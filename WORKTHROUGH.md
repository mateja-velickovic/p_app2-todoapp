## 23/03/2026
Création d'un repository GitHub public pour le projet
Lancement du projet en local (fix des vulnerabilités des dépendances)
Création d'un conteneur Docker avec le docker-compose fourni pour héberger la base de données en local
__Test de l'application en local :__
- Retirer le texte dans le input lorsque la tâche est créé
- Changer le style d'une tâche lorsqu'elle est finie (par ex: baisser la luminosité)
- Classer les tâches effectuées tout en bas de la liste
- Améliorer les messages d'erreurs lors de la création de compte (email déjà existant)
- "mot de passe oublier" lors de la connexion

## 25/03/2026
Correction d'une dernière vulnérabilité avec le module *tar*, j'ai du insérer un overrides dans le package.json du backend pour forcer une version plus récente du package.
Planification du projet avec Gantt
Ajout des 4 amélioration mentionées lors du test de l'application en local (4/5, il manque le classement des tâches selon le statut)
