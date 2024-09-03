/* eslint-disable @next/next/no-img-element */
// src/components/Footer.tsx

import { Text, Anchor, Box, List } from '@mantine/core';
import { IconBrandFacebook, IconBrandTwitter, IconBrandLinkedin, IconBrandYoutube, IconBrandInstagram } from '@tabler/icons-react';
import React from 'react';
const Footer = () => {
  return (
    <footer style={{ backgroundColor: 'azure', borderTop: 'solid black 0.1px' }} className="w-full text-white">
      <Box className="max-w-screen-lg mx-auto text-center text-black p-4" >
        <h3 className="text-3xl mb-4 flex justify-center items-center text-black">
          <Text size='xl'>Perago Systems</Text>
          
        </h3>
        <Text className="text-gray-700 mb-6">Crafting Digital Excellence</Text>
        <Text className="mb-6 font-bold text-black underline ">Contact us:</Text>
        <List className="flex justify-around mb-6 p-4"
        >
          <List.Item>
            <Anchor href="#" className="flex items-center text-black text-md p-8">
              <IconBrandFacebook className="w-6 h-6 mr-2" />
              
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor href="#" className="flex items-center text-black text-md">
              <IconBrandTwitter className="w-6 h-6 mr-2" />
              
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor href="#" className="flex items-center text-black text-md">
              <IconBrandLinkedin className="w-6 h-6 mr-2" />
              
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor href="#" className="flex items-center text-black text-md">
              <IconBrandYoutube className="w-6 h-6 mr-2"/>
              
            </Anchor>
          </List.Item>
          <List.Item>
            <Anchor href="#" className="flex items-center text-black text-md">
              <IconBrandInstagram className="w-6 h-6 mr-2" />
            </Anchor>
          </List.Item>
        </List>
      </Box>
      <Box className="bg-teal-50 text-black py-4">
        <Text className="text-center">&copy; 2024 Company Name. All rights reserved. | Designed by <Anchor href="#" className="text-black">Tesfa</Anchor></Text>
      </Box>
    </footer>
  );
};

export default Footer;
