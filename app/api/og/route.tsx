import { NEXT_PUBLIC_URL } from "@/app/config";
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userOpHash = searchParams.get("userOpHash");
    const safe = searchParams.get("safe");
    const fid = searchParams.get("fid");
    const balance = searchParams.get("balance");
    console.log(searchParams, safe);

    // if (!safe) {
    //   return new Response(`The address parameter is required`, {
    //     status: 400,
    //   });
    // }

    const response = await fetch(`http://8.217.5.3:3344/account/${fid}`);
    // console.log(response.json())
    const data: any = await response.json();
    console.log("OG request", data);

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
            background: `black`,
            color: "#fff",
            fontSize: 32,
            fontWeight: 600,
            gap: "30px",
          }}
        >
          <div style={{ display: "flex" }}>Safe Address: {safe}</div>
          <div style={{ display: "flex" }}>Balance: {balance}</div>
          {Object.keys(data?.data?.credentials || {}).map((key) => {
            return (
              <div style={{ display: "flex" }}>
                {key}:{" "}
                {data.data.credentials[key] ? "Verified" : "Not Verified"}
              </div>
            );
          })}
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
