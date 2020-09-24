import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'

import { getEarned, getMasterGardenerContract } from '../daikon/utils'
import useDaikon from './useDaikon'
import useBlock from './useBlock'

const useEarnings = (pid: number) => {
  const [balance, setBalance] = useState(new BigNumber(0))
  const {
    account,
    ethereum,
  }: { account: string; ethereum: provider } = useWallet()
  const daikon = useDaikon()
  const masterGardenerContract = getMasterGardenerContract(daikon)
  const block = useBlock()

  const fetchBalance = useCallback(async () => {
    const balance = await getEarned(masterGardenerContract, pid, account)
    setBalance(new BigNumber(balance))
  }, [account, masterGardenerContract, daikon])

  useEffect(() => {
    if (account && masterGardenerContract && daikon) {
      fetchBalance()
    }
  }, [account, block, masterGardenerContract, setBalance, daikon])

  return balance
}

export default useEarnings
