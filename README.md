# Segmentation d'utilisateurs de réseaux sociaux

Ce projet a pour objectif de **segmenter les utilisateurs de réseaux sociaux** à partir de leurs caractéristiques démographiques et comportementales, en utilisant des techniques de **clustering non supervisé**.  

---

## 🚀 Technologies utilisées

- **Python 3.x**
- **pandas** : manipulation et prétraitement des données
- **numpy** : calculs numériques
- **scikit-learn** : algorithmes de clustering et évaluation
- **matplotlib** & **seaborn** : visualisation des résultats
- **FastAPI** : API REST pour exposer les résultats
- **uvicorn** : serveur ASGI pour FastAPI

---

## 📂 Dataset

Le dataset utilisé est **[Social Network Ads](https://www.kaggle.com/datasets/rakeshrau/social-network-ads)** (Kaggle) et contient les colonnes suivantes :

- Age
- Gender
- Estimated Salary
- Purchased  

Pour ce projet, nous utilisons uniquement :

- Age
- Estimated Salary

---

## 🔧 Méthodologie

Les étapes principales du projet sont :

1. **Chargement du dataset** avec `pandas`
2. **Nettoyage des données** : suppression des colonnes inutiles, gestion des valeurs manquantes
3. **Sélection des features** : Age et Estimated Salary
4. **Normalisation des données** avec `StandardScaler`
5. **Application des algorithmes de clustering** :
   - K-Means
   - Clustering hiérarchique (Ward linkage)
6. **Évaluation des clusters** avec le Silhouette Score
7. **Visualisation des résultats** : scatter plots, dendrogrammes, courbes d’Elbow

---

## 📈 Algorithmes utilisés

### K-Means
- Partitionne les données en `K` clusters
- Minimise la variance intra-cluster
- Nécessite de choisir `K` à l’avance

### Clustering hiérarchique
- Construire une hiérarchie de clusters (dendrogramme)
- Méthode utilisée : Ward linkage
- Ne nécessite pas de choisir le nombre de clusters initialement

### Silhouette Score
- Mesure la cohésion et la séparation des clusters
- Valeurs proches de 1 : clusters bien séparés
- Valeurs proches de 0 : points à la frontière
- Valeurs négatives : mauvais regroupement
