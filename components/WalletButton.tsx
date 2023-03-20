import { Button } from "@chakra-ui/react"
import { MagicConnect } from "web3-react-magic"
import { Connector } from "@web3-react/types"
import { useEffect, useState } from "react"

interface WalletButtonProps {
  connector: MagicConnect | Connector
}

const WalletButton = ({ connector }: WalletButtonProps) => {
  const [showButton, setShowButton] = useState(false)

  const handleOpenWallet = async () => {
    if (showButton) {
      try {
        // @ts-ignore
        await connector.magic.wallet.showUI()
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    const checkWalletType = async () => {
      const isMagicConnect =
        connector instanceof MagicConnect && connector.magic

      if (isMagicConnect) {
        const walletInfo = await connector.magic.wallet.getInfo()
        setShowButton(walletInfo?.walletType === "magic")
      } else {
        setShowButton(false)
      }
    }

    checkWalletType()
  }, [connector])

  if (!showButton) return null

  return (
    <Button onClick={handleOpenWallet} w={100}>
      Wallet
    </Button>
  )
}

export default WalletButton
