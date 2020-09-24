import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getStaked, getMasterGardenerContract } from '../daikon/utils'
import useDaikon from './useDaikon'
import useBlock from './useBlock'

const useStakedBalance = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const { account }: { account: string } = useWallet()
  const daikon = useDaikon()
  const masterGardenerContract = getMasterGardenerContract(daikon)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getStaked(masterGardenerContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, pid, daikon])

  useEffect(() => {
    if (account && daikon) {
      fetchBalance()
    }
  }, [account, pid, setBalance, block, daikon])

  return balance
}

export default useStakedBalance
