import { useCallback } from 'react'

import useDaikon from './useDaikon'
import { useWallet } from 'use-wallet'

import { stake, getMasterGardenerContract } from '../daikon/utils'

const useStake = (pid: number) => {
  const { account } = useWallet()
  const daikon = useDaikon()

  const handleStake = useCallback(
    async (amount: string) => {
      const txHash = await stake(
        getMasterGardenerContract(daikon),
        pid,
        amount,
        account,
      )
      console.log(txHash)
    },
    [account, pid, daikon],
  )

  return { onStake: handleStake }
}

export default useStake
