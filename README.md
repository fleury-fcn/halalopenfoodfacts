<div align="center">

# 🥗 Halal Open Food Facts

### The collaborative database for halal food products

[![Production](https://img.shields.io/badge/production-halalopenfoodfacts.org-green?style=for-the-badge)](https://halalopenfoodfacts.org)
[![GitHub](https://img.shields.io/badge/github-halalopenfoodfacts-181717?style=for-the-badge&logo=github)](https://github.com/halalopenfoodfacts-server/halalopenfoodfacts)
[![MIT License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)
[![ODbL Data](https://img.shields.io/badge/data-ODbL-orange?style=for-the-badge)](https://opendatacommons.org/licenses/odbl/)

</div>

---

## ☪️ About

**Halal Open Food Facts** is an open-source community portal for browsing, searching, and contributing to a database of halal-certified food products.

> 🗄️ **100% proprietary infrastructure** — All data is hosted on **our own PostgreSQL server** (OVH VPS, Roubaix). Open Food Facts CSV dumps are imported locally and synchronized automatically.
>
> 🚫 **No requests are sent to the public Open Food Facts API** in production. Everything is served from our own infrastructure.

🔗 **Site**: https://halalopenfoodfacts.org
💄 **Cosmetics portal**: https://halalopenbeautyfacts.org

---

## 📊 Key figures

| Metric | Value |
|---|---|
| 🛒 Food products | **4,501,144** |
| ☪️ Halal-certified products | **24,412** |
| 🚫 Non-compliant products | **565** |
| 🌍 Countries covered | **400** |
| 👥 Contributors | **42,846** |

---

## 🏗️ Project architecture

```
halalopenfoodfacts/
│
├── html/                          # 🌐 Frontend (served by Nginx in production)
│   ├── index.html                 # Catalog — search, filters, real-time stats
│   ├── product.html               # Product page — 200+ fields, nutriscore, nova, barcode SVG
│   ├── excluded.html              # Non-compliant products (alcohol, pork, gelatin…)
│   ├── add.html                   # Product contribution form
│   ├── signin.html                # Contributor authentication
│   ├── legal.html                 # Legal notice
│   ├── terms.html                 # Terms of use
│   └── assets/
│       ├── css/
│       │   ├── style.css          # Main design — CSS variables, mobile responsive
│       │   └── product.css        # Product page–specific styles
│       └── js/
│           ├── app.js             # Catalog: full-text search, halal filters, pagination, stats
│           ├── product.js         # Product page: full rendering, JsBarcode SVG, safeGet(), parse_tags()
│           ├── add.js             # Contribution: form + image upload
│           ├── nav.js             # Responsive navigation + mobile menu
│           └── locale.js          # i18n fr / en / ar / es — live switching, Arabic RTL
│
├── backend/                       # ⚙️ Django API (shared with the beauty portal)
│   ├── Dockerfile                 # Python 3.11 + Gunicorn image
│   ├── requirements.txt           # Django 4.2, DRF, Celery, psycopg2, redis…
│   ├── manage.py
│   ├── config/
│   │   ├── settings.py            # Config via environment variables (.env)
│   │   ├── urls.py                # Main routing /api/*
│   │   ├── celery.py              # Celery configuration
│   │   └── wsgi.py
│   └── products/
│       ├── models.py              # Product model — portal, code, JSONB data (200+ fields)
│       ├── serializers.py         # ProductListSerializer + ProductDetailSerializer + parse_tags()
│       ├── views.py               # API views — search, product, stats, top, recent, facets
│       ├── urls.py                # /api/v2/… routes
│       ├── tasks.py               # Celery tasks (delta sync)
│       └── management/commands/
│           ├── import_full.py     # Full CSV import from OFF (streaming, ~4h)
│           ├── sync_delta.py      # Hourly delta sync
│           └── update_images.py   # Image URL updates
│
├── docker-compose.yml             # 🐳 Full stack — Postgres, Redis, Django, Celery, Nginx
├── nginx.conf                     # Dev Nginx config (port 8090)
├── .env.example                   # Environment variable template (secrets excluded from repo)
├── .gitignore
└── README.md
```

---

## ⚙️ Tech stack

| Component | Technology | Role |
|---|---|---|
| Frontend | HTML5 / CSS3 / Vanilla JS | Zero framework — light and fast |
| Backend API | **Django 4.2** + DRF | JSON REST API — all `/api/*` endpoints |
| Database | **PostgreSQL 16** | 4.5M+ products, full JSONB data |
| Cache / Broker | **Redis 7** | API cache + Celery task queue |
| Async tasks | **Celery** + Celery Beat | Automatic hourly delta import |
| i18n | Custom `locale.js` | fr / en / ar / es — automatic Arabic RTL |
| Production reverse proxy | **System Nginx** + Let's Encrypt | HTTPS, `/proxy/*` → `127.0.0.1:8000` |
| Barcode | **JsBarcode 3.11.6** | Local SVG generation for EAN-8 / EAN-13 / CODE128 |
| Hosting | **OVH VPS** — 51.83.97.15 | Debian, Roubaix |

---

## 🚀 API — Available endpoints

The Nginx proxy redirects `/proxy/*` → `http://127.0.0.1:8000/api/*` with the `X-Portal: food` header.

| Method | Endpoint | Description |
|---|---|---|
| GET | `/proxy/v2/product/{code}.json` | Full product sheet (nutriscore, nova, ingredients, allergens…) |
| GET | `/proxy/v2/search?q={term}&page={n}` | PostgreSQL full-text search |
| GET | `/proxy/v2/search?is_halal=1` | Halal-certified products only |
| GET | `/proxy/v2/search?is_excluded=1` | Non-compliant products (alcohol, pork…) |
| GET | `/proxy/stats` | `{ total, halal, excluded, countries, contributors }` |
| GET | `/proxy/top` | Most-scanned products |
| GET | `/proxy/recent` | Recently added products |
| GET | `/proxy/facets/` | Facets — categories, brands, countries, labels |

---

## 💻 Quick start (local development)

### Prerequisites
- Docker + Docker Compose
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/halalopenfoodfacts-server/halalopenfoodfacts.git
cd halalopenfoodfacts

# 2. Configure secrets
cp .env.example .env
# Edit .env with your own values (SECRET_KEY, POSTGRES_PASSWORD…)

# 3. Start the full stack
docker compose up -d

# Food frontend  → http://localhost:8090
# Django API     → http://localhost:8000
```

### Data import

```bash
# Full import from Open Food Facts (~4h, streaming)
docker exec halal_django python manage.py import_full --portal food

# Manual delta sync
docker exec halal_django python manage.py sync_delta --portal food

# Image URLs update only
docker exec halal_django python manage.py update_images --portal food
```

---

## 🌐 Production deployment (OVH VPS)

```bash
# Deploy the frontend
sudo rsync -av --delete ./html/ /var/www/halalopenfoodfacts/
sudo chown -R www-data:www-data /var/www/halalopenfoodfacts/

# Rebuild + restart Django backend after Python code changes
docker-compose -f /home/debian/halal-frontend/docker-compose.yml build django
docker-compose -f /home/debian/halal-frontend/docker-compose.yml up -d django

# Check logs
docker logs halal_django --tail=50
```

---

## 🌍 Internationalization

The `html/assets/js/locale.js` file handles **4 languages** without page reload:

| Code | Language | Direction |
|---|---|---|
| `fr` | French | LTR |
| `en` | English | LTR |
| `ar` | Arabic | **RTL** (automatic) |
| `es` | Spanish | LTR |

---

## 🤝 Contributing

1. Fork this repository
2. Create a branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: description'`
4. Push: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📜 Legal notice

| | |
|---|---|
| Structure | Non-profit association (French Law 1901) |
| Address | 392 rue des Peupliers, 59800 Lille |
| Director / DPO | Mr. Mustapha Zentar |
| Contact | contact@halalopenfoodfacts.org |
| Hosting provider | OVH SAS, 2 rue Kellermann, 59100 Roubaix |

---

## 📄 Licenses

| Scope | License |
|---|---|
| Source code | [MIT](LICENSE) |
| Product data | [ODbL — Open Database License](https://opendatacommons.org/licenses/odbl/) |
| Content (photos, contributor text) | [CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) |

---

<div align="center">

Made with ☪️ by the **Halal Open Facts** community

[halalopenfoodfacts.org](https://halalopenfoodfacts.org) · [halalopenbeautyfacts.org](https://halalopenbeautyfacts.org)

</div>


## 👤 Author

<img src="https://github.com/fleury-fcn.png" width="100" style="border-radius: 50%;" alt="Fleury Niyokwizera" />

**Fleury NIYOKWIZERA**
Master 1 in Applied Statistics and Business Intelligence, University of Burundi 🇧🇮
Currently pursuing a Master's in Data Modeling – University of Lille, France 🇫🇷

[![GitHub](https://img.shields.io/badge/GitHub-fleury--fcn-181717?style=flat&logo=github&logoColor=white)](https://github.com/fleury-fcn)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Fleury_Niyokwizera-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/fleury-niyokwizera-2a9436291)

------------------------------------------------------------------------

⭐ **If you find this project interesting, feel free to explore the
repository and follow my work in AI, Machine Learning and Data
Science.**
