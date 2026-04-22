### Lundi 23/03/2026
- Création d'un repository GitHub public pour le projet
- Lancement du projet en local (fix des vulnerabilités des dépendances)
- Création d'un conteneur Docker avec le docker-compose fourni pour héberger la base de données en local
- __Test de l'application en local :__
    - Retirer le texte dans le input lorsque la tâche est créé
    - Changer le style d'une tâche lorsqu'elle est finie (par ex: baisser la luminosité)
    - Classer les tâches effectuées tout en bas de la liste
    - Améliorer les messages d'erreurs lors de la création de compte (email déjà existant)
    - Corriger l'orthographe "mot de passe oublier" lors de la connexion

### Mercredi 25/03/2026
- Correction d'une dernière vulnérabilité avec le module *tar*, j'ai du insérer un overrides dans le package.json du backend pour forcer une version plus récente du package.
- Planification du projet avec Gantt
- Ajout des 4 amélioration mentionées lors du test de l'application en local (4/5, il manque le classement des tâches selon le statut)
- Amélioration du coverage de tests d'intégration pour le controller Todo

### Mercredi 22.04
- Reprise des supports de cours pour les images docker / docker hub
- Création d'une image sur ghrc.io du backend et du frontend et adaptation du code pour gérer le manque du .env physique
- Connexion au VPN via le workflow et connexion en SSH à la machine virtuelle
- Mise en place de certaines des améliorations discutées avec l'enseignant à ce jour
- Création du .env sur la machine distante
- Envoi du docker-compose et montage des containers sur la machine distante