import Navbar from '@/components/Navbar';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box bg="#fafafc" minH="100vh">
      <Navbar />
      <Box
        left={['1', '1', '36']}
        right={['1', '1', '36']}
        position="fixed"
        top="20"
        px="4"
      >
        <Flex
          boxShadow="0 2px 4px 0 rgba(0,0,82,.15)"
          w="full"
          borderRadius="lg"
          bg="white"
        >
          <Input
            placeholder="pfp of a generative AI artist, digital art, postmodernism"
            border="none"
            borderRightRadius="0"
            p="6"
            fontSize="sm"
          />
          <Button
            borderLeft="1px solid rgba(0,0,0,.05)"
            backgroundColor="white"
            borderRadius="lg"
            borderLeftRadius="0"
            p="6"
            fontWeight="black"
          >
            Mint NFT
          </Button>
        </Flex>
      </Box>
    </Box>
  );
}
