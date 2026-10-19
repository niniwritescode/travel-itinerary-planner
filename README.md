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

## Live demo
- App: https://travel-itinerary-planner-beryl.vercel.app
- API docs: https://travel-itinerary-planner-ce17.onrender.com/docs

## Screenshots
![Form](Screenshot_2026-10-19_163923.png)
![Itinerary](Screenshot_2026-10-19_163934.png)
![Saved trips](Screenshot_2026-10-19_163946.png)
![Supabase table](Screenshot_2026-10-19_161528.png)
![API docs](Screenshot_2026-10-19_161620.png)
