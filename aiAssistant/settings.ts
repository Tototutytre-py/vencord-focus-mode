/**
 * Paramètres de configuration pour l'Assistant IA
 * Définit les options disponibles pour l'utilisateur
 */

import { OptionType } from "@utils/types";

export const aiAssistantSettings = {
    enableAIAssistant: {
        type: OptionType.BOOLEAN,
        description: "Enable AI Assistant for per-conversation mode",
        default: false,
    },
    aiProvider: {
        type: OptionType.SELECT,
        description: "AI Provider (OpenAI or local Ollama)",
        default: "ollama",
        options: [
            { label: "Ollama (Local)", value: "ollama" },
            { label: "OpenAI", value: "openai" },
        ],
    },
    openaiKey: {
        type: OptionType.STRING,
        description: "OpenAI API Key",
        default: "",
        secret: true,
    },
    openaiModel: {
        type: OptionType.STRING,
        description: "OpenAI Model (e.g., gpt-3.5-turbo, gpt-4)",
        default: "gpt-3.5-turbo",
    },
    ollamaUrl: {
        type: OptionType.STRING,
        description: "Ollama Server URL",
        default: "http://localhost:11434",
    },
    ollamaModel: {
        type: OptionType.STRING,
        description: "Ollama Model (e.g., mistral, neural-chat)",
        default: "mistral",
    },
    styleMessagesLimit: {
        type: OptionType.SLIDER,
        description: "Number of user messages to analyze for style profile",
        default: 20,
        markers: [5, 10, 20, 50, 100],
    },
    maxContextMessages: {
        type: OptionType.SLIDER,
        description: "Maximum number of recent messages to use as context",
        default: 10,
        markers: [5, 10, 15, 20],
    },
    maxResponseLength: {
        type: OptionType.SLIDER,
        description: "Maximum response length in characters",
        default: 500,
        markers: [100, 250, 500, 1000, 2000],
    },
    autoUpdateStyleProfile: {
        type: OptionType.BOOLEAN,
        description: "Automatically update style profile as new messages arrive",
        default: true,
    },
    styleProfileUpdateInterval: {
        type: OptionType.SLIDER,
        description: "Update style profile every X messages",
        default: 5,
        markers: [1, 3, 5, 10],
    },
};

export type AIAssistantSettingsType = typeof aiAssistantSettings;
