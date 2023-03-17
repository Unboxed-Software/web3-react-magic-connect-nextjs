import { MetaMask } from "@web3-react/metamask"
import type { Connector } from "@web3-react/types"
import { MagicConnect } from "web3-react-magic"

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return "MetaMask"
  if (connector instanceof MagicConnect) return "Magic Connect"
  return "Unknown"
}
