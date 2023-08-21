import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const instructionMessage: ChatCompletionRequestMessage = {
    role: "system",
    content: "You are a code generator. You must answer only in markdown code snippers. Use code comments for explanations"
}

export const POST = async (
    req : Request
) => {
    const {userId} = auth();
    const body = await req.json();
    const { messages } = body;

    try{
        if(!userId) return new NextResponse("Unauthorized", { status: 401 });
        if(!configuration.apiKey) return new NextResponse("OpenAi API Key not configured", {status: 500});
        if(!messages) return new NextResponse("Messages are required", {status: 400});

        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [instructionMessage, ...messages]
        });

        return NextResponse.json(response.data.choices[0].message);
    }catch(error){
        console.log("[CODE_ERROR]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}