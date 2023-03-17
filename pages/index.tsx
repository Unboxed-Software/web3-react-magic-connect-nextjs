import { Button, VStack, Text, HStack, Input, Box } from "@chakra-ui/react"
import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"
import type { MagicConnect as MagicConnectType } from "web3-react-magic"
import { useEffect, useRef, useState } from "react"
import { Status } from "../components/Status"
import { Accounts } from "../components/Accounts"
import Web3 from "web3"
import { getName } from "../utils"

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

  const [user, setUser] = useState(null)

  async function openWallet() {
    if (magicConnect.magic) {
      magicConnect.magic.wallet.getInfo().then(async (walletInfo) => {
        if (walletInfo?.walletType == "magic") {
          magicConnect.magic.wallet.showUI().catch((err) => console.error(err))
        }
      })
    }
  }

  // console.log(`Connector is: ${getName(magicConnect)}`)
  // console.log(`Accounts are: ${accounts}`)
  // console.log(`Is active: ${isActive}`)
  // console.log(`ENS names: ${ENSNames}`)
  // console.log(`Chain ID: ${chainId}`)
  // console.log(`Is activating: ${isActivating}`)
  // console.log(`Provider: ${provider}`)

  const [web3, setWeb3] = useState(null)
  const [error, setError] = useState(undefined)

  const inputRef = useRef(null)
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState("")

  // useEffect(() => {
  //   if (isActive && magicConnect) {
  //     //@ts-ignore
  //     setWeb3(new Web3(magicConnect.magic.rpcProvider))
  //   }
  // }, [isActive, magicConnect])

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

  const refreshState = () => {
    setMessage("")
    setSignature("")
  }

  const handleInput = (e) => setMessage(e.target.value)
  console.log(message)

  const signMessage = async () => {
    // if (web3 && accounts) {
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
        <VStack>
          <Button onClick={disconnect}>Disconnect</Button>
          <Button onClick={openWallet}>Wallet</Button>
        </VStack>
      ) : (
        <Button onClick={connect}>Connect</Button>
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
