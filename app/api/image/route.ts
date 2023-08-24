import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAPI, { OpenAI } from "openai";

const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
}


export const POST = async (
    req : Request
) => {
    const {userId} = auth();
    const body = await req.json();
    const { prompt, amount, resolution } = body;

    try{
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });
        if(!configuration.apiKey) return new NextResponse("OpenAi API Key not configured", {status: 500});
        if(!prompt) return new NextResponse("Prompt is required", {status: 400});
        if(!amount) return new NextResponse("Amount is required", {status: 400});
        if(!resolution) return new NextResponse("Resolution is required", {status: 400});

        const isPro = await checkSubscription();
        const apiLimit = await checkApiLimit();

        if(!isPro && !apiLimit) return new NextResponse("You have exceeded the free trial limit", { status: 403 });

        const openai = new OpenAPI(configuration)

        const { data } = await openai.images.generate({
            prompt,
            n: parseInt(amount, 10),
            size: resolution
            
        });

        if(!isPro) await increaseApiLimit();

        return NextResponse.json(data, { status: 200 });
    }catch(error){
        console.log("[IMAGE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}