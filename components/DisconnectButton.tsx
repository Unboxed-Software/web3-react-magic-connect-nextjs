import { Button } from "@chakra-ui/react"
import { useState } from "react"
import { Connector } from "@web3-react/types"

type DisconnectButtonProps = {
  connector: Connector
}

const DisconnectButton = ({ connector }: DisconnectButtonProps) => {
  const [error, setError] = useState<Error | undefined>(undefined)

  // Function to handle disconnection
  const handleDisconnect = async () => {
    try {
      if (connector?.deactivate) {
        void connector.deactivate()
      } else {
        void connector.resetState()
      }
      setError(undefined)
    } catch (error) {
      setError(error)
    }
  }

  return (
    <>
      <Button onClick={handleDisconnect} w={100}>
        Disconnect
      </Button>
      {error && <p>Error: {error.message}</p>}
    </>
  )
}

export default DisconnectButton
