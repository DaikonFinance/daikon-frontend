import { useCallback } from 'react'

import useDaikon from './useDaikon'
import { useWallet } from 'use-wallet'

import { harvest, getMasterGardenerContract } from '../daikon/utils'

const useReward = (pid: number) => {
  const { account } = useWallet()
  const daikon = useDaikon()
  const masterGardenerContract = getMasterGardenerContract(daikon)

  const handleReward = useCallback(async () => {
    const txHash = await harvest(masterGardenerContract, pid, account)
    console.log(txHash)
    return txHash
  }, [account, pid, daikon])

  return { onReward: handleReward }
}

export default useReward
