"use client";

import React, { RefObject, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Paperclip, Square, X } from "lucide-react";
import { omit } from "remeda";

import { cn } from "@/lib/utils";
import { useAutosizeTextArea } from "@/hooks/use-autosize-textarea";
import { Button } from "@/components/ui/button";
import { FilePreview } from "@/components/ui/file-preview";

interface MessageInputBaseProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  value: string;
  submitOnEnter?: boolean;
  stop?: () => void;
  isGenerating: boolean;
  enableInterrupt?: boolean;
}

interface MessageInputWithoutAttachmentProps extends MessageInputBaseProps {
  allowAttachments?: false;
}

interface MessageInputWithAttachmentsProps extends MessageInputBaseProps {
  allowAttachments: true;
  files: File[] | null;
  setFiles: React.Dispatch<React.SetStateAction<File[] | null>>;
}

type MessageInputProps =
  | MessageInputWithoutAttachmentProps
  | MessageInputWithAttachmentsProps;

export function MessageInput({
  placeholder = "Ask AI...",
  className,
  onKeyDown: onKeyDownProp,
  submitOnEnter = true,
  stop,
  isGenerating,
  enableInterrupt = true,
  ...props
}: MessageInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [showInterruptPrompt, setShowInterruptPrompt] = useState(false);

  useEffect(() => {
    if (!isGenerating) {
      setShowInterruptPrompt(false);
    }
  }, [isGenerating]);

  const addFiles = (files: File[] | null) => {
    if (props.allowAttachments) {
      props.setFiles((currentFiles) => {
        if (currentFiles === null) {
          return files;
        }

        if (files === null) {
          return currentFiles;
        }

        return [...currentFiles, ...files];
      });
    }
  };

  const onDragOver = (event: React.DragEvent) => {
    if (props.allowAttachments !== true) return;
    event.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (event: React.DragEvent) => {
    if (props.allowAttachments !== true) return;
    event.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (event: React.DragEvent) => {
    setIsDragging(false);
    if (props.allowAttachments !== true) return;
    event.preventDefault();
    const dataTransfer = event.dataTransfer;
    if (dataTransfer.files.length) {
      addFiles(Array.from(dataTransfer.files));
    }
  };

  const onPaste = (event: React.ClipboardEvent) => {
    const items = event.clipboardData?.items;
    if (!items) return;

    const text = event.clipboardData.getData("text");
    if (text && text.length > 500 && props.allowAttachments) {
      event.preventDefault();
      const blob = new Blob([text], { type: "text/plain" });
      const file = new File([blob], "Pasted text", {
        type: "text/plain",
        lastModified: Date.now(),
      });
      addFiles([file]);
      return;
    }

    const files = Array.from(items)
      .map((item) => item.getAsFile())
      .filter((file) => file !== null);

    if (props.allowAttachments && files.length > 0) {
      addFiles(files as File[]);
    }
  };

  const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (submitOnEnter && event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (isGenerating && stop && enableInterrupt) {
        if (showInterruptPrompt) {
          stop();
          setShowInterruptPrompt(false);
          event.currentTarget.form?.requestSubmit();
        } else if (
          props.value ||
          (props.allowAttachments && props.files?.length)
        ) {
          setShowInterruptPrompt(true);
          return;
        }
      }

      event.currentTarget.form?.requestSubmit();
    }

    onKeyDownProp?.(event);
  };

  const textAreaRef = useRef<HTMLTextAreaElement | null>(null);

  const showFileList =
    props.allowAttachments && props.files && props.files.length > 0;

  useAutosizeTextArea({
    ref: textAreaRef as RefObject<HTMLTextAreaElement>,
    maxHeight: 240,
    borderWidth: 1,
    dependencies: [props.value, showFileList],
  });

  return (
    <div
      className="relative flex w-full"
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
    >
      {enableInterrupt && (
        <InterruptPrompt
          isOpen={showInterruptPrompt}
          close={() => setShowInterruptPrompt(false)}
        />
      )}

      <textarea
        aria-label="Write your prompt here"
        placeholder={placeholder}
        ref={textAreaRef}
        onPaste={onPaste}
        onKeyDown={onKeyDown}
        className={cn(
          "z-10 w-full grow resize-none rounded-xl border border-input bg-background p-3 pr-24 text-sm ring-offset-background transition-[border] placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          showFileList && "pb-16",
          className
        )}
        {...(props.allowAttachments
          ? omit(props, ["allowAttachments", "files", "setFiles"])
          : omit(props, ["allowAttachments"]))}
      />

      {props.allowAttachments && (
        <div className="absolute inset-x-3 bottom-0 z-20 overflow-x-scroll py-3">
          <div className="flex space-x-3">
            <AnimatePresence mode="popLayout">
              {props.files?.map((file) => {
                return (
                  <FilePreview
                    key={file.name + String(file.lastModified)}
                    file={file}
                    onRemove={() => {
                      props.setFiles((files) => {
                        if (!files) return null;

                        const filtered = Array.from(files).filter(
                          (f) => f !== file
                        );
                        if (filtered.length === 0) return null;
                        return filtered;
                      });
                    }}
                  />
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}

      <div className="absolute right-3 top-3 z-20 flex gap-2">
        {props.allowAttachments && (
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-8 w-8"
            aria-label="Attach a file"
            onClick={async () => {
              const files = await showFileUploadDialog();
              addFiles(files);
            }}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
        )}
        {isGenerating && stop ? (
          <Button
            type="button"
            size="icon"
            className="h-8 w-8"
            aria-label="Stop generating"
            onClick={stop}
          >
            <Square className="h-3 w-3 animate-pulse" fill="currentColor" />
          </Button>
        ) : (
          <Button
            type="submit"
            size="icon"
            className="h-8 w-8 transition-opacity"
            aria-label="Send message"
            disabled={props.value === "" || isGenerating}
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>

      {props.allowAttachments && <FileUploadOverlay isDragging={isDragging} />}
    </div>
  );
}
MessageInput.displayName = "MessageInput";

interface InterruptPromptProps {
  isOpen: boolean;
  close: () => void;
}

function InterruptPrompt({ isOpen, close }: InterruptPromptProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ top: 0, filter: "blur(5px)" }}
          animate={{
            top: -40,
            filter: "blur(0px)",
            transition: {
              type: "spring",
              filter: { type: "tween" },
            },
          }}
          exit={{ top: 0, filter: "blur(5px)" }}
          className="absolute left-1/2 flex -translate-x-1/2 overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-sm text-muted-foreground"
        >
          <span className="ml-2.5">Press Enter again to interrupt</span>
          <button
            className="ml-1 mr-2.5 flex items-center"
            type="button"
            onClick={close}
            aria-label="Close"
          >
            <X className="h-3 w-3" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface FileUploadOverlayProps {
  isDragging: boolean;
}

function FileUploadOverlay({ isDragging }: FileUploadOverlayProps) {
  return (
    <AnimatePresence>
      {isDragging && (
        <motion.div
          className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center space-x-2 rounded-xl border border-dashed border-border bg-background text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          aria-hidden
        >
          <Paperclip className="h-4 w-4" />
          <span>Drop your files here to attach them.</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function showFileUploadDialog() {
  const input = document.createElement("input");

  input.type = "file";
  input.multiple = true;
  input.accept = "*/*";
  input.click();

  return new Promise<File[] | null>((resolve) => {
    input.onchange = (e) => {
      const files = (e.currentTarget as HTMLInputElement).files;

      if (files) {
        resolve(Array.from(files));
        return;
      }

      resolve(null);
    };
  });
}
