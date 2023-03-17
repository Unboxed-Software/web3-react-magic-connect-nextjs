import { Button } from "@chakra-ui/react"
import { MagicConnect } from "web3-react-magic"
import { useState } from "react"

type DisconnectButtonProps = {
  magicConnect: MagicConnect
}

const DisconnectButton = ({ magicConnect }: DisconnectButtonProps) => {
  const [error, setError] = useState<Error | undefined>(undefined)

  const handleDisconnect = async () => {
    try {
      await magicConnect.deactivate()
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
