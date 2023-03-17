import { Button, VStack, Text, HStack, Input, Box } from "@chakra-ui/react"
import { initializeConnector } from "@web3-react/core"
import { MagicConnect } from "web3-react-magic"
import type { MagicConnect as MagicConnectType } from "web3-react-magic"
import { useEffect, useRef, useState } from "react"
import { Status } from "../components/Status"
import { Accounts } from "../components/Accounts"
import Web3 from "web3"
import { useWeb3React } from "@web3-react/core"
import { getName } from "../utils"

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

  console.log(connector)

  // console.log(`Priority Connector is: ${getName(connector)}`)
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
      await connector.activate()
      setError(undefined)
    } catch (error) {
      setError(error)
      console.log(error)
    }
  }

  const disconnect = async () => {
    try {
      if (connector?.deactivate) {
        void connector.deactivate()
      } else {
        void connector.resetState()
      }
      setError(undefined)
      refreshState()
      if (inputRef.current) {
        inputRef.current.focus()
      }
    } catch (error) {
      setError(error)
      console.log(error)
    }
  }

  const refreshState = () => {
    setMessage("")
    setSignature("")
  }

  const handleInput = (e) => setMessage(e.target.value)
  console.log(message)

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
