import React, { useState, useEffect, useCallback } from 'react';
import { Button, Table, TextInput, ActionIcon, Title, Stack, Box, Pagination } from '@mantine/core';
import { IconEdit, IconTrash } from '@tabler/icons-react';
import Swal from 'sweetalert2';
import { debounce } from 'lodash';
import EmployeeForm from './Employeeform';
import { useFetchEmployeesQuery, useDeleteEmployeeMutation, useUpdateEmployeeMutation } from '../Redux/api'; // Import the hooks
import { notifications } from "@mantine/notifications";

interface Employee {
  id: string;
  name: string;
  description: string;
  position: string;
  parentPosition: string;
}

interface EmployeelistProps {
  onClose: () => void;
}

const EmployeeList: React.FC<EmployeelistProps> = ({ onClose }) => {
  const { data: userData = [], isLoading, isError, refetch } = useFetchEmployeesQuery(); // Fetch employees using RTK Query and get refetch method
  const [deleteEmployee] = useDeleteEmployeeMutation();
  const [updateEmployee] = useUpdateEmployeeMutation();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredUsers, setFilteredUsers] = useState<Employee[]>([]);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);
  const [noResultsFound, setNoResultsFound] = useState<boolean>(false); // State for no results found message

  // Pagination states
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  useEffect(() => {
    if (userData.length) {
      setFilteredUsers(userData);
    }
  }, [userData]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceSearch = useCallback(
    debounce((term: string) => {
      const filteredData = userData.filter(user =>
        user.name.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredUsers(filteredData);
      setNoResultsFound(filteredData.length === 0); // Update no results state
      setCurrentPage(1); // Reset to first page on search
    }, 300),
    [userData]
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value;
    setSearchTerm(term);
    debounceSearch(term);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setFilteredUsers(userData);
    setNoResultsFound(false); 
    setCurrentPage(1); 
  };

  const handleDelete = async (id: string, name: string) => {
    try {
      const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you really want to delete the employee with Name "${name}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel',
      });

      if (result.isConfirmed) {
        const success = await deleteEmployee(id).unwrap();
        if (success) {
          refetch(); 
          notifications.show({
            color: 'blue',
            title: 'Success',
            message: 'The user is deleted successfully',
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
      console.error('Error deleting employee:', error);
      notifications.show({
        color: 'red',
        title: 'Oops',
        message: 'Unexpected error occurred! Please try again.',
      });
    }
  };

  const handleEditClick = (user: Employee) => {
    setSelectedEmp(user);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setSelectedEmp(null);
  };

  const handleSave = async (updatedEmployee: Employee) => {
    if (selectedEmp) {
      try {
        await updateEmployee(updatedEmployee).unwrap();
        notifications.show({
          color: 'blue',
          title: 'Success',
          message: 'The employee has been updated successfully',
        });
        handleFormClose();
        refetch(); 
      } catch (error) {
        console.error('Error updating employee:', error);
        notifications.show({
          color: 'red',
          title: 'Oops',
          message: 'Unexpected error occurred. Please try again',
        });
      }
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (isError) {
    return <p>Error loading employees. Please try again later.</p>;
  }

  // Calculate pagination
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  return (
    <Box>
      <Stack>
        <Title order={2} className="mb-4">Employee List</Title>

        {/* Search input */}
        <TextInput
          type="text"
          placeholder="Search by name"
          className="flex-grow p-4 "
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </Stack>
      {searchTerm && (
        <Button
          className="px-4 py-2 ml-2 font-bold text-white bg-blue-500 rounded-lg hover:bg-blue-600"
          onClick={clearSearch}
        >
          Clear
        </Button>
      )}

      {/* Employee list */}
      <Box style={{ display: 'flex', flexDirection: 'column', minHeight: '300px' }}>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>ID</Table.Th>
              <Table.Th>Name</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Position</Table.Th>
              <Table.Th>Parent Position</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {paginatedUsers.length > 0 ? (
              paginatedUsers.map((user) => (
                <Table.Tr key={user.id}>
                  <Table.Td>{user.id}</Table.Td>
                  <Table.Td>{user.name}</Table.Td>
                  <Table.Td>{user.description}</Table.Td>
                  <Table.Td>{user.position}</Table.Td>
                  <Table.Td>{user.parentPosition}</Table.Td>
                  <Table.Td>
                    <Box className='flex gap-2'>
                      <ActionIcon
                        color="blue"
                        onClick={() => handleEditClick(user)}
                      >
                        <IconEdit />
                      </ActionIcon>
                      <ActionIcon
                        color="red"
                        onClick={() => handleDelete(user.id, user.name)}
                      >
                        <IconTrash />
                      </ActionIcon>
                    </Box>
                  </Table.Td>
                </Table.Tr>
              ))
            ) : (
              <Table.Tr>
                <Table.Td colSpan={6} style={{ textAlign: 'center' }}>
                  {noResultsFound ? 'No results found.' : 'No employees available.'}
                </Table.Td>
              </Table.Tr>
            )}
          </Table.Tbody>
        </Table>

        {/* Pagination controls */}
        <Box style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <Pagination
            total={totalPages}
            value={currentPage} // Use `value` instead of `page`
            onChange={(page) => setCurrentPage(page)}
          />
        </Box>
      </Box>

      {isFormOpen && selectedEmp && (
        <EmployeeForm
          onClose={handleFormClose}
          initialData={selectedEmp}
          onSave={handleSave} 
        />
      )}
    </Box>
  );
};

export default EmployeeList;
