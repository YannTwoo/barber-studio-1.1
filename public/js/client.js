const tbody = document.querySelector("#planning tbody")

async function loadPlanning(){

try{
const res = await fetch("/api/reservations")
const data = await res.json()

tbody.innerHTML = ""

data.forEach(r=>{
const tr = document.createElement("tr")
const tdDate = document.createElement("td")
tdDate.textContent = new Date(r.date).toLocaleDateString("fr-FR")
const tdHeure = document.createElement("td")
tdHeure.textContent = r.heure
tr.appendChild(tdDate)
tr.appendChild(tdHeure)
tbody.appendChild(tr)
})

}catch(err){
tbody.innerHTML = "<tr><td colspan='2'>Impossible de charger le planning</td></tr>"
console.error(err)
}

}

loadPlanning()
