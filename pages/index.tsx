import Navbar from '@/components/Navbar';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';

export default function Home() {
  return (
    <Box bg="#fafafc" minH="100vh">
      <Navbar />
      <Box
        left={['4', '4', '36']}
        right={['4', '4', '36']}
        position="fixed"
        top="20"
      >
        {/* <Flex gap="2" pb="2">
          <Text>Start with a detailed description</Text>
          <Button size="xs" fontWeight="extrabold">
            Surprise me
          </Button>
        </Flex> */}
        <Flex
          boxShadow="0 2px 4px 0 rgba(0,0,82,.15)"
          w="full"
          borderRadius="lg"
          bg="white"
        >
          <Input
            placeholder="pfp of an AI-native artist, digital art, postmodernism"
            border="none"
            borderRightRadius="0"
            py="6"
            px="3"
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
