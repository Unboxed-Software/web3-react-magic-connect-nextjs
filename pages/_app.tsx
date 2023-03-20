import type { AppProps } from "next/app"
import { ChakraProvider } from "@chakra-ui/react"
import { Web3ReactHooks, Web3ReactProvider } from "@web3-react/core"
import { MetaMask } from "@web3-react/metamask"
import { MagicConnect } from "web3-react-magic"
import { WalletConnect } from "@web3-react/walletconnect"
import { hooks as metaMaskHooks, metaMask } from "../connectors/metaMask"
import {
  hooks as magicConnectHooks,
  magicConnect,
} from "../connectors/magicConnect"
import {
  hooks as walletConnectHooks,
  walletConnect,
} from "../connectors/walletConnect"

const connectors: [MetaMask | MagicConnect | WalletConnect, Web3ReactHooks][] =
  [
    [metaMask, metaMaskHooks],
    [magicConnect, magicConnectHooks],
    [walletConnect, walletConnectHooks],
  ]

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <Web3ReactProvider connectors={connectors}>
        <Component {...pageProps} />
      </Web3ReactProvider>
    </ChakraProvider>
  )
}
