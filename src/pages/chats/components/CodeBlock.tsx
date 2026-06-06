import { useState } from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import {
  ArrowsInIcon,
  ArrowsOutIcon,
  CheckIcon,
  CopyIcon,
} from "@phosphor-icons/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "react-toastify";

interface CodeBlockProps {
  language: string;
  code: string;
}

export function CodeBlock({ language, code }: CodeBlockProps) {
  const [copied, setCopied] = useState<boolean>(false);
  const [wordWrap, setWordWrap] = useState<boolean>(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Failed to copy!");
    }
  };

  return (
    <Box
      sx={{
        my: 2,
        borderRadius: 2,
        overflow: "hidden",
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 2,
          py: 0.75,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          bgcolor: "rgba(255,255,255,0.04)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Typography
          variant="caption"
          color="text.disabled"
          sx={{ fontFamily: "monospace" }}
        >
          {language || "plaintext"}
        </Typography>
        <Box sx={{ display: "flex", gap: 0.5 }}>
          <Tooltip
            title={wordWrap ? "Disable word wrap" : "Enable word wrap"}
            placement="top"
          >
            <IconButton
              size="small"
              onClick={() => setWordWrap((v) => !v)}
              sx={{
                p: 0.5,
                color: wordWrap ? "primary.light" : "text.disabled",
                "&:hover": { color: "text.primary" },
              }}
            >
              {wordWrap ? (
                <ArrowsInIcon size={14} />
              ) : (
                <ArrowsOutIcon size={14} />
              )}
            </IconButton>
          </Tooltip>
          <Tooltip title={copied ? "Copied!" : "Copy"} placement="top">
            <IconButton
              size="small"
              onClick={handleCopy}
              sx={{
                p: 0.5,
                color: copied ? "success.light" : "text.disabled",
                "&:hover": { color: "text.primary" },
              }}
            >
              {copied ? <CheckIcon size={14} /> : <CopyIcon size={14} />}
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Code */}
      <Box sx={{ overflowX: wordWrap ? "unset" : "auto" }}>
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={language || "plaintext"}
          PreTag="div"
          wrapLines={wordWrap}
          wrapLongLines={wordWrap}
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: "0.8125rem",
            lineHeight: 1.65,
            background: "transparent",
            padding: "1rem 1.25rem",
          }}
        >
          {code}
        </SyntaxHighlighter>
      </Box>
    </Box>
  );
}
