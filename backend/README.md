---
title: Amrith Backend
emoji: 🏥
colorFrom: purple
colorTo: indigo
sdk: docker
pinned: false
---

# Amrith Backend API Server

This repository hosts the backend services for Amrith, an AI-powered diagnostic and clinic management healthcare portal.

## Services Included
*   **Express.js API Server**: Entry point exposed on port `7860`.
*   **Flask Python ML Service**: Injects local prediction models, and dynamically fetches weights from the Hugging Face Model Hub on startup.
