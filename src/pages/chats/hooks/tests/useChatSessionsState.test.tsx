import { describe, expect, it, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import type { ReactNode } from "react";
import type { ChatMessagesState } from "../../store/useChatMessagesStore";

const mocks = vi.hoisted(() => ({
  useGetChats: vi.fn(),
  useGetChat: vi.fn(),
  createChat: vi.fn(),
  deleteChat: vi.fn(),
  sendMessage: vi.fn(),
  clearChatMessages: vi.fn(),
  setChatMessagesFromServer: vi.fn(),
}));

vi.mock("../../api/getChats", () => ({
  chatsQueryKey: ["chats"],
  useGetChats: mocks.useGetChats,
}));

vi.mock("../../api/getChat", () => ({
  useGetChat: mocks.useGetChat,
}));

vi.mock("../../api/createNewChat", () => ({
  useCreateNewChat: () => ({
    mutateAsync: mocks.createChat,
  }),
}));

vi.mock("../../api/deleteChat", () => ({
  useDeleteChat: () => ({
    mutateAsync: mocks.deleteChat,
  }),
}));

vi.mock("../../api/sendMessage", () => ({
  useSendMessage: () => ({
    mutateAsync: mocks.sendMessage,
    isPending: false,
  }),
}));

vi.mock("../../store/useChatMessagesStore", () => ({
  useChatMessagesStore: (selector: (state: ChatMessagesState) => unknown) =>
    selector({
      messagesByChatId: {},
      messageOrderByChatId: {},
      clearChatMessages: mocks.clearChatMessages,
      setChatMessagesFromServer: mocks.setChatMessagesFromServer,
      addMessage: vi.fn(),
      appendToMessage: vi.fn(),
      markChatMessagesComplete: vi.fn(),
      replaceMessage: vi.fn(),
      updateMessage: vi.fn(),
    }),
}));

import { useChatSessionsState } from "../useChatSessions";
import type { Model } from "../../api/getModels";

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

describe("useChatSessionsState", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    vi.spyOn(queryClient, "invalidateQueries").mockResolvedValue(undefined);

    mocks.useGetChats.mockReturnValue({
      data: [
        { id: "chat-1", title: "Chat 1" },
        { id: "chat-2", title: "Chat 2" },
      ],
      isLoading: false,
    });

    mocks.useGetChat.mockReturnValue({
      data: {
        id: "chat-1",
        messages: [],
      },
    });
  });

  it("should select first session by default", async () => {
    const { result } = renderHook(() => useChatSessionsState(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.activeSessionId).toBe("chat-1");
    });
  });

  it("should create a new session", async () => {
    mocks.createChat.mockResolvedValue({
      id: "new-chat",
    });

    const { result } = renderHook(() => useChatSessionsState(), {
      wrapper: createWrapper(),
    });

    let chatId = "";

    await act(async () => {
      chatId = await result.current.createSession("gpt-4");
    });

    expect(chatId).toBe("new-chat");

    expect(mocks.createChat).toHaveBeenCalledWith({
      model: "gpt-4",
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("should allow manual session selection", async () => {
    const { result } = renderHook(() => useChatSessionsState(), {
      wrapper: createWrapper(),
    });

    act(() => {
      result.current.selectSession("chat-2");
    });

    expect(result.current.activeSessionId).toBe("chat-2");
  });

  it("should delete a session", async () => {
    mocks.deleteChat.mockResolvedValue(undefined);

    const { result } = renderHook(() => useChatSessionsState(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.activeSessionId).toBe("chat-1");
    });

    let nextSession: string | null = null;

    await act(async () => {
      nextSession = await result.current.deleteSession("chat-1");
    });

    expect(mocks.deleteChat).toHaveBeenCalledWith("chat-1");
    expect(mocks.clearChatMessages).toHaveBeenCalledWith("chat-1");
    expect(nextSession).toBe("chat-2");
  });

  it("should send message to existing chat", async () => {
    const { result } = renderHook(() => useChatSessionsState(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.activeSessionId).toBe("chat-1");
    });

    await act(async () => {
      await result.current.sendMessage("Hello", { id: "gpt-4" } as Model);
    });

    expect(mocks.sendMessage).toHaveBeenCalledWith({
      chatId: "chat-1",
      content: "Hello",
      model: "gpt-4",
      webSearch: false,
      reasoning: false,
    });

    expect(queryClient.invalidateQueries).toHaveBeenCalled();
  });

  it("should not send empty message", async () => {
    const { result } = renderHook(() => useChatSessionsState(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.sendMessage("   ", null);
    });

    expect(mocks.sendMessage).not.toHaveBeenCalled();
  });

  it("should create chat before sending first message", async () => {
    mocks.useGetChats.mockReturnValue({
      data: [],
      isLoading: false,
    });

    mocks.useGetChat.mockReturnValue({
      data: undefined,
    });

    mocks.createChat.mockResolvedValue({
      id: "new-chat",
    });

    const { result } = renderHook(() => useChatSessionsState(), {
      wrapper: createWrapper(),
    });

    await act(async () => {
      await result.current.sendMessage("Hello", { id: "gpt-4" } as Model);
    });

    expect(mocks.createChat).toHaveBeenCalled();

    expect(mocks.sendMessage).toHaveBeenCalledWith({
      chatId: "new-chat",
      content: "Hello",
      model: "gpt-4",
      webSearch: false,
      reasoning: false,
    });
  });

  it("should sync messages from server", async () => {
    renderHook(() => useChatSessionsState(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(mocks.setChatMessagesFromServer).toHaveBeenCalledWith(
        "chat-1",
        [],
      );
    });
  });
});
