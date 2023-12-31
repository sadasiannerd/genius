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
    const { messages } = body;

    try{
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });
        if(!configuration.apiKey) return new NextResponse("OpenAi API Key not configured", { status: 500 });
        if(!messages) return new NextResponse("Messages are required", {status: 400});

        const isPro = await checkSubscription();

        const freeTrial = await checkApiLimit();

        if(!isPro && !freeTrial) return new NextResponse("You have exceeded the free trial limit", { status: 403 });

        const openai = new OpenAPI(configuration)

        const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages
        });

        if(!isPro) await increaseApiLimit();

        return NextResponse.json(completion.choices[0].message, {status: 200});
    }catch(error){
        console.log("[CONVERSATION_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}