import { Button, HStack, Link, Text, Spinner } from "@chakra-ui/react"
import { useState } from "react"
import { Contract } from "web3-eth-contract"
import { LinkIcon } from "@chakra-ui/icons"
import { requestMintNFT } from "../utils/utils"
import type { Web3ReactHooks } from "@web3-react/core"

type MintButtonProps = {
  accounts: string[]
  contract: Contract | null
  provider: ReturnType<Web3ReactHooks["useProvider"]>
}

const MintButton = ({ accounts, contract, provider }: MintButtonProps) => {
  // State to keep track of transaction hash
  const [transactionHash, setTransactionHash] = useState<string | null>(null)
  // State to keep track of loading status
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Function to request NFT minting
  const requestMint = async () => {
    if (contract && accounts.length > 0) {
      setIsLoading(true)
      // Call the minting function and wait for the result
      const res = await requestMintNFT(accounts[0], contract, provider)
      setIsLoading(false)
      if (!res) {
        // console.log("Mint failed (or was canceled by the user).")
        return
      }
      // Set the transaction hash in state
      setTransactionHash(res.hash)
      // console.log(res.tokenId)
      // console.log(res.hash)
    }
  }

  // Display Etherscan link once transactionHash is available
  // Using Etherscan since OpenSea doesn't currently support Sepolia
  const etherscanLink = transactionHash ? (
    <HStack>
      <Text>Etherscan</Text>
      <Link
        href={`https://sepolia.etherscan.io/tx/${transactionHash}`}
        isExternal
        _hover={{ color: "blue.600" }}
      >
        <LinkIcon />
      </Link>
    </HStack>
  ) : null

  return (
    <>
      {/* Mint button */}
      <Button onClick={requestMint} w={100}>
        Mint
      </Button>
      {/* Spinner while loading */}
      {isLoading ? <Spinner /> : null}
      {/* Etherscan link */}
      {etherscanLink}
    </>
  )
}

export default MintButton
