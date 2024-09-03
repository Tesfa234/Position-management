import React, { useEffect, useState } from 'react';
import { ActionIcon, Box, Loader, Modal, Text } from '@mantine/core';
import { IconCheck, IconChevronDown, IconChevronUp, IconPencil, IconTrash } from '@tabler/icons-react';
import PositionRegistration from '../components/PositionForm';
import { useFetchPositionsQuery, useDeletePositionMutation, useUpdatePositionMutation, useAddPositionMutation } from '../Redux/api';
import { notifications } from '@mantine/notifications';
import Swal from 'sweetalert2';

export interface TreeNodeData {
  label: string;
  value: string;
  id?: string;
  description?: string;
  children?: TreeNodeData[];
  data?: any;
}

const buildTree = (nodes: any[]): TreeNodeData[] => {
  const map: { [key: string]: TreeNodeData } = {};
  const roots: TreeNodeData[] = [];

  nodes.forEach(node => {
    map[node.id] = {
      label: node.position,
      value: `${node.position}-${node.id}`,
      id: node.id,
      description: node.description,
      data: node,
      children: [],
    };
  });

  nodes.forEach(node => {
    const treeNode = map[node.id];
    if (node.parentPositionId) {
      const parentNode = map[node.parentPositionId];
      if (parentNode) {
        parentNode.children?.push(treeNode);
      }
    } else {
      roots.push(treeNode);
    }
  });

  return roots;
};

const PositionTree: React.FC = () => {
  const { data: positions = [], isLoading, isError, refetch } = useFetchPositionsQuery();
  const [deletePosition] = useDeletePositionMutation();
  const [updatePosition] = useUpdatePositionMutation();
  const [addPosition] = useAddPositionMutation();
  const [treeData, setTreeData] = useState<TreeNodeData[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [selectedPosition, setSelectedPosition] = useState<TreeNodeData | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (positions) {
      const tree = buildTree(positions);
      setTreeData(tree);
    }
  }, [positions]);

  useEffect(() => {
    if (!modalOpen) {
      refetch(); 
    }
  }, [modalOpen, refetch]);

  const handleEdit = (position: TreeNodeData) => {
    setSelectedPosition(position);
    setModalOpen(true);
  };

  const removeNode = (nodes: TreeNodeData[], nodeId: string): TreeNodeData[] => {
    return nodes
      .map(node => {
        if (node.id === nodeId) {
          return null;
        }
        if (node.children) {
          node.children = removeNode(node.children, nodeId);
        }
        return node;
      })
      .filter((node): node is TreeNodeData => node !== null);
  };

  const handleDelete = async (nodeId: string) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "This action cannot be undone.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await deletePosition(nodeId).unwrap();
        setTreeData(prevTreeData => removeNode(prevTreeData, nodeId));
        notifications.show({
          title: 'Success!',
          message: 'Position deleted successfully',
          color: 'green',
        });
      } catch (error) {
        console.error('Error deleting position:', error);
        notifications.show({
          color: 'red',
          title: 'Error',
          message: 'Unexpected error occurred! Please try again',
        });
      }
    }
  };

  const handleSave = async (updatedPosition: any) => {
    try {
      const positionData = {
        id: updatedPosition.id,
        position: updatedPosition.position,
        parentPosition: updatedPosition.parentPosition || '', 
        parentPositionId: updatedPosition.parentPositionId || '' 
      };

      if (updatedPosition.id) {
        // Update existing position
        await updatePosition(positionData).unwrap();
        notifications.show({
          title: 'Success!',
          message: 'Position updated successfully',
          color: 'blue',
        });
      } else {
        // Add new position
        await addPosition(positionData).unwrap();
        notifications.show({
          title: 'Success!',
          message: 'Position added successfully',
          color: 'blue',
        });
      }
      refetch(); 
      setModalOpen(false); 
    } catch (error) {
      console.error('Error saving position:', error);
      notifications.show({
        color: 'red',
        title: 'Error',
        message: 'Unexpected error occurred! Please try again',
      });
    }
  };

  const toggleExpand = (nodeValue: string) => {
    setExpandedNodes(prevExpandedNodes => {
      const newExpandedNodes = new Set(prevExpandedNodes);
      if (newExpandedNodes.has(nodeValue)) {
        newExpandedNodes.delete(nodeValue);
      } else {
        newExpandedNodes.add(nodeValue);
      }
      return newExpandedNodes;
    });
  };

  const renderNode = (node: TreeNodeData) => {
    const isExpanded = expandedNodes.has(node.value);
    return (
      <Box key={node.value} className="mb-2 p-1.5 border-0 rounded-lg bg-gray-100 transition-all duration-300 ease-in-out">
        <Box className="flex items-center justify-between">
          <Box className="flex items-center">
            {node.children && node.children.length > 0 && (
              <Text span
                onClick={() => toggleExpand(node.value)}
                style={{ cursor: 'pointer', marginRight: '5px', fontSize: '12px', color: '#333' }}
              >
                {/* {isExpanded ? '▲' : '▼'} */}
                {isExpanded ? <IconChevronUp size={14}/>:<IconChevronDown size={14}/>}
              </Text>
            )}
            <span className='font-semibold'>{node.label}</span>
          </Box>
          {node.data && (
            <Box>
              <ActionIcon onClick={() => handleEdit(node)}  variant='subtle' color="gray">
                <IconPencil size={14} />
              </ActionIcon>
              <ActionIcon onClick={() => handleDelete(node.id!)} color="red" variant='subtle'>
                <IconTrash size={14} />
              </ActionIcon>
            </Box>
          )}
        </Box>
        {node.children && node.children.length > 0 && isExpanded && (
          <Box>
            {node.children.map(child => renderNode(child))}
          </Box>
        )}
      </Box>
    );
  };

  if (isLoading) {
    return <Box className="text-center mt-5"><Loader /></Box>;
  }

  if (isError) {
    return <Box className="text-center mt-5">Error loading data</Box>;
  }

  return (
    <Box>
      {treeData.map(node => renderNode(node))}
      <Modal
        opened={modalOpen}
        onClose={() => setModalOpen(false)}
        title={selectedPosition ? 'Edit Position' : 'Add Position'}
      >
        <PositionRegistration
          opened={modalOpen}
          onClose={() => setModalOpen(false)}
          positionData={selectedPosition ? {
            id: selectedPosition.id!,
            position: selectedPosition.label,
            parentPosition: selectedPosition.data?.parentPosition || '',
            parentPositionId: selectedPosition.data?.parentPositionId || ''
          } : undefined}
          onSave={handleSave}
        />
      </Modal>
    </Box>
  );
};

export default PositionTree;
