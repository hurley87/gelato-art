import { GaslessOnboarding } from '@gelatonetwork/gasless-onboarding';

const apiKey = process.env.NEXT_PUBLIC_GELATO_API_KEY as string;

const createGelato = () => {
  return (
    typeof window != 'undefined' &&
    new GaslessOnboarding(
      {
        domains: [window.location.origin],
        chain: {
          id: 84531,
          rpcUrl:
            'hhttps://responsive-palpable-violet.base-goerli.quiknode.pro/7a6b981506c0cc9cb4544c20fabd1307e5827f67/',
        },
        ui: {
          theme: 'light',
        },
        openLogin: {
          redirectUrl: `${window.location.origin}`,
        },
      },
      { apiKey }
    )
  );
};

export const gelato = createGelato();
