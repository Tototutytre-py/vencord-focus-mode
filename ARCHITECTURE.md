# FocusMode + AI Assistant Plugin

Plugin Vencord complet combinant le Mode Focus et l'Assistant IA par conversation.

## Architecture

Le plugin est organisé en modules distincts :

### Structure des fichiers

```
/workspaces/vencord-focus-mode/
├── index.tsx                          # Plugin principal
├── README.md                          # Documentation utilisateur
└── aiAssistant/
    ├── settings.ts                    # Configuration des paramètres
    ├── storage.ts                     # Gestion du stockage par canal
    ├── styleProfiler.ts               # Analyse du style d'écriture
    ├── aiProvider.ts                  # Fournisseurs IA (OpenAI, Ollama)
    ├── messageProcessor.ts            # Traitement des messages
    ├── messageReceiver.ts             # Réception et traitement des messages
    └── ui.ts                          # Interface utilisateur (bouton)
```

## Modules

### 1. **settings.ts** - Paramètres de configuration

Définit tous les paramètres disponibles dans les paramètres du plugin :

- **AI Provider Selection** : Choix entre OpenAI et Ollama
- **API Keys** : Configuration pour OpenAI
- **Server URLs** : Configuration pour Ollama
- **Tuning Parameters** : Contrôle du comportement de l'IA
  - Nombre de messages pour l'analyse du style
  - Longueur maximale des réponses
  - Mise à jour automatique du profil

### 2. **storage.ts** - Gestion du stockage

Utilise `DataStore` de Vencord pour persister les données :

- **État par conversation** (`ConversationState`)
  - `enabled`: Activation de l'IA pour ce canal
  - `lastUpdated`: Timestamp de la dernière mise à jour

- **Profil de style** (`StyleProfile`)
  - `messageCount`: Nombre de messages analysés
  - `averageLength`: Longueur moyenne des messages
  - `emojiFrequency`: Fréquence d'utilisation des emojis
  - `formalityScore`: Score de formalité (0-1)
  - `punctuationScore`: Fréquence de la ponctuation
  - `commonWords`: Map des mots récurrents
  - `lastUpdated`: Timestamp de la dernière mise à jour

Les données sont organisées par `channelId`, permettant une gestion indépendante par conversation.

### 3. **styleProfiler.ts** - Analyse du style d'écriture

Analyse les messages de l'utilisateur pour créer un profil unique :

#### Fonctionnalités d'analyse :

1. **Longueur moyenne des messages** : Détermine le verbosité
2. **Fréquence des emojis** : Compte les emojis par message
3. **Formalité** : Détecte le tutoiement/vouvoiement et le ton
4. **Ponctuation** : Mesure l'utilisation de la ponctuation
5. **Vocabulaire récurrent** : Garde les 50 mots les plus fréquents

#### Fonctions principales :

- `buildStyleProfile(messages)` : Crée un profil initial
- `mergeStyleProfiles(existing, new)` : Fusionne progressivement les profils
- `extractEmojis()`, `calculateFormalityScore()`, `calculatePunctuationScore()`

### 4. **aiProvider.ts** - Fournisseurs IA

Interface abstraite `AIProvider` avec deux implémentations :

#### OpenAI Provider
```typescript
new OpenAIProvider(apiKey, model)
- Utilise l'API OpenAI
- Modèles: gpt-3.5-turbo, gpt-4, etc.
- Requiert une clé API valide
```

#### Ollama Provider
```typescript
new OllamaProvider(baseUrl, model)
- Exécution locale du modèle
- Modèles: mistral, neural-chat, etc.
- Pas de dépendances externes
```

Factory `createAIProvider()` pour créer le bon provider selon la configuration.

### 5. **messageProcessor.ts** - Traitement des messages

Construit les prompts et génère les réponses :

1. **buildSystemPrompt()** : Crée un prompt système qui décrit le style attendu
   - Adapte la longueur, fréquence des emojis, formalité, etc.
   - Utilise le profil de style pour guider l'IA

2. **generateAIResponse()** : Génère une réponse IA
   - Récupère le contexte récent
   - Combine avec le profil de style
   - Appelle le fournisseur IA

