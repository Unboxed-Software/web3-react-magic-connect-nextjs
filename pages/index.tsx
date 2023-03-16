import { Button, VStack, Text, HStack, Input, Box } from "@chakra-ui/react"
import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"
import type { MagicConnect as MagicConnectType } from "web3-react-magic"
import { useEffect, useState } from "react"
import { Status } from "../components/Status"
import { Accounts } from "../components/Accounts"
import Web3 from "web3"

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

  const [error, setError] = useState(undefined)
  const [web3, setWeb3] = useState(null)
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState("")

  useEffect(() => {
    if (isActive && magicConnect) {
      //@ts-ignore
      setWeb3(new Web3(magicConnect.magic.rpcProvider))
    }
  }, [isActive, magicConnect])

  const connect = async () => {
    try {
      await magicConnect.activate()
      setError(undefined)
    } catch (error) {
      setError(error)
    }
  }

  const disconnect = async () => {
    try {
      await magicConnect.deactivate()
      setError(undefined)
    } catch (error) {
      setError(error)
    }
  }

  const handleInput = (e) => setMessage(e.target.value)

  const signMessage = async () => {
    if (web3 && accounts) {
      try {
        const signed = await web3.eth.personal.sign(message, accounts[0], null)
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
        <Button onClick={disconnect}>Disconnect</Button>
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
