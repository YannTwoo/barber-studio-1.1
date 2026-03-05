const dateSelect = document.getElementById("date")
const heureSelect = document.getElementById("heure")
const form = document.getElementById("reservationForm")
const message = document.getElementById("message")
const selectService = document.getElementById("service")
const prixElement = document.getElementById("prixService")

const horaires = ["10:30","11:00","11:30","12:00"]

// Prix des services
const prixServices = {
  "Standard": 5,
  "+ Barbe": 5.5,
  "+ Finition Ciseau": 6,
  "+ Barbe & Finition Ciseau": 6.5
} 

// Mettre à jour le prix quand on change le service
selectService.addEventListener("change", ()=>{
  const serviceChoisi = selectService.value
  if(prixServices[serviceChoisi]){
    prixElement.textContent = `Prix : ${prixServices[serviceChoisi]}€`
  } else {
    prixElement.textContent = "Prix : 0€"
  }
})

// Générer les 7 prochains jours
function generateDates(){
  const today = new Date()
  for(let i=0;i<7;i++){
    const d = new Date()
    d.setDate(today.getDate()+i)
    const value = d.toISOString().split("T")[0]
    const option = document.createElement("option")
    option.value = value
    option.textContent = d.toLocaleDateString("fr-FR")
    dateSelect.appendChild(option)
  }
}

generateDates()

// Récupérer les réservations et bloquer les créneaux déjà pris
async function loadReservations(){
  const res = await fetch("/api/reservations")
  const reservations = await res.json()

  dateSelect.addEventListener("change", ()=>{
    const selectedDate = dateSelect.value
    heureSelect.innerHTML = '<option value="">Choisir un horaire</option>'
    horaires.forEach(h=>{
      const option = document.createElement("option")
      option.value = h
      option.textContent = h
      const taken = reservations.find(r=> r.date === selectedDate && r.heure === h)
      if(taken){
        option.disabled = true
        option.textContent = h + " (complet)"
      }
      heureSelect.appendChild(option)
    })
  })
}

loadReservations()

// Envoyer la réservation
form.addEventListener("submit", async e=>{
  e.preventDefault()
  const nom = document.getElementById("nom").value
  const coupe = document.getElementById("coupe").value
  const date = dateSelect.value
  const heure = heureSelect.value
  const service = selectService.value

  const res = await fetch("/api/reserver", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ nom, coupe, date, heure, service })
  })

  const data = await res.json()
  if(data.success){
    message.textContent = "Réservation confirmée"
    form.reset()
    prixElement.textContent = "Prix : 0€"
  } else {
    message.textContent = data.error
  }
})
