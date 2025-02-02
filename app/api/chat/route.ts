import { Message, StreamData, StreamingTextResponse } from "ai";
import { ChatMessage, Settings } from "llamaindex";
import { NextRequest, NextResponse } from "next/server";
import { createChatEngine } from "./engine/chat";
import { initSettings } from "./engine/settings";
import { convertMessageContent } from "./llamaindex/streaming/annotations";
import {
  createCallbackManager,
  createStreamTimeout,
} from "./llamaindex/streaming/events";
import { LlamaIndexStream } from "./llamaindex/streaming/stream";

initSettings();

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // Init Vercel AI StreamData and timeout
  const vercelStreamData = new StreamData();
  const streamTimeout = createStreamTimeout(vercelStreamData);

  try {
    const body = await request.json();
    const { messages, data }: { messages: Message[]; data?: any } = body;
    const userMessage = messages.pop();
    if (!messages || !userMessage || userMessage.role !== "user") {
      return NextResponse.json(
        {
          error:
            "messages are required in the request body and the last message must be from the user",
        },
        { status: 400 },
      );
    }
    // Convert message content from Vercel/AI format to LlamaIndex/OpenAI format
    const userMessageContent = convertMessageContent(
      userMessage.content,
      undefined,
      data?.latitude,
      data?.longitude,
    );

    const chatEngine = await createChatEngine([], data);

    // Setup callbacks
    const callbackManager = createCallbackManager(vercelStreamData);

    // Calling LlamaIndex's ChatEngine to get a streamed response
    const response = await Settings.withCallbackManager(callbackManager, () => {
      return chatEngine.chat({
        message: userMessageContent,
        chatHistory: messages as ChatMessage[],
        stream: true,
      });
    });

    // Transform LlamaIndex stream to Vercel/AI format
    const stream = LlamaIndexStream(
      response,
      vercelStreamData,
      messages as ChatMessage[],
    );

    // Return a StreamingTextResponse, which can be consumed by the Vercel/AI client
    return new StreamingTextResponse(stream, {}, vercelStreamData);
  } catch (error) {
    console.error("[LlamaIndex]", error);
    return NextResponse.json(
      {
        detail: (error as Error).message,
      },
      {
        status: 500,
      },
    );
  } finally {
    clearTimeout(streamTimeout);
  }
}
