import { useCallback, useEffect } from "react"
import { CHAINS, getAddChainParameters } from "../chains"

function ChainSelect({ connector, chainId, onSelect, isActive }) {
  const chainIds = Object.keys(CHAINS).map((chainId) => Number(chainId))

  useEffect(() => {
    if (chainId === undefined && chainIds.length > 0) {
      onSelect(chainIds[0]) // Set the first available chainId as the default
    }
  }, [])

  const handleSelectChange = (event) => {
    const selectedChainId = event.target.value
    // console.log("selectedChainId", selectedChainId)
    onSelect(selectedChainId) // Call the onSelect prop with the selected chainId

    if (isActive) {
      switchChain(selectedChainId)
    }
  }

  const switchChain = useCallback(
    (desiredChainId: number) => {
      // if we're already connected to the desired chain, return
      if (desiredChainId === chainId) {
        return
      }

      // if they want to connect to the default chain and we're already connected, return
      if (desiredChainId === -1 && chainId !== undefined) {
        return
      }

      connector.activate(getAddChainParameters(desiredChainId))
    },
    [chainId]
  )

  return (
    <select value={chainId} onChange={handleSelectChange}>
      {chainIds.map((chainId) => (
        <option key={chainId} value={chainId}>
          {CHAINS[chainId]?.name ?? chainId}
        </option>
      ))}
    </select>
  )
}

export default ChainSelect
