"use client";

import { useGeolocation } from "@reactuses/core";
import ChatSection from "./components/chat-section";

export default function DataSource() {
  const { coordinates } = useGeolocation();

  return (
    <main className="h-screen w-screen background-gradient">
      <div className="p-4 w-full h-full lg:p-10 lg:w-[60rem] lg:mx-auto">
        <ChatSection coordinates={coordinates} />
      </div>
    </main>
  );
}
