# Contributing to Halal Open Food Facts

First off, thank you for considering contributing to **Halal Open Food Facts**! 🥗☪️

This project exists to help people around the world find trustworthy information about halal-certified food products. Whether you're fixing a bug, improving documentation, adding a translation, or curating product data — every contribution matters.

---

## 🙋 Ways to contribute

You don't need to be an expert developer to help. Here are several ways to get involved:

- **🐛 Report bugs** — Found something broken? Open an issue describing what happened and how to reproduce it.
- **💡 Suggest features** — Have an idea to improve the platform? Open an issue to discuss it before starting work.
- **💻 Write code** — Fix bugs, build features, improve performance. See [Good first issues](#-good-first-issues) below.
- **📝 Improve documentation** — Clearer setup instructions, better code comments, or corrections to this file are all welcome.
- **🌍 Add translations** — Help extend `locale.js` to support more languages beyond French, English, Arabic, and Spanish.
- **📊 Curate product data** — Help identify and flag halal-certified or non-compliant products through the platform itself.

---

## 🛠️ Setting up your development environment

### Prerequisites
- [Docker](https://www.docker.com/) + Docker Compose
- Git

### Steps

```bash
# 1. Fork this repository on GitHub, then clone your fork
git clone https://github.com/YOUR_USERNAME/halalopenfoodfacts.git
cd halalopenfoodfacts

# 2. Add the original repository as an upstream remote
git remote add upstream https://github.com/halalopenfoodfacts-server/halalopenfoodfacts.git

# 3. Configure environment variables
cp .env.example .env
# Edit .env with your local values

# 4. Start the full stack
docker compose up -d

# Frontend → http://localhost:8090
# API      → http://localhost:8000
```

You now have a working local copy of the platform. 🎉

---

## 🔄 Making a contribution

1. **Create a branch** for your change, based on the latest `main`:
   ```bash
   git checkout main
   git pull upstream main
   git checkout -b feature/short-description
   ```

2. **Make your changes.** Keep commits focused — one logical change per commit when possible.

3. **Write clear commit messages**, following this convention where relevant:
   ```
   feat: add product filtering by country
   fix: correct barcode rendering for EAN-8 codes
   docs: clarify local setup instructions
   ```

4. **Test your changes locally** before opening a pull request. Make sure the app still runs (`docker compose up -d`) and the feature/fix behaves as expected.

5. **Push your branch and open a Pull Request:**
   ```bash
   git push origin feature/short-description
   ```
   Then open a PR on GitHub against the `main` branch of this repository. Describe what your change does and why.

6. **Respond to review feedback.** A maintainer will review your PR and may suggest changes — this is a normal part of the process, not a rejection.

---

## 🎯 Good first issues

New to the project? Look for issues labeled [`good first issue`](../../labels/good%20first%20issue) — these are scoped to be approachable without deep familiarity with the codebase.

Don't see one that fits? Feel free to open an issue proposing a small improvement (a UI fix, a missing translation string, a documentation gap) and mention you'd like to work on it.

---

## 🧭 Project structure

For an overview of how the codebase is organized (frontend, Django backend, data import scripts), see the [README](README.md#-project-architecture).

---

## 💬 Questions?

If anything is unclear, open an issue with the `question` label, or reach out via [halalopenfoodfacts@gmail.com].

---

## 📜 Code of Conduct

Be respectful, be constructive, and remember there's a person on the other side of every issue and pull request. We want this to be a welcoming space for contributors of all backgrounds and experience levels.

---

Thank you again for helping make halal food certification more transparent for everyone. 🙏
