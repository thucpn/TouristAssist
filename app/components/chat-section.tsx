"use client";

import { useChat } from "ai/react";
import Image from "next/image";
import { useState } from "react";
import { Button } from "./ui/button";
import { ChatInput, ChatMessages } from "./ui/chat";

const starters = [
  "🏨 Suggest some hotels in Northern Territory with cheap prices and near me",
  "🎭 Can you recommend to me some cultural stories with images or books?",
  "✈️ Suggest me some tour packages with high rating in Northern Territory",
  "🍕 I am looking for some good restaurants in Northern Territory.",
  "🦷 My daughter has a toothache, what is the cost of a dental check-up and treatment in Northern Territory?",
  "🌎 How can I hire an interpreter?",
  "🚑 I need to call an ambulance right now",
];

const projectName = "TouristAssist";
const projectDesc = "All-in-one AI assistant for tourism in Northern Territory";

export default function ChatSection({
  coordinates,
}: {
  coordinates: GeolocationCoordinates;
}) {
  const [requestData, setRequestData] = useState<any>();
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
    append,
    setInput,
  } = useChat({
    body: {
      data: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    },
    api: `/api/chat`,
    headers: {
      "Content-Type": "application/json", // using JSON because of vercel/ai 2.2.26
    },
    onError: (error: unknown) => {
      if (!(error instanceof Error)) throw error;
      const message = JSON.parse(error.message);
      alert(message.detail);
    },
  });

  return (
    <div className="w-full h-full flex flex-col gap-4">
      {messages.length > 0 && (
        <ChatMessages
          messages={messages}
          isLoading={isLoading}
          reload={reload}
          stop={stop}
          append={append}
          starters={starters}
        />
      )}

      {messages.length === 0 && (
        <div className="space-y-2 shrink-0 flex gap-6 items-center p-4 justify-center">
          <Image
            className="rounded-full border-8 border-white shadow"
            src={"/nt-logo.jpg"}
            alt="User"
            width={120}
            height={120}
            priority
          />
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold capitalize lg:text-4xl leading-tight tracking-tighter">
              {projectName}
            </h1>
            <p className=" text-gray-500 text-xl">{projectDesc}</p>
          </div>
        </div>
      )}

      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
        messages={messages}
        append={append}
        setInput={setInput}
        requestParams={{ params: requestData }}
        setRequestData={setRequestData}
        starters={starters}
      />

      {messages.length === 0 && starters?.length && (
        <div className="space-y-4 mb-4">
          <div className="flex flex-wrap gap-2">
            {starters.map((question, index) => (
              <Button
                variant="outline"
                className="justify-start w-full lg:w-fit whitespace-normal text-left h-auto"
                key={index}
                onClick={() => append!({ role: "user", content: question })}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {messages.length === 0 && (
        <div className="mt-4">
          GovHack 2024. Copyright by GTYouths team. Contact us at{" "}
          <a
            href="https://hackerspace.govhack.org/projects/touristassist"
            className="text-[#858dff]"
          >
            https://hackerspace.govhack.org
          </a>
        </div>
      )}
    </div>
  );
}
