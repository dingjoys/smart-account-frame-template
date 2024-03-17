import { NEXT_PUBLIC_URL } from '@/app/config';
import { FrameRequest, getFrameHtmlResponse, getFrameMessage } from '@coinbase/onchainkit';
import { NextRequest, NextResponse } from 'next/server';
import { Address } from 'viem';

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

  const accountAddresses = message.interactor.verified_accounts as Address[];
  let addresses = JSON.stringify(accountAddresses)

  const response = await fetch(`http://8.217.5.3:3344/account/${fid}`);
  /**
   * data: owners, safeAddress, credentials
   */
  const data: any = await response.json();
  let status = data?.data?.safeAddress ? 1 : 0
  let verified = data?.data?.credentials?.indexOf("1") > -1
  if (status == 1) {
    // Internal account has been created
    if (verified) {
      // Internal account has been Verified
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Explorer`,
              action: 'post_redirect'
            },
            {
              label: `Launch Pad`,
            },
          ],
          // Display status
          image: `${NEXT_PUBLIC_URL}/api/og?address=${addresses || "empty"}&fid=${message.interactor.fid}&safe=${data.data.safeAddress}`,
          post_url: `${NEXT_PUBLIC_URL}/api/launchpad?verified=1&safe=${data.data.safeAddress}`,
        }),
      );
    } else {
      return new NextResponse(
        getFrameHtmlResponse({
          buttons: [
            {
              label: `Get Verified`,
            }, {
              label: `Continue Anyway`,
            },
          ],
          image: `${NEXT_PUBLIC_URL}/api/og?address=${addresses || "empty"}&fid=${message.interactor.fid}`,
          post_url: `${NEXT_PUBLIC_URL}/api/launchpad?verified=0&safe=${data.data.safeAddress}`,
        }),

      );
    }
  } else {
    // Creating the internal account
    return new NextResponse(
      getFrameHtmlResponse({
        buttons: [
          {
            label: `Refresh`,
          },
        ],
        image: `${NEXT_PUBLIC_URL}/loading.gif`,
        post_url: `${NEXT_PUBLIC_URL}/api/account`,
      }),
    );
  }
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';

