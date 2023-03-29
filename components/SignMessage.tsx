import { useState, useRef } from "react"
import { HStack, Box, VStack, Input, Button, Text } from "@chakra-ui/react"

type SignMessageProps = {
  provider: any
  accounts: string[]
}

// Component to test signing a message with the connected wallet
const SignMessage = ({ provider, accounts }: SignMessageProps) => {
  // Initialize state for message and signature
  const [message, setMessage] = useState("")
  const [signature, setSignature] = useState("")

  // Initialize a ref for the input field
  const inputRef = useRef(null)

  // Handle input change
  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) =>
    setMessage(e.target.value)

  // Sign the message
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
          {/* Input field for message */}
          <Input
            ref={inputRef}
            value={message}
            placeholder="Set Message"
            maxLength={20}
            onChange={handleInput}
            w="140px"
          />
          {/* Button to sign the message */}
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
