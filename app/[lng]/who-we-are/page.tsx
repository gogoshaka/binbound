import type { Metadata } from "next";


export default function IndexPage({ params: { lng } }: {
  params: {
    lng: string;
  };
}) {
  return (
    <div>Who we are</div>
  
  )
}

export const metadata: Metadata = {
  title: "lemonjohn",
};