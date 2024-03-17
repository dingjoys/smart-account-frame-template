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

    const { searchParams } = new URL(req.url);

    if (!isValid) {
        return new NextResponse('Invalid Frame message', { status: 400 });
    }

    if (!message) {
        return new NextResponse('Invalid Frame message', { status: 400 });
    }

    let tokenid = 0
    if (!searchParams.get('curr')) {
        tokenid = 1
    } else {
        tokenid = parseInt(searchParams.get('curr') || "1");

        if (searchParams.get('curr') && message.button == 2) {
            // Joined
            fetch(`http://localhost:3344/ifo/swap?fid=${fid}&contractIndex=${tokenid}`);
            // console.log(response.json())
            return new NextResponse(
                getFrameHtmlResponse({
                    buttons: [
                        {
                            label: `Back`,
                        },
                    ],
                    image: `${NEXT_PUBLIC_URL}/congrats.png`,
                    post_url: `${NEXT_PUBLIC_URL}/api/account`,
                }),
            );
        }

        if (message?.button == 1) {
            tokenid--
        } else if (message?.button == 3) {
            tokenid++
        }
        if (tokenid < 1) {
            tokenid = 3
        } else if (tokenid > 3) {
            tokenid = 1
        }
    }
    console.log("tokenid", tokenid)

    const verified = searchParams.get('verified');
    const safe = searchParams.get('safe');
    if (verified && message?.button == 1) {
        return NextResponse.redirect(
            `https://app.safe.global/home?safe=basesep:${safe}`,
            { status: 302 },
        );
    }

    const response = await fetch(`http://localhost:3344/ifo/info?contractIndex=${tokenid}`);
    // console.log(response.json())
    const data: any = await response.json();
    console.log(data)




    return new NextResponse(
        getFrameHtmlResponse({
            buttons: [
                {
                    label: `Last`,
                },
                {
                    label: `Pay $`,
                },
                {
                    label: `Next`,
                },
            ],
            image: `${NEXT_PUBLIC_URL}/final-${tokenid}.png`,
            post_url: `${NEXT_PUBLIC_URL}/api/launchpad?curr=${tokenid}`,
        }),
    );
}

export const dynamic = 'force-dynamic';
export const runtime = 'edge';