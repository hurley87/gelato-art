import {
  Box,
  GridItem,
  Img,
  SimpleGrid,
  Stack,
  Text,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  Link,
  Button,
} from '@chakra-ui/react';
import type { NextPage } from 'next';
import { useCallback, useContext, useEffect, useState } from 'react';
import GelatoArt from './GelatoArt.json';
import { create } from 'ipfs-http-client';
import _ from 'lodash';
import { useAccount, useContract, useProvider } from 'wagmi';
import { UserContext } from '@/lib/UserContext';
import MintSecondary from './MintSecondary';

const projectId = process.env.NEXT_PUBLIC_INFRA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFRA_SECRET;
const projectIdAndSecret = `${projectId}:${projectSecret}`;

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

const Gallery: NextPage = () => {
  const [user]: any = useContext(UserContext);
  const provider = useProvider();
  const contract = useContract({
    address: '0x1Bf93b2ad3bE4eF6ED0FF658ac4A1D83B9a2bcfE',
    abi: GelatoArt.abi,
    signerOrProvider: user?.signer || provider,
  });
  const [nfts, setNfts] = useState<any>([]);
  const [nftsLoaded, setNftsLoaded] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const { address } = useAccount();

  const getFromIPFS = async (cid: string) => {
    const decoder = new TextDecoder();
    let content = '';
    for await (const chunk of ipfs.cat(cid)) {
      content += decoder.decode(chunk);
    }
    return content;
  };

  // re write getNFTs using useCallback
  const getNFTs = useCallback(async () => {
    try {
      const totalSupply = await contract?.totalSupply();
      console.log(totalSupply.toNumber());

      if (!totalSupply) return;

      if (totalSupply.toNumber() === 0) {
        setNftsLoaded(true);
        return;
      }

      const nfts = [];
      for (let i = 0; i < totalSupply; i++) {
        const id = await contract?.tokenByIndex(i);
        const owner = await contract?.ownerOf(id);
        const tokenURI = await contract?.tokenURI(id);
        const ipfsHash = tokenURI.replace('https://ipfs.io/ipfs/', '');

        const content = await getFromIPFS(ipfsHash);

        try {
          const ipfsObject = JSON.parse(content);
          nfts.push({
            i,
            id,
            uri: tokenURI,
            owner,
            ...ipfsObject,
          });
        } catch (e) {
          console.log(e);
        }
      }
      setNftsLoaded(true);
      setNfts(nfts);
    } catch (e) {
      console.log(e);
      setNftsLoaded(true);
    }
  }, [contract]);

  //   get total supply on load in useEffect
  useEffect(() => {
    if (!nftsLoaded) getNFTs();
  }, [contract, nftsLoaded, getNFTs]);

  const showNFT = (nft: any) => {
    onOpen();
    setSelectedNFT(nft);
  };

  console.log(nfts);

  return (
    <SimpleGrid
      columns={{ base: 2, md: 2, lg: 4 }}
      maxWidth="8xl"
      mx="auto"
      columnGap={2}
      rowGap={2}
    >
      {nftsLoaded &&
        nfts.map((nft: any) => (
          <GridItem
            key={nft.i}
            bg="blue.500"
            display="relative"
            h="full"
            cursor="pointer"
            onClick={() => showNFT(nft)}
          >
            <Img w="full" h="auto" src={nft.image} borderRadius="md" />
          </GridItem>
        ))}
      <Modal size={'md'} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <Img
            w="full"
            h="auto"
            src={selectedNFT?.image}
            borderTopRadius="md"
          />
          <ModalBody>
            <Stack gap="0" pb="4">
              <Text fontSize="sm" textAlign="center" py="4">
                {selectedNFT?.description}
              </Text>
              <MintSecondary prompt={selectedNFT?.description} />
            </Stack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </SimpleGrid>
  );
};

export default Gallery;
