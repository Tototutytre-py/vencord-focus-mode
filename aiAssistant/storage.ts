/**
 * Gestion du stockage des états et profils d'IA par conversation
 * Chaque canal (channelId) a son propre état et profil de style
 */

import { DataStore } from "@api/index";

// Interface pour l'état d'une conversation
export interface ConversationState {
    enabled: boolean;
    lastUpdated: number;
}

// Interface pour le profil de style d'un utilisateur
export interface StyleProfile {
    messageCount: number;
    averageLength: number;
    emojiFrequency: number;
    formalityScore: number; // 0 = très informel, 1 = très formel
    punctuationScore: number; // Fréquence de la ponctuation
    commonWords: Map<string, number>;
    lastUpdated: number;
}

const STORAGE_KEY_PREFIX = "vc-aiassistant";
const STATES_KEY = `${STORAGE_KEY_PREFIX}:states`;
const PROFILES_KEY = `${STORAGE_KEY_PREFIX}:profiles`;

/**
 * Récupère l'état d'activation de l'IA pour une conversation
 */
export async function getConversationState(channelId: string): Promise<ConversationState> {
    const states = (await DataStore.get(STATES_KEY, {})) as Record<string, ConversationState>;
    return states[channelId] ?? { enabled: false, lastUpdated: Date.now() };
}

/**
 * Définit l'état d'activation de l'IA pour une conversation
 */
export async function setConversationState(channelId: string, enabled: boolean): Promise<void> {
    const states = (await DataStore.get(STATES_KEY, {})) as Record<string, ConversationState>;
    states[channelId] = { enabled, lastUpdated: Date.now() };
    await DataStore.set(STATES_KEY, states);
}

/**
 * Récupère le profil de style d'écriture pour une conversation
 */
export async function getStyleProfile(channelId: string): Promise<StyleProfile | null> {
    const profiles = (await DataStore.get(PROFILES_KEY, {})) as Record<string, any>;
    const profile = profiles[channelId];
    
    if (!profile) return null;
    
    // Reconstruire la Map depuis l'objet sérialisé
    const commonWordsObj = profile.commonWords || {};
    const commonWords = new Map<string, number>(Object.entries(commonWordsObj) as Array<[string, number]>);
    
    return {
        ...profile,
        commonWords,
    };
}

/**
 * Définit le profil de style d'écriture pour une conversation
 */
export async function setStyleProfile(channelId: string, profile: StyleProfile): Promise<void> {
    const profiles = (await DataStore.get(PROFILES_KEY, {})) as Record<string, any>;
    
    // Convertir la Map en objet pour la sérialisation
    profiles[channelId] = {
        ...profile,
        commonWords: Object.fromEntries(profile.commonWords),
    };
    
    await DataStore.set(PROFILES_KEY, profiles);
}

/**
 * Supprime les données d'une conversation
 */
export async function clearConversationData(channelId: string): Promise<void> {
    const states = (await DataStore.get(STATES_KEY, {})) as Record<string, ConversationState>;
    const profiles = (await DataStore.get(PROFILES_KEY, {})) as Record<string, StyleProfile>;
    
    delete states[channelId];
    delete profiles[channelId];
    
    await DataStore.set(STATES_KEY, states);
    await DataStore.set(PROFILES_KEY, profiles);
}
