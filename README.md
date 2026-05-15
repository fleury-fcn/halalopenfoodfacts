# 🥗 Halal Open Food Facts — Frontend

> **🗄️ Données 100 % propriétaires** — Ce portail exploite sa **propre base PostgreSQL** avec 4 500 000+ produits alimentaires importés depuis les dumps Open Food Facts.  
> **Aucune dépendance à l'API publique d'Open Food Facts en production.**

🔗 **Production** : https://halalopenfoodfacts.org  
📦 **Dépôt** : https://github.com/halalopenfoodfacts-server/halalopenfoodfacts  
🔗 **Portail sister** : [Halal Open Beauty Facts](https://halalopenbeautyfacts.org)

---

## 📁 Structure

```
food/html/
├── index.html       # Catalogue produits — recherche, filtres halal, stats temps réel
├── product.html     # Fiche produit complète — 200+ champs, code-barres SVG, nutriscore
├── excluded.html    # Produits non conformes — alcool, porc, gélatine porcine…
├── add.html         # Formulaire contribution produit
├── signin.html      # Authentification contributeur
├── legal.html       # Mentions légales
├── terms.html       # Conditions générales d'utilisation
└── assets/
    ├── css/
    │   ├── style.css       # Design principal (variables CSS, responsive)
    │   └── product.css     # Styles fiche produit
    └── js/
        ├── app.js          # Catalogue : recherche full-text, filtres, pagination, stats
        ├── product.js      # Fiche produit : rendu, JsBarcode, safeGet(), parse_tags()
        ├── add.js          # Contribution : formulaire + upload image
        ├── nav.js          # Navigation responsive + menu mobile
        └── locale.js       # i18n fr / en / ar / es (changement à chaud)
```

---

## 🗄️ Base de données

| Statistique | Valeur |
|---|---|
| Produits alimentaires | **4 501 144** |
| Produits halal certifiés | 24 412 |
| Produits non conformes | 565 |
| Pays couverts | 400 |
| Contributeurs | 42 846 |

Les données proviennent du **dump CSV complet d'Open Food Facts**, importé en streaming dans PostgreSQL.  
Elles sont synchronisées automatiquement via **Celery Beat** (delta horaire).

---

## 🚀 API (proxy local)

Toutes les requêtes passent par `/proxy/*` → `http://127.0.0.1:8000/api/*` (Django + DRF).  
L'en-tête `X-Portal: food` est ajouté automatiquement par Nginx.

| Endpoint | Usage |
|---|---|
| `/proxy/v2/product/{code}.json` | Fiche produit (nutriscore, nova, ingrédients…) |
| `/proxy/v2/search?q=…&page=1` | Recherche full-text PostgreSQL |
| `/proxy/v2/search?is_halal=1` | Produits halal certifiés |
| `/proxy/v2/search?is_excluded=1` | Produits non conformes |
| `/proxy/stats` | `{total, halal, excluded, countries, contributors}` |
| `/proxy/top` | Top produits scannés |
| `/proxy/recent` | Récemment ajoutés |

---

## 🌍 Internationalisation

`locale.js` gère 4 langues : **Français · English · العربية · Español**

Changement de langue sans rechargement. Direction RTL automatique pour l'arabe.

---

## 🛠️ Déploiement

```bash
# Déployer en production
sudo rsync -av --delete /home/debian/halal-frontend/food/html/ /var/www/halalopenfoodfacts/
sudo chown -R www-data:www-data /var/www/halalopenfoodfacts/
```

---

## 📄 Licence

- Code : [MIT](../LICENSE)
- Données : [ODbL](https://opendatacommons.org/licenses/odbl/)
- Contenus : [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
