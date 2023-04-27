import { VStack } from "@chakra-ui/react"
import { useState } from "react"

import { useWeb3React } from "@web3-react/core"
import { useContract } from "../utils/useContract"

import { Status } from "../components/Status"
import { Accounts } from "../components/Accounts"
import SignMessage from "../components/SignMessage"
import MintButton from "../components/MintButton"
import WalletButton from "../components/WalletButton"
import ConnectButton from "../components/ConnectButton"
import DisconnectButton from "../components/DisconnectButton"

import { Chain } from "../components/Chain"
import ChainSelect from "../components/ChainSelect"

export default function Home() {
  // Get variables from Web3react context using the useWeb3React hook
  const {
    connector,
    accounts,
    isActive,
    ENSNames,
    chainId,
    isActivating,
    provider,
  } = useWeb3React()

  // Get the NFT minting contract instance if Web3React is active
  const contract = useContract(isActive, connector)

  const [selectedChainId, setSelectedChainId] = useState(chainId)

  return (
    <VStack justifyContent="center" alignItems="center" height="100vh">
      <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      <Status isActivating={isActivating} isActive={isActive} />
      <Chain chainId={chainId} />
      <ChainSelect
        connector={connector}
        chainId={chainId}
        onSelect={setSelectedChainId}
        isActive={isActive}
      />
      {isActive ? (
        <VStack alignItems="center" justifyContent="center">
          <DisconnectButton connector={connector} />
          <WalletButton connector={connector} />
          <MintButton
            accounts={accounts}
            contract={contract}
            provider={provider}
          />
          <SignMessage provider={provider} accounts={accounts} />
        </VStack>
      ) : (
        <ConnectButton selectedChainId={selectedChainId} />
      )}
    </VStack>
  )
}
