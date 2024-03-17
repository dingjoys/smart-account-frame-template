import { NEXT_PUBLIC_URL } from "@/app/config";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userOpHash = searchParams.get("userOpHash");
    const address = searchParams.get("address");
    const fid = searchParams.get("fid");

    if (!address) {
      return new Response(`The address parameter is required`, {
        status: 400,
      });
    }

    // const response = await fetch("http://8.217.5.3:3344/helloworld");
    // // console.log(response.json())
    // const data: any = await response.json();
    // console.log("OG request", data);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            // alignItems: 'center',
            // justifyContent: 'center',
            paddingTop: "50",
            paddingLeft: "100",
            paddingRight: "100",
            backgroundColor: `${NEXT_PUBLIC_URL}/main.png`,
            filter: "blur(20px)",
            color: "#fff",
            fontSize: 32,
            fontWeight: 600,
            gap: "30px",
          }}
        >
          <div style={{ display: "flex" }}>Safe Address: {address}</div>
          {/* <div style={{ display: 'flex' }}>FID: {fid}</div>
          <div style={{ display: 'flex' }}>Your smart account has been deployed (might take a minute to show up as indexed on Etherscan)</div>
          <div style={{ display: 'flex' }}>Source code: https://github.com/pimlicolabs/smart-account-frame-template</div> */}
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: any) {
    console.log(`${e.message}`);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
