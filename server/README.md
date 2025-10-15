# Battleship Server

Backend server for the Battleship game, powered by Supabase and WebSockets.

## 🚀 Quick Start

### 1. Setup Supabase
Follow the comprehensive guide in **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)**

### 2. Install Dependencies
```bash
yarn install
```

### 3. Configure Environment
```bash
cp .env.sample .env
# Edit .env with your Supabase credentials
```

### 4. Run the Server
```bash
# Production
yarn start

# Development (with auto-reload)
yarn devstart
```

## 📋 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `SUPABASE_URL` | Your Supabase project URL | `https://xxxxx.supabase.co` |
| `SUPABASE_SERVICE_KEY` | Service role key (not anon key!) | `eyJhbGc...` |

## 🏗️ Architecture

### Tech Stack
- **Express.js** - Web server
- **express-ws** - WebSocket support for real-time gameplay
- **Supabase** - PostgreSQL database (free tier compatible)
- **shortid** - Unique match ID generation

### Database Schema
```sql
matches
├── id (TEXT, PK)
├── player_one (TEXT)
├── player_two (TEXT)
├── player_one_ship_placements (JSONB)
├── player_two_ship_placements (JSONB)
├── player_one_attack_placements (JSONB)
├── player_two_attack_placements (JSONB)
├── turn (TEXT)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 📡 API Endpoints

### REST API

#### Create Match
```http
POST /match
Content-Type: application/json

{
  "uid": "player-user-id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "match-id",
    "player_one": "player-user-id",
    "player_two": null,
    ...
  }
}
```

### WebSocket API

#### Connect to Match
```
ws://localhost:3001/match/{match-id}
```

#### Message Types

**1. Authenticate**
```json
{
  "action": "AUTH",
  "uid": "player-user-id"
}
```

**2. Place Ships**
```json
{
  "action": "SHIP_PLACEMENTS",
  "uid": "player-user-id",
  "placements": {
    "0": {"0": true, "1": true, ...},
    "1": {"0": false, ...},
    ...
  },
  "turn": "player-user-id"
}
```

**3. Attack**
```json
{
  "action": "ATTACK",
  "uid": "player-user-id",
  "row": 5,
  "col": 3,
  "turn": "opponent-user-id"
}
```
