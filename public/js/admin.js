const loginForm = document.getElementById("loginForm")
const adminPasswordInput = document.getElementById("adminPassword")
const adminPanel = document.getElementById("adminPanel")
const adminTableBody = document.querySelector("#adminTable tbody")
const message = document.getElementById("message")

let adminPassword = "admin123" // correspond à .env, utilisé côté serveur pour vérif API

let headers = {}

// login admin
loginForm.addEventListener("submit", async e=>{
e.preventDefault()

const pwd = adminPasswordInput.value

headers = { "admin-password": pwd }

try{
const res = await fetch("/api/admin/reservations",{ headers })
if(res.status !== 200) throw new Error("Mot de passe incorrect")
const data = await res.json()

loginForm.style.display="none"
adminPanel.style.display="block"

populateTable(data)

}catch(err){
message.textContent="Mot de passe incorrect"
console.error(err)
}

})

// remplir le tableau
function populateTable(data){
adminTableBody.innerHTML=""

data.forEach(r=>{
const tr = document.createElement("tr")

tr.innerHTML=`

<td>${r.nom}</td>
<td>${r.coupe}</td>
<td>${new Date(r.date).toLocaleDateString("fr-FR")}</td>
<td>${r.heure}</td>
<td>${r.service}</td>
<td><button data-id="${r.id}">Supprimer</button></td>
`

adminTableBody.appendChild(tr)
})

// ajouter événement suppression
document.querySelectorAll("#adminTable button").forEach(btn=>{
btn.addEventListener("click", async ()=>{
const id = btn.dataset.id

try{
const res = await fetch("/api/admin/reservations/"+id,{
method:"DELETE",
headers
})
const data = await res.json()
if(data.success){
btn.closest("tr").remove()
}else{
alert(data.error)
}
}catch(err){
console.error(err)
alert("Erreur suppression")
}
})
})
}
