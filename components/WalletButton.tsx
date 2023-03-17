import { Button } from "@chakra-ui/react"
import { MagicConnect } from "web3-react-magic"

type WalletButtonProps = {
  magicConnect: MagicConnect
}

const WalletButton = ({ magicConnect }: WalletButtonProps) => {
  const handleOpenWallet = () => {
    if (magicConnect.magic) {
      magicConnect.magic.wallet.getInfo().then((walletInfo) => {
        if (walletInfo?.walletType == "magic") {
          magicConnect.magic.wallet.showUI().catch((err) => console.error(err))
        }
      })
    }
  }

  return (
    <Button onClick={handleOpenWallet} w={100}>
      Wallet
    </Button>
  )
}

export default WalletButton
