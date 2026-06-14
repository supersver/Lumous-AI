import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import React, { type ReactNode } from "react";
import { useChatStream, parseSSE, readSSE } from "../useChatStream";

// --- Mocks ---
// 1. Define mocks using vi.hoisted so they are available to vi.mock factories
const { storeMocks } = vi.hoisted(() => ({
  storeMocks: {
    addMessage: vi.fn(),
    appendToMessage: vi.fn(),
    markChatMessagesComplete: vi.fn(),
    replaceMessage: vi.fn(),
    updateMessage: vi.fn(),
  },
}));

// 2. CRITICAL FIX: Mock useShallow to return a selector that ALWAYS returns
// the exact same object reference (storeMocks). This prevents React's
// useSyncExternalStore from triggering infinite re-renders.
vi.mock("zustand/react/shallow", () => ({
  useShallow: () => () => storeMocks,
}));

// 3. We no longer need to mock useChatMessagesStore! The useShallow mock
// handles the return value safely. (If you still want to mock it, ensure
// the path is relative to THIS test file: "../../store/useChatMessagesStore")

vi.mock("@/lib/firebase", () => ({
  auth: { currentUser: { getIdToken: vi.fn().mockResolvedValue("token") } },
}));
vi.mock("@/config", () => ({ API_URL: "http://api.test" }));

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return ({ children }: { children: ReactNode }) =>
    React.createElement(QueryClientProvider, { client: qc }, children);
};

function mockStream(chunks: string[]) {
  const encoder = new TextEncoder();
  return new ReadableStream({
    start(controller) {
      chunks.forEach((c) => controller.enqueue(encoder.encode(c)));
      controller.close();
    },
  });
}

describe("parseSSE", () => {
  it("parses standard event and data", () => {
    expect(parseSSE('event: token\ndata: {"token": "hi"}')).toEqual({
      event: "token",
      data: '{"token": "hi"}',
    });
  });

  it("handles multi-line data", () => {
    expect(parseSSE("data: line1\ndata: line2")).toEqual({
      event: "message",
      data: "line1\nline2",
    });
  });

  it("returns null for comments or empty chunks", () => {
    expect(parseSSE(": comment")).toBeNull();
    expect(parseSSE("")).toBeNull();
  });
});

describe("readSSE", () => {
  it("yields parsed events from stream", async () => {
    const stream = mockStream([
      'event: start\ndata: {"id": 1}\n\n',
      "event: token\ndata: hi\n\n",
    ]);

    const events = [];
    for await (const event of readSSE(stream)) {
      events.push(event);
    }

    expect(events).toEqual([
      { event: "start", data: '{"id": 1}' },
      { event: "token", data: "hi" },
    ]);
  });
});

describe("useChatStream", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", vi.fn());
    vi.stubGlobal("crypto", { randomUUID: () => "test-uuid" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("should add optimistic messages, stream tokens, and complete successfully", async () => {
    const stream = mockStream([
      'event: start\ndata: {"assistantMessageId": "server-123"}\n\n',
      'event: token\ndata: {"token": "Hello"}\n\n',
      'event: token\ndata: {"token": " world"}\n\n',
      'event: complete\ndata: {"message": {"id": "server-123", "content": "Hello world"}}\n\n',
    ]);

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      body: stream,
    } as unknown as Response);

    const { result } = renderHook(() => useChatStream(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.sendMessage({
        chatId: "chat-1",
        content: "Hi",
        model: "gpt-4",
      });
    });

    await waitFor(() =>
      expect(storeMocks.markChatMessagesComplete).toHaveBeenCalledWith(
        "chat-1",
      ),
    );

    expect(storeMocks.addMessage).toHaveBeenCalledWith(
      "chat-1",
      expect.objectContaining({
        role: "user",
        content: "Hi",
        status: "optimistic",
      }),
    );
    expect(storeMocks.appendToMessage).toHaveBeenCalledWith(
      "chat-1",
      "server-123",
      "Hello",
    );
    expect(storeMocks.appendToMessage).toHaveBeenCalledWith(
      "chat-1",
      "server-123",
      " world",
    );
    expect(storeMocks.replaceMessage).toHaveBeenCalledWith(
      "chat-1",
      "server-123",
      expect.objectContaining({
        content: "Hello world",
        status: "complete",
      }),
    );
  });

  it("should handle stream errors gracefully", async () => {
    const stream = mockStream([
      'event: start\ndata: {"assistantMessageId": "server-123"}\n\n',
      'event: error\ndata: {"message": "Rate limit exceeded"}\n\n',
    ]);

    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      body: stream,
    } as unknown as Response);

    const { result } = renderHook(() => useChatStream(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.sendMessage({
        chatId: "chat-1",
        content: "Hi",
        model: "gpt-4",
      });
    });

    await waitFor(() =>
      expect(storeMocks.updateMessage).toHaveBeenCalledWith(
        "chat-1",
        "server-123",
        expect.objectContaining({
          status: "error",
          error: "Rate limit exceeded",
        }),
      ),
    );
  });
});
