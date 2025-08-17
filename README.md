# PokemonAPI
<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg" alt="Donate us"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow" alt="Follow us on Twitter"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Clone the repository

```bash
git clone https://github.com/DionysusDT/pokemon-nest-backend.git
cd pokemon-nest-backend
```

## Start PostgreSQL using Docker Compose:

```bash
# docker-compose up -d
```

## Install dependencies:
npm install

## Create a `.env` file in the project root:
 ```env
   PORT=3000
   NODE_ENV=local
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/pokeapi
   AUTH_TOKEN_SECRET=your_secret_key_here
   AUTH_TOKEN_EXPIRES=1d
```

## Start the NestJS server:
 ```
npm run start:dev
```
API will be available at: `http://localhost:${PORT}` (default: 3000).

  ## 🚀 Implemented API

### Auth
- `POST /auth/signup` – Register new account
- `POST /auth/login` – Login and receive access token
- `POST /auth/logout` – Logout current session
- `GET /auth/profile` – Get current user profile

### Pokemon
- `POST /pokemon/import-csv` – Import Pokemon list from CSV file
- `GET /pokemon` – Get paginated list of Pokemon
- `GET /pokemon/{id}` – Get Pokemon detail by ID

### Settings
- `GET /settings/pokemon` – Get user Pokemon settings
- `POST /settings/pokemon` – Create user Pokemon settings.
  
  **Requirement**: User must be logged in.  
  **Purpose**: Save filter preferences (such as Pokemon types and speed ranges). These settings will be used to render dynamic queries on the frontend.  
  
  Example payload:  
  ```json
  {
    "types": [
      "Normal", "Fire", "Water", "Grass", "Electric", "Ice",
      "Fighting", "Poison", "Ground", "Flying",
      "Psychic", "Bug", "Rock", "Ghost", "Dragon",
      "Dark", "Steel", "Fairy"
    ],
    "speedRanges": [
      { "label": "0 – 50", "value": "0-50" },
      { "label": "51 – 100", "value": "51-100" },
      { "label": "101 – 150", "value": "101-150" },
      { "label": "151 – 200", "value": "151-200" },
      { "label": "201 – 255", "value": "201-255" }
    ]
  }
- `PUT /settings/pokemon` – Update user Pokemon settings

### Favorites
- `GET /favorites/{pokemonId}/is-favorite` – Check if Pokemon is in favorites
- `POST /favorites/{pokemonId}` – Add Pokemon to favorites
- `DELETE /favorites/{pokemonId}` – Remove Pokemon from favorites

---

## 📖 API Documentation

This project provides interactive API documentation via **Swagger UI**.
- After running the project, open your browser at:  
  👉 [http://localhost:3000/docs](http://localhost:3000/docs)  


