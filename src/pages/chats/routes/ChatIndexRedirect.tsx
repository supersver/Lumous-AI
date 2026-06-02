import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerGapIcon } from "@phosphor-icons/react";

import { useChatSessions } from "../context/ChatSessionsContext";

export function ChatIndexRedirect() {
  const navigate = useNavigate();
  const { createSession, sessions } = useChatSessions();

  useEffect(() => {
    const targetId = sessions[0]?.id ?? createSession();
    navigate(`/chat/${targetId}`, { replace: true });
    // Only redirect once when landing on /
  }, [createSession, navigate, sessions[0]?.id]);

  return (
    <div className="flex flex-1 items-center justify-center bg-slate-950 text-slate-400">
      <SpinnerGapIcon size={24} className="animate-spin" />
    </div>
  );
}
