import os, json
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from groq import Groq
from supabase import create_client

load_dotenv()
app = FastAPI(title="Personalized Travel Itinerary Planner")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])

groq_client = Groq(api_key=os.environ["GROQ_API_KEY"])
supabase = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_KEY"])
MODEL = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")


class TripRequest(BaseModel):
    destination: str = ""
    days: int = 3
    budget: str = "medium"
    interests: str = ""
    vibe: str = "relaxed"


class SaveTrip(BaseModel):
    destination: str
    days: int
    preferences: dict
    itinerary: dict


def ask_groq(prompt: str) -> dict:
    res = groq_client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert travel planner. Reply with valid JSON only."},
            {"role": "user", "content": prompt},
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
    )
    return json.loads(res.choices[0].message.content)


def build_prompt(r: TripRequest) -> str:
    # Epic 3.2 prompt structuring + 4.2 route/time optimization + 4.3 vibe personalization
    return f"""Create a {r.days}-day itinerary for {r.destination}.
Budget: {r.budget}. Interests: {r.interests or 'general sightseeing'}. Vibe: {r.vibe}.
Match the pace and activity style to the vibe. Group nearby places on the same day,
order activities by time, and include travel time between stops.
Return JSON exactly like:
{{"destination": "", "summary": "", "estimated_total_cost": "",
"days": [{{"day": 1, "theme": "", "activities": [{{"time": "", "place": "",
"description": "", "travel_time": "", "cost": ""}}], "dining": "", "stay_tip": ""}}]}}"""


@app.get("/")
def health():
    return {"status": "ok"}


@app.post("/recommend")  # Epic 3.3 destination recommendations
def recommend(r: TripRequest):
    prompt = f"""Suggest 5 destinations for a {r.budget} budget, interests: {r.interests or 'any'},
vibe: {r.vibe}. Return JSON: {{"destinations": [{{"name": "", "why": ""}}]}}"""
    try:
        return ask_groq(prompt)
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/itinerary")  # Epic 4.1 daily itinerary builder
def itinerary(r: TripRequest):
    if not r.destination.strip():
        raise HTTPException(400, "Destination is required")
    try:
        return ask_groq(build_prompt(r))
    except Exception as e:
        raise HTTPException(500, str(e))


@app.post("/trips")  # Epic 5.1 save
def save_trip(t: SaveTrip):
    return supabase.table("trips").insert(t.model_dump()).execute().data[0]


@app.get("/trips")
def list_trips():
    return supabase.table("trips").select("*").order("created_at", desc=True).execute().data


@app.delete("/trips/{trip_id}")
def delete_trip(trip_id: int):
    supabase.table("trips").delete().eq("id", trip_id).execute()
    return {"deleted": trip_id}
