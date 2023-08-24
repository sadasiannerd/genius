import { checkApiLimit, increaseApiLimit } from "@/lib/api-limit";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletionMessage } from "openai/resources/chat";

const configuration = {
    apiKey: process.env.OPENAI_API_KEY,
};


const instructionMessage:ChatCompletionMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations"
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
        if(!messages) return new NextResponse("Messages are required", { status: 400 });

        const freeTrial = await checkApiLimit();

        if(!freeTrial) return new NextResponse("You have exceeded the free trial limit", { status: 403 });

        const openai = new OpenAI(configuration)

        const completion: OpenAI.Chat.ChatCompletion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        await increaseApiLimit();

        return NextResponse.json(completion.choices[0].message, { status: 200 });
    }catch(error){
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}