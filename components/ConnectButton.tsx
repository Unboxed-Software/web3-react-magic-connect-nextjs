import { Button } from "@chakra-ui/react"
import { useState } from "react"
import { Connector } from "@web3-react/types"
import { magicConnect } from "../connectors/magic-connect"
import { metaMask } from "../connectors/metaMask"

const ConnectButton = () => {
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
      <Button onClick={() => handleConnect(metaMask)} w={150}>
        Metamask
      </Button>

      <Button onClick={() => handleConnect(magicConnect)} w={150}>
        Magic Connect
      </Button>
      {error && <p>Error: {error.message}</p>}
    </>
  )
}

export default ConnectButton
