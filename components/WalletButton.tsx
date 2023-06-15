import { Button } from "@chakra-ui/react"
import { MagicConnect } from "@magiclabs/web3-react"
import { Connector } from "@web3-react/types"
import { useCallback, useEffect, useState } from "react"

interface WalletButtonProps {
  connector: MagicConnect | Connector
}

const WalletButton = ({ connector }: WalletButtonProps) => {
  // Check if connector is an instance of MagicConnect
  if (!(connector instanceof MagicConnect)) return null

  // State to determine if Magic Connect wallet button should be shown
  const [showButton, setShowButton] = useState(false)

  // Function to open Magic Connect wallet
  const handleOpenWallet = useCallback(async () => {
    await connector.magic?.wallet.showUI()
  }, [connector])

  // Function to check wallet type is "magic" to determine if button should be shown
  const checkWalletType = async () => {
    const walletInfo = await connector.magic?.wallet.getInfo()
    setShowButton(walletInfo?.walletType === "magic")
  }

  // Check wallet type on mount and when connector changes
  useEffect(() => {
    checkWalletType()
  }, [connector])

  // Render button if showButton is true, otherwise render null
  return showButton ? (
    <Button onClick={handleOpenWallet} w={100}>
      Wallet
    </Button>
  ) : null
}

export default WalletButton
