import { Button, HStack, Link, Text } from "@chakra-ui/react"
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
  const [tokenID, setTokenID] = useState<number | null>(null)

  const requestMint = async () => {
    if (contract && accounts.length > 0) {
      const res = await requestMintNFT(accounts[0], contract, provider)
      if (!res) {
        console.log("Mint failed (or was canceled by the user).")
        return
      }
      setTokenID(res.tokenId)
      console.log(res.tokenId)
      console.log(res.hash)
    }
  }

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
      <Button onClick={requestMint} w={100}>
        Mint
      </Button>
      {openSeaLink}
    </>
  )
}

export default MintButton
