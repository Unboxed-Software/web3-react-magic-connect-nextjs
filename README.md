## Next.js - web3-react Magic Connect Example

This is a minimal implementation of the `@magiclabs/web3-react` Magic Connect Connector in Next.js.
It includes a wallet selector modal, network switching, message signing, and NFT minting. Note that the NFT contract is only deployed and implemented for Sepolia.

## Getting started

1. Clone this repo
2. Install dependencies: `npm install`
3. Rename `.env.example` to `.env` and replace variables with your own. You can get your own Magic Connect API Key by creating an account [here](https://magic.link/).
4. Run the development server: `npm run dev`

## Magic Connect Connector

```ts
import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "@magiclabs/web3-react"

// Initialize the MagicConnect connector
export const [magicConnect, hooks] = initializeConnector<MagicConnect>(
  (actions) =>
    new MagicConnect({
      actions,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGICKEY, // Magic Connect Publishable API key
        networkOptions: {
          rpcUrl: "https://rpc2.sepolia.org", // Sepolia Testnet RPC URL
          chainId: 11155111, // Chain ID for the Sepolia network
        },
      },
    })
)
```
