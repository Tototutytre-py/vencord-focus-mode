# 🚀 Guide de Démarrage Rapide

## Installation rapide du plugin

### 1. Cloner/télécharger dans Vencord

```bash
cd ~/.config/Vencord/plugins/
git clone https://github.com/your-repo/vencord-focus-mode.git
# OU télécharger et extraire le ZIP
```

### 2. Redémarrer Discord

- Fermer complètement Discord
- Relancer Discord
- Le plugin devrait être chargé

### 3. Vérifier l'installation

- Ouvrir les paramètres Vencord (Ctrl+,)
- Aller à "Plugins"
- Chercher "FocusMode"
- Activer le plugin

## Configuration rapide

### Mode Focus (fonctionne d'emblée)

1. Paramètres du plugin : Vous verrez des options pour language, boutons optionnels, etc.
2. Le bouton ⊞ apparaît dans la barre supérieure
3. Cliquez dessus pour activer/désactiver

### Assistant IA (configuration requise)

#### Avec Ollama (recommandé au départ)

1. **Installer Ollama** :
   ```bash
   # macOS
   brew install ollama
   
   # Linux
   curl https://ollama.ai/install.sh | sh
   
   # Ou télécharger depuis https://ollama.ai
   ```

2. **Lancer un modèle** :
   ```bash
   ollama run mistral
   ```
   Cela va télécharger et lancer le modèle Mistral (~4GB)

3. **Configurer dans le plugin** :
   - Ouvrir les paramètres du plugin
   - Cocher "Enable AI Assistant"
   - Provider: `Ollama (Local)`
   - URL: `http://localhost:11434`
   - Model: `mistral`

4. **C'est prêt !** 🎉

#### Avec OpenAI (option cloud)

1. **Obtenir une clé API** :
   - Aller sur https://platform.openai.com/api/keys
   - Se connecter (créer compte si nécessaire)
   - "Create new secret key"
   - Copier la clé

2. **Configurer dans le plugin** :
   - Ouvrir les paramètres du plugin
   - Cocher "Enable AI Assistant"
   - Provider: `OpenAI`
   - API Key: Coller la clé secrète
   - Model: `gpt-3.5-turbo` (ou `gpt-4` si vous avez l'accès)

3. **Vérifier le crédit** :
   - Sur https://platform.openai.com/account/billing/overview
   - Vous devez avoir du crédit disponible (free tier: $5 gratuit pendant 3 mois)

## Première utilisation

### Tester le mode Focus

1. Aller dans un salon
2. Cliquer sur ⊞ en haut à gauche
3. Vérifier que tout est floutée/masqué

### Tester l'Assistant IA

1. Aller dans un salon
2. Cliquer sur le bouton 🤖 dans la barre de saisie
   - Il doit devenir vert
3. Attendre qu'un autre utilisateur (ou vous sur un compte test) écrive un message
4. L'IA devrait générer une réponse dans la barre de saisie
5. Éditer ou envoyer la réponse

## Configuration recommandée

### Paramètres par défaut

```
Provider: Ollama
Style Messages: 20
Max Context: 10
Max Response: 500
Auto-update: ON
Update Interval: 5
```

### Pour de meilleures réponses

Augmentez :
- **Style Messages** à 50 (pour mieux capturer votre style)
- **Max Context** à 15 (pour plus de contexte)

### Pour moins de latence

Diminuez :
- **Style Messages** à 10
- **Max Context** à 5

## Modèles Ollama populaires

```bash
ollama run mistral      # Rapide, bon qualité
ollama run neural-chat  # Optimisé chat
ollama run llama2       # Généraliste
ollama run dolphin-mix  # Créatif
ollama run orca-mini    # Léger et rapide
```

Pour lister les modèles disponibles :
```bash
curl http://localhost:11434/api/tags
```

## Dépannage rapide

### "Le bouton IA n'apparaît pas"
- ✅ "Enable AI Assistant" est coché ?
- ✅ Vous êtes dans un canal (pas la page d'accueil) ?
- ✅ Redémarrer Discord

### "L'IA ne génère rien"
- ✅ Ollama lancé ? `curl http://localhost:11434/api/tags`
- ✅ Clé OpenAI valide ?
- ✅ Vérifier la console (F12 > Console) pour les erreurs

### "Les réponses ne sont pas dans mon style"
- Écrire plus de messages dans le salon pour que le profil se renforce
- Augmenter "Style Messages" dans les paramètres

## Prochaines étapes

Après avoir configuré et testé :

1. Lire le [README.md](./README.md) pour toutes les fonctionnalités
2. Consulter [ARCHITECTURE.md](./ARCHITECTURE.md) pour comprendre le code
3. Customizer les paramètres selon vos besoins
4. Essayer différents modèles Ollama
5. Reporter les bugs sur GitHub

## Support

- **Questions** : Voir la section FAQ du README
- **Bugs** : Ouvrir une issue sur GitHub
- **Code source** : Voir ARCHITECTURE.md

---

**Conseil** : Commencez avec **Ollama** pour un déploiement facile et privé. Une fois confortable, vous pouvez essayer OpenAI pour une meilleure qualité.
