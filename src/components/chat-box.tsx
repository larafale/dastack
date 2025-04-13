'use client';

import { useChat } from '@ai-sdk/react';
import { LetterText, Maximize2, Send, Square, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useRef, useEffect, useState } from 'react';
import { AudioBox } from '@/components/audio-stream';
import Modal from '@/components/modal';
import { AudioBoxRef } from './audio-stream/audio-box';
import { useTranslations } from 'next-intl';

interface ChatBoxProps {
  open?: boolean;
  systemPrompt?: string;
  initialMessage?: string;
  debug?: boolean;
  onClose?: () => void;
  className?: string;
}

export function ChatBox({
  systemPrompt = 'You are a helpful assistant that provides accurate and detailed information.',
  open = true,
  onClose,
  initialMessage = '',
  debug = false,
  className,
}: ChatBoxProps) {
  const [expanded, setExpanded] = useState(false);
  const [showText, setShowText] = useState(false);
  const audio = useRef<AudioBoxRef>(null);
  const t = useTranslations('Chatbox');

  // Create initial messages array with system and user messages if initial message is provided
  const initialMessages = undefined;

  const {
    messages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    error,
    status,
    stop,
    reload,
    setMessages,
    setInput,
    append,
  } = useChat({
    api: '/api/chat',
    body: {
      systemPrompt,
    },
    // Reset chat when system prompt changes
    id: `chat-${systemPrompt}`,
    initialMessages,
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'nearest',
      });
    }
  }, [messages]);

  // Reset messages when system prompt changes
  useEffect(() => {
    setMessages([]);
  }, [systemPrompt, setMessages]);

  // Trigger submission when initialMessage is provided
  useEffect(() => {
    if (initialMessage && messages.length === 0) {
      // Use the append method to directly add messages and trigger AI response
      append({
        role: 'user',
        content: initialMessage,
      });
    }
  }, [initialMessage, messages.length, append]);

  // Handle audio completion
  const handleAudioComplete = (mode: string, res?: any, text?: string) => {
    const question = text || res?.data?.text;
    if (question) {
      append({
        role: 'user',
        content: question,
      });
    }
  };

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  const handleModalClose = () => {
    setExpanded(false);
  };

  if (!open) return null;

  const renderDebugInfo = () => {
    if (!debug) return null;

    return (
      <div className="p-4 border-t border-yellow-500 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800 text-xs font-mono overflow-auto">
        <details>
          <summary className="font-bold cursor-pointer">
            Debug Information
          </summary>
          <div className="mt-2 space-y-3">
            <div>
              <div className="font-semibold mb-1">Props:</div>
              <pre className="bg-black/5 dark:bg-white/5 p-2 rounded">
                {JSON.stringify(
                  {
                    open,
                    initialMessage,
                    systemPrompt,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div>
              <div className="font-semibold mb-1">Chat State:</div>
              <pre className="bg-black/5 dark:bg-white/5 p-2 rounded">
                {JSON.stringify(
                  {
                    status,
                    isLoading,
                    messageCount: messages.length,
                    error: error ? error.toString() : null,
                  },
                  null,
                  2
                )}
              </pre>
            </div>

            <div>
              <div className="font-semibold mb-1">Messages:</div>
              <pre className="bg-black/5 dark:bg-white/5 p-2 rounded max-h-32 overflow-auto">
                {JSON.stringify(
                  messages.map((m) => ({
                    id: m.id,
                    role: m.role,
                    content:
                      m.content.slice(0, 50) +
                      (m.content.length > 50 ? '...' : ''),
                  })),
                  null,
                  2
                )}
              </pre>
            </div>
          </div>
        </details>
      </div>
    );
  };

  const chatContent = (
    <Card
      className={cn('flex flex-col', className, {
        'rounded-none md:rounded-md': expanded,
      })}
    >
      <div
        className="p-2 border-b text-card-foreground flex justify-between items-center"
        style={{ height: '53px' }}
      >
        <AudioBox
          ref={audio}
          onComplete={handleAudioComplete}
          placeholder="Speak your message..."
          endpoint="/api/stream/voice"
          disableModeSwitch={true}
          variant="button"
        />
        <div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowText(!showText)}
          >
            <LetterText />
          </Button>
          <Button variant="ghost" size="icon" className='md:hidden' onClick={toggleExpand}>
            {expanded ? <X /> : <Maximize2 />}
          </Button>
        </div>
      </div>

      <ScrollArea
        className={cn('flex-1 p-3')}
        style={{
          overflowY: 'auto',
          height: expanded
            ? showText
              ? 'calc(100svh - 190px)'
              : 'calc(100svh - 60px)'
            : '300px',
          maxHeight: expanded
            ? showText
              ? 'calc(100svh - 190px)'
              : 'calc(100svh - 60px)'
            : '300px',
        }}
      >
        <div className="space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center  py-8 select-none">
              <div className='text-sm font-mono text-muted-foreground'>{t('start')}</div>
              <div
                onClick={() => audio.current?.toggle()}
                className="text-xs font-mono text-center text-muted-foreground bg-muted rounded-md p-1 mt-3 field-shadow w-[130px]"
              >
                {t('trigger')}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  'flex flex-col',
                  message.role === 'user' ? 'items-end' : 'items-start'
                )}
              >
                {/* Name and timestamp header */}
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-medium">
                    {message.role === 'user' ? 'You' : 'AI'}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {new Date().toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>

                {/* Message bubble */}
                <div
                  className={cn(
                    'rounded-lg p-2 max-w-[80%]',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="">{message.content}</p>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex flex-col items-start">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-medium">AI</span>
                <span className="text-xs text-muted-foreground">
                  {new Date().toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </span>
              </div>
              <div className="bg-muted rounded-lg p-3 max-w-[80%]">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"></div>
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  ></div>
                  <div
                    className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="flex flex-col items-start">
              <div className="bg-destructive/10 text-destructive rounded-lg p-3 max-w-[80%]">
                <p className="text-sm">
                  Something went wrong. Please try again.
                </p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {showText && (
        <div className="p-3 border-t">
          <form onSubmit={handleSubmit} className="flex flex-col gap-2">
            <Textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Type your message..."
              className="min-h-[60px] flex-1 resize-none"
              tabIndex={-1}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(e);
                }
              }}
            />
            <div className="flex items-center gap-2 ">
              <Button
                type="submit"
                variant="default"
                className="flex-1"
                disabled={isLoading || !input.trim()}
              >
                <Send className="mr-2 h-4 w-4" /> Send
              </Button>
              {(status === 'submitted' || status === 'streaming') && (
                <Button variant="outline" size="icon" onClick={() => stop()}>
                  <Square className="h-4 w-4" />
                </Button>
              )}
            </div>
          </form>
        </div>
      )}

      {renderDebugInfo()}
    </Card>
  );

  return (
    <>
      <Modal
        mode="dialog"
        showCloseButton={false}
        open={expanded}
        onClose={handleModalClose}
        className="max-w-screen-sm p-0 h-full sm:h-auto border-none"
      >
        {chatContent}
      </Modal>

      {!expanded && <div className="flex flex-col w-full h-full">{chatContent}</div>}
    </>
  );
}
