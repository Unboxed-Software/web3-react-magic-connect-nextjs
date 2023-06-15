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
import { getAddChainParameters } from "../chains"

const ConnectButton = ({ selectedChainId }) => {
  // Manage modal state
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [error, setError] = useState<Error | undefined>(undefined)

  // Handle connection to wallet using selected connector
  const handleConnect = async (connector: Connector) => {
    try {
      await connector.activate(getAddChainParameters(selectedChainId))
      setError(undefined)
    } catch (error) {
      setError(error)
      console.log(error)
    }
  }

  return (
    <>
      <Button onClick={onOpen}>Connect</Button>

      {/* Show error message if an error occurred */}
      {error && <p>Error: {error.message}</p>}

      {/* Show modal with wallet connection options */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textAlign="center">Select Wallet</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* Show buttons to connect using wallet connectors*/}
            <VStack>
              <Button onClick={() => handleConnect(metaMask)} w="65%">
                Metamask
              </Button>
              <Button onClick={() => handleConnect(magicConnect)} w="65%">
                Magic Connect
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
