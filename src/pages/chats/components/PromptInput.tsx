import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import TextField from "@mui/material/TextField";
import { PaperPlaneTiltIcon } from "@phosphor-icons/react";
import type { KeyboardEvent } from "react";

interface PromptInputProps {
  canSend: boolean;
  draft: string;
  isSending?: boolean;
  selectedModelName?: string;
  onDraftChange: (draft: string) => void;
  onSend: () => void;
}

export function PromptInput({
  canSend,
  draft,
  isSending = false,
  selectedModelName,
  onDraftChange,
  onSend,
}: PromptInputProps) {
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      onSend();
    }
  };

  return (
    <Box
      component="footer"
      sx={{
        borderTop: 1,
        borderColor: "divider",
        bgcolor: "background.default",
        px: { xs: 2, sm: 3 },
        py: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          onSend();
        }}
        sx={{
          mx: "auto",
          display: "flex",
          width: "100%",
          maxWidth: 896,
          alignItems: "flex-end",
          gap: 1.5,
        }}
      >
        <TextField
          fullWidth
          multiline
          minRows={1}
          maxRows={6}
          size="small"
          disabled={isSending}
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={
            selectedModelName
              ? `Ask ${selectedModelName}`
              : "Select a model to chat"
          }
        />
        <IconButton
          type="submit"
          color="primary"
          disabled={!canSend}
          aria-label="Send prompt"
          sx={{
            width: 48,
            height: 48,
            bgcolor: canSend ? "primary.main" : "action.disabledBackground",
            color: canSend ? "primary.contrastText" : "text.disabled",
            "&:hover": {
              bgcolor: canSend ? "primary.light" : undefined,
            },
          }}
        >
          <PaperPlaneTiltIcon size={20} weight="fill" />
        </IconButton>
      </Box>
    </Box>
  );
}
