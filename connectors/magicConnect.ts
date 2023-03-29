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
