import { useEffect, useState } from "react"
import type { Connector } from "@web3-react/types"
import Web3 from "web3"
import { contractABI } from "./abi"

// NFT minting contract address
export const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS

export const useContract = (isActive: boolean, connector: Connector) => {
  // Initialize state for the contract instance
  const [contract, setContract] = useState<any>(null)

  // Function to create the contract instance
  const createContract = async () => {
    if (!isActive || !connector) {
      return
    }

    try {
      // Create a new Web3 instance with the connector provider
      // @ts-ignore
      const web3 = new Web3(connector.provider)

      // Create a new contract instance with the contract ABI and address
      const newContract = new web3.eth.Contract(
        // @ts-ignore
        contractABI,
        contractAddress
      )

      // Set the contract state to the new contract instance
      setContract(newContract)
    } catch (error) {
      console.log("Failed to create contract", error)
    }
  }

  // Call the createContract function when the component mounts or when the Web3React state changes
  useEffect(() => {
    createContract()
  }, [isActive, connector])

  return contract
}
