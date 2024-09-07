import { Bot, Command } from "lucide-react";

export default function ChatAvatar({ role }: { role: string }) {
  if (role === "user") {
    return (
      <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
        <Command className="w-4 h-4" />
      </div>
    );
  }
  return (
    <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border bg-background shadow">
      <Bot className="w-5 h-5 text-blue-500" />
    </div>
  );
}
