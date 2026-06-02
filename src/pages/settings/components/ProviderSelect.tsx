import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

import type { ApiKeyProvider } from "../api/types";

export interface ProviderOption {
  label: string;
  value: ApiKeyProvider;
}

interface ProviderSelectProps {
  disabled?: boolean;
  options: ProviderOption[];
  value: ApiKeyProvider;
  onChange: (provider: ApiKeyProvider) => void;
}

export function ProviderSelect({
  disabled = false,
  options,
  value,
  onChange,
}: ProviderSelectProps) {
  return (
    <FormControl fullWidth disabled={disabled} size="small">
      <InputLabel id="api-key-provider-label">Provider</InputLabel>
      <Select
        labelId="api-key-provider-label"
        id="api-key-provider"
        label="Provider"
        value={value}
        onChange={(event) => onChange(event.target.value as ApiKeyProvider)}
      >
        {options.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
