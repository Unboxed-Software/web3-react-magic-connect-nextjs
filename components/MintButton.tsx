import { Button, HStack, Link, Text, Spinner } from "@chakra-ui/react"
import { useState } from "react"
import { Contract } from "web3-eth-contract"
import { LinkIcon } from "@chakra-ui/icons"
import { requestMintNFT } from "../utils/utils"
import type { Web3ReactHooks } from "@web3-react/core"

type MintButtonProps = {
  accounts: string[]
  contract: Contract | null
  contractAddress: string
  provider: ReturnType<Web3ReactHooks["useProvider"]>
}

const MintButton = ({
  accounts,
  contract,
  contractAddress,
  provider,
}: MintButtonProps) => {
  // State to keep track of the minted token ID
  const [tokenID, setTokenID] = useState<number | null>(null)
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
        console.log("Mint failed (or was canceled by the user).")
        return
      }
      // Set the token ID in state
      setTokenID(res.tokenId)
      console.log(res.tokenId)
      console.log(res.hash)
    }
  }

  // Display OpenSea link if token ID is available
  const openSeaLink = tokenID ? (
    <HStack>
      <Text>OpenSea</Text>
      <Link
        href={`https://testnets.opensea.io/assets/goerli/${contractAddress}/${tokenID}`}
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
      {/* OpenSea link */}
      {openSeaLink}
    </>
  )
}

export default MintButton
