import { ChevronRightCircle } from "lucide-react";
import { useMemo } from "react";
import { ChatHandler, SuggestedQuestionsData, ToolData } from "..";

interface SuggestData {
  MarkerID: string;
  Category: string;
  SubCategory: string;
  Lat: string;
  Long: string;
  Name: string;
  distance: number;
}

export function SuggestedQuestions({
  questions,
  toolData,
  append,
}: {
  toolData: ToolData;
  questions: SuggestedQuestionsData;
  append: Pick<ChatHandler, "append">["append"];
}) {
  const qs = useMemo(() => {
    const result: string[] = [];
    const { toolCall, toolOutput } = toolData || {};
    if (toolCall?.name === "nt_travel_plan") {
      const data = toolOutput?.output as unknown as SuggestData[];
      data.slice(0, 2).forEach((item, index) => {
        const prefix =
          index === 0
            ? "Give me more information about "
            : "What is the rating of ";
        const text = `${prefix} ${item.Name}`;
        if (!result.includes(text)) result.push(text);
      });
    }
    result.push(...questions);
    return result;
  }, [questions, toolData]);

  return (
    <div className="flex flex-col space-y-3 mt-2">
      {qs.map((question, index) => (
        <div
          key={index}
          onClick={() => {
            append!({ role: "user", content: question });
          }}
          className="italic p-2 cursor-pointer active:bg-gray-200 flex gap-2 text-gray-800 border border-1 hover:bg-gray-100 rounded-md w-fit"
        >
          <ChevronRightCircle className="w-5 h-5 text-blue-700" />
          <span className="flex-1 text-sm">{question}</span>
        </div>
      ))}
    </div>
  );
}
