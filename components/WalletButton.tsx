import { Button } from "@chakra-ui/react"
import { MagicConnect } from "web3-react-magic"
import { Connector } from "@web3-react/types"

type WalletButtonProps = {
  connector: MagicConnect | Connector
}

const WalletButton = ({ connector }: WalletButtonProps) => {
  const handleOpenWallet = () => {
    if (connector instanceof MagicConnect && connector.magic) {
      connector.magic.wallet.getInfo().then((walletInfo) => {
        if (walletInfo?.walletType == "magic") {
          connector.magic.wallet.showUI().catch((err) => console.error(err))
        }
      })
    }
  }

  if (!(connector instanceof MagicConnect)) {
    return null
  }

  return (
    <Button onClick={handleOpenWallet} w={100}>
      Wallet
    </Button>
  )
}

export default WalletButton
