import { ChakraProvider } from '@chakra-ui/react';
import { providers } from 'ethers';
import { createClient, useProvider, WagmiConfig } from 'wagmi';
import { useEffect, useState } from 'react';
import { UserContext } from '../lib/UserContext';
import { gelato } from '../lib/gelato';
import { Toaster } from 'react-hot-toast';
import { ethers } from 'ethers';

const provider = new providers.JsonRpcProvider(
  'https://fabled-proportionate-grass.base-goerli.quiknode.pro/43a2893a730d0ac6376b0fbd184c18c94d408504/',
  { name: 'base-goerli', chainId: 84531, ensAddress: undefined }
);

// Give wagmi our provider config and allow it to autoconnect wallet
const client = createClient({
  autoConnect: true,
  provider,
});

function MyApp({ Component, pageProps }) {
  const [user, setUser] = useState();
  const provider = useProvider();

  useEffect(() => {
    const init = async () => {
      setUser({ loading: true });
      await gelato.init();

      try {
        const user = await gelato.getUserInfo();
        const provider = gelato.getProvider();
        const wallet = gelato.getGaslessWallet();
        const web3Provider = new ethers.providers.Web3Provider(provider);
        const signer = web3Provider.getSigner();
        const address = await signer.getAddress();

        user['wallet'] = wallet;
        user['signer'] = signer;
        user['provider'] = web3Provider;
        user['address'] = address;

        setUser(user);
      } catch (error) {
        console.log(error);
        console.log(provider);
        setUser({ provider });
      }
    };
    init();
  }, [provider, setUser]);

  return (
    <WagmiConfig client={client}>
      <UserContext.Provider value={[user, setUser]}>
        <ChakraProvider>
          <Component {...pageProps} />
          <Toaster position="top-center" />
        </ChakraProvider>
      </UserContext.Provider>
    </WagmiConfig>
  );
}

export default MyApp;