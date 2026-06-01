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
    <label className="block">
      <span className="text-sm font-medium text-slate-300">Provider</span>
      <select
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(event.target.value as ApiKeyProvider)}
        className="mt-2 h-11 w-full rounded-lg border border-slate-700 bg-slate-950 px-3 text-sm text-slate-100 outline-none transition focus:border-cyan-300 focus:ring-2 focus:ring-cyan-300/20 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
