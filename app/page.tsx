import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";
import { NEXT_PUBLIC_URL, TEMPLATE_PUBLIC_URL } from "./config";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Start The Journey",
    },
  ],
  // input:{text:"Import your wallet"},
  image: `${NEXT_PUBLIC_URL}/main.png`,
  post_url: `${NEXT_PUBLIC_URL}/api/account`,
});

export const metadata: Metadata = {
  title: "Metopia Service",
  description: "",
  openGraph: {
    title: "Metopia Service",
    description: "",
    images: [`${NEXT_PUBLIC_URL}/main.png`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Page() {
  return (
    <>
      <h1>Smart Account Frame Template</h1>
    </>
  );
}
