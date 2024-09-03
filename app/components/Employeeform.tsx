import React, { useState, useEffect } from "react";
import { useForm, SubmitHandler, Controller } from "react-hook-form";
import { Button, Flex, Modal, TextInput, Select } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useAddEmployeeMutation, useUpdateEmployeeMutation, useFetchPositionsQuery } from '../Redux/api';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

// Define Yup schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  description: yup.string().required('Description is required'),
  position: yup.string().required('Position is required'),
  parentPosition: yup.string(),
}).required();

interface EmployeeFormValues {
  name: string;
  description: string;
  position: string;
  parentPosition?: string;
}

export interface Employee {
  id: string;
  name: string;
  description: string;
  position: string;
  parentPosition: string;
}

interface EmployeeFormProps {
  onClose: () => void;
  initialData?: Employee;
  onSave: (updatedEmployee: Employee) => Promise<void>; // Add this line
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ onClose, initialData, onSave }) => {
  const [loading, setLoading] = useState(false);
  const { data: positionData, isFetching } = useFetchPositionsQuery();
  const [addEmployee] = useAddEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const { register, handleSubmit, setValue, control, watch, formState: { errors } } = useForm<EmployeeFormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: initialData?.name || "",
      description: initialData?.description || "",
      position: initialData?.position || "",
      parentPosition: initialData?.parentPosition || "",
    },
  });

  const positions = positionData?.reduce((acc: { [key: string]: any }, position: any) => {
    acc[position.position] = position;
    return acc;
  }, {}) || {};

  const watchedPosition = watch('position');

  useEffect(() => {
    if (watchedPosition && positions[watchedPosition]) {
      const selectedPosition = positions[watchedPosition];
      setValue('parentPosition', selectedPosition.parentPosition || "");
    }
  }, [watchedPosition, positions, setValue]);

  const onSubmit: SubmitHandler<EmployeeFormValues> = async (values) => {
    setLoading(true);
    try {
      let success;
      const dataToSend = {
        name: values.name,
        description: values.description,
        position: values.position,
        parentPosition: values.parentPosition || "", 
      };
  
      if (initialData?.id) {
        success = await updateEmployee({ id: initialData.id, ...dataToSend }).unwrap();

        notifications.show({
          color: 'blue',
          title: 'Success',
          message: 'The employee is Updated successfully',
        });
        
      } else {
        success = await addEmployee(dataToSend).unwrap();
  
        notifications.show({
          color: 'blue',
          title: 'Success',
          message: 'The employee is added successfully',
        });
      }
  
      if (success) onClose(); 
    } catch (error) {
      notifications.show({
        color: 'red',
        title: 'Oops...',
        message: 'Unexpected error occurred! Please try again!',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      opened={true}
      onClose={onClose}
      title={initialData ? "Edit Employee" : "Employee Registration"}
      size="lg"
      styles={{
        title: { fontSize: '1.5rem', fontWeight: 700, color: 'black' },
        body: { padding: '1rem' },
        header: { backgroundColor: '#f0f0f0', padding: '1rem', borderRadius: '0.5rem' },
        close: { color: 'black' }
      }}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextInput
          label='Name'
          id="name"
          {...register('name')}
          placeholder="Enter name"
          radius="md"
          size="md"
          withAsterisk
          error={errors.name?.message}
        />
        
        <TextInput
          label="Description"
          id="description"
          {...register('description')}
          placeholder="Enter description"
          radius="md"
          size="md"
          withAsterisk
          error={errors.description?.message}
        />
        
        <Controller
          control={control}
          name="position"
          render={({ field }) => (
            <Select
              label="Position"
              placeholder="Select position"
              data={positionData ? positionData.map((pos) => pos.position) : []}
              value={field.value}
              onChange={field.onChange}
              radius="md"
              size="md"
              withAsterisk
              error={errors.position?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="parentPosition"
          render={({ field }) => (
            <Select
              label="Parent Position"
              placeholder="Select parent position"
              data={positionData ? positionData.map((pos) => pos.position) : []}
              value={field.value}
              onChange={field.onChange}
              radius="md"
              size="md"
              clearable
              error={errors.parentPosition?.message}
            />
          )}
        />
        
        <Flex justify="end">
          <Button type="submit" loading={loading}>
            {initialData ? "Update" : "Register"}
          </Button>
        </Flex>
      </form>
    </Modal>
  );
};

export default EmployeeForm;
