# Projet IMIS M2 SIG - 2020-2021

## Avancement

Le projet est fonctionnel et complet. Il implémente le minimum requis ainsi que les layers avec gestion des couleurs en fonction des catégories.

---
## Installation/Deploiement (important)
Pour tester et vérifier l'ensemble du projet il est nécessaire de :
- Créer une base de données POSTGRES dans un docker
- Avoir un Geoserver fonctionnel
- Faire le lien (enregistrer) entre le projet QGis et la BDD pour le peuplement
- Creer deux agrégat de couche dans Geoserver : une pour le RDC et l'autre pour l'étage - voir structure Geoserver
- Changer les informations de connextion de BDD pour l'api dans le fichier *application.properties*
- Changer les routes d'appels dans le fichier *main.js* pour la webview si vous ne respectez pas la structure geoserver (voir plus bas)
- Lancer l'API sur le port 8081 et le geoserver sur le port 8080
- Copier/coller l'ensemble des fichiers présents dans le dossier *webapps* dans le dossier du geoserver du même nom
- changer le nom de la machine locale dans le fichier *MapNavigationActivity.java* dans l'api (ad-laptop -> your machine name)
---
## Structure
- *android* : Contient le code source de l'apk pour le téléphone servant d'interface au projet.
- *barcode* : contient les images des barcodes à scanner pour simuler la position initiale.
- *qgis* : contient les fichiers du projet QGis du batiment.
- *server* : contient l'API en Spring pour la modification d'une salle.
- *webapps* : contient le JS et l'HTML nécessaire pour le bon.fonctionnement de la webview. A Placer dans le geoserver.

---
## Structure Geoserver
- Un entrepot : *batiment-sig*
- 4 couches : *portes-rdc*, *portes-etage*, *salles-etage* et *salles-rdc*
- 2 agrégats : *batiment-sig-etage* (*portes-etage* + *salles-etage*) et *batiment-sig-rdc* (*portes-rdc* + *salles-rdc*)
- Nécessaire d'importer le style des couches dans geoserver pour les salles et les portes
---
## Fil    

- [X] Avoir un server - postgres qui marche  

- [X] Concevoir la base (plan batiment -portes et salles-  + styles)  

- [X] Geoserver (couche) -> afficher dans openlayers avec PostGres en direct

- [X] Mettre en place une app android avec Webview

- [X] Mettre en place un web Service (API)

- [X] Trouver une solution pour scan et étude des QR codes

---
## Organisation

Table "salle" = salle ,SRID (coords géographiques), infos salle (polygon)
Table "porte" = (line)

*Le but est de relier les points pour passer d'une porte à une autre.*

---
### Membres :
- Guidez Romain
- Sarget Alexis
- Renard Vincent
- Derieux Arnault
