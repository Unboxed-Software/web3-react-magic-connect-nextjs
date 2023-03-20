import { VStack } from "@chakra-ui/react"

import { useWeb3React } from "@web3-react/core"
import { contractAddress, useContract } from "../utils/useContract"

import { Status } from "../components/Status"
import { Accounts } from "../components/Accounts"
import SignMessage from "../components/SignMessage"
import MintButton from "../components/MintButton"
import WalletButton from "../components/WalletButton"
import ConnectButton from "../components/ConnectButton"
import DisconnectButton from "../components/DisconnectButton"

export default function Home() {
  const {
    connector,
    accounts,
    isActive,
    ENSNames,
    chainId,
    isActivating,
    provider,
  } = useWeb3React()

  const contract = useContract(isActive, connector)

  return (
    <VStack justifyContent="center" alignItems="center" height="100vh">
      <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      <Status isActivating={isActivating} isActive={isActive} />
      {isActive ? (
        <VStack alignItems="center" justifyContent="center">
          <DisconnectButton connector={connector} />
          <WalletButton connector={connector} />
          <MintButton
            accounts={accounts}
            contract={contract}
            contractAddress={contractAddress}
          />
          <SignMessage provider={provider} accounts={accounts} />
        </VStack>
      ) : (
        <ConnectButton />
      )}
    </VStack>
  )
}
