import { Button } from "@chakra-ui/react"
import { useState } from "react"
import { Connector } from "@web3-react/types"

type ConnectButtonProps = {
  connector: Connector
}

const ConnectButton = ({ connector }: ConnectButtonProps) => {
  const [error, setError] = useState<Error | undefined>(undefined)

  const handleConnect = async () => {
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
      <Button onClick={handleConnect} w={100}>
        Connect
      </Button>
      {error && <p>Error: {error.message}</p>}
    </>
  )
}

export default ConnectButton
