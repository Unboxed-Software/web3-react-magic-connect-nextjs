import type { Web3ReactHooks } from "@web3-react/core"
import { Text } from "@chakra-ui/react"

export function Status({
  isActivating,
  isActive,
  error,
}: {
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>
  error?: Error
}) {
  return (
    <Text>
      {error ? (
        <>
          🔴 {error.name ?? "Error"}
          {error.message ? `: ${error.message}` : null}
        </>
      ) : isActivating ? (
        <>🟡 Connecting</>
      ) : isActive ? (
        <>🟢 Connected</>
      ) : (
        <>⚪️ Disconnected</>
      )}
    </Text>
  )
}
