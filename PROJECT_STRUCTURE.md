# 📁 Structure du Projet Final

```
vencord-focus-mode/
│
├── 📄 index.tsx                          # Plugin principal (Vencord entry point)
│                                          # - Intègre FocusMode + AI Assistant
│                                          # - Gère le lifecycle du plugin
│                                          # - ~420 lignes
│
├── 📄 README.md                          # Guide utilisateur complet
│                                          # - Installation, configuration, utilisation
│                                          # - Dépannage, vie privée
│
├── 📄 ARCHITECTURE.md                    # Documentation technique détaillée
│                                          # - Explique chaque module
│                                          # - Flux de données
│                                          # - Améliorations possibles
│
├── 📄 QUICKSTART.md                      # Guide de démarrage rapide
│                                          # - Installation en 3 étapes
│                                          # - Configuration Ollama/OpenAI
│                                          # - FAQ rapide
│
└── 📂 aiAssistant/                       # Dossier contenant tous les modules IA
    │
    ├── 📄 settings.ts                    # Paramètres de configuration
    │                                      # - aiAssistantSettings
    │                                      # - ~70 lignes
    │
    ├── 📄 storage.ts                     # Gestion du stockage persistant
    │                                      # - Interfaces: ConversationState, StyleProfile
    │                                      # - Fonctions: get/setConversationState, get/setStyleProfile
    │                                      # - ~95 lignes
    │
    ├── 📄 styleProfiler.ts               # Analyse du style d'écriture
    │                                      # - buildStyleProfile()
    │                                      # - mergeStyleProfiles()
    │                                      # - Fonctions d'analyse (emojis, formalité, ponctuation)
    │                                      # - ~200 lignes
    │
    ├── 📄 aiProvider.ts                  # Fournisseurs IA abstraits
    │                                      # - Interface AIProvider
    │                                      # - OpenAIProvider (api.openai.com)
    │                                      # - OllamaProvider (localhost)
    │                                      # - createAIProvider() factory
    │                                      # - ~140 lignes
    │
    ├── 📄 messageProcessor.ts            # Traitement des messages
    │                                      # - buildSystemPrompt()
    │                                      # - generateAIResponse()
    │                                      # - getRecentMessages()
    │                                      # - ~90 lignes
    │
    ├── 📄 messageReceiver.ts             # Classe MessageReceiver (orchestration)
    │                                      # - Gère le flux complet
    │                                      # - handleMessageReceived()
    │                                      # - fetchUserMessages()
    │                                      # - ~140 lignes
    │
    └── 📄 ui.ts                          # Interface utilisateur (bouton)
                                           # - injectAIAssistantButton()
                                           # - removeAIAssistantButton()
                                           # - updateAIAssistantButton()
                                           # - ~165 lignes
```

## 📊 Statistiques du code

### Modules IA
| Module | Lignes | Responsabilité |
|--------|--------|-----------------|
| settings.ts | ~70 | Configuration Vencord |
| storage.ts | ~95 | Persistance des données |
| styleProfiler.ts | ~200 | Analyse du style |
| aiProvider.ts | ~140 | Fournisseurs IA |
| messageProcessor.ts | ~90 | Traitement des messages |
| messageReceiver.ts | ~140 | Orchestration complète |
| ui.ts | ~165 | Interface utilisateur |
| **TOTAL** | **~900** | **Logique IA complète** |

### Documentation
| Fichier | Sections | Contenu |
|---------|----------|---------|
| README.md | 15+ | Guide complet utilisateur |
| ARCHITECTURE.md | 20+ | Détails techniques |
| QUICKSTART.md | 10+ | Installation rapide |

## 🔗 Dépendances et imports

### Modules internes
```
index.tsx
  ├── aiAssistant/settings.ts
  ├── aiAssistant/ui.ts
  ├── aiAssistant/aiProvider.ts
  ├── aiAssistant/messageReceiver.ts
  │   ├── aiAssistant/aiProvider.ts
  │   ├── aiAssistant/styleProfiler.ts
  │   ├── aiAssistant/messageProcessor.ts
  │   └── aiAssistant/storage.ts
  └── ...

styleProfiler.ts
  └── storage.ts (pour l'interface StyleProfile)

messageProcessor.ts
  └── storage.ts (pour l'interface StyleProfile)

messageReceiver.ts
  ├── aiAssistant/aiProvider.ts
  ├── aiAssistant/styleProfiler.ts
  ├── aiAssistant/messageProcessor.ts
  └── aiAssistant/storage.ts
```

