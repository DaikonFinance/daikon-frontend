import React, { useCallback, useEffect, useState } from 'react'

import { useWallet } from 'use-wallet'
import useDaikon from '../../hooks/useDaikon'

import { bnToDec } from '../../utils'
import { getMasterGardenerContract, getEarned } from '../../daikon/utils'
import { getFarms } from '../../daikon/utils'

import Context from './context'
import { Farm } from './types'

const Farms: React.FC = ({ children }) => {
  const [unharvested, setUnharvested] = useState(0)

  const daikon = useDaikon()
  const { account } = useWallet()

  const farms = getFarms(daikon)

  return (
    <Context.Provider
      value={{
        farms,
        unharvested,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export default Farms
