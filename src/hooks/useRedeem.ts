import { useCallback } from 'react'
import { useWallet } from 'use-wallet'
import { Contract } from 'web3-eth-contract'
import { redeem } from '../daikon/utils'

const useRedeem = (masterGardenerContract: Contract) => {
  const { account } = useWallet()

  const handleRedeem = useCallback(async () => {
    const txHash = await redeem(masterGardenerContract, account)
    console.log(txHash)
    return txHash
  }, [account, masterGardenerContract])

  return { onRedeem: handleRedeem }
}

export default useRedeem
