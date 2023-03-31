import React, { useContext } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';
import { UserContext } from '@/lib/UserContext';
import { gelato } from '@/lib/gelato';

const Mint = () => {
  const [user, setUser]: any = useContext(UserContext);

  return (
    <Box
      left={['4', '4', '36']}
      right={['4', '4', '36']}
      position="fixed"
      top="20"
    >
      <Alert status="error" borderRadius="lg">
        <AlertIcon />
        <AlertTitle>Your collection is empty.</AlertTitle>
        <AlertDescription>Try minting one for free.</AlertDescription>
      </Alert>
    </Box>
  );
};

export default Mint;
