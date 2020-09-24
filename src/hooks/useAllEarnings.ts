import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterGardenerContract, getFarms } from '../daikon/utils'
import useDaikon from './useDaikon'
import useBlock from './useBlock'

const useAllEarnings = () => {
  const [balances, setBalance] = useState([] as Array<BigNumber>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const daikon = useDaikon()
  const farms = getFarms(daikon)
  const masterGardenerContract = getMasterGardenerContract(daikon)
  const block = useBlock()

  const fetchAllBalances = useCallback(async () => {
    const balances: Array<BigNumber> = await Promise.all(
      farms.map(({ pid }: { pid: number }) =>
        getEarned(masterGardenerContract, pid, account),
      ),
    )
    setBalance(balances)
  }, [account, masterGardenerContract, daikon])

  useEffect(() => {
    if (account && masterGardenerContract && daikon) {
      fetchAllBalances()
    }
  }, [account, block, masterGardenerContract, setBalance, daikon])

  return balances
}

export default useAllEarnings
