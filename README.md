# EXPlain - Apprentissage Explicable des Brevets pour l'Intelligence Artificielle

**Juin/Juillet 2024, Mastercamp**

## Aperçu du Projet

EXPlain est un projet visant à créer un modèle d'IA explicable pour l'apprentissage des brevets. L'objectif principal est d'exploiter les techniques d'apprentissage automatique, en particulier en utilisant des modèles basés sur BERT et Fasttext, pour analyser et classifier les données de brevets.

## Table des Matières

1. [Aperçu du Projet](#aperçu-du-projet)
2. [Installation](#installation)
3. [Préparation des Données](#préparation-des-données)
4. [Entraînement du Modèle](#entraînement-du-modèle)
5. [Évaluation](#évaluation)
6. [Requis techniques](#requis-techniques)
7. [Utilisation du programme](#utilisation-du-programme)
8. [Contributeurs](#contributeurs)

## Installation

Pour installer les paquets requis, exécutez la commande suivante :

```sh
pip install pandas tensorflow torch transformers scikit-learn keras openpyxl numpy keras_preprocessing tqdm nltk
```

## Préparation des Données

### Étape 1 : Nettoyage des Données

1. **Chargement des Données :**
    - Les données sont chargées à partir d'un fichier Excel nommé `data.xlsx`. Ces données ont été récupérées du dataset donné en cours.
    - Les colonnes inutiles sont supprimées et les données sont nettoyées en supprimant les balises HTML, en convertissant le texte en minuscules et en supprimant les caractères non alphanumériques.

2. **Suppression des Mots Vides et Lemmatisation :**
    - Les mots vides sont supprimés en utilisant la bibliothèque NLTK.
    - Les mots sont lemmatisés à leur forme de base.

3. **Sauvegarde des Données Nettoyées :**
    - Les données nettoyées sont sauvegardées dans `data_cleaned.xlsx` pour une utilisation future.

### Étape 2 : Chargement des Données Nettoyées

- Les données nettoyées sont chargées à partir de `data_cleaned.xlsx` pour l'entraînement et les tests.

## Entraînement du Modèle

### Étape 1 : Préparation des Données d'Entraînement

1. **Binarisation des Étiquettes :**
    - Les étiquettes sont binarisées en utilisant `MultiLabelBinarizer`.

2. **Division Entraînement-Test :**
    - Les données sont divisées en ensembles d'entraînement et de test.

3. **DataLoaders :**
    - Des DataLoaders sont créés pour un traitement par lot efficace pendant l'entraînement.

### Étape 2 : Définir le Modèle

- Une classe `PatentClassifier` est définie en utilisant le modèle BERT pour traiter les descriptions et les revendications des brevets.

### Étape 3 : Boucle d'Entraînement

1. **Fonction de Perte et Optimiseur :**
    - La fonction de perte utilisée est `MultiLabelSoftMarginLoss`.
    - L'optimiseur est Adam avec un taux d'apprentissage de `1e-5`.

2. **Processus d'Entraînement :**
    - Le modèle est entraîné sur plusieurs époques, avec des évaluations périodiques pour surveiller les performances.

3. **Sauvegarder le Modèle :**
    - L'état du modèle est sauvegardé après chaque époque.

## Évaluation

- La fonction d'évaluation évalue les performances du modèle en utilisant l'exactitude et le score F1.
- Les résultats sont imprimés pour comparer les étiquettes vraies avec les étiquettes prédites.
- L'utilisation de SHAP permet à l'utilisateur de comprendre et analyser le fonctionnement d'un modèle Transformers (ou autre) à l'aide de différents graphiques.

## Requis techniques

- Python >= 3.11
- Distribution Linux (Ubuntu, Debian...) recommandé
- GPU NVIDIA requis (CUDA)
- RAM >= 16 GB

## Utilisation du programme

1. Chargez les données afin de les nettoyer par la suite (utilisez `data.xlsx`) ou utilisez les données nettoyées (`data_cleaned.xlsx`).
2. Ici, vous avez plusieurs choix:
- Vous pouvez entraîner (ou continuer à entrainer) un modèle en utilisant les données nettoyées.
- Vous pouvez évaluer un modèle existant.
- Vous pouvez héberger un back-end pour l'application web afin de pouvoir utiliser SHAP pour expliquer les prédictions du modèle.
3. Pour le site web, accéder au dossier "frontend", exécuter `npm i` puis `npm run dev` avec Node pour lancer le serveur Web, en même temps que l'hébergement backend.

## Contributeurs

- Tom DIZDAREVIC
- Cédric HOMBOURGER
- Virgile MARTEL
- Adam MOUNIR
- Louis PERSONNIC
