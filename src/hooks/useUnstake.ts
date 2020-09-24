import { useCallback } from 'react'

import useDaikon from './useDaikon'
import { useWallet } from 'use-wallet'

import { unstake, getMasterGardenerContract } from '../daikon/utils'

const useUnstake = (pid: number) => {
  const { account } = useWallet()
  const daikon = useDaikon()
  const masterGardenerContract = getMasterGardenerContract(daikon)

  const handleUnstake = useCallback(
    async (amount: string) => {
      const txHash = await unstake(masterGardenerContract, pid, amount, account)
      console.log(txHash)
    },
    [account, pid, daikon],
  )

  return { onUnstake: handleUnstake }
}

export default useUnstake
