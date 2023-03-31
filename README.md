## Next.js - web3-react Magic Connect Example

This is a minimal implementation of the web3-react Magic Connect Connector in Next.js. 
It includes a wallet selector modal, message signing, and NFT minting.

## Getting started

1. Clone this repo
2. Install dependencies: `npm install`
3. Rename `.env.example` to `.env` and replace variables with your own. You can get you Magic Connect API Key by creating an account [here](https://magic.link/).
4. Run the development server: `npm run dev`


## Magic Connect Connector

```ts
import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"
import type { MagicConnect as MagicConnectType } from "web3-react-magic"

// Initialize the MagicConnect connector
export const [magicConnect, hooks] = initializeConnector<MagicConnectType>(
  (actions) =>
    new MagicConnect({
      actions,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGICKEY, // Magic Connect Publishable API key
        networkOptions: {
          rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC, // Goerli Testnet RPC URL
          chainId: 5, // Chain ID for the Goerli network
        },
      },
    })
)
```
