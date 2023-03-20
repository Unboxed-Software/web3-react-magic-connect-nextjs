import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import { useState } from "react"
import { Connector } from "@web3-react/types"
import { magicConnect } from "../connectors/magicConnect"
import { metaMask } from "../connectors/metaMask"
import { walletConnect } from "../connectors/walletConnect"

const ConnectButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [error, setError] = useState<Error | undefined>(undefined)

  const handleConnect = async (connector: Connector) => {
    try {
      await connector.activate()
      setError(undefined)
    } catch (error) {
      setError(error)
      console.log(error)
    }
  }

  return (
    <>
      <Button onClick={onOpen}>Connect</Button>
      {error && <p>Error: {error.message}</p>}

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Select Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack>
              <Button onClick={() => handleConnect(metaMask)} w="65%">
                Metamask
              </Button>
              <Button onClick={() => handleConnect(magicConnect)} w="65%">
                Magic Connect
              </Button>
              <Button onClick={() => handleConnect(walletConnect)} w="65%">
                Wallet Connect
              </Button>
            </VStack>
          </ModalBody>
          <ModalFooter />
        </ModalContent>
      </Modal>
    </>
  )
}

export default ConnectButton
