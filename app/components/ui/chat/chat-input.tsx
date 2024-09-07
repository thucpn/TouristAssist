import { JSONValue } from "ai";
import { Lightbulb, SendHorizontal } from "lucide-react";
import { useState } from "react";
import { Button } from "../button";
import { DocumentPreview } from "../document-preview";
import { Popover, PopoverContent, PopoverTrigger } from "../popover";
import { Textarea } from "../textarea";
import UploadImagePreview from "../upload-image-preview";
import { ChatHandler } from "./chat.interface";
import { useFile } from "./hooks/use-file";

export default function ChatInput(
  props: Pick<
    ChatHandler,
    | "isLoading"
    | "input"
    | "onFileUpload"
    | "onFileError"
    | "handleSubmit"
    | "handleInputChange"
    | "messages"
    | "setInput"
    | "append"
  > & {
    requestParams?: any;
    setRequestData?: React.Dispatch<any>;
    starters?: string[];
  },
) {
  const {
    imageUrl,
    setImageUrl,
    uploadFile,
    files,
    removeDoc,
    reset,
    getAnnotations,
  } = useFile();
  const [open, setOpen] = useState(false);

  // default submit function does not handle including annotations in the message
  // so we need to use append function to submit new message with annotations
  const handleSubmitWithAnnotations = (
    e: React.FormEvent<HTMLFormElement>,
    annotations: JSONValue[] | undefined,
  ) => {
    e.preventDefault();
    props.append!({
      content: props.input,
      role: "user",
      createdAt: new Date(),
      annotations,
    });
    props.setInput!("");
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const annotations = getAnnotations();
    if (annotations.length) {
      handleSubmitWithAnnotations(e, annotations);
      return reset();
    }
    props.handleSubmit(e);
  };

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl bg-white p-4 shadow-xl space-y-4 shrink-0"
    >
      {imageUrl && (
        <UploadImagePreview url={imageUrl} onRemove={() => setImageUrl(null)} />
      )}
      {files.length > 0 && (
        <div className="flex gap-4 w-full overflow-auto py-2">
          {files.map((file) => (
            <DocumentPreview
              key={file.id}
              file={file}
              onRemove={() => removeDoc(file)}
            />
          ))}
        </div>
      )}
      <div className="flex w-full items-start justify-between gap-4 ">
        {/* <Input
          autoFocus
          name="message"
          placeholder="Hỏi phiên bản AI của tôi... 😉"
          className="flex-1"
          value={props.input}
          onChange={props.handleInputChange}
        />
         */}

        <Textarea
          autoFocus
          name="message"
          placeholder="Ask me anything about Northern Territory in any language... 😉"
          className="flex-1"
          value={props.input}
          onChange={props.handleInputChange}
        />

        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="outline" size="icon" className="bg-yellow-500">
              <Lightbulb className="h-6 w-6 text-white" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[400px]" side="bottom">
            {props.starters?.length && props.append && (
              <div className="space-y-4 mb-4">
                <h1 className="font-semibold text-lg">Common questions</h1>
                <div className="flex flex-col gap-2">
                  {props.starters.map((question, index) => (
                    <Button
                      variant="outline"
                      size="sm"
                      className="justify-start w-full lg:w-fit whitespace-normal text-left h-auto py-2"
                      key={index}
                      onClick={() => {
                        props.append!({ role: "user", content: question });
                        setOpen(false);
                      }}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </PopoverContent>
        </Popover>

        <Button type="submit" disabled={props.isLoading || !props.input.trim()}>
          <SendHorizontal className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
}
