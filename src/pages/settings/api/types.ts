export type ApiKeyProvider = "openrouter";

export interface ApiKey {
  id: string;
  provider: ApiKeyProvider | string;
  key?: string;
  maskedKey?: string;
  keyPreview?: string;
  preview?: string;
  lastFour?: string;
  name?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SaveApiKeyInput {
  provider: ApiKeyProvider;
  apiKey: string;
}

export type ApiKeysListResponse =
  | ApiKey[]
  | {
      apiKeys?: ApiKey[];
      keys?: ApiKey[];
      data?: ApiKey[];
    };
