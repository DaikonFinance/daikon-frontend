import { useCallback, useEffect, useState } from 'react'
import { provider } from 'web3-core'

import BigNumber from 'bignumber.js'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'

import {
  getMasterGardenerContract,
  getWethContract,
  getFarms,
  getTotalLPWethValue,
} from '../daikon/utils'
import useDaikon from './useDaikon'
import useBlock from './useBlock'

export interface StakedValue {
  tokenAmount: BigNumber
  wethAmount: BigNumber
  totalWethValue: BigNumber
  tokenPriceInWeth: BigNumber
  poolWeight: BigNumber
}

const useAllStakedValue = () => {
  const [balances, setBalance] = useState([] as Array<StakedValue>)
  const { account }: { account: string; ethereum: provider } = useWallet()
  const daikon = useDaikon()
  const farms = getFarms(daikon)
  const masterGardenerContract = getMasterGardenerContract(daikon)
  const wethContact = getWethContract(daikon)
  const block = useBlock()

  const fetchAllStakedValue = useCallback(async () => {
    const balances: Array<StakedValue> = await Promise.all(
      farms.map(
        ({
          pid,
          lpContract,
          tokenContract,
        }: {
          pid: number
          lpContract: Contract
          tokenContract: Contract
        }) =>
          getTotalLPWethValue(
            masterGardenerContract,
            wethContact,
            lpContract,
            tokenContract,
            pid,
          ),
      ),
    )

    setBalance(balances)
  }, [account, masterGardenerContract, daikon])

  useEffect(() => {
    if (account && masterGardenerContract && daikon) {
      fetchAllStakedValue()
    }
  }, [account, block, masterGardenerContract, setBalance, daikon])

  return balances
}

export default useAllStakedValue
