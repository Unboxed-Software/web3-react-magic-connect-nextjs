import type { Web3ReactHooks } from "@web3-react/core"
import { Text } from "@chakra-ui/react"

export function Status({
  isActivating,
  isActive,
}: {
  isActivating: ReturnType<Web3ReactHooks["useIsActivating"]>
  isActive: ReturnType<Web3ReactHooks["useIsActive"]>
}) {
  return (
    <Text>
      {isActive ? (
        <>🟢 Connected</>
      ) : (
        <>{isActivating ? <>🟡 Connecting</> : <>⚪️ Disconnected</>}</>
      )}
    </Text>
  )
}
