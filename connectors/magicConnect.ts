import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"

// Initialize the MagicConnect connector
export const [magicConnect, hooks] = initializeConnector<MagicConnect>(
  (actions) =>
    new MagicConnect({
      actions,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGICKEY, // Magic Connect Publishable API key
        networkOptions: {
          rpcUrl: process.env.NEXT_PUBLIC_SEPOLIA_RPC, // Sepolia Testnet RPC URL
          chainId: 11155111, // Chain ID for the Sepolia network
        },
      },
    })
)
