# Projet d'Authentification Node.js TypeScript

Un projet Node.js avec TypeScript et ESLint configurés pour le développement d'un système d'authentification.

## 🚀 Installation

1. Installer les dépendances :
```bash
npm install
```

2. Compiler le projet :
```bash
npm run build
```

3. Démarrer le serveur :
```bash
npm start
```

## 🛠️ Scripts disponibles

- `npm run dev` - Démarrer en mode développement avec ts-node
- `npm run build` - Compiler TypeScript vers JavaScript
- `npm run start` - Démarrer le serveur compilé
- `npm run watch` - Compiler en mode watch
- `npm run lint` - Vérifier le code avec ESLint
- `npm run lint:fix` - Corriger automatiquement les erreurs ESLint
- `npm run clean` - Supprimer le dossier dist

## 📁 Structure du projet

```
├── src/           # Code source TypeScript
├── dist/          # Code JavaScript compilé (généré)
├── node_modules/  # Dépendances (généré)
├── .eslintrc.js   # Configuration ESLint
├── tsconfig.json  # Configuration TypeScript
├── package.json   # Dépendances et scripts
└── README.md      # Documentation
```

## 🔧 Configuration

### TypeScript
Le projet utilise une configuration TypeScript stricte avec :
- Target ES2020
- Module CommonJS
- Strict mode activé
- Source maps activées

### ESLint
Configuration ESLint avec :
- Règles TypeScript recommandées
- Règles de formatage (indentation, guillemets, etc.)
- Détection des promesses non gérées
- Vérification des types stricts

## 🌐 API

Le serveur démarre sur le port 3000 par défaut avec les routes suivantes :

- `GET /` - Message de bienvenue
- `GET /health` - Statut de santé du serveur

## 📝 Développement

Pour développer :
1. Utilisez `npm run dev` pour le développement en temps réel
2. Utilisez `npm run lint` pour vérifier votre code
3. Utilisez `npm run build` avant de déployer

## 🚀 Déploiement

1. Compilez le projet : `npm run build`
2. Démarrez le serveur : `npm start`
