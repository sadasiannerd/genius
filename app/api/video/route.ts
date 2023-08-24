import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import Replicate from "replicate";

const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN!,
})



export const POST = async (
    req : Request
) => {
    const { userId } = auth();
    const body = await req.json();
    const { prompt } = body;

    try{
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });
        if(!prompt) return new NextResponse("Prompt is required", {status: 400});

        const isPro = await checkSubscription();

        const apiLimit = await checkApiLimit();

        if(!isPro && !apiLimit) return new NextResponse("You have exceeded the free trial limit", { status: 403 });

        const response = await replicate.run(
          "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
          {
            input: {
              prompt: prompt
            }
          }
        );

        if(!isPro) await increaseApiLimit();

        return NextResponse.json(response, { status: 200 });
    }catch(error){
        console.log("[VIDEO ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}