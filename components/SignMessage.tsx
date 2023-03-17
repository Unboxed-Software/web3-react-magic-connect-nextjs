import { useState, useRef } from "react"
import { HStack, Box, VStack, Input, Button, Text } from "@chakra-ui/react"

type SignMessageProps = {
  provider: any
  accounts: string[]
}

const SignMessage = ({ provider, accounts }: SignMessageProps) => {
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState("")

  const inputRef = useRef(null)

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value)

  const signMessage = async () => {
    if (accounts) {
      try {
        const signed = await provider.send("personal_sign", [
          message,
          accounts[0],
          null,
        ])
        setSignature(signed)
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
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
  )
}

export default SignMessage
