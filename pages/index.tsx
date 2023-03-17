import {
  Button,
  VStack,
  Text,
  HStack,
  Input,
  Box,
  Link,
} from "@chakra-ui/react"
import { LinkIcon } from "@chakra-ui/icons"
import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"
import type { MagicConnect as MagicConnectType } from "web3-react-magic"
import { useEffect, useRef, useState } from "react"
import { Status } from "../components/Status"
import { Accounts } from "../components/Accounts"
import Web3 from "web3"
import { contractABI } from "../lib/abi"
import { requestMintNFT } from "../lib/utils"

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
  const [error, setError] = useState(undefined)

  const inputRef = useRef(null)
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState("")

  const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
  const [contract, setContract] = useState(null)
  const [tokenID, setTokenID] = useState(null)

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

  async function requestMint() {
    if (magicConnect.magic && contract) {
      const res = await requestMintNFT(accounts[0], contract)
      if (!res) {
        console.log("Mint failed (or was canceled by the user).")
        return
      }
      setTokenID(res.tokenId)
      console.log(res.tokenId)
      console.log(res.hash)
    }
  }

  const connect = async () => {
    try {
      await magicConnect.activate()
      setError(undefined)
    } catch (error) {
      setError(error)
      console.log(error)
    }
  }

  const disconnect = async () => {
    try {
      await magicConnect.deactivate()
      setError(undefined)
      refreshState()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch (error) {
      setError(error)
    }
  }

  function openWallet() {
    if (magicConnect.magic) {
      magicConnect.magic.wallet.getInfo().then((walletInfo) => {
        if (walletInfo?.walletType == "magic") {
          magicConnect.magic.wallet.showUI().catch((err) => console.error(err))
        }
      })
    }
  }

  const refreshState = () => {
    setMessage("")
    setSignature("")
    setTokenID(null)
  }

  const handleInput = (e) => setMessage(e.target.value)
  console.log(message)

  const signMessage = async () => {
    if (accounts) {
      try {
        const signed = await provider.send("personal_sign", [
          message,
          accounts[0],
          null,
        ])

        // const signed = await provider.provider.request({
        //   method: "personal_sign",
        //   params: [message, accounts[0], null],
        // })

        // const signed = await web3.eth.personal.sign(message, accounts[0], null)
        setSignature(signed)
      } catch (error) {
        setError(error)
      }
    }
  }

  return (
    <VStack justifyContent="center" alignItems="center" height="100vh">
      <Accounts accounts={accounts} provider={provider} ENSNames={ENSNames} />
      <Status isActivating={isActivating} isActive={isActive} error={error} />
      {isActive ? (
        <VStack alignItems="center" justifyContent="center">
          <Button onClick={disconnect} w={100}>
            Disconnect
          </Button>
          <Button onClick={openWallet} w={100}>
            Wallet
          </Button>
          <Button onClick={requestMint} w={100}>
            Mint
          </Button>

          {tokenID && (
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
          )}
        </VStack>
      ) : (
        <Button onClick={connect} w={100}>
          Connect
        </Button>
      )}

      {isActive && (
        <HStack justifyContent="flex-start" alignItems="flex-start">
          <Box
            maxW="sm"
            borderWidth="1px"
            borderRadius="lg"
            overflow="hidden"
            padding="10px"
          >
            <VStack>
              <Input
                ref={inputRef}
                value={message}
                placeholder="Set Message"
                maxLength={20}
                onChange={handleInput}
                w="140px"
              />
              <Button onClick={signMessage} isDisabled={!message}>
                Sign Message
              </Button>
            </VStack>
            {signature && <Text>{`Signature: ${signature}`}</Text>}
          </Box>
        </HStack>
      )}
    </VStack>
  )
}
