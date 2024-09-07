"use client";

export interface ChatConfig {
  backend?: string;
}

export function useClientConfig(): ChatConfig {
  return {
    backend: "",
  };
}
