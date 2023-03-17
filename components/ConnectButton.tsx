import { Button } from "@chakra-ui/react"
import { MagicConnect } from "web3-react-magic"
import { useState } from "react"

type ConnectButtonProps = {
  magicConnect: MagicConnect
}

const ConnectButton = ({ magicConnect }: ConnectButtonProps) => {
  const [error, setError] = useState<Error | undefined>(undefined)

  const handleConnect = async () => {
    try {
      await magicConnect.activate()
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