### 6. **messageReceiver.ts** - Classe MessageReceiver

Gère la réception des messages et le flux complet :

```typescript
class MessageReceiver {
  setAIProvider(provider)        // Configurer le fournisseur
  handleMessageReceived()        // Traiter un message reçu
  fetchUserMessages()            // Récupérer les messages récents
  resetCache()                   // Réinitialiser le cache
}
```

Processus complet :
1. Vérifier si l'IA est activée pour le canal
2. Récupérer ou construire le profil de style
3. Mettre à jour le profil si nécessaire
4. Générer la réponse IA
5. Émettre l'événement de réponse

### 7. **ui.ts** - Interface utilisateur

Gère le bouton 🤖 dans la barre de saisie :

**Styles visuels** :
- 🤖 Emoji fixe
- Gris (#72767d) quand désactivé
- Vert (#43b581) quand activé

**Fonctionnalités** :
- Toggle ON/OFF par canal
- Tooltip informatif
- Accessibilité (ARIA labels, keyboard navigation)
- Persistance de l'état

**Méthodes** :
- `injectAIAssistantButton()` : Ajoute le bouton à la barre
- `removeAIAssistantButton()` : Supprime le bouton
- `updateAIAssistantButtonState()` : Met à jour l'état visuel

### 8. **index.tsx** - Plugin principal

Intègre tous les modules et expose aux APIs Vencord.

#### Initialisation :
- `initializeAIAssistant()` : Configure le fournisseur IA
- `setupAIAssistantButton()` : Ajoute le bouton à l'UI
- `watchChannelChanges()` : Détecte les changements de canal
- `detectCurrentChannel()` : Trouve le canal actuel

#### Cycle de vie :
- **start()** : Initialise le plugin et les features
- **stop()** : Nettoie les ressources

## Flux de données

```
Message reçu
    ↓
MessageReceiver.handleMessageReceived()
    ↓
Récupérer/construire StyleProfile
    ↓
Récupérer contexte récent
    ↓
buildSystemPrompt() + profil
    ↓
AIProvider.generateResponse()
    ↓
insertResponseIntoInput() [sans envoyer]
    ↓
Utilisateur peut éditer/envoyer ou annuler
```

## Utilisation

### Configuration recommandée :

**Pour OpenAI** :
1. Obtenir une clé API sur https://platform.openai.com
2. Dans les paramètres du plugin :
   - Provider: OpenAI
   - API Key: Coller la clé
   - Model: gpt-3.5-turbo (ou gpt-4)

**Pour Ollama** :
1. Installer Ollama depuis https://ollama.ai
2. Lancer : `ollama run mistral`
3. Dans les paramètres :
   - Provider: Ollama
   - URL: http://localhost:11434
   - Model: mistral (ou autre modèle disponible)

### Utilisation par conversation :

1. Cliquer sur le bouton 🤖 dans la barre de saisie
2. Le bouton devient vert quand l'IA est activée
3. Les nouveaux messages déclenchent la génération de réponses
4. Les réponses apparaissent dans la zone de saisie (éditable)

## Optimisations et améliorations futures

1. **Cache du profil** : Évite de recalculer après chaque message
2. **Rate limiting** : Éviter de surcharger les APIs
3. **Gestion d'erreurs** : Failover gracieux si l'IA n'est pas disponible
4. **Webhooks** : Intégration plus profonde avec Discord
5. **Personnalisation avancée** : Templates de prompt personnalisés
6. **Plusieurs styles** : Profils différents par utilisateur

## Dépendances

- Vencord API (settings, storage, UI hooks)
- APIs externes : OpenAI API ou serveur Ollama local
- Aucune dépendance npm supplémentaire

## Sécurité

- Les clés API OpenAI sont sauvegardées comme secrètes (secrets: true)
- Les données de profil sont stockées localement
- Pas de transmission de données personnelles à des tiers (sauf OpenAI si choisi)

## Débogage

Accéder à la console du navigateur (DevTools) pour voir les logs :
```javascript
// Vérifier l'état d'une conversation
await vc.plugins.FocusMode.getConversationState("channel-id")

// Vérifier le profil de style
await vc.plugins.FocusMode.getStyleProfile("channel-id")
```
