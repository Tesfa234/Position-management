"use client";
import { MantineProvider, Flex, Box } from '@mantine/core';
import '@mantine/core/styles.css';
import { useState } from 'react';
import Frontpage from './Page/Frontpage';
import React from 'react';
import { Notifications } from '@mantine/notifications';




function Home() {
  

  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };


  return (
    
    <MantineProvider> 
      <Notifications position='bottom-right'/>  
      <Box className="flex min-h-screen">
        <main className="relative flex-1 w-full bg-white">
          <Frontpage />
        </main>
      </Box>


</MantineProvider>
 
  );
}

export default Home;
