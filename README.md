# work-flow-editor

Interface qui permet de construire visuellement un scénario marketing composé d'étapes conditionnelles pouvant s'exécuter séquentiellement ou en parallèle, puis de le simuler côté client.

## Prérequis

- [Node.js](https://nodejs.org/) (version 20+)
- npm

## Installation

```bash
cd front-work-flow
npm install
```

## Lancer l'application

```bash
npm start
```

Puis ouvre `http://localhost:4200` dans ton navigateur. L'application se recharge automatiquement à chaque modification du code.

## Build

```bash
npm run build
```

Les fichiers compilés sont générés dans `front-work-flow/dist/`.

## Tests

```bash
npm test
```

## Utilisation

### Créer une étape

> **Astuce** : les cases à cocher des transitions ne proposent que les étapes déjà créées. Il est donc préférable de créer d'abord toutes les étapes du scénario (sans se soucier des transitions), puis de revenir les éditer une par une pour choisir leurs transitions `onSuccess`/`onFailure`.

Dans le panneau **Nouvelle étape** :

1. Renseigne un **nom** pour l'étape.
2. Choisis un **type** : `start`, `sms`, `email`, `custom` ou `end`.
   - Une seule étape `start` est autorisée par scénario (le type disparaît de la liste une fois qu'une étape `start` existe déjà).
3. Coche, si besoin, les étapes vers lesquelles transiter en cas de **succès** et/ou d'**échec**.
4. Clique sur **Submit** pour ajouter l'étape.

### Modifier ou supprimer une étape

Dans le panneau **Étapes du scénario**, chaque étape est affichée sous forme de carte avec son type et ses transitions.

- **Modifier** : recharge l'étape dans le formulaire pour l'éditer (nom, type, transitions).
- **Supprimer** : retire l'étape du scénario. Les références à cette étape dans les transitions des autres étapes sont automatiquement nettoyées.

Un avertissement s'affiche si le scénario ne contient aucune étape de type `end` — ce n'est pas bloquant, mais recommandé pour indiquer clairement la fin du parcours.

### Lancer une simulation

Le bouton **▶ Lancer la simulation** exécute le scénario à partir de l'étape `start` :

- Chaque étape simulée passe par un statut `running` puis `success` ou `failure` (le résultat est aléatoire pour les étapes de type `email`, toujours réussi pour les autres).
- Selon le résultat, la simulation poursuit vers les transitions `onSuccess` ou `onFailure` de l'étape, en parallèle si plusieurs transitions sont définies.
- Si le scénario ne contient aucune étape `start`, un message d'erreur s'affiche au lieu de lancer la simulation.
- Si une boucle est détectée sur un chemin d'exécution (une étape déjà exécutée dans ce même chemin), cette branche est arrêtée pour éviter une exécution infinie.

Le déroulé complet (étape, statut, horodatage) est visible dans le panneau **Journal d'exécution**.

### Importer / Exporter un scénario

- **⬇ Exporter** : télécharge le scénario courant au format JSON (`scenario.json`).
- **⬆ Importer** : charge un fichier JSON et remplace le scénario courant. Chaque étape importée est validée (id, nom, type et transitions) ; en cas de fichier invalide, un message d'erreur explicite s'affiche et le scénario actuel n'est pas modifié.

Un fichier d'exemple prêt à importer est disponible dans [`front-work-flow/examples/scenario-test.json`](front-work-flow/examples/scenario-test.json). Il décrit un parcours `start → sms → email → (custom si échec) → end`, sans boucle et avec une étape `end` unique.