### APIs externes
```
aiProvider.ts
  ├── fetch → https://api.openai.com/v1/chat/completions (OpenAI)
  └── fetch → http://localhost:11434/api/generate (Ollama)

storage.ts
  └── @api/index → DataStore (Vencord)

index.tsx
  ├── @api/Settings → definePluginSettings
  ├── @utils/constants → Devs
  └── @utils/types → definePlugin, OptionType
```

## 🎯 Flux de contrôle

### Initialisation du plugin
```
start()
  ├── startObserver() [FocusMode]
  ├── injectButtons() [FocusMode]
  ├── initializeAIAssistant()
  │   ├── createAIProvider()
  │   └── new MessageReceiver()
  ├── watchChannelChanges()
  └── setupAIAssistantButton()
```

### Génération d'une réponse IA
```
handleMessageReceived(channelId, message, sender)
  ├── Vérifier si IA activée pour ce canal
  ├── Récupérer/construire StyleProfile
  │   ├── fetchUserMessages(20 derniers)
  │   └── buildStyleProfile() ou mergeStyleProfiles()
  ├── Récupérer contexte récent
  ├── buildSystemPrompt() avec profil
  ├── aiProvider.generateResponse()
  │   ├── [OpenAI] fetch à api.openai.com
  │   └── [Ollama] fetch à localhost:11434
  └── insertResponseIntoInput() [pas d'envoi]
```

### État utilisateur
```
Bouton 🤖
  ├── Gris (#72767d) → inactif
  └── Vert (#43b581) → activé pour ce canal

DataStore
  ├── vc-aiassistant:states
  │   └── { channelId: ConversationState }
  └── vc-aiassistant:profiles
      └── { channelId: StyleProfile }
```

## 🔄 Points d'intégration Vencord

1. **definePluginSettings** : Paramètres UI
2. **DataStore** : Persistance locale
3. **MutationObserver** : Détection UI/changements de canal
4. **Document.querySelector** : Injection de bouton
5. **Fetch API** : Appels IA externes

## 💾 Sérialisation des données

### ConversationState (JSON)
```json
{
  "enabled": true,
  "lastUpdated": 1234567890
}
```

### StyleProfile (partiel - commonWords sérialisée)
```json
{
  "messageCount": 25,
  "averageLength": 145,
  "emojiFrequency": 0.08,
  "formalityScore": 0.45,
  "punctuationScore": 0.15,
  "commonWords": {
    "lol": 12,
    "cool": 8,
    "yeah": 7
  },
  "lastUpdated": 1234567890
}
```

## 🚀 Fichiers prêts pour production

✅ index.tsx - Plugin principal complet
✅ aiAssistant/settings.ts - Configuration
✅ aiAssistant/storage.ts - Persistance
✅ aiAssistant/styleProfiler.ts - Analyse du style
✅ aiAssistant/aiProvider.ts - Intégration IA
✅ aiAssistant/messageProcessor.ts - Traitement
✅ aiAssistant/messageReceiver.ts - Orchestration
✅ aiAssistant/ui.ts - Interface utilisateur
✅ README.md - Documentation utilisateur
✅ ARCHITECTURE.md - Documentation technique
✅ QUICKSTART.md - Guide de démarrage

## 📦 Installation dans Vencord

```bash
# Copier dans le dossier des plugins Vencord
cp -r vencord-focus-mode ~/.config/Vencord/plugins/

# Redémarrer Discord
# Activer le plugin dans les paramètres
```

## ✨ Fonctionnalités prêtes à utiliser

- ✅ Mode Focus (existant, non modifié)
- ✅ Bouton IA par conversation
- ✅ Analyse du style d'écriture
- ✅ Génération de réponses adaptées
- ✅ Support OpenAI et Ollama
- ✅ Persistance par conversation
- ✅ Configuration complète
- ✅ UI intuitive avec tooltips
- ✅ Gestion d'erreurs robuste

**Le plugin est prêt pour production! 🎉**
