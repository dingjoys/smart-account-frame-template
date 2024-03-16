import { EthersAdapter, SafeAccountConfig, SafeFactory } from '@safe-global/protocol-kit'
import { SafeVersion } from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers'
import { CONTROLLER_WALLET } from '../../config'

// This file can be used to play around with the Safe Core SDK

interface Config {
  RPC_URL: string
  DEPLOYER_ADDRESS_PRIVATE_KEY: string
  DEPLOY_SAFE: {
    OWNERS: string[]
    THRESHOLD: number
    SALT_NONCE: string
    SAFE_VERSION: string
  }
}

const getconfig: (owner: string, fid: number) => Config = (owner, fid) => ({
  RPC_URL: 'https://maximum-spring-daylight.base-sepolia.quiknode.pro/f80c89e1e8f03bdb4eea77aa68bf8546d8862cc5/',
  DEPLOYER_ADDRESS_PRIVATE_KEY: process.env.PRIVATE_KEY as string,
  DEPLOY_SAFE: {
    OWNERS: owner ? [owner, CONTROLLER_WALLET] : [CONTROLLER_WALLET],
    THRESHOLD: 1,
    SALT_NONCE: fid.toString(),
    SAFE_VERSION: '1.3.0'
  }
})

export async function deploySafeWallet(owner: string, fid?: number) {
  const config = getconfig(owner, fid || 5000)
  console.log(config)
  const provider = new ethers.JsonRpcProvider(config.RPC_URL)
  const deployerSigner = new ethers.Wallet(config.DEPLOYER_ADDRESS_PRIVATE_KEY, provider)

  // Create EthAdapter instance
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: deployerSigner
  } as any)

  const safeVersion = config.DEPLOY_SAFE.SAFE_VERSION as SafeVersion

  console.log('safe config: ', config.DEPLOY_SAFE)

  // Create SafeFactory instance
  const safeFactory = await SafeFactory.create({ ethAdapter, safeVersion })

  // Config of the deployed Safe
  const safeAccountConfig: SafeAccountConfig = {
    owners: config.DEPLOY_SAFE.OWNERS,
    threshold: config.DEPLOY_SAFE.THRESHOLD
  }
  const saltNonce = config.DEPLOY_SAFE.SALT_NONCE

  // Predict deployed address
  const predictedDeploySafeAddress = await safeFactory.predictSafeAddress(
    safeAccountConfig,
    saltNonce
  )

  console.log('Predicted deployed Safe address:', predictedDeploySafeAddress)

  function callback(txHash: string) {
    console.log('Transaction hash:', txHash)
  }

  // Deploy Safe
  const safe = await safeFactory.deploySafe({
    safeAccountConfig,
    saltNonce,
    callback
  })

  console.log('Deployed Safe:', await safe.getAddress())
  return await safe.getAddress()
}

