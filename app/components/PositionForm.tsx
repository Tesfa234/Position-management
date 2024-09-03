import React, { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal, Button, TextInput, Select, Flex } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAddPositionMutation, useUpdatePositionMutation, useFetchPositionsQuery } from "../Redux/api";

// Validation schema using yup
const validationSchema = yup.object().shape({
  position: yup.string().required("Position is required").test(
    'unique-position',
    'Position already exists',
    async (value, context) => {
      // Access positions data from the context
      const { positionsData } = context.parent;
      if (!positionsData) return true;

      // Check if position already exists
      const positionExists = positionsData.some((p: { position: string }) => p.position === value);
      return !positionExists;
    }
  ),
  parentPosition: yup.string().nullable(), // Allow null for parent position
});

interface PositionRegistrationProps {
  opened: boolean;
  onClose: () => void;
  positionData?: { 
    id: string; 
    position: string; 
    parentPosition: string | null; 
    parentPositionId: string | null; 
  };
  onSave: (updatedPosition: {
    id: string; 
    position: string; 
    parentPosition: string | null; 
    parentPositionId: string | null; 
  }) => Promise<void>;
}

const PositionRegistration: React.FC<PositionRegistrationProps> = ({ opened, onClose, positionData }) => {
  const { register, handleSubmit, control, setValue, reset, formState: { errors }, getValues } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      position: "",
      parentPosition: null,
    },
    context: { positionsData: [] } 
  });

  const [loading, setLoading] = useState(false);
  const [parentPositions, setParentPositions] = useState<{ id: string, position: string }[]>([]);

  
  const { data: positionsData } = useFetchPositionsQuery();

  useEffect(() => {
    if (positionsData) {
      const uniquePositions = Array.from(new Set(positionsData.map((p: any) => p.position)))
        .map(position => positionsData.find((p: any) => p.position === position));
      setParentPositions(uniquePositions.map((p: any) => ({ id: p.id, position: p.position })));
    }
  }, [positionsData]);

  useEffect(() => {
    setValue("position", positionData?.position || "");
    setValue("parentPosition", positionData?.parentPosition || "");

  }, [positionData, setValue, reset]);

  const [addPosition] = useAddPositionMutation();
  const [updatePosition] = useUpdatePositionMutation();

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const { position, parentPosition } = data;
      const parentPositionData = parentPositions.find(p => p.position === parentPosition);
      const parentPositionId = parentPositionData ? parentPositionData.id : "";

      const success = positionData
        ? await updatePosition({ id: positionData.id, position, parentPosition, parentPositionId }).unwrap()
        : await addPosition({ position, parentPosition, parentPositionId }).unwrap();

      if (success) {
        notifications.show({
          title: "Success!",
          message: `Position ${positionData ? "updated" : "registered"} successfully`,
          color: "blue",
        });
        reset(); 
        onClose(); 
      } else {
        notifications.show({
          title: "Error!",
          message: `Position ${positionData ? "update" : "registration"} failed. Please try again.`,
          color: "red",
        });
      }
    } catch (err) {
      notifications.show({
        title: "Error!",
        message: "An unexpected error occurred. Please try again.",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title={positionData ? "Edit Position" : "Position Registration"}
      size="lg"
      styles={{
        title: { fontSize: '1.5rem', fontWeight: 700, color: 'black' },
        body: { padding: '1rem' },
        header: { backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '0.5rem' },
        close: { color: 'black' }
      }}
    >
      <Flex className="relative w-full">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
          <TextInput
            label="Position"
            {...register("position")}
            className={`w-full ${errors.position ? 'border-red-500' : ''}`}
            placeholder="Enter position"
            error={errors.position?.message}
          />

          <Controller
            name="parentPosition"
            control={control}
            render={({ field }) => (
              <Select
                label="Parent Position"
                {...field}
                placeholder="Select a parent position"
                data={parentPositions.map(p => ({ value: p.position, label: p.position }))}
                className={`w-full ${errors.parentPosition ? 'border-red-500' : ''}`}
                error={errors.parentPosition?.message}
              />
            )}
          />

          <Flex className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              className="bg-gray-200 hover:bg-gray-300"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600"
              loading={loading}
            >
              {positionData ? "Update" : "Submit"}
            </Button>
          </Flex>
        </form>
      </Flex>
    </Modal>
  );
};

export default PositionRegistration;
