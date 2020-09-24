import { useContext } from 'react'
import { Context } from '../contexts/DaikonProvider'

const useDaikon = () => {
  const { daikon } = useContext(Context)
  return daikon
}

export default useDaikon
