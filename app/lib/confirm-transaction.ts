import SafeApiKit from '@safe-global/api-kit'
import Safe, { EthersAdapter } from '@safe-global/protocol-kit'
import { ethers } from 'ethers'

// This file can be used to play around with the Safe Core SDK

interface Config {
  CHAIN_ID: bigint
  RPC_URL: string
  SIGNER_ADDRESS_PRIVATE_KEY: string
  SAFE_ADDRESS: string
  TX_SERVICE_URL: string
  SAFE_TX_HASH: string
}

const config: Config = {
  CHAIN_ID: BigInt(84532),
  RPC_URL: "https://maximum-spring-daylight.base-sepolia.quiknode.pro/f80c89e1e8f03bdb4eea77aa68bf8546d8862cc5/",
  SIGNER_ADDRESS_PRIVATE_KEY: process.env.PRIVATE_KEY as string,
  SAFE_ADDRESS: '0x559527a6D82Ac336821F2082c1cda49A4eB63588',
  TX_SERVICE_URL: 'https://safe-transaction-goerli.safe.global/', // Check https://docs.safe.global/safe-core-api/available-services
  SAFE_TX_HASH: '0x7aca6c44e1becf24fc42e596f0bbe4a4470d77226f556352d58837a70e4406c4'
}

export async function confirmSafeTx() {
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


  console.log(config.SAFE_TX_HASH)

  // Get the transaction
  const transaction = await service.getTransaction(config.SAFE_TX_HASH)

  console.log(transaction)
  // const transactions = await service.getPendingTransactions()
  // const transactions = await service.getIncomingTransactions()
  // const transactions = await service.getMultisigTransactions()
  // const transactions = await service.getModuleTransactions()
  // const transactions = await service.getAllTransactions()

  const safeTxHash = transaction.safeTxHash
  const signature = await safe.signHash(safeTxHash)

  // Confirm the Safe transaction
  const signatureResponse = await service.confirmTransaction(safeTxHash, signature.data)

  const signerAddress = await signer.getAddress()
  console.log('Added a new signature to transaction with safeTxGas:', config.SAFE_TX_HASH)
  console.log('- Signer:', signerAddress)
  console.log('- Signer signature:', signatureResponse.signature)
}
