<div align="center">

# 🥗 Halal Open Food Facts

### La base de données collaborative des produits alimentaires halal

[![Production](https://img.shields.io/badge/production-halalopenfoodfacts.org-green?style=for-the-badge)](https://halalopenfoodfacts.org)
[![GitHub](https://img.shields.io/badge/github-halalopenfoodfacts-181717?style=for-the-badge&logo=github)](https://github.com/halalopenfoodfacts-server/halalopenfoodfacts)
[![Licence MIT](https://img.shields.io/badge/licence-MIT-blue?style=for-the-badge)](LICENSE)
[![Données ODbL](https://img.shields.io/badge/données-ODbL-orange?style=for-the-badge)](https://opendatacommons.org/licenses/odbl/)

</div>

---

## ☪️ À propos

**Halal Open Food Facts** est un portail communautaire open-source permettant de consulter, rechercher et contribuer à une base de données de produits alimentaires certifiés halal.

> 🗄️ **Infrastructure 100 % propriétaire** — Toutes les données sont hébergées sur **notre propre serveur PostgreSQL** (VPS OVH, Roubaix). Les dumps CSV d'Open Food Facts sont importés localement et synchronisés automatiquement.
>
> 🚫 **Aucune requête n'est envoyée à l'API publique d'Open Food Facts** en production. Tout est servi depuis notre infrastructure.

🔗 **Site** : https://halalopenfoodfacts.org  
💄 **Portail cosmétiques** : https://halalopenbeautyfacts.org

---

## 📊 Chiffres clés

| Indicateur | Valeur |
|---|---|
| 🛒 Produits alimentaires | **4 501 144** |
| ☪️ Produits halal certifiés | **24 412** |
| 🚫 Produits non conformes | **565** |
| 🌍 Pays couverts | **400** |
| 👥 Contributeurs | **42 846** |

---

## 🏗️ Architecture du projet

```
halalopenfoodfacts/
│
├── html/                          # 🌐 Frontend (servi par Nginx en production)
│   ├── index.html                 # Catalogue — recherche, filtres, stats temps réel
│   ├── product.html               # Fiche produit — 200+ champs, nutriscore, nova, code-barres SVG
│   ├── excluded.html              # Produits non conformes (alcool, porc, gélatine…)
│   ├── add.html                   # Formulaire de contribution produit
│   ├── signin.html                # Authentification contributeur
│   ├── legal.html                 # Mentions légales
│   ├── terms.html                 # Conditions générales d'utilisation
│   └── assets/
│       ├── css/
│       │   ├── style.css          # Design principal — variables CSS, responsive mobile
│       │   └── product.css        # Styles spécifiques à la fiche produit
│       └── js/
│           ├── app.js             # Catalogue : recherche full-text, filtres halal, pagination, stats
│           ├── product.js         # Fiche : rendu complet, JsBarcode SVG, safeGet(), parse_tags()
│           ├── add.js             # Contribution : formulaire + upload image
│           ├── nav.js             # Navigation responsive + menu mobile
│           └── locale.js          # i18n fr / en / ar / es — changement à chaud, RTL arabe
│
├── backend/                       # ⚙️ API Django (partagée avec le portail beauty)
│   ├── Dockerfile                 # Image Python 3.11 + Gunicorn
│   ├── requirements.txt           # Django 4.2, DRF, Celery, psycopg2, redis…
│   ├── manage.py
│   ├── config/
│   │   ├── settings.py            # Config via variables d'environnement (.env)
│   │   ├── urls.py                # Routage principal /api/*
│   │   ├── celery.py              # Config Celery
│   │   └── wsgi.py
│   └── products/
│       ├── models.py              # Modèle Product — portal, code, data JSONB (200+ champs)
│       ├── serializers.py         # ProductListSerializer + ProductDetailSerializer + parse_tags()
│       ├── views.py               # Vues API — search, product, stats, top, recent, facets
│       ├── urls.py                # Routes /api/v2/…
│       ├── tasks.py               # Tâches Celery (sync delta)
│       └── management/commands/
│           ├── import_full.py     # Import CSV complet OFF (streaming, ~4h)
│           ├── sync_delta.py      # Sync delta horaire
│           └── update_images.py   # Mise à jour URLs images
│
├── docker-compose.yml             # 🐳 Stack complète — Postgres, Redis, Django, Celery, Nginx
├── nginx.conf                     # Config Nginx dev (port 8090)
├── .env.example                   # Template variables d'environnement (secrets exclus du dépôt)
├── .gitignore
└── README.md
```

---

## ⚙️ Stack technique

| Composant | Technologie | Rôle |
|---|---|---|
| Frontend | HTML5 / CSS3 / JS Vanilla | Zéro framework — léger et rapide |
| Backend API | **Django 4.2** + DRF | API REST JSON — tous les endpoints `/api/*` |
| Base de données | **PostgreSQL 16** | 4,5 M+ produits, données JSONB complètes |
| Cache / Broker | **Redis 7** | Cache API + file de tâches Celery |
| Tâches async | **Celery** + Celery Beat | Import delta automatique toutes les heures |
| i18n | `locale.js` maison | fr / en / ar / es — RTL arabe automatique |
| Reverse proxy prod | **Nginx système** + Let's Encrypt | HTTPS, `/proxy/*` → `127.0.0.1:8000` |
| Code-barres | **JsBarcode 3.11.6** | Génération SVG locale EAN-8 / EAN-13 / CODE128 |
| Hébergeur | **VPS OVH** — 51.83.97.15 | Debian, Roubaix |

---

## 🚀 API — Endpoints disponibles

Le proxy Nginx redirige `/proxy/*` → `http://127.0.0.1:8000/api/*` avec l'en-tête `X-Portal: food`.

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/proxy/v2/product/{code}.json` | Fiche produit complète (nutriscore, nova, ingrédients, allergènes…) |
| GET | `/proxy/v2/search?q={terme}&page={n}` | Recherche full-text PostgreSQL |
| GET | `/proxy/v2/search?is_halal=1` | Produits halal certifiés uniquement |
| GET | `/proxy/v2/search?is_excluded=1` | Produits non conformes (alcool, porc…) |
| GET | `/proxy/stats` | `{ total, halal, excluded, countries, contributors }` |
| GET | `/proxy/top` | Top produits les plus scannés |
| GET | `/proxy/recent` | Produits récemment ajoutés |
| GET | `/proxy/facets/` | Facettes — catégories, marques, pays, labels |

---

## 💻 Démarrage rapide (développement local)

### Prérequis
- Docker + Docker Compose
- Git

### Installation

```bash
# 1. Cloner le dépôt
git clone https://github.com/halalopenfoodfacts-server/halalopenfoodfacts.git
cd halalopenfoodfacts

# 2. Configurer les secrets
cp .env.example .env
# Éditer .env avec vos valeurs (SECRET_KEY, POSTGRES_PASSWORD…)

# 3. Lancer la stack complète
docker compose up -d

# Frontend Food  → http://localhost:8090
# API Django     → http://localhost:8000
```

### Import des données

```bash
# Import complet depuis Open Food Facts (~4h en streaming)
docker exec halal_django python manage.py import_full --portal food

# Synchronisation delta manuelle
docker exec halal_django python manage.py sync_delta --portal food

# Mise à jour images uniquement
docker exec halal_django python manage.py update_images --portal food
```

---

## 🌐 Déploiement production (VPS OVH)

```bash
# Déployer le frontend
sudo rsync -av --delete ./html/ /var/www/halalopenfoodfacts/
sudo chown -R www-data:www-data /var/www/halalopenfoodfacts/

# Rebuild + restart backend Django après modification Python
docker-compose -f /home/debian/halal-frontend/docker-compose.yml build django
docker-compose -f /home/debian/halal-frontend/docker-compose.yml up -d django

# Vérifier les logs
docker logs halal_django --tail=50
```

---

## 🌍 Internationalisation

Le fichier `html/assets/js/locale.js` gère **4 langues** sans rechargement de page :

| Code | Langue | Direction |
|---|---|---|
| `fr` | Français | LTR |
| `en` | English | LTR |
| `ar` | العربية | **RTL** (automatique) |
| `es` | Español | LTR |

---

## 🤝 Contribuer

1. Forkez ce dépôt
2. Créez une branche : `git checkout -b feature/ma-fonctionnalite`
3. Committez vos changements : `git commit -m 'feat: description'`
4. Pushez : `git push origin feature/ma-fonctionnalite`
5. Ouvrez une Pull Request

---

## 📜 Mentions légales

| | |
|---|---|
| Structure | Association Loi 1901 |
| Adresse | 392 rue des Peupliers, 59800 Lille |
| Directeur / DPO | M. Mustapha Zentar |
| Contact | contact@halalopenfoodfacts.org |
| Hébergeur | OVH SAS, 2 rue Kellermann, 59100 Roubaix |

---

## 📄 Licences

| Périmètre | Licence |
|---|---|
| Code source | [MIT](LICENSE) |
| Données produits | [ODbL — Open Database License](https://opendatacommons.org/licenses/odbl/) |
| Contenus (photos, textes contributeurs) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

---

<div align="center">

Fait avec ☪️ par la communauté **Halal Open Facts**

[halalopenfoodfacts.org](https://halalopenfoodfacts.org) · [halalopenbeautyfacts.org](https://halalopenbeautyfacts.org)

</div>


## 👤 Author

<img src="https://github.com/fleury-fcn.png" width="100" style="border-radius: 50%;" alt="Fleury Niyokwizera" />

**Fleury NIYOKWIZERA**
Master 1 in Applied Statistics and Decision-Making Computer Science – ISTA, University of Burundi
Currently pursuing a Master's in Data Modeling (Artificial Intelligence track) – University of Lille

[![GitHub](https://img.shields.io/badge/GitHub-fleury--fcn-181717?style=flat&logo=github&logoColor=white)](https://github.com/fleury-fcn)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Fleury_Niyokwizera-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fleury-niyokwizera-2a9436291)












