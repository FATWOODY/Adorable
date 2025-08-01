"use client";

import Image from "next/image";

import { PromptInputBasic } from "./chatinput";
import { Markdown } from "./ui/markdown";
import { useState } from "react";
import { ChatContainer } from "./ui/chat-container";
import { UIMessage } from "ai";
import { ToolMessage } from "./tools";
import { useQuery } from "@tanstack/react-query";
import { chatState } from "@/actions/chat-streaming";
import { CompressedImage } from "@/lib/image-compression";
import { useChatSafe } from "./use-chat";
import { LoadingSpinner } from "./ui/loading-spinner";

export default function Chat(props: {
  appId: string;
  initialMessages: UIMessage[];
  isLoading?: boolean;
  topBar?: React.ReactNode;
  running: boolean;
}) {
  const { data: chat } = useQuery({
    queryKey: ["stream", props.appId],
    queryFn: async () => {
      return chatState(props.appId);
    },
    refetchInterval: 1000,
    refetchOnWindowFocus: true,
  });

  const { messages, sendMessage } = useChatSafe({
    messages: props.initialMessages,
    id: props.appId,
    resume: props.running && chat?.state === "running",
  });

  const [input, setInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (e?: React.FormEvent<HTMLFormElement>) => {
    if (e?.preventDefault) {
      e.preventDefault();
    }
    if (isSubmitting || !input.trim()) return;
    
    setIsSubmitting(true);
    sendMessage(
      {
        parts: [
          {
            type: "text",
            text: input,
          },
        ],
      },
      {
        headers: {
          "Adorable-App-Id": props.appId,
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
    setInput("");
  };

  const onSubmitWithImages = (text: string, images: CompressedImage[]) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    const parts: Parameters<typeof sendMessage>[0]["parts"] = [];

    if (text.trim()) {
      parts.push({
        type: "text",
        text: text,
      });
    }

    images.forEach((image) => {
      parts.push({
        type: "file",
        mediaType: image.mimeType,
        url: image.data,
      });
    });

    sendMessage(
      {
        parts,
      },
      {
        headers: {
          "Adorable-App-Id": props.appId,
        },
        onFinish: () => {
          setIsSubmitting(false);
        },
        onError: () => {
          setIsSubmitting(false);
        },
      }
    );
    setInput("");
  };

  async function handleStop() {
    setIsSubmitting(false);
    await fetch("/api/chat/" + props.appId + "/stream", {
      method: "DELETE",
      headers: {
        "Adorable-App-Id": props.appId,
      },
    });
  }

  return (
    <div
      className="flex flex-col h-full"
      style={{ transform: "translateZ(0)" }}
    >
      {props.topBar}
      <div
        className="flex-1 overflow-y-auto flex flex-col space-y-6 min-h-0"
        style={{ overflowAnchor: "auto" }}
      >
        <ChatContainer autoScroll>
          {messages.map((message: any) => (
            <MessageBody key={message.id} message={message} />
          ))}
          {(props.isLoading || chat?.state === "running" || isSubmitting) && (
            <div className="flex items-center gap-2 py-2">
              <LoadingSpinner size="sm" />
              <span className="text-sm text-gray-500">
                {isSubmitting ? "Sending..." : "AI is thinking..."}
              </span>
            </div>
          )}
        </ChatContainer>
      </div>
      <div className="flex-shrink-0 p-3 transition-all bg-background md:backdrop-blur-sm">
        <PromptInputBasic
          stop={handleStop}
          input={input}
          onValueChange={(value) => {
            setInput(value);
          }}
          onSubmit={onSubmit}
          onSubmitWithImages={onSubmitWithImages}
          isGenerating={props.isLoading || chat?.state === "running" || isSubmitting}
        />
      </div>
    </div>
  );
}

function MessageBody({ message }: { message: any }) {
  if (message.role === "user") {
    return (
      <div className="flex justify-end py-1 mb-4">
        <div className="bg-neutral-200 dark:bg-neutral-700 rounded-xl px-4 py-1 max-w-[80%] ml-auto">
          {message.parts.map((part: any, index: number) => {
            if (part.type === "text") {
              return <div key={index}>{part.text}</div>;
            } else if (
              part.type === "file" &&
              part.mediaType?.startsWith("image/")
            ) {
              return (
                <div key={index} className="mt-2">
                  <Image
                    src={part.url as string}
                    alt="User uploaded image"
                    width={200}
                    height={200}
                    className="max-w-full h-auto rounded"
                    style={{ maxHeight: "200px" }}
                  />
                </div>
              );
            }
            return <div key={index}>unexpected message</div>;
          })}
        </div>
      </div>
    );
  }

  if (Array.isArray(message.parts) && message.parts.length !== 0) {
    return (
      <div className="mb-4">
        {message.parts.map((part: any, index: any) => {
          if (part.type === "text") {
            return (
              <div key={index} className="mb-4">
                <Markdown className="prose prose-sm dark:prose-invert max-w-none">
                  {part.text}
                </Markdown>
              </div>
            );
          }

          if (part.type.startsWith("tool-")) {
            // if (
            //   part.toolInvocation.state === "result" &&
            //   part.toolInvocation.result.isError
            // ) {
            //   return (
            //     <div
            //       key={index}
            //       className="border-red-500 border text-sm text-red-800 rounded bg-red-100 px-2 py-1 mt-2 mb-4"
            //     >
            //       {part.toolInvocation.result?.content?.map(
            //         (content: { type: "text"; text: string }, i: number) => (
            //           <div key={i}>{content.text}</div>
            //         )
            //       )}
            //       {/* Unexpectedly failed while using tool{" "}
            //       {part.toolInvocation.toolName}. Please try again. again. */}
            //     </div>
            //   );
            // }

            // if (
            //   message.parts!.length - 1 == index &&
            //   part.toolInvocation.state !== "result"
            // ) {
            return <ToolMessage key={index} toolInvocation={part} />;
            // } else {
            //   return undefined;
            // }
          }
        })}
      </div>
    );
  }

  if (message.parts) {
    return (
      <Markdown className="prose prose-sm dark:prose-invert max-w-none">
        {message.parts
          .map((part: any) =>
            part.type === "text" ? part.text : "[something went wrong]"
          )
          .join("")}
      </Markdown>
    );
  }

  return (
    <div>
      <p className="text-gray-500">Something went wrong</p>
    </div>
  );
}
