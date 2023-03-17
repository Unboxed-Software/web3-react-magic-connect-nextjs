import { VStack } from "@chakra-ui/react"
import { useEffect, useState } from "react"

import Web3 from "web3"
import { contractABI } from "../lib/abi"
import { contractAddress, getName } from "../lib/utils"
import { useWeb3React } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"

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

  const [contract, setContract] = useState(null)

  // Not sure how to set this up without a useEffect
  useEffect(() => {
    let web3 = null

    if (isActive) {
      if (connector instanceof MagicConnect) {
        // @ts-ignore
        web3 = new Web3(connector.magic.rpcProvider)
      } else {
        // TODO: How to support other connectors
      }
    }

    if (web3) {
      const contract = new web3.eth.Contract(contractABI, contractAddress)
      setContract(contract)
    }
  }, [isActive, connector])

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
        <ConnectButton connector={connector} />
      )}
    </VStack>
  )
}
function usePriorityConnector() {
  throw new Error("Function not implemented.")
}

function usePriorityProvider() {
  throw new Error("Function not implemented.")
}
