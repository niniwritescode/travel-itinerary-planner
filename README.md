# Personalized Travel Itinerary Planner

AI-powered full-stack app that builds day-by-day trip itineraries from your destination, budget, interests and vibe.

**Stack:** React + Vite (Vercel) · FastAPI (Render) · Supabase (database) · Groq (Llama) for generation

## Features
- Preference form: destination, days, budget, interests, vibe
- Structured prompt that groups nearby places, orders activities by time and adds travel time
- Vibe-based personalization (relaxed, adventure, romantic, cultural)
- Destination suggestions from the same preferences
- Save, view and delete trips (Supabase)
- Copy the itinerary as text

## Run locally
1. Supabase: create a project, then run `backend/schema.sql` in the SQL editor.
2. Backend:
   ```
   cd backend
   pip install -r requirements.txt
   cp .env.example .env   # fill in your keys
   uvicorn main:app --reload
   ```
   API docs at http://localhost:8000/docs
3. Frontend:
   ```
   cd frontend
   npm install
   cp .env.example .env
   npm run dev
   ```

## Deploy
- **Render (backend):** root directory `backend`, build `pip install -r requirements.txt`, start `uvicorn main:app --host 0.0.0.0 --port $PORT`. Add the 4 env vars from `.env.example`.
- **Vercel (frontend):** root directory `frontend`, add `VITE_API_URL` = your Render URL.

## Screenshots
Add screenshots of the form, a generated itinerary, and the saved trips list here.
