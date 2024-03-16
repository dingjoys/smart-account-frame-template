import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { createPimlicoPaymasterClient } from 'permissionless/clients/pimlico';
import { Address, createPublicClient, http } from 'viem';
import { NEXT_PUBLIC_URL } from '@/app/config';

const privateKey = process.env.PRIVATE_KEY!;
const apiKey = process.env.PIMLICO_API_KEY!;
const paymasterUrl = `https://api.pimlico.io/v2/sepolia/rpc?apikey=${apiKey}`
const bundlerUrl = `https://api.pimlico.io/v1/sepolia/rpc?apikey=${apiKey}`

const publicClient = createPublicClient({
  transport: http("https://maximum-spring-daylight.base-sepolia.quiknode.pro/f80c89e1e8f03bdb4eea77aa68bf8546d8862cc5/"),
})

const paymasterClient = createPimlicoPaymasterClient({
  transport: http(paymasterUrl),
})

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body: FrameRequest = await req.json();
  const { isValid, message } = await getFrameMessage(body, { neynarApiKey: process.env.NEYNAR_API_KEY! });
  console.log("isvalid", isValid, message?.button)
  const fid = message?.interactor.fid
  if (!isValid) {
    return new NextResponse('Invalid Frame message', { status: 400 });
  }

  if (!message) {
    return new NextResponse('Invalid Frame message', { status: 400 });
  }

  const accountAddress = message.interactor.verified_accounts[0] as Address;
  // let result = await deploySafeWallet(accountAddress, fid)
  // console.log("Deployed To", result)
  // console.log("accountAddress", accountAddress)
  // // send transaction
  // const account = await privateKeyToSafeSmartAccount(publicClient, {
  //     privateKey: privateKey as Address,
  //     safeVersion: "1.4.1", // simple version
  //     entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789", // global entrypoint
  //     saltNonce: BigInt(message.interactor.fid)
  // })

  // const smartAccountClient = createSmartAccountClient({
  //     account,
  //     chain: sepolia,
  //     transport: http(bundlerUrl),
  //     sponsorUserOperation: paymasterClient.sponsorUserOperation,
  // })
  //     .extend(bundlerActions)
  //     .extend(pimlicoBundlerActions)

  // const gasPrices = await smartAccountClient.getUserOperationGasPrice()

  // const callData = await account.encodeCallData({
  //     to: "0xd8da6bf26964af9d7eed9e03e53415d37aa96045",
  //     data: "0x1234",
  //     value: BigInt(0)
  // })

  // const userOperation = await smartAccountClient.prepareUserOperationRequest({
  //     userOperation: {
  //         callData
  //     },
  // })

  // userOperation.signature = await account.signUserOperation(userOperation)

  // const userOpHash = await smartAccountClient.sendUserOperation({
  //     userOperation,
  //     entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789"
  // })



  const response = await fetch('http://8.217.5.3:3344/helloworld');
  const data: any = await response.json();

  return new NextResponse(
    getFrameHtmlResponse({
      buttons: [
        {
          label: `View Smart Account`,
          action: "post_redirect"
        },
      ],
      image: `${NEXT_PUBLIC_URL}/api/og?address=${data?.msg || "xxxx"}&fid=${message.interactor.fid}`,
      post_url: `${NEXT_PUBLIC_URL}/api/etherscan`,
    }),
  );
}


export const dynamic = 'force-dynamic';
export const runtime = 'edge';