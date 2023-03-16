import type { BigNumber } from "@ethersproject/bignumber"
import { formatEther } from "@ethersproject/units"
import type { Web3ReactHooks } from "@web3-react/core"
import { useEffect, useState } from "react"
import { VStack, Text, UnorderedList, ListItem } from "@chakra-ui/react"

function useBalances(
  provider?: ReturnType<Web3ReactHooks["useProvider"]>,
  accounts?: string[]
): BigNumber[] | undefined {
  const [balances, setBalances] = useState<BigNumber[] | undefined>()

  useEffect(() => {
    if (provider && accounts?.length) {
      let stale = false

      void Promise.all(
        accounts.map((account) => provider.getBalance(account))
      ).then((balances) => {
        if (stale) return
        setBalances(balances)
      })

      return () => {
        stale = true
        setBalances(undefined)
      }
    }
  }, [provider, accounts])

  return balances
}

export function Accounts({
  accounts,
  provider,
  ENSNames,
}: {
  accounts: ReturnType<Web3ReactHooks["useAccounts"]>
  provider: ReturnType<Web3ReactHooks["useProvider"]>
  ENSNames: ReturnType<Web3ReactHooks["useENSNames"]>
}) {
  const balances = useBalances(provider, accounts)

  if (accounts === undefined) return null

  return (
    <VStack>
      <Text>Accounts:</Text>
      <Text as="b">
        {accounts.length === 0 ? (
          "None"
        ) : (
          <UnorderedList style={{ margin: 0 }}>
            {accounts.map((account, i) => (
              <ListItem
                key={account}
                style={{ overflow: "hidden", textOverflow: "ellipsis" }}
              >
                {ENSNames?.[i] ?? account}
                {balances?.[i] ? ` (Ξ${formatEther(balances[i])})` : null}
              </ListItem>
            ))}
          </UnorderedList>
        )}
      </Text>
    </VStack>
  )
}
