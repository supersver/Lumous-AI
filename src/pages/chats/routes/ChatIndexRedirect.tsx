import { Box, Typography } from "@mui/material";

export function ChatIndexRedirect() {
  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100%",
        alignItems: "center",
        justifyContent: "center",
        px: 3,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          maxWidth: 420,
          width: "100%",
        }}
      >
        <Box
          component="svg"
          aria-hidden="true"
          viewBox="0 0 220 180"
          sx={{ width: 224, height: 176, maxWidth: "100%" }}
          fill="none"
        >
          <path
            d="M54 118c-14.36 0-26-11.64-26-26V58c0-14.36 11.64-26 26-26h112c14.36 0 26 11.64 26 26v34c0 14.36-11.64 26-26 26h-42.5L92 146v-28H54Z"
            fill="var(--mui-palette-background-paper)"
            stroke="var(--mui-palette-divider)"
            strokeWidth="3"
            strokeLinejoin="round"
          />
          <path
            d="M72 72h76M72 92h48"
            stroke="var(--mui-palette-text-disabled)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          <path
            d="m164 30 4.76 12.24L181 47l-12.24 4.76L164 64l-4.76-12.24L147 47l12.24-4.76L164 30ZM49 26l2.98 7.52L59.5 36.5l-7.52 2.98L49 47l-2.98-7.52-7.52-2.98 7.52-2.98L49 26Z"
            fill="#818cf8"
          />
          <circle cx="68" cy="134" r="8" fill="#22d3ee" />
          <circle cx="181" cy="126" r="5" fill="#34d399" />
        </Box>
        <Typography variant="h4" sx={{ mt: 3, fontWeight: 600 }}>
          Any new ideas to explore?
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1, lineHeight: 1.7 }}
        >
          Type a message below to start a new conversation.
        </Typography>
      </Box>
    </Box>
  );
}
