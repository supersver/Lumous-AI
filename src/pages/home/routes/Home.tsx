import {
  Box,
  InputAdornment,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import sparkle from "@/assets/sparkle.svg";
import { useAppStore } from "@/store/useAppStore";
import { ToolCard } from "../components/ToolCard";
import { tools } from "@/data/Tools";

export function Home() {
  const navigate = useNavigate();
  const user = useAppStore((s) => s.user);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [search, setSearch] = useState("");

  const firstName = user?.name?.trim().split(/\s+/)[0] ?? "there";

  const filteredTools = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return tools;
    }

    return tools.filter(
      (tool) =>
        tool.title.toLowerCase().includes(query) ||
        tool.description.toLowerCase().includes(query),
    );
  }, [search]);

  return (
    <Box
      sx={{
        width: "100%",
        minHeight: "100%",
        display: "flex",
        justifyContent: "center",
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 3, sm: 4 },
      }}
    >
      <Box sx={{ width: "100%" }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 2,
          }}
        >
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                letterSpacing: "-0.02em",
              }}
            >
              Hello{firstName === "there" ? "" : `, ${firstName}`}
            </Typography>

            <Typography
              variant="inherit"
              component="p"
              sx={{
                mt: 1,
                lineHeight: 1.2,
                maxWidth: 700,
                color: "contentSecondary",
              }}
            >
              Select a workspace below to begin. Lumous AI integrates your
              workflows, tracking, and insights into one seamless hub.
            </Typography>
          </Box>

          <img
            src={sparkle}
            alt="Lumous AI"
            style={{
              width: "auto",
              display: "block",
            }}
          />
        </Box>

        {/* Workspace heading + search */}
        <Box
          sx={{
            display: "flex",
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            gap: 2,
            flexDirection: { xs: "column", sm: "row" },
          }}
        >
          <Typography
            variant="overline"
            component="h2"
            sx={{
              color: "text.primary",
              letterSpacing: "0.08em",
              flexShrink: 0,
            }}
          >
            Active Workspaces
          </Typography>

          <TextField
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search workspaces..."
            size="small"
            sx={{
              width: { xs: "100%", sm: 350 },

              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                bgcolor: "background.paper",

                "& fieldset": {
                  borderColor: "divider",
                },

                "&:hover fieldset": {
                  borderColor: "primary.main",
                },

                "&.Mui-focused fieldset": {
                  borderColor: "primary.main",
                },
              },
            }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <MagnifyingGlassIcon size={18} />
                  </InputAdornment>
                ),
              },
            }}
          />
        </Box>

        {/* Tool cards */}
        <Box
          sx={{
            mt: 2,
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, minmax(0, 1fr))",
              md: "repeat(3, minmax(0, 1fr))",
            },
            gap: 2,
          }}
        >
          {filteredTools.map((tool) => (
            <ToolCard
              key={tool.title}
              {...tool}
              onClick={() => navigate(tool.to)}
            />
          ))}
        </Box>

        {filteredTools.length === 0 && (
          <Box
            sx={{
              py: 8,
              textAlign: "center",
            }}
          >
            <Typography variant="body1" color="text.secondary">
              No tools found for "{search}".
            </Typography>
          </Box>
        )}

        {isMobile && filteredTools.length > 0 && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{
              display: "block",
              mt: 3,
              textAlign: "center",
            }}
          >
            Tap a tool card to get started.
          </Typography>
        )}
      </Box>
    </Box>
  );
}
