import { ImageResponse } from "next/og";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const tokenlist = ["FIRST", "SECOND", "THIRD"];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const tokenid = searchParams.get("tokenid");

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            paddingTop: "50",
            paddingLeft: "100",
            paddingRight: "100",
            backgroundColor: "#1F0430",
            color: "#fff",
            fontSize: 32,
            fontWeight: 600,
            gap: "30px",
          }}
        >
          <div style={{ display: "flex" }}>{tokenid}</div>
          <div style={{ display: "flex" }}>Price: 1000${tokenid}/ETH</div>
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
