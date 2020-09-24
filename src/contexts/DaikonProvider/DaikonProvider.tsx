import React, { createContext, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'

import { Daikon } from '../../daikon'

export interface DaikonContext {
  daikon?: typeof Daikon
}

export const Context = createContext<DaikonContext>({
  daikon: undefined,
})

declare global {
  interface Window {
    daikonsauce: any
  }
}

const DaikonProvider: React.FC = ({ children }) => {
  const { ethereum }: { ethereum: any } = useWallet()
  const [daikon, setDaikon] = useState<any>()

  // @ts-ignore
  window.daikon = daikon
  // @ts-ignore
  window.eth = ethereum

  useEffect(() => {
    if (ethereum) {
      const chainId = Number(ethereum.chainId)
      const daikonLib = new Daikon(ethereum, chainId, false, {
        defaultAccount: ethereum.selectedAddress,
        defaultConfirmations: 1,
        autoGasMultiplier: 1.5,
        testing: false,
        defaultGas: '6000000',
        defaultGasPrice: '1000000000000',
        accounts: [],
        ethereumNodeTimeout: 10000,
      })
      setDaikon(daikonLib)
      window.daikonsauce = daikonLib
    }
  }, [ethereum])

  return <Context.Provider value={{ daikon }}>{children}</Context.Provider>
}

export default DaikonProvider
