import { Box, Divider, Link, Typography } from "@mui/material";
import type { Components } from "react-markdown";
import { CodeBlock } from "./CodeBlock";

export const MarkdownComponents: Components = {
  // Headings
  h1: ({ children }) => (
    <Typography
      variant="h5"
      component="h1"
      sx={{
        mt: 2.5,
        mb: 1.25,
        fontWeight: 700,
        lineHeight: 1.3,
        "&:first-of-type": { mt: 0 },
      }}
    >
      {children}
    </Typography>
  ),
  h2: ({ children }) => (
    <Typography
      variant="h6"
      component="h2"
      sx={{ mt: 2, mb: 1, fontWeight: 600, "&:first-of-type": { mt: 0 } }}
    >
      {children}
    </Typography>
  ),
  h3: ({ children }) => (
    <Typography
      variant="subtitle1"
      component="h3"
      sx={{ mt: 1.5, mb: 0.75, fontWeight: 600, "&:first-of-type": { mt: 0 } }}
    >
      {children}
    </Typography>
  ),
  h4: ({ children }) => (
    <Typography
      variant="subtitle2"
      component="h4"
      sx={{ mt: 1.25, mb: 0.5, fontWeight: 600, "&:first-of-type": { mt: 0 } }}
    >
      {children}
    </Typography>
  ),
  h5: ({ children }) => (
    <Typography
      variant="body1"
      component="h5"
      sx={{ mt: 1, mb: 0.5, fontWeight: 600 }}
    >
      {children}
    </Typography>
  ),
  h6: ({ children }) => (
    <Typography
      variant="body2"
      component="h6"
      sx={{ mt: 1, mb: 0.5, fontWeight: 600, color: "text.secondary" }}
    >
      {children}
    </Typography>
  ),

  // Paragraph
  p: ({ children }) => (
    <Typography
      component="p"
      variant="body2"
      sx={{ mb: 1.25, lineHeight: 1.75, "&:last-child": { mb: 0 } }}
    >
      {children}
    </Typography>
  ),

  // Lists
  ul: ({ children }) => (
    <Box
      component="ul"
      sx={{
        pl: 2.5,
        mb: 1.25,
        listStyleType: "disc",
        "& ul": { mb: 0, listStyleType: "circle" },
        "& ul ul": { listStyleType: "square" },
      }}
    >
      {children}
    </Box>
  ),
  ol: ({ children }) => (
    <Box
      component="ol"
      sx={{ pl: 2.5, mb: 1.25, listStyleType: "decimal", "& ol": { mb: 0 } }}
    >
      {children}
    </Box>
  ),
  li: ({ children }) => (
    <Typography
      component="li"
      variant="body2"
      sx={{ mb: 0.5, lineHeight: 1.7, "& p": { mb: 0.5 } }}
    >
      {children}
    </Typography>
  ),

  // Links — secure by default
  a: ({ href, children }) => (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      underline="always"
      sx={{
        color: "primary.light",
        textDecorationColor: "rgba(129,140,248,0.4)",
        "&:hover": { textDecorationColor: "primary.light" },
      }}
    >
      {children}
    </Link>
  ),

  // Blockquote
  blockquote: ({ children }) => (
    <Box
      component="blockquote"
      sx={{
        m: 0,
        my: 1.5,
        pl: 2,
        py: 0.75,
        borderLeft: "3px solid",
        borderColor: "primary.dark",
        bgcolor: "rgba(255,255,255,0.03)",
        borderRadius: "0 8px 8px 0",
        "& p": { mb: 0, color: "text.secondary", fontStyle: "italic" },
      }}
    >
      {children}
    </Box>
  ),

  // Divider
  hr: () => <Divider sx={{ my: 2 }} />,

  // Bold
  strong: ({ children }) => (
    <Box component="strong" sx={{ fontWeight: 700, color: "text.primary" }}>
      {children}
    </Box>
  ),

  // Italic
  em: ({ children }) => (
    <Box component="em" sx={{ fontStyle: "italic" }}>
      {children}
    </Box>
  ),

  // Tables — requires remark-gfm
  table: ({ children }) => (
    <Box
      sx={{
        overflowX: "auto",
        my: 2,
        borderRadius: 1.5,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        component="table"
        sx={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: "0.8125rem",
        }}
      >
        {children}
      </Box>
    </Box>
  ),
  thead: ({ children }) => (
    <Box component="thead" sx={{ bgcolor: "rgba(255,255,255,0.05)" }}>
      {children}
    </Box>
  ),
  tbody: ({ children }) => <Box component="tbody">{children}</Box>,
  tr: ({ children }) => (
    <Box
      component="tr"
      sx={{
        borderBottom: "1px solid",
        borderColor: "divider",
        "&:last-child": { borderBottom: "none" },
        "&:nth-of-type(even)": { bgcolor: "rgba(255,255,255,0.02)" },
      }}
    >
      {children}
    </Box>
  ),
  th: ({ children }) => (
    <Box
      component="th"
      sx={{
        px: 1.5,
        py: 0.875,
        textAlign: "left",
        fontWeight: 600,
        fontSize: "0.8125rem",
        borderRight: "1px solid",
        borderColor: "divider",
        "&:last-child": { borderRight: "none" },
      }}
    >
      {children}
    </Box>
  ),
  td: ({ children }) => (
    <Box
      component="td"
      sx={{
        px: 1.5,
        py: 0.875,
        fontSize: "0.8125rem",
        borderRight: "1px solid",
        borderColor: "divider",
        "&:last-child": { borderRight: "none" },
      }}
    >
      {children}
    </Box>
  ),

  // Inline code + Code blocks
  code({ className, children, ...props }) {
    const match = /language-(\w+)/.exec(className ?? "");

    if (!match) {
      return (
        <Box
          component="code"
          sx={{
            px: 0.65,
            py: 0.15,
            borderRadius: 0.75,
            fontSize: "0.82em",
            fontFamily: "monospace",
            bgcolor: "rgba(255,255,255,0.08)",
            border: "1px solid",
            borderColor: "divider",
            color: "secondary.light",
          }}
          {...props}
        >
          {children}
        </Box>
      );
    }

    return (
      <CodeBlock
        language={match[1]}
        code={String(children).replace(/\n$/, "")}
      />
    );
  },
};
