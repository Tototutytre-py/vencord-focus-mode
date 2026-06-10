# FocusMode + AI Assistant Plugin

🎯 **FocusMode** : Masquez les serveurs et la barre latérale en un clic pour vous concentrer sur le chat.

🤖 **AI Assistant** : Activez un assistant IA par conversation pour générer des réponses dans votre style personnel.

## 🌟 Fonctionnalités

### Mode Focus (existant)

- ⊞/⊟ Bouton principal pour activer/désactiver le mode focus
- 🔒 Verrouillage avec mot de passe optionnel
- 👁/👁‍🗨 Floutage du chat optionnel
- G/G+ Masquage des serveurs optionnel
- S/S+ Masquage de la barre latérale optionnel
- Support multilingue (EN, PT-BR, FR)

### Assistant IA (nouveau) ✨

#### 🎛️ Configuration flexible
- Soutien de **2 fournisseurs IA** :
  - **OpenAI** (cloud) : gpt-3.5-turbo, gpt-4, etc.
  - **Ollama** (local) : exécution privée sans dépendances externes
- Configuration avancée :
  - Nombre de messages pour l'analyse du style
  - Longueur maximale des réponses
  - Mise à jour automatique du profil de style

#### 🧠 Profil d'écriture intelligent

L'assistant apprend automatiquement **votre style personnel** :

✅ Longueur moyenne des messages
✅ Fréquence d'utilisation des emojis
✅ Tutoiement vs vouvoiement
✅ Fréquence de ponctuation
✅ Vocabulaire récurrent
✅ Ton général

Le profil est :
- **Construit automatiquement** à partir de vos messages
- **Mis en cache** pour performance
- **Mis à jour progressivement** au fil du temps
- **Sauvegardé par conversation**

#### 💬 Génération de réponses

Lorsqu'un nouveau message arrive dans une conversation où l'IA est activée :

1. ✅ Récupère le contexte récent (derniers messages)
2. ✅ Récupère votre profil de style
3. ✅ Construit un prompt qui demande à l'IA de répondre dans VOTRE style
4. ✅ Appelle le fournisseur IA configuré
5. ✅ **Génère une proposition de réponse**
6. ✅ **L'insère dans la zone de saisie** (sans envoyer)
7. ✅ Vous pouvez l'éditer ou l'annuler

### 🎨 Interface utilisateur

**Bouton 🤖 dans la barre de saisie** :

```
┌────────────────────────────────────────┐
│  Tapez un message...    [emoji] [🤖] [↑] │
└────────────────────────────────────────┘
```

