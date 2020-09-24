import { useCallback } from 'react'

import useDaikon from './useDaikon'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { approve, getMasterGardenerContract } from '../daikon/utils'

const useApprove = (lpContract: Contract) => {
  const { account }: { account: string; ethereum: provider } = useWallet()
  const daikon = useDaikon()
  const masterGardenerContract = getMasterGardenerContract(daikon)

  const handleApprove = useCallback(async () => {
    try {
      const tx = await approve(lpContract, masterGardenerContract, account)
      return tx
    } catch (e) {
      return false
    }
  }, [account, lpContract, masterGardenerContract])

  return { onApprove: handleApprove }
}

export default useApprove
