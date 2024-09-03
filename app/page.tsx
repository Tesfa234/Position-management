'use client'
import React from 'react';
import Page from './Home';
import { MantineProvider } from '@mantine/core';
import '@mantine/notifications/styles.css';

function Home() {
    return (
      <MantineProvider>
      <Page/>
      </MantineProvider>
    );
        }
        export default Home;
