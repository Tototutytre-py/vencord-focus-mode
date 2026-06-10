/**
 * Traite les messages reçus et génère des réponses IA
 * Récupère le contexte, le profil de style et appelle le fournisseur IA
 */

import { StyleProfile } from "./storage";
import { AIProvider } from "./aiProvider";

/**
 * Construit un prompt système qui demande à l'IA d'imiter le style de l'utilisateur
 */
export function buildSystemPrompt(styleProfile: StyleProfile | null): string {
    let prompt = "You are a helpful Discord assistant. ";

    if (!styleProfile || styleProfile.messageCount === 0) {
        return prompt + "Respond in a natural and friendly way.";
    }

    // Construire une description du style basée sur le profil
    const styleDescriptions = [];

    // Longueur moyenne des messages
    if (styleProfile.averageLength < 50) {
        styleDescriptions.push("Keep responses short and concise");
    } else if (styleProfile.averageLength > 200) {
        styleDescriptions.push("Feel free to write longer, more detailed responses");
    } else {
        styleDescriptions.push("Write responses of moderate length");
    }

    // Fréquence des emojis
    if (styleProfile.emojiFrequency > 0.1) {
        styleDescriptions.push("Use emojis regularly to express emotions and reactions");
    } else if (styleProfile.emojiFrequency < 0.02) {
        styleDescriptions.push("Avoid using too many emojis");
    }

    // Formalité
    if (styleProfile.formalityScore > 0.7) {
        styleDescriptions.push("Use formal language and proper grammar");
    } else if (styleProfile.formalityScore < 0.3) {
        styleDescriptions.push("Use casual and informal language");
    } else {
        styleDescriptions.push("Use a balanced mix of formal and casual language");
    }

    // Ponctuation
    if (styleProfile.punctuationScore > 0.3) {
        styleDescriptions.push("Use punctuation frequently for clarity");
    } else if (styleProfile.punctuationScore < 0.1) {
        styleDescriptions.push("Don't overuse punctuation");
    }

    // Mots communs
    if (styleProfile.commonWords.size > 0) {
        const topWords = Array.from(styleProfile.commonWords.entries() as Array<[string, number]>)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word]) => word)
            .join(", ");

        styleDescriptions.push(`Use these words occasionally: ${topWords}`);
    }

    prompt += `\nAdopt the following style based on the user's writing patterns:\n`;
    prompt += styleDescriptions.join("\n");
    prompt += "\n\nRespond in a way that naturally mirrors these patterns without sounding artificial.";

    return prompt;
}

/**
 * Récupère les derniers messages d'une conversation
 * Cette fonction serait généralement implémentée avec accès à l'API Discord
 */
export async function getRecentMessages(
    channelId: string,
    limit: number = 10
): Promise<string[]> {
    // NOTE: Cette fonction doit être implémentée avec les APIs Discord appropriées
    // Pour l'instant, retourner un tableau vide
    // L'intégration sera faite dans messageReceiver.ts
    
    console.log(`Fetching ${limit} recent messages from channel ${channelId}`);
    return [];
}

/**
 * Génère une réponse IA pour un message reçu
 */
export async function generateAIResponse(
    aiProvider: AIProvider,
    newMessage: string,
    styleProfile: StyleProfile | null,
    recentMessages: string[],
    maxTokens: number = 500
): Promise<string> {
    try {
        // Limiter le contexte récent
        const contextMessages = recentMessages.slice(-6); // 6 derniers messages

        // Construire le prompt système
        const systemPrompt = buildSystemPrompt(styleProfile);

        // Générer la réponse
        const response = await aiProvider.generateResponse(
            systemPrompt,
            newMessage,
            contextMessages
        );

        // Limiter la longueur si nécessaire
        if (response.length > maxTokens) {
            return response.substring(0, maxTokens).trim() + "...";
        }

        return response;
    } catch (error) {
        console.error("Error generating AI response:", error);
        throw error;
    }
}

/**
 * Interface pour les options de génération
 */
export interface GenerationOptions {
    maxContextMessages?: number;
    maxResponseLength?: number;
    temperature?: number;
}
