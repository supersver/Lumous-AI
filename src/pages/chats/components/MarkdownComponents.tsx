import { Box, Typography } from "@mui/material";
import type { Components } from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const MarkdownComponents: Components = {
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");
    const isInline = !match;

    if (isInline) {
      return (
        <Box
          component="code"
          sx={{
            px: 0.6,
            py: 0.2,
            borderRadius: 0.75,
            fontSize: "0.8em",
            fontFamily: "monospace",
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid",
            borderColor: "divider",
          }}
          {...props}
        >
          {children}
        </Box>
      );
    }

    return (
      <Box
        sx={{
          my: 1.5,
          borderRadius: 1.5,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Language label */}
        <Box
          sx={{
            px: 2,
            py: 0.75,
            bgcolor: "rgba(255,255,255,0.04)",
            borderBottom: "1px solid",
            borderColor: "divider",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography
            variant="caption"
            color="text.disabled"
            sx={{ fontFamily: "monospace" }}
          >
            {match[1]}
          </Typography>
        </Box>

        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          customStyle={{
            margin: 0,
            borderRadius: 0,
            fontSize: "0.8rem",
            background: "transparent",
          }}
        >
          {String(children).replace(/\n$/, "")}
        </SyntaxHighlighter>
      </Box>
    );
  },
};
