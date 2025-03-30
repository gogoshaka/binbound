import type { Metadata } from "next";


type Params =  Promise<{ lng: string }>
export default async function WhoWeAre(props: { params: Params }) {
  const params = await props.params;
  const { lng } = params
  return (
    <div>Who we are</div>
  
  )
}

export const metadata: Metadata = {
  title: "lemonjohn",
};