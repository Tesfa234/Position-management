import React, { useState, useEffect, useCallback } from "react";
import { ActionIcon, Button, Table, TextInput, Group, Box, Title, Text, Pagination } from "@mantine/core";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import Swal from "sweetalert2";
import PositionRegistration from "./PositionForm";
import {useFetchPositionsQuery,useUpdatePositionMutation,useDeletePositionMutation} from "../Redux/api";
import { notifications } from "@mantine/notifications";
import { debounce } from "lodash";

interface Position {
  id: string;
  position: string;
  parentPositionId: string | null;
  parentPosition?: string | null;
}

interface PositionListProps {
  onClose: () => void;
}

const PositionList: React.FC<PositionListProps> = ({ onClose }) => {
  const [page, setPage] = useState<number>(1);
  const itemsPerPage = 10;
  const { data: positions = [], refetch } = useFetchPositionsQuery();
  const [updatePosition] = useUpdatePositionMutation();
  const [deletePosition] = useDeletePositionMutation();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredPositions, setFilteredPositions] = useState<Position[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<Position | null>(null);
  const [noResultsFound, setNoResultsFound] = useState<boolean>(false);

  useEffect(() => {
    if (positions.length) {
      setFilteredPositions(positions);
    }
  }, [positions]);

  const debounceSearch = useCallback(
    debounce((term: string) => {
      const filteredData = positions.filter(position =>
        position.position.toLowerCase().includes(term.toLowerCase()) ||
        (position.parentPosition ? position.parentPosition.toLowerCase().includes(term.toLowerCase()) : false)
      );
      setFilteredPositions(filteredData);
      setNoResultsFound(filteredData.length === 0);
      setPage(1); 
    }, 300),
    [positions]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    debounceSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredPositions(positions);
    setNoResultsFound(false);
    setPage(1); 
  };

  const handleDelete = async (id: string, position: string) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: `Do you really want to delete the position "${position}"?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const success = await deletePosition(id).unwrap();
        if (success) {
          refetch(); 
          notifications.show({
            title: "Success!",
            message: `Position "${position}" has been deleted.`,
            color: "blue",
          });
        } else {
          notifications.show({
            color: 'red',
            title: 'Oops',
            message: 'Unexpected error occurred! Please try again.',
          });
        }
      }
    } catch (error) {
      console.error("Error deleting position:", error);
      notifications.show({
        color: 'red',
        title: 'Oops',
        message: 'Unexpected error occurred! Please try again.',
      });
    }
  };

  const handleEditClick = (position: Position) => {
    setSelectedPosition(position);
    setIsFormOpen(true);
  };

  const handleSave = async (updatedPosition: Position) => {
    try {
      await updatePosition({
        position: updatedPosition.position,
        parentPosition: updatedPosition.parentPosition || "",
        parentPositionId: updatedPosition.parentPositionId || "",
        id: updatedPosition.id,
      }).unwrap();
      refetch(); 
      setIsFormOpen(false);
    } catch (error) {
      console.error("Error updating position:", error);
    }
  };

  // Calculate paginated data
  const paginatedPositions = filteredPositions.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  const totalPages = Math.ceil(filteredPositions.length / itemsPerPage);

  return (
    <Box>
      <Title order={1} className="p-4">Position List</Title>
      <Group mb="md">
        <TextInput
          placeholder="Search by position or parent position"
          className="flex-grow p-4"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {searchTerm && (
          <Button className="ml-2" onClick={clearSearch}>
            Clear
          </Button>
        )}
      </Group>
      {filteredPositions.length === 0 ? (
        <Text>No positions found.</Text>
      ) : (
        <>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>ID</Table.Th>
                <Table.Th>Position</Table.Th>
                <Table.Th>Parent Position</Table.Th>
                <Table.Th>Parent Position ID</Table.Th>
                <Table.Th>Actions</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {paginatedPositions.map((position) => (
                <Table.Tr key={position.id}>
                  <Table.Td>{position.id}</Table.Td>
                  <Table.Td>{position.position}</Table.Td>
                  <Table.Td>{position.parentPosition || "None"}</Table.Td>
                  <Table.Td>{position.parentPositionId || "None"}</Table.Td>
                  <Table.Td>
                    <Group>
                      <ActionIcon
                        color="blue"
                        onClick={() => handleEditClick(position)}
                      >
                        <IconEdit />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(position.id, position.position)}
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Group>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
          <Group mt="md">
            <Pagination
              total={totalPages}
              value={page}
              onChange={setPage}
            />
          </Group>
        </>
      )}
      {isFormOpen && selectedPosition && (
        <PositionRegistration
          opened={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          positionData={{
            id: selectedPosition.id,
            position: selectedPosition.position,
            parentPositionId: selectedPosition.parentPositionId,
            parentPosition: selectedPosition.parentPosition || null
          }}
          onSave={handleSave}
        />
      )}
    </Box>
  );
};

export default PositionList;
