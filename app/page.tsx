import { getFrameMetadata } from "@coinbase/onchainkit";
import type { Metadata } from "next";
import { NEXT_PUBLIC_URL, TEMPLATE_PUBLIC_URL } from "./config";

const frameMetadata = getFrameMetadata({
  buttons: [
    {
      label: "Deploy Smart Account",
    },
    {
      label: "What is going on",
    },
  ],
  image: `${TEMPLATE_PUBLIC_URL}/main.png`,
  post_url: `${NEXT_PUBLIC_URL}/api/account`,
});

export const metadata: Metadata = {
  title: "Metopia Service",
  description: "LFG",
  openGraph: {
    title: "Smart Account Frame Templatess",
    description: "LFG",
    images: [`${TEMPLATE_PUBLIC_URL}/main.png`],
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
