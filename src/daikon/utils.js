import BigNumber from 'bignumber.js'
import { ethers } from 'ethers'

BigNumber.config({
  EXPONENTIAL_AT: 1000,
  DECIMAL_PLACES: 80,
})

const GAS_LIMIT = {
  STAKING: {
    DEFAULT: 200000,
    SNX: 850000,
  },
}

export const getMasterGardenerAddress = (daikon) => {
  return daikon && daikon.masterGardenerAddress
}
export const getDaikonAddress = (daikon) => {
  return daikon && daikon.daikonAddress
}
export const getWethContract = (daikon) => {
  return daikon && daikon.contracts && daikon.contracts.weth
}

export const getMasterGardenerContract = (daikon) => {
  return daikon && daikon.contracts && daikon.contracts.masterGardener
}
export const getDaikonContract = (daikon) => {
  return daikon && daikon.contracts && daikon.contracts.daikon
}

export const getFarms = (daikon) => {
  return daikon
    ? daikon.contracts.pools.map(
        ({
          pid,
          name,
          symbol,
          icon,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          lpAddress,
          lpContract,
        }) => ({
          pid,
          id: symbol,
          name,
          lpToken: symbol,
          lpTokenAddress: lpAddress,
          lpContract,
          tokenAddress,
          tokenSymbol,
          tokenContract,
          earnToken: 'daikon',
          earnTokenAddress: daikon.contracts.daikon.options.address,
          icon,
        }),
      )
    : []
}

export const getPoolWeight = async (masterGardenerContract, pid) => {
  const { allocPoint } = await masterGardenerContract.methods.poolInfo(pid).call()
  const totalAllocPoint = await masterGardenerContract.methods
    .totalAllocPoint()
    .call()
  return new BigNumber(allocPoint).div(new BigNumber(totalAllocPoint))
}

export const getEarned = async (masterGardenerContract, pid, account) => {
  return masterGardenerContract.methods.pendingDaikon(pid, account).call()
}

export const getTotalLPWethValue = async (
  masterGardenerContract,
  wethContract,
  lpContract,
  tokenContract,
  pid,
) => {
  // Get balance of the token address
  const tokenAmountWholeLP = await tokenContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  const tokenDecimals = await tokenContract.methods.decimals().call()
  // Get the share of lpContract that masterGardenerContract owns
  const balance = await lpContract.methods
    .balanceOf(masterGardenerContract.options.address)
    .call()
  // Convert that into the portion of total lpContract = p1
  const totalSupply = await lpContract.methods.totalSupply().call()
  // Get total weth value for the lpContract = w1
  const lpContractWeth = await wethContract.methods
    .balanceOf(lpContract.options.address)
    .call()
  // Return p1 * w1 * 2
  const portionLp = new BigNumber(balance).div(new BigNumber(totalSupply))
  const lpWethWorth = new BigNumber(lpContractWeth)
  const totalLpWethValue = portionLp.times(lpWethWorth).times(new BigNumber(2))
  // Calculate
  const tokenAmount = new BigNumber(tokenAmountWholeLP)
    .times(portionLp)
    .div(new BigNumber(10).pow(tokenDecimals))

  const wethAmount = new BigNumber(lpContractWeth)
    .times(portionLp)
    .div(new BigNumber(10).pow(18))
  return {
    tokenAmount,
    wethAmount,
    totalWethValue: totalLpWethValue.div(new BigNumber(10).pow(18)),
    tokenPriceInWeth: wethAmount.div(tokenAmount),
    poolWeight: await getPoolWeight(masterGardenerContract, pid),
  }
}

export const approve = async (lpContract, masterGardenerContract, account) => {
  return lpContract.methods
    .approve(masterGardenerContract.options.address, ethers.constants.MaxUint256)
    .send({ from: account })
}

export const getDaikonSupply = async (daikon) => {
  return new BigNumber(await daikon.contracts.daikon.methods.totalSupply().call())
}

export const stake = async (masterGardenerContract, pid, amount, account) => {
  return masterGardenerContract.methods
    .deposit(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const unstake = async (masterGardenerContract, pid, amount, account) => {
  return masterGardenerContract.methods
    .withdraw(
      pid,
      new BigNumber(amount).times(new BigNumber(10).pow(18)).toString(),
    )
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}
export const harvest = async (masterGardenerContract, pid, account) => {
  return masterGardenerContract.methods
    .deposit(pid, '0')
    .send({ from: account })
    .on('transactionHash', (tx) => {
      console.log(tx)
      return tx.transactionHash
    })
}

export const getStaked = async (masterGardenerContract, pid, account) => {
  try {
    const { amount } = await masterGardenerContract.methods
      .userInfo(pid, account)
      .call()
    return new BigNumber(amount)
  } catch {
    return new BigNumber(0)
  }
}

export const redeem = async (masterGardenerContract, account) => {
  let now = new Date().getTime() / 1000
  if (now >= 1597172400) {
    return masterGardenerContract.methods
      .exit()
      .send({ from: account })
      .on('transactionHash', (tx) => {
        console.log(tx)
        return tx.transactionHash
      })
  } else {
    alert('pool not active')
  }
}
