/**
 * Interface utilisateur pour le bouton de l'Assistant IA
 * Affiche un bouton dans la barre de saisie des messages
 */

import { getConversationState, setConversationState } from "./storage";

// Variables d'état
let aiAssistantButton: HTMLDivElement | null = null;
let currentChannelId: string | null = null;
let aiStates: Map<string, boolean> = new Map();

/**
 * Crée le bouton de l'Assistant IA avec styling approprié
 */
function createAIAssistantButton(
    label: string,
    onClick: () => void
): HTMLDivElement {
    const button = document.createElement("div");
    button.className = "vc-aiassistant-btn";
    button.setAttribute("role", "button");
    button.setAttribute("tabindex", "0");
    button.setAttribute("aria-label", label);

    Object.assign(button.style, {
        display: "inline-flex",
        justifyContent: "center",
        alignItems: "center",
        width: "32px",
        height: "32px",
        borderRadius: "4px",
        cursor: "pointer",
        fontSize: "16px",
        transition: "all 0.15s ease",
        marginLeft: "4px",
        flexShrink: "0",
        border: "none",
        padding: "0",
    });

    button.textContent = "🤖";
    button.addEventListener("click", onClick);
    
    // Hover effect
    button.addEventListener("mouseenter", () => {
        button.style.opacity = "0.85";
    });
    
    button.addEventListener("mouseleave", () => {
        button.style.opacity = "1";
    });

    // Keyboard accessibility
    button.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onClick();
        }
    });

    return button;
}

/**
 * Met à jour l'apparence du bouton selon l'état
 */
function updateAIAssistantButton(channelId: string, enabled: boolean) {
    if (!aiAssistantButton) return;

    aiStates.set(channelId, enabled);

    const tooltip = enabled
        ? `🤖 Assistant IA activé pour ce salon`
        : `🤖 Assistant IA désactivé`;

    aiAssistantButton.title = tooltip;
    aiAssistantButton.setAttribute("aria-label", tooltip);

    if (enabled) {
        // Bouton vert quand activé
        aiAssistantButton.style.backgroundColor = "#43b581";
    } else {
        // Bouton gris quand désactivé
        aiAssistantButton.style.backgroundColor = "#72767d";
    }
}

/**
 * Ajoute le bouton à la barre de saisie
 */
export function injectAIAssistantButton(
    channelId: string,
    onToggle: (channelId: string, enabled: boolean) => void
) {
    // Récupérer le conteneur des boutons (toolbar)
    const toolbar = document.querySelector<HTMLElement>('[class*="toolbar_"]');
    if (!toolbar) return;

    // Vérifier si le bouton existe déjà
    if (aiAssistantButton && toolbar.contains(aiAssistantButton)) {
        // Mettre à jour le bouton s'il existe pour un autre canal
        if (currentChannelId !== channelId) {
            currentChannelId = channelId;
            const isEnabled = aiStates.get(channelId) ?? false;
            updateAIAssistantButton(channelId, isEnabled);
        }
        return;
    }

    currentChannelId = channelId;
    const isEnabled = aiStates.get(channelId) ?? false;

    // Créer le bouton
    aiAssistantButton = createAIAssistantButton("Toggle AI Assistant", async () => {
        if (!currentChannelId) return;

        const newState = !aiStates.get(currentChannelId);
        await setConversationState(currentChannelId, newState);
        updateAIAssistantButton(currentChannelId, newState);
        onToggle(currentChannelId, newState);
    });

    updateAIAssistantButton(channelId, isEnabled);

    // Chercher le conteneur approprié pour injecter le bouton
    // Généralement avant le bouton "envoyer"
    const existingButton = toolbar.querySelector('[class*="buttonContainer_"]');
    if (existingButton) {
        existingButton.parentElement?.insertBefore(aiAssistantButton, existingButton);
    } else {
        toolbar.appendChild(aiAssistantButton);
    }
}

/**
 * Supprime le bouton de la barre de saisie
 */
export function removeAIAssistantButton() {
    if (aiAssistantButton) {
        aiAssistantButton.remove();
        aiAssistantButton = null;
    }
}

/**
 * Met à jour l'état du bouton pour le canal actuel
 */
export function updateAIAssistantButtonState(channelId: string, enabled: boolean) {
    currentChannelId = channelId;
    updateAIAssistantButton(channelId, enabled);
}

/**
 * Récupère l'état actuel du bouton
 */
export function isAIAssistantEnabled(channelId: string): boolean {
    return aiStates.get(channelId) ?? false;
}

/**
 * Charge les états sauvegardés depuis le stockage
 */
export async function loadAIAssistantStates() {
    // Cette fonction sera implémentée en conjunction avec le stockage principal
    console.log("AI Assistant states loaded");
}
