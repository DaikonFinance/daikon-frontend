import { useCallback, useEffect, useState } from 'react'

import BigNumber from 'bignumber.js'
import useDaikon from './useDaikon'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import { Contract } from 'web3-eth-contract'

import { getAllowance } from '../utils/erc20'
import { getMasterGardenerContract } from '../daikon/utils'

const useAllowance = (lpContract: Contract) => {
  const [allowance, setAllowance] = useState(new BigNumber(0))
  const { account }: { account: string; ethereum: provider } = useWallet()
  const daikon = useDaikon()
  const masterGardenerContract = getMasterGardenerContract(daikon)

  const fetchAllowance = useCallback(async () => {
    const allowance = await getAllowance(
      lpContract,
      masterGardenerContract,
      account,
    )
    setAllowance(new BigNumber(allowance))
  }, [account, masterGardenerContract, lpContract])

  useEffect(() => {
    if (account && masterGardenerContract && lpContract) {
      fetchAllowance()
    }
    let refreshInterval = setInterval(fetchAllowance, 10000)
    return () => clearInterval(refreshInterval)
  }, [account, masterGardenerContract, lpContract])

  return allowance
}

export default useAllowance
