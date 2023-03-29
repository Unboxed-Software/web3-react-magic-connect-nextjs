import { useEffect, useState } from "react"

import type { Connector } from "@web3-react/types"
import { MagicConnect } from "web3-react-magic"

import Web3 from "web3"
import { contractABI } from "./abi"

export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export const useContract = (isActive: boolean, connector: Connector) => {
  const [contract, setContract] = useState<any>(null)

  useEffect(() => {
    if (!isActive || !connector) {
      return
    }

    try {
      // @ts-ignore
      const web3 = new Web3(connector.provider)
      const contract = new web3.eth.Contract(
        // @ts-ignore
        contractABI,
        contractAddress
      )
      setContract(contract)
    } catch (error) {
      console.log("Failed to create contract", error)
    }
  }, [isActive, connector])

  return contract
}
