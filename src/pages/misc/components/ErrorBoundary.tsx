import { Box, Button, Typography } from "@mui/material";
import { type FallbackProps } from "react-error-boundary";

export function AppFallback({ error, resetErrorBoundary }: FallbackProps) {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "background.default",
        px: 2,
        py: 8,
      }}
    >
      <Box
        sx={{
          maxWidth: 480,
          width: "100%",
          p: 4,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "error.dark",
          bgcolor: "background.paper",
        }}
      >
        <Typography variant="h6" color="error.light" sx={{ fontWeight: 600 }}>
          Something went wrong
        </Typography>
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 1.5, lineHeight: 1.7 }}
        >
          {message}
        </Typography>
        <Button
          variant="contained"
          color="error"
          onClick={resetErrorBoundary}
          disableElevation
          sx={{
            mt: 3,
            borderRadius: 999,
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Try again
        </Button>
      </Box>
    </Box>
  );
}
