import React from 'react';
import { Box } from '@chakra-ui/react';
import Navbar from './Navbar';

type LayoutProps = {
  children: React.ReactNode;
};

const Layout = ({ children }: LayoutProps) => {
  return (
    <Box bg="#fafafc" minH="100vh" pb="20">
      <Navbar />
      <Box mx="auto" maxW="10xl" w="full" pt="40">
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
