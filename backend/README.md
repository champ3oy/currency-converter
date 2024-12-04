## Currency Converter

This simple currency converter built with nestjs and postgresql, it uses [exchangerate](https://www.exchangerate-api.com/) api for rates.

## Project setup

To run this project you need

- node.js
- postgresql v12 or higher
- redis
- [exchangerate](https://www.exchangerate-api.com/) api

Follow these steps to set up and run the project

**1. Then clone the repository and cd into the project directory**

```bash
$ git clone <repo-url>
cd currency-converter
```

**2. run `yarn install` to install dependencies**

```bash
$ yarn install
```

**3. Enviroment variables set up**
create a `.env` file the root directory and copy `.env.example`

```bash
# Application
PORT=3000
NODE_ENV=development

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=currency_converter

# JWT
JWT_SECRET=987654321

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# Frontend URL
FRONTEND_URL=http://localhost:3001

# Exchange Rate API
EXCHANGE_API_URL2=https://v6.exchangerate-api.com/v6
EXCHANGE_API_KEY2=YOUR_EXCHANGERATE_API_KEY #get one for free here https://www.exchangerate-api.com/
```

**4. Database set up**

```bash
# Using psql
psql -U postgres
CREATE DATABASE currency_converter;
```

make sure you have redis running aswell

## Compile and run the project

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```

## Run tests

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e
```

## How nonce is used to prevent replay attack

```
Client          Auth Guard       Redis         JWT Strategy      Exchange Service    Database
  |                 |             |                |                    |              |
  | POST /convert   |             |                |                    |              |
  |    with JWT     |             |                |                    |              |
  |---------------->|             |                |                    |              |
  |                 |             |                |                    |              |
  |                 |  Validate   |                |                    |              |
  |                 |------------>|                |                    |              |
  |                 |             |                |                    |              |
  |                 |             |  Check Nonce   |                    |              |
  |                 |             |--------------->|                    |              |
  |                 |             |                |                    |              |
  |                 |             | Delete Nonce   |                    |              |
  |                 |             |<---------------|                    |              |
  |                 |             |                |                    |              |
  |                 |             | Store New Nonce|                    |              |
  |                 |             |<---------------|                    |              |
  |                 |             |                |                    |              |
  |                 |             |                |  Convert Currency  |              |
  |                 |             |                |------------------->|              |
  |                 |             |                |                    |  Save Trans  |
  |                 |             |                |                    |------------->|
  |                 |             |                |                    |              |
  |    Response     |             |                |                    |              |
  |    + New Token  |             |                |                    |              |
  |<----------------|             |                |                    |              |
  |                 |             |                |                    |              |
```

## Known Issues

- exchangerate-api.com free tier has rate limits
- exchangerate-api.com provides rates every hour so the rates will not be realtime
