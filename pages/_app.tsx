import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { MagicConnect } from "web3-react-magic"
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask"
import {
  hooks as magicConnectHooks,
  magicConnect,
} from "../connectors/magicConnect"

// Define an array of web3react connectors and their hooks
// This is simply  an example of how to setup multiple connectors
// The MagicConnect connector already supports connecting with MetaMask and WalletConnect using the Magic Connect Modal
const connectors: [MetaMask | MagicConnect, Web3ReactHooks][] = [
  [metaMask, metaMaskHooks],
  [magicConnect, magicConnectHooks],
]

// Wrap the app in the ChakraProvider and Web3ReactProvider passing in the connectors
export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Web3ReactProvider connectors={connectors}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </ChakraProvider>
  )
}
