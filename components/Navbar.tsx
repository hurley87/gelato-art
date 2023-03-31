import React, { useContext } from 'react';
import NextLink from 'next/link';
import { Flex, Text, HStack, Link, Badge } from '@chakra-ui/react';
import { UserContext } from '@/lib/UserContext';
import { gelato } from '@/lib/gelato';

// function to format user wallet address
const formatAddress = (address: string) => {
  return address ? `${address.slice(0, 4)}...${address.slice(-4)}` : '';
};

const Navbar = () => {
  const [user, setUser]: any = useContext(UserContext);

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

  const logout = async () => {
    if (!gelato) {
      return;
    }
    await gelato.logout();
    window.location.reload();
    setUser(null);
  };

  return (
    <Flex
      justifyContent="space-between"
      w="full"
      bg="white"
      p="4"
      borderBottom="1px solid rgba(0,0,0,.05)"
      position="fixed"
      zIndex="9999"
    >
      <HStack gap={0}>
        <NextLink href="/" passHref>
          <Text
            transition="all 200ms linear"
            _active={{
              transform: 'scale(0.95)',
            }}
            fontWeight="black"
          >
            Gelato Art
          </Text>
        </NextLink>
      </HStack>
      {user?.signer ? (
        <Flex
          justifyContent="center"
          alignItems="center"
          textDecoration="none"
          gap={2}
        >
          <Link
            href={`https://base-goerli.blockscout.com/address/${user.address}?tab=token_transfers`}
            target="_blank"
            fontSize="sm"
            cursor="pointer"
          >
            <Badge colorScheme="orange">{formatAddress(user.address)}</Badge>
          </Link>
          <Text>|</Text>
          <Text fontSize="sm" cursor="pointer" onClick={logout}>
            Logout
          </Text>
        </Flex>
      ) : (
        <Flex
          justifyContent="center"
          alignItems="center"
          textDecoration="none"
          gap={3}
        >
          <NextLink href="/collection" passHref>
            <Text fontSize="sm">Collection</Text>
          </NextLink>
          <Text>|</Text>
          <Text fontSize="sm" cursor="pointer" onClick={connect}>
            Login
          </Text>
        </Flex>
      )}
    </Flex>
  );
};

export default Navbar;
