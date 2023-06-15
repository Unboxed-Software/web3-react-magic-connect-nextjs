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
          rpcUrl: "https://rpc.ankr.com/eth_goerli",
          chainId: 5,
        },
      },
    })
)
