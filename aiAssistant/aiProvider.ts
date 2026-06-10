/**
 * Interface et implémentations pour les fournisseurs IA
 * Support de OpenAI et Ollama
 */

export interface AIProvider {
    /**
     * Génère une réponse basée sur le contexte et le profil de style
     */
    generateResponse(
        systemPrompt: string,
        userMessage: string,
        recentMessages: string[]
    ): Promise<string>;

    /**
     * Teste la connexion au fournisseur
     */
    testConnection(): Promise<boolean>;
}

/**
 * Fournisseur OpenAI
 */
export class OpenAIProvider implements AIProvider {
    private apiKey: string;
    private model: string;

    constructor(apiKey: string, model: string = "gpt-3.5-turbo") {
        this.apiKey = apiKey;
        this.model = model;
    }

    async generateResponse(
        systemPrompt: string,
        userMessage: string,
        recentMessages: string[]
    ): Promise<string> {
        if (!this.apiKey) {
            throw new Error("OpenAI API key not configured");
        }

        // Construire l'historique de messages
        const messages = [
            { role: "system", content: systemPrompt },
            ...recentMessages.map((msg, i) => ({
                role: i % 2 === 0 ? "assistant" : "user",
                content: msg,
            })),
            { role: "user", content: userMessage },
        ];

        try {
            const response = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${this.apiKey}`,
                },
                body: JSON.stringify({
                    model: this.model,
                    messages: messages,
                    temperature: 0.7,
                    max_tokens: 500,
                }),
            });

            if (!response.ok) {
                throw new Error(`OpenAI API error: ${response.statusText}`);
            }

            const data = await response.json() as {
                choices: Array<{ message: { content: string } }>;
            };

            if (!data.choices || !data.choices[0]) {
                throw new Error("Invalid OpenAI response format");
            }

            return data.choices[0].message.content.trim();
        } catch (error) {
            console.error("OpenAI generation error:", error);
            throw error;
        }
    }

    async testConnection(): Promise<boolean> {
        if (!this.apiKey) return false;

        try {
            const response = await fetch("https://api.openai.com/v1/models", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${this.apiKey}`,
                },
            });

            return response.ok;
        } catch {
            return false;
        }
    }
}

/**
 * Fournisseur Ollama (local)
 */
export class OllamaProvider implements AIProvider {
    private baseUrl: string;
    private model: string;

    constructor(baseUrl: string = "http://localhost:11434", model: string = "mistral") {
        this.baseUrl = baseUrl.replace(/\/$/, ""); // Supprimer trailing slash
        this.model = model;
    }

    async generateResponse(
        systemPrompt: string,
        userMessage: string,
        recentMessages: string[]
    ): Promise<string> {
        // Construire un prompt combiné pour Ollama
        const contextMessages = recentMessages
            .slice(-6) // Garder les 6 derniers messages pour le contexte
            .join("\n\n");

        const fullPrompt = `${systemPrompt}

${contextMessages ? "Recent conversation:\n" + contextMessages + "\n\n" : ""}User message: ${userMessage}`;

        try {
            const response = await fetch(`${this.baseUrl}/api/generate`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    model: this.model,
                    prompt: fullPrompt,
                    stream: false,
                    temperature: 0.7,
                }),
            });

            if (!response.ok) {
                throw new Error(`Ollama API error: ${response.statusText}`);
            }

            const data = await response.json() as { response: string };

            if (!data.response) {
                throw new Error("Invalid Ollama response format");
            }

            return data.response.trim();
        } catch (error) {
            console.error("Ollama generation error:", error);
            throw error;
        }
    }

    async testConnection(): Promise<boolean> {
        try {
            const response = await fetch(`${this.baseUrl}/api/tags`, {
                method: "GET",
            });

            return response.ok;
        } catch {
            return false;
        }
    }
}

/**
 * Factory pour créer le bon fournisseur IA basé sur la configuration
 */
export function createAIProvider(
    provider: "openai" | "ollama",
    openaiKey?: string,
    openaiModel?: string,
    ollamaUrl?: string,
    ollamaModel?: string
): AIProvider {
    if (provider === "openai") {
        return new OpenAIProvider(openaiKey || "", openaiModel);
    } else {
        return new OllamaProvider(ollamaUrl, ollamaModel);
    }
}
