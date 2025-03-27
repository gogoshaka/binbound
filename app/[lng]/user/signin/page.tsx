'use server';

import SignIn from "./_containers/SignIn";


type Params =  Promise<{ lng: string }>
export default async function IndexPage(props: { params: Params }) {
    const params = await props.params;
  const { lng } = params
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <SignIn lng={lng} /> 
        </div> 
    )  
           
}


 
