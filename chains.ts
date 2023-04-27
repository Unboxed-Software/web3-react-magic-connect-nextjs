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
    rpcUrl: ["https://sepolia.infura.io/v3/84842078b09946638c03157f83405213"],
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
    rpcUrl: [
      "https://eth-goerli.g.alchemy.com/v2/3jKhhva6zBqwp_dnwPlF4d0rFZhu2pjD/",
    ],
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

// unused
export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS
).reduce<{ [chainId: number]: string[] }>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].rpcUrl

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs
  }

  return accumulator
}, {})
