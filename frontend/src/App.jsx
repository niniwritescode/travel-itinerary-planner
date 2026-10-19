import { useState, useEffect } from "react";

const API = import.meta.env.VITE_API_URL || "http://localhost:8000";
const post = (path, body) =>
  fetch(API + path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) })
    .then((r) => { if (!r.ok) throw new Error("Request failed"); return r.json(); });

const toText = (t) =>
  `${t.destination}\n${t.summary}\nEstimated cost: ${t.estimated_total_cost}\n\n` +
  (t.days || []).map((d) => `Day ${d.day}: ${d.theme}\n` +
    (d.activities || []).map((a) => `  ${a.time} - ${a.place} (${a.cost})`).join("\n")).join("\n\n");

function Itinerary({ t }) {
  return (
    <section className="trip">
      <h2>{t.destination}</h2>
      <p>{t.summary}</p>
      <p className="cost">Estimated cost: {t.estimated_total_cost}</p>
      {(t.days || []).map((d) => (
        <div className="day" key={d.day}>
          <h3>Day {d.day}: {d.theme}</h3>
          {(d.activities || []).map((a, i) => (
            <div className="stop" key={i}>
              <span className="time">{a.time}</span>
              <div>
                <strong>{a.place}</strong>
                <p>{a.description}</p>
                <small>{a.travel_time} · {a.cost}</small>
              </div>
            </div>
          ))}
          <p><b>Eat:</b> {d.dining}</p>
          <p><b>Stay:</b> {d.stay_tip}</p>
        </div>
      ))}
    </section>
  );
}

export default function App() {
  const [form, setForm] = useState({ destination: "", days: 3, budget: "medium", interests: "", vibe: "relaxed" });
  const [trip, setTrip] = useState(null);
  const [saved, setSaved] = useState([]);
  const [ideas, setIdeas] = useState([]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const body = () => ({ ...form, days: Number(form.days) });

  const loadSaved = () => fetch(API + "/trips").then((r) => r.json()).then(setSaved).catch(() => {});
  useEffect(() => { loadSaved(); }, []);

  const generate = async (e) => {
    e.preventDefault(); setBusy(true); setMsg("");
    try { setTrip(await post("/itinerary", body())); }
    catch { setMsg("Could not build the itinerary. Check the destination and try again."); }
    setBusy(false);
  };
  const suggest = async () => {
    setMsg("");
    try { setIdeas((await post("/recommend", body())).destinations || []); }
    catch { setMsg("Could not load suggestions."); }
  };
  const save = async () => {
    try { await post("/trips", { destination: trip.destination, days: Number(form.days), preferences: form, itinerary: trip }); setMsg("Trip saved."); loadSaved(); }
    catch { setMsg("Could not save the trip."); }
  };
  const remove = async (id) => { await fetch(`${API}/trips/${id}`, { method: "DELETE" }); loadSaved(); };
  const copy = () => navigator.clipboard.writeText(toText(trip)).then(() => setMsg("Itinerary copied."));

  return (
    <main>
      <h1>Plan a trip that fits how you travel</h1>
      <form onSubmit={generate}>
        <input placeholder="Destination" value={form.destination} onChange={set("destination")} />
        <input type="number" min="1" max="14" value={form.days} onChange={set("days")} aria-label="Days" />
        <select value={form.budget} onChange={set("budget")}><option>low</option><option>medium</option><option>premium</option></select>
        <select value={form.vibe} onChange={set("vibe")}><option>relaxed</option><option>adventure</option><option>romantic</option><option>cultural</option></select>
        <input placeholder="Interests (food, hiking, museums)" value={form.interests} onChange={set("interests")} />
        <div className="row">
          <button disabled={busy}>{busy ? "Building..." : "Build itinerary"}</button>
          <button type="button" className="ghost" onClick={suggest}>Suggest destinations</button>
        </div>
      </form>
      {ideas.length > 0 && (
        <ul className="ideas">{ideas.map((d) => (
          <li key={d.name}><button className="ghost" onClick={() => setForm({ ...form, destination: d.name })}>{d.name}</button> {d.why}</li>
        ))}</ul>
      )}
      {msg && <p className="msg" role="status">{msg}</p>}
      {trip && (<>
        <div className="row"><button onClick={save}>Save trip</button><button className="ghost" onClick={copy}>Copy as text</button></div>
        <Itinerary t={trip} />
      </>)}
      <h2>Saved trips</h2>
      {saved.length === 0 && <p>No saved trips yet. Build one and save it.</p>}
      <ul className="saved">{saved.map((s) => (
        <li key={s.id}>
          <span>{s.destination} · {s.days} days</span>
          <span><button className="ghost" onClick={() => setTrip(s.itinerary)}>View</button> <button className="ghost" onClick={() => remove(s.id)}>Delete</button></span>
        </li>
      ))}</ul>
    </main>
  );
}