**Styles visuels** :
- 🤖 Gris (#72767d) quand **désactivé**
- 🤖 Vert (#43b581) quand **activé**

**Tooltip** :
- "Assistant IA désactivé" (inactif)
- "Assistant IA activé pour ce salon" (actif)

### 💾 Persistance

- État sauvegardé **par conversation** (channelId)
- Persiste après redémarrage de Discord
- Chaque salon/DM peut avoir son propre état

## 📋 Installation

### Pour Vencord

1. Cloner/télécharger le plugin dans `~/.config/Vencord/plugins/`
2. Redémarrer Discord
3. Activer le plugin dans les paramètres Vencord

### Structure attendue

```
~/.config/Vencord/plugins/vencord-focus-mode/
├── index.tsx
├── README.md
├── ARCHITECTURE.md
└── aiAssistant/
    ├── settings.ts
    ├── storage.ts
    ├── styleProfiler.ts
    ├── aiProvider.ts
    ├── messageProcessor.ts
    ├── messageReceiver.ts
    └── ui.ts
```

## ⚙️ Configuration

### Mode Focus

Dans les paramètres du plugin :

- **Language** : Sélectionner la langue (EN, PT-BR, FR)
- **Show Guild Toggle** : Bouton séparé pour les serveurs
- **Show Sidebar Toggle** : Bouton séparé pour la barre latérale
- **Show Blur Toggle** : Bouton séparé pour le floutage
- **Show Lock Toggle** : Bouton de verrouillage avec mot de passe
- **Lock Password** : Mot de passe pour déverrouiller

### Assistant IA

#### Activation
- **Enable AI Assistant** : Cocher pour activer la feature

#### Choix du fournisseur

**Option 1 : Ollama (Recommandé pour démarrer)**

```
AI Provider: Ollama (Local)
Ollama Server URL: http://localhost:11434
Ollama Model: mistral
```

Installation :
```bash
# Sur macOS/Linux
curl https://ollama.ai/install.sh | sh

# Lancer un modèle
ollama run mistral
```

Modèles populaires :
- `mistral` : Rapide et efficace
- `neural-chat` : Optimisé pour la conversation
- `llama2` : Généraliste
- `orca-mini` : Léger

**Option 2 : OpenAI (Plus puissant)**

```
AI Provider: OpenAI
OpenAI API Key: sk-...
OpenAI Model: gpt-3.5-turbo
```

Obtenir une clé API :
1. Aller sur https://platform.openai.com/api/keys
2. Créer une nouvelle clé
3. Copier-coller dans les paramètres

#### Tuning

- **Messages for Style Profile** : Nombre de vos messages à analyser (5-100)
  - Plus élevé = profil plus précis mais plus lent à construire
  - Recommandé : 20-30
  
- **Max Context Messages** : Nombre de messages récents à utiliser (5-20)
  - Plus élevé = meilleur contexte mais plus lent
  - Recommandé : 10
  
- **Max Response Length** : Longueur maximale de la réponse (100-2000 caractères)
  - Recommandé : 500
  
- **Auto-update Style Profile** : Met à jour automatiquement votre profil
  - Recommandé : Activé
  
- **Update Interval** : Mettre à jour le profil tous les X messages
  - Recommandé : 5

## 🎯 Utilisation

### Mode Focus

1. Cliquez sur **⊞** dans la barre supérieure pour activer le mode focus
2. La barre change couleur : **⊞** (rouge, actif) ou **⊟** (bleu, inactif)
3. Utilisez les boutons optionnels pour plus de contrôle

### Assistant IA

#### Activation par conversation

1. Allez dans une conversation (salon, DM, groupe)
2. Cliquez sur le bouton **🤖** dans la barre de saisie
3. Le bouton devient **vert** quand l'IA est activée
4. Pour ce salon seulement, l'IA génèrera des réponses

#### Utilisation

1. Quelqu'un écrit un message dans le salon
2. L'IA analyse le message et votre style personnel
3. Une réponse suggérée apparaît dans la zone de saisie
4. Vous pouvez :
   - ✅ Modifier le texte et l'envoyer
   - ✅ Appuyer sur Entrée pour l'envoyer directement
   - ✅ Supprimer et écrire vous-même
   - ❌ La réponse n'est JAMAIS envoyée automatiquement

#### Gestion par salon

- Chaque salon a son **propre profil de style**
- Chaque salon a son **propre état** (activé/désactivé)
- Les profils sont indépendants les uns des autres
- Vous pouvez activer l'IA dans le salon A mais pas le B

## 🔒 Vie privée et sécurité

### Données locales
- Votre profil de style est sauvegardé **localement**
- Les messages analysés ne quittent pas votre ordinateur
- Les états d'activation sont sauvegardés **localement**

### Données envoyées à l'IA
**Avec Ollama (Local)** : Rien n'est envoyé à l'extérieur

**Avec OpenAI** : 
- Uniquement le message actuel + contexte récent (pas l'analyse de style)
- Selon les conditions d'utilisation d'OpenAI
- Clé API traitée comme un secret

## 🐛 Dépannage

### L'IA ne génère aucune réponse

**Vérifier** :
1. L'Assistant IA est activé dans les paramètres
2. Le bouton 🤖 est vert pour ce salon
3. La connexion au fournisseur IA fonctionne

**Ollama** :
```bash
# Vérifier que Ollama est lancé
curl http://localhost:11434/api/tags

# Relancer si nécessaire
ollama run mistral
```

**OpenAI** :
- Vérifier la clé API (platform.openai.com)
- Vérifier le crédit disponible
- Vérifier que le modèle existe (gpt-3.5-turbo, gpt-4)

### Le profil de style ne semble pas fonctionner

1. **Vérifier les paramètres** :
   - "Messages for Style Profile" > 0
   - "Auto-update Style Profile" activé

2. **Reconstruire le profil** :
   - Écrire quelques messages dans le salon
   - Attendre que le profil se construise

### Le bouton n'apparaît pas

1. Vérifier que "Enable AI Assistant" est coché
2. Redémarrer Discord
3. Vérifier les erreurs dans la console DevTools (F12)

## 📊 Diagnostic

Ouvrir DevTools (F12) et consulter la console pour les logs de debug :

```javascript
// Vérifier l'état d'une conversation
console.log(vc.plugins.FocusMode);

// Voir les erreurs
// Chercher "AI Assistant Error" dans la console
```

## 🚀 Améliorations futures possibles

- [ ] Support de plus de fournisseurs (Claude, Cohere)
- [ ] Profiles personnalisés multiples
- [ ] Génération en temps réel (streaming)
- [ ] Personnalisation avancée des prompts
- [ ] Interface graphique pour configurer les fournisseurs
- [ ] Support des images/pièces jointes
- [ ] Historique des réponses générées

## 📝 Licence

GPL-3.0-or-later (Vencord standard)

## 🙏 Crédits

Plugin développé pour Vencord
Basé sur l'architecture modulaire pour faciliter la maintenance

---

### ⭐ Astuces

- Utilisez **Ollama** pour une meilleure vie privée et pas d'API
- Plus de messages = profil plus précis (20-50 messages recommandé)
- Testez les paramètres progressivement pour trouver ce qui vous convient
- Désactivez l'IA dans les salons publics si vous ne voulez pas de suggestions

- Smooth CSS transitions

## Preview

| Normal | Focus Mode |
|--------|-----------|
| Full Discord UI | Clean chat-only view |

## Installation

### As a Vencord userplugin

1. Clone this repo into your Vencord `src/userplugins/` folder:

```bash
cd path/to/Vencord/src/userplugins
git clone https://github.com/ferpgshy/vencord-focus-mode.git focusMode
```

2. Build Vencord:

```bash
pnpm build
```

3. Restart Discord (Ctrl+R)

4. Enable **FocusMode** in Settings → Plugins

## Settings

| Setting | Description |
|---------|-------------|
| Language | English / Português (BR) |
| Show Guild Toggle | Adds a separate "G" button to toggle the server list |
| Show Sidebar Toggle | Adds a separate "S" button to toggle the sidebar |

## License

GPL-3.0-or-later — See [Vencord License](https://github.com/Vendicated/Vencord/blob/main/LICENSE)
