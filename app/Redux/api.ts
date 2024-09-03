'use client';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Define the API slice with correct types for tags
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:5000' }),
  endpoints: (builder) => ({
    // Endpoint for adding an employee
    addEmployee: builder.mutation<boolean, { name: string; description: string; position: string; parentPosition: string }>({
      query: (employee) => ({
        url: '/employees',
        method: 'POST',
        body: employee,
      }),
       transformResponse: (response: { id: string }) => !!response.id,
      // Refetch employees after adding a new employee
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
           await queryFulfilled;
           dispatch(api.util.invalidateTags([{ type: 'Employees' }]));
         } catch {}
       }
    }),
    
    // Endpoint for adding a position
    addPosition: builder.mutation<boolean, { position: string; parentPosition: string; parentPositionId: string }>({
      query: (position) => ({
        url: '/positions',
        method: 'POST',
        body: position,
      }),
      
       transformResponse: (response: { id: string }) => !!response.id,
       // Refetch positions after adding a new position
       async onQueryStarted(arg, { dispatch, queryFulfilled }) {
         try {
           await queryFulfilled;
           dispatch(api.util.invalidateTags([{ type: 'Positions' }]));
         } catch {}
       }
    }),
    
    // Endpoint for fetching all employees
    fetchEmployees: builder.query<any[], void>({
      query: () => '/employees',
      // providesTags: [{ type: 'Employees' }]
      providesTags: ["Positions"]
    }),
    
    // Endpoint for fetching all positions
    fetchPositions: builder.query<any[], void>({
      query: () => '/positions',
      providesTags: ["Positions"]
    }),
    
    // Endpoint for updating an employee
    updateEmployee: builder.mutation<boolean, { id: string; name: string; description: string; position: string; parentPosition: string }>({
      query: ({ id, ...employee }) => ({
        url: `/employees/${id}`,
        method: 'PUT',
        body: employee,
      }),
      transformResponse: () => true,
      // Refetch employees after updating
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.invalidateTags([{ type: 'Employees' }]));
        } catch {}
      }
    }),
    
    // Endpoint for updating a position
    updatePosition: builder.mutation<boolean, { id: string; position: string; parentPosition: string; parentPositionId: string }>({
      query: ({ id, ...position }) => ({
        url: `/positions/${id}`,
        method: 'PUT',
        body: position,
      }),
      transformResponse: () => true,
      // Refetch positions after updating
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.invalidateTags([{ type: 'Positions' }]));
        } catch {}
      }
    }),
    
    // Endpoint for deleting an employee
    deleteEmployee: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/employees/${id}`,
        method: 'DELETE',
      }),
      transformResponse: () => true,
      // Refetch employees after deleting
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.invalidateTags([{ type: 'Employees' }]));
        } catch {}
      }
    }),
    
    // Endpoint for deleting a position
    deletePosition: builder.mutation<boolean, string>({
      query: (id) => ({
        url: `/positions/${id}`,
        method: 'DELETE',
      }),
      transformResponse: () => true,
      // Refetch positions after deleting
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(api.util.invalidateTags([{ type: 'Positions' }]));
        } catch {}
      }
    }),
  }),
  tagTypes: ['Employees', 'Positions'], // Define tag types here
});

// Export hooks for use in components
export const {
  useAddEmployeeMutation,
  useAddPositionMutation,
  useFetchEmployeesQuery,
  useFetchPositionsQuery,
  useUpdateEmployeeMutation,
  useUpdatePositionMutation,
  useDeleteEmployeeMutation,
  useDeletePositionMutation,
} = api;
