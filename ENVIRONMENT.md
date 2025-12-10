# Environment Variables

Supabase-powered Battleship requires a few environment variables across web, mobile, and server. Use `.env.example` as a starting point.

## Required
- `SUPABASE_URL` / `VITE_SUPABASE_URL` / `MOBILE_SUPABASE_URL`: Your Supabase project URL.
- `SUPABASE_ANON_KEY` / `VITE_SUPABASE_ANON_KEY` / `MOBILE_SUPABASE_ANON_KEY`: Supabase anon key for client SDKs.
- `SUPABASE_SERVICE_ROLE_KEY`: Only for trusted server-side contexts (never ship to client).
- `API_URL` / `SOCKET_URL`: Backend REST/WebSocket endpoints used by the mobile app.
- `VITE_SOCKET_URL`: WebSocket endpoint used by the Vite web client (must start with `wss://` in production).
- `MOBILE_SOCKET_URL`: WebSocket endpoint used by the React Native app.

## Usage
- Web (Vite) reads `VITE_*` variables at build time; configure them in your hosting provider (Netlify/Vercel).
- Mobile reads from your native env/config. You can use `.env` + a library like `react-native-dotenv` or inject via CI.
- Never commit real secrets. Keep `.env` files local and set environment variables in CI/CD secrets.
