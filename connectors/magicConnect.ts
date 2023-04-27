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
          rpcUrl:
            "https://eth-goerli.g.alchemy.com/v2/3jKhhva6zBqwp_dnwPlF4d0rFZhu2pjD/",
          chainId: 5,
        },
      },
    })
)
