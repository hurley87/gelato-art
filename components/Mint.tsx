import React, { useContext, useState } from 'react';
import { Box, Button, Flex, Input } from '@chakra-ui/react';
import { UserContext } from '@/lib/UserContext';
import { gelato } from '@/lib/gelato';
import { useContract } from 'wagmi';
import GelatoArt from './GelatoArt.json';
import { create } from 'ipfs-http-client';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { GelatoRelay } from '@gelatonetwork/relay-sdk';

const relay = new GelatoRelay();

const Mint = () => {
  const [user]: any = useContext(UserContext);
  const [isLoading, setIsLoading] = useState(false);
  const [prompt, setPrompt] = useState('');
  const contract = useContract({
    address: '0x1Bf93b2ad3bE4eF6ED0FF658ac4A1D83B9a2bcfE',
    abi: GelatoArt.abi,
    signerOrProvider: user?.signer,
  });
  const projectId = process.env.NEXT_PUBLIC_INFRA_PROJECT_ID;
  const projectSecret = process.env.NEXT_PUBLIC_INFRA_SECRET;
  const projectIdAndSecret = `${projectId}:${projectSecret}`;
  const router = useRouter();

  const ipfs = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
    headers: {
      authorization: `Basic ${Buffer.from(projectIdAndSecret).toString(
        'base64'
      )}`,
    },
  });

  async function connect() {
    try {
      if (!gelato) {
        return;
      }
      await gelato.login();
    } catch (error) {
      console.log(error);
    }
  }

  const handleMint = async () => {
    if (!user.signer) {
      connect();
      return;
    } else {
      setIsLoading(true);
      console.log('Calling OpenAI...', prompt);

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      const { url } = data;
      const address = user.address;

      console.log('OpenAI Response: ', url);

      const mintJson = {
        name: prompt.split(' ').slice(0, 3).join(' '),
        description: prompt,
        image: url,
      };
      const uploaded = await ipfs.add(JSON.stringify(mintJson));
      console.log('Uploaded Hash: ', uploaded);
      const path = uploaded.path;

      try {
        const { data } = await contract!.populateTransaction.mint(
          address,
          path
        );
        console.log('data2', data);

        const request: any = {
          chainId: 84531,
          target: '0x1Bf93b2ad3bE4eF6ED0FF658ac4A1D83B9a2bcfE',
          data: data,
          user: address,
        };

        console.log('request2', request);

        const apiKey = process.env.NEXT_PUBLIC_GELATO_API_KEY as string;

        const response = await relay.sponsoredCallERC2771(
          request,
          user.provider,
          apiKey
        );
        console.log('response', response);
        const taskId = response.taskId;
        console.log('taskId', taskId);

        const interval = setInterval(async () => {
          try {
            setIsLoading(true);
            const taskStatus = await relay.getTaskStatus(taskId || '');
            console.log('taskStatus', taskStatus);
            if (taskStatus?.taskState === 'ExecSuccess') {
              clearInterval(interval);
              setIsLoading(false);
              toast.success('NFT minted!');
              router.push('/collection');
            } else if (taskStatus?.taskState === 'CheckPending') {
              if (
                taskStatus?.lastCheckMessage?.includes('sponsoredCallERC2771:')
              ) {
                clearInterval(interval);
                throw new Error(
                  taskStatus?.lastCheckMessage?.split(
                    'sponsoredCallERC2771:'
                  )[1]
                );
              }
            } else if (taskStatus?.taskState === 'Cancelled') {
              throw new Error('Error minting tokens');
            }
          } catch (error) {
            console.log(error);
            if (!error?.toString().includes('GelatoRelaySDK/getTaskStatus')) {
              setIsLoading(false);
              toast.error(`${error}`);
            }
          }
        }, 1000);
      } catch (e) {
        console.log('Error minting NFT: ', e);
        setIsLoading(false);
      }
    }
  };

  return (
    <Box
      left={['4', '4', '36']}
      right={['4', '4', '36']}
      position="fixed"
      top="20"
    >
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
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Button
          borderLeft="1px solid rgba(0,0,0,.05)"
          backgroundColor="black"
          borderRadius="lg"
          borderLeftRadius="0"
          p="6"
          fontWeight="bolder"
          color="white"
          isLoading={isLoading}
          onClick={handleMint}
          isDisabled={prompt.length < 1}
          _disabled={{
            color: 'gray.400',
            bg: 'white',
            cursor: 'not-allowed',
          }}
          _hover={{
            bg: 'black',
            color: 'white',
          }}
        >
          Mint NFT
        </Button>
      </Flex>
    </Box>
  );
};

export default Mint;
