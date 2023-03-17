import { Button, VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"
import type { MagicConnect as MagicConnectType } from "web3-react-magic"

import Web3 from "web3"
import { contractABI } from "../lib/abi"
import { contractAddress } from "../lib/utils"

import { Status } from "../components/Status"
import { Accounts } from "../components/Accounts"
import SignMessage from "../components/SignMessage"
import MintButton from "../components/MintButton"
import WalletButton from "../components/WalletButton"
import ConnectButton from "../components/ConnectButton"
import DisconnectButton from "../components/DisconnectButton"

const [magicConnect, magicConnectHooks] = initializeConnector<MagicConnectType>(
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

const {
  useChainId,
  useAccounts,
  useIsActivating,
  useIsActive,
  useProvider,
  useENSNames,
} = magicConnectHooks

export default function Home() {
  const chainId = useChainId()
  const accounts = useAccounts()
  const isActivating = useIsActivating()
  const isActive = useIsActive()
  const provider = useProvider()
  const ENSNames = useENSNames(provider)

  const [web3, setWeb3] = useState(null)

  const [contract, setContract] = useState(null)

  useEffect(() => {
    if (isActive && magicConnect) {
      //@ts-ignore
      setWeb3(new Web3(magicConnect.magic.rpcProvider))
    }
  }, [isActive, magicConnect])

  useEffect(() => {
    if (web3 && isActive && magicConnect) {
      setContract(new web3.eth.Contract(contractABI, contractAddress))
    }
  }, [web3])

  return (
    <VStack justifyContent="center" alignItems="center" height="100vh">
      <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      <Status isActivating={isActivating} isActive={isActive} />
      {isActive ? (
        <VStack alignItems="center" justifyContent="center">
          <DisconnectButton magicConnect={magicConnect} />
          <WalletButton magicConnect={magicConnect} />
          <MintButton
            accounts={accounts}
            contract={contract}
            contractAddress={contractAddress}
          />
          <SignMessage provider={provider} accounts={accounts} />
        </VStack>
      ) : (
        <ConnectButton magicConnect={magicConnect} />
      )}
    </VStack>
  )
}
