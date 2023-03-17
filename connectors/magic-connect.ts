import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"
import type { MagicConnect as MagicConnectType } from "web3-react-magic"

export const [magicConnect, hooks] = initializeConnector<MagicConnectType>(
  (actions) =>
    new MagicConnect({
      actions,
      options: {
        apiKey: process.env.NEXT_PUBLIC_MAGICKEY,
        networkOptions: {
          rpcUrl: process.env.NEXT_PUBLIC_GOERLI_RPC,
          chainId: 5,
        },
      },
    })
)
