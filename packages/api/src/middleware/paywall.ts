import { createPaywall } from 'n-payment';

const MERCHANT_ADDRESS = process.env.MERCHANT_WALLET || '0x0000000000000000000000000000000000000000';

export const paywall = (createPaywall as any)({
  routes: {
    'POST /v1/stories': {
      price: '10000',
      celo: {
        payTo: MERCHANT_ADDRESS,
        network: 'eip155:11142220',
        asset: 'USDC',
        scheme: 'eip3009',
      },
    },
    'POST /v1/stories/:storyId/chapters': {
      price: '10000',
      celo: {
        payTo: MERCHANT_ADDRESS,
        network: 'eip155:11142220',
        asset: 'USDC',
        scheme: 'eip3009',
      },
    },
  },
});
