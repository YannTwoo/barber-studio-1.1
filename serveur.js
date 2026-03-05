const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { createClient } = require("@supabase/supabase-js");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

const supabase = createClient(
process.env.SUPABASE_URL,
process.env.SUPABASE_KEY
);

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

const horaires = ["10:30", "11:00", "11:30", "12:00"];

/*
GET reservations (public)
retourne uniquement date + heure
*/
app.get("/api/reservations", async (req, res) => {
const { data, error } = await supabase
.from("reservations")
.select("date, heure");

if (error) {
return res.status(500).json({ error: error.message });
}

res.json(data);
});

/*
GET reservations admin
*/
app.get("/api/admin/reservations", async (req, res) => {

const password = req.headers["admin-password"];

if (password !== ADMIN_PASSWORD) {
return res.status(401).json({ error: "Unauthorized" });
}

const { data, error } = await supabase
.from("reservations")
.select("*")
.order("date");

if (error) {
return res.status(500).json({ error: error.message });
}

res.json(data);

});

/*
POST reservation
*/
app.post("/api/reserver", async (req, res) => {

const { nom, coupe, date, heure, service } = req.body;

if (!nom || !coupe || !date || !heure || !service) {
return res.status(400).json({ error: "Champs manquants" });
}

if (!horaires.includes(heure)) {
return res.status(400).json({ error: "Horaire invalide" });
}

// vérifier si déjà pris
const { data: existing } = await supabase
.from("reservations")
.select("*")
.eq("date", date)
.eq("heure", heure);

if (existing.length > 0) {
return res.status(400).json({ error: "Créneau déjà réservé" });
}

const { error } = await supabase
.from("reservations")
.insert([
{
nom,
coupe,
date,
heure,
service
}
]);

if (error) {
return res.status(500).json({ error: error.message });
}

res.json({ success: true });

});

/*
DELETE reservation admin
*/
app.delete("/api/admin/reservations/:id", async (req, res) => {

const password = req.headers["admin-password"];

if (password !== ADMIN_PASSWORD) {
return res.status(401).json({ error: "Unauthorized" });
}

const id = req.params.id;

const { error } = await supabase
.from("reservations")
.delete()
.eq("id", id);

if (error) {
return res.status(500).json({ error: error.message });
}

res.json({ success: true });

});

app.listen(process.env.PORT, () => {
console.log("Serveur lancé sur le port " + process.env.PORT);
});
