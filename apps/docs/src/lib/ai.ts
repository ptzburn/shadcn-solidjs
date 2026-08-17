// Docs-only stand-in for upstream's `@/lib/ai` (the @shadcn/helpers AI-SDK
// runtime + `useChat`). Scripts a deterministic conversation and replays it
// with simulated streaming so the message-scroller examples can stay
// near-verbatim ports. Not part of the registry.
import type { Accessor, Store } from "solid-js";
import { createSignal, createStore, onCleanup } from "solid-js";

type ChatRole = "user" | "assistant";

type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
};

type ChatStatus = "ready" | "submitted" | "streaming";

type ChatTurnOptions = {
  id?: string;
};

type ChatTransportHandlers = {
  onStart: (reply: ChatMessage) => void;
  onDelta: (reply: ChatMessage) => void;
  onFinish: () => void;
};

// Streams the scripted assistant turn that follows a user message. `respond`
// returns a cancel function.
type ChatTransport = {
  respond: (
    userMessage: Pick<ChatMessage, "id">,
    handlers: ChatTransportHandlers,
  ) => () => void;
};

// A deterministic conversation: chain turns, then read them back or stream them
// through a transport (mirrors the upstream Chat surface the examples use).
type Chat = {
  // Scripts a user turn.
  user: (text: string, options?: ChatTurnOptions) => Chat;
  // Scripts an assistant turn (streamed word by word by the transport).
  assistant: (text: string, options?: ChatTurnOptions) => Chat;
  // Delays the next turn's stream.
  sleep: (delayMs: number) => Chat;
  // Clones of the first `count` scripted messages, or all when omitted.
  get: (count?: number) => ChatMessage[];
  // The next scripted user message after the given transcript, or null.
  next: (messages: readonly Pick<ChatMessage, "id">[]) => ChatMessage | null;
  // The transport that streams scripted assistant replies.
  transport: (options?: { delayMs?: number }) => ChatTransport;
};

const DEFAULT_STREAM_DELAY_MS = 50;

function cloneMessage(message: ChatMessage): ChatMessage {
  return { id: message.id, role: message.role, text: message.text };
}

function createChat(): Chat {
  const turns: ChatMessage[] = [];
  // delays[i] = ms to wait before turn i starts streaming (from .sleep()).
  const delays: number[] = [];
  let pendingSleep = 0;

  const push = (role: ChatRole, text: string, options?: ChatTurnOptions) => {
    turns.push({
      id: options?.id ?? `${role}-${turns.length + 1}`,
      role,
      text,
    });
    delays.push(pendingSleep);
    pendingSleep = 0;
  };

  const chat: Chat = {
    user(text, options) {
      push("user", text, options);
      return chat;
    },
    assistant(text, options) {
      push("assistant", text, options);
      return chat;
    },
    sleep(delayMs) {
      pendingSleep = delayMs;
      return chat;
    },
    get(count) {
      return turns.slice(0, count ?? turns.length).map(cloneMessage);
    },
    next(messages) {
      const last = messages[messages.length - 1];
      const start = last
        ? turns.findIndex((turn) => turn.id === last.id) + 1
        : 0;
      const next = turns.slice(start).find((turn) => turn.role === "user");
      return next ? cloneMessage(next) : null;
    },
    transport({ delayMs = DEFAULT_STREAM_DELAY_MS } = {}) {
      return {
        respond(userMessage, handlers) {
          const index = turns.findIndex((turn) => turn.id === userMessage.id);
          const reply = index >= 0 ? turns[index + 1] : undefined;

          if (!reply || reply.role !== "assistant") {
            const done = setTimeout(() => handlers.onFinish(), 0);
            return () => clearTimeout(done);
          }

          // One word per tick, keeping trailing whitespace so paragraph
          // breaks survive (upstream's splitTextDeltas: /\S+\s*/g).
          const deltas = reply.text.match(/\S+\s*/g) ?? [reply.text];
          let cancelled = false;
          let count = 0;
          let timer: ReturnType<typeof setTimeout> | null = null;

          const tick = () => {
            if (cancelled) return;
            count += 1;
            handlers.onDelta({
              ...reply,
              text: deltas.slice(0, count).join(""),
            });
            if (count >= deltas.length) {
              handlers.onFinish();
              return;
            }
            timer = setTimeout(tick, delayMs);
          };

          const startTimer = setTimeout(() => {
            if (cancelled) return;
            handlers.onStart({ ...reply, text: "" });
            timer = setTimeout(tick, delayMs);
          }, delays[index + 1] ?? 0);

          return () => {
            cancelled = true;
            clearTimeout(startTimer);
            if (timer !== null) clearTimeout(timer);
          };
        },
      };
    },
  };

  return chat;
}

// The Solid stand-in for `useChat`: a reactive transcript (store, so a streaming
// row updates in place instead of being re-created), a status accessor, and
// the two commands the examples call. Timers stop on disposal and on reset.
function createChatSession(options: {
  messages?: ChatMessage[];
  transport: ChatTransport;
}): {
  messages: Store<ChatMessage[]>;
  status: Accessor<ChatStatus>;
  sendMessage: (message: ChatMessage) => void;
  setMessages: (messages: ChatMessage[]) => void;
} {
  const [messages, setMessages] = createStore<ChatMessage[]>(
    (options.messages ?? []).map(cloneMessage),
  );
  const [status, setStatus] = createSignal<ChatStatus>("ready");
  let cancel: (() => void) | null = null;

  const stop = () => {
    cancel?.();
    cancel = null;
  };

  const sendMessage = (message: ChatMessage) => {
    stop();
    setMessages((list) => {
      list.push(cloneMessage(message));
    });
    setStatus("submitted");
    cancel = options.transport.respond(message, {
      onStart(reply) {
        setMessages((list) => {
          list.push(cloneMessage(reply));
        });
        setStatus("streaming");
      },
      onDelta(reply) {
        setMessages((list) => {
          const target = list.find((entry) => entry.id === reply.id);
          if (target) target.text = reply.text;
        });
      },
      onFinish() {
        cancel = null;
        setStatus("ready");
      },
    });
  };

  const replaceMessages = (next: ChatMessage[]) => {
    stop();
    setMessages(() => next.map(cloneMessage));
    setStatus("ready");
  };

  onCleanup(stop);

  return { messages, status, sendMessage, setMessages: replaceMessages };
}

function getMessageText(message: Pick<ChatMessage, "text">): string {
  return message.text;
}

export { createChat, createChatSession, getMessageText };
export type { Chat, ChatMessage, ChatStatus, ChatTransport };
