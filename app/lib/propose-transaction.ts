import SafeApiKit from '@safe-global/api-kit'
import Safe, { EthersAdapter, EthersAdapterConfig } from '@safe-global/protocol-kit'
import { OperationType, SafeTransactionDataPartial } from '@safe-global/safe-core-sdk-types'
import { ethers } from 'ethers'

// This file can be used to play around with the Safe Core SDK

interface Config {
  CHAIN_ID: bigint
  RPC_URL: string
  SIGNER_ADDRESS_PRIVATE_KEY: string
  SAFE_ADDRESS: string
  TX_SERVICE_URL: string
}

const config: Config = {
  CHAIN_ID: BigInt(84532),
  RPC_URL: "https://maximum-spring-daylight.base-sepolia.quiknode.pro/f80c89e1e8f03bdb4eea77aa68bf8546d8862cc5/",
  SIGNER_ADDRESS_PRIVATE_KEY: process.env.PRIVATE_KEY as string,
  SAFE_ADDRESS: '0x559527a6D82Ac336821F2082c1cda49A4eB63588',
  TX_SERVICE_URL: 'https://safe-transaction-goerli.safe.global/' // Check https://docs.safe.global/safe-core-api/available-services
}

export async function proposeSafeTx() {
  const provider = new ethers.JsonRpcProvider(config.RPC_URL)
  const signer = new ethers.Wallet(config.SIGNER_ADDRESS_PRIVATE_KEY, provider)

  // Create EthAdapter instance
  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: signer
  } as any)

  // Create Safe instance
  const safe = await Safe.create({
    ethAdapter,
    safeAddress: config.SAFE_ADDRESS
  })

  // Create Safe API Kit instance
  const service = new SafeApiKit({
    chainId: config.CHAIN_ID
  })

  // Create transaction
  const safeTransactionData: SafeTransactionDataPartial = {
    to: '0xc53bdD8865cf9f77170474B9985A2f9f7E5a8F90',
    value: '10000000000', // 1 wei
    data: '0x951b6c0200000000000000000000000018fbda434458e031abb93948ab0f01746396e87d000000000000000000000000622ee91c3b4841c54670120948cd91c2603353a2',
    operation: OperationType.Call
  }
  const safeTransaction = await safe.createTransaction({ transactions: [safeTransactionData] })

  const senderAddress = await signer.getAddress()
  const safeTxHash = await safe.getTransactionHash(safeTransaction)
  const signature = await safe.signHash(safeTxHash)

  // Propose transaction to the service
  await service.proposeTransaction({
    safeAddress: config.SAFE_ADDRESS,
    safeTransactionData: safeTransaction.data,
    safeTxHash,
    senderAddress,
    senderSignature: signature.data
  })

  console.log('Proposed a transaction with Safe:', config.SAFE_ADDRESS)
  console.log('- safeTxHash:', safeTxHash)
  console.log('- Sender:', senderAddress)
  console.log('- Sender signature:', signature.data)
}