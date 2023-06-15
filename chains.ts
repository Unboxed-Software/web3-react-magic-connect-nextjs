import type { AddEthereumChainParameter } from "@web3-react/types"

const ETH = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
}

const MATIC = {
  name: "Matic",
  symbol: "MATIC",
  decimals: 18,
}

export const CHAINS = {
  11155111: {
    rpcUrl: ["https://rpc2.sepolia.org"],
    nativeCurrency: ETH,
    name: "Sepolia",
  },
  420: {
    rpcUrl: ["https://goerli.optimism.io/"],
    nativeCurrency: ETH,
    name: "Optimism",
  },
  80001: {
    rpcUrl: ["https://rpc-mumbai.maticvigil.com/"],
    nativeCurrency: MATIC,
    name: "Polygon",
  },
  5: {
    rpcUrl: ["https://rpc.ankr.com/eth_goerli"],
    nativeCurrency: ETH,
    name: "Görli",
  },
}

export function getAddChainParameters(
  chainId: number
): AddEthereumChainParameter {
  const chainInformation = CHAINS[chainId]
  return {
    chainId: Number(chainId),
    chainName: chainInformation.name,
    nativeCurrency: chainInformation.nativeCurrency,
    rpcUrls: chainInformation.rpcUrl,
  }
}
