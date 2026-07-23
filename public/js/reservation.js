const dateSelect = document.getElementById("date");
const heureSelect = document.getElementById("heure");
const form = document.getElementById("reservationForm");
const message = document.getElementById("message");
const selectService = document.getElementById("service");
const prixElement = document.getElementById("prixService");

const hourButtons = document.querySelectorAll(".hour-btn");

const horaires = [
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:45",
    "13:30"
];

const prixServices = {
    "Standard": 5,
    "+ Barbe": 5.5,
    "+ Finition Ciseau": 6,
    "+ Barbe & Finition Ciseau": 6.5
};

let reservations = [];

selectService.addEventListener("change", () => {

    prixElement.textContent =
        prixServices[selectService.value]
            ? `Prix : ${prixServices[selectService.value]}€`
            : "Prix : 0€";

});

const calendar=document.getElementById("calendar");

function generateDates(){

calendar.innerHTML="";

dateSelect.innerHTML="";

const today=new Date();

for(let i=0;i<14;i++){

const d=new Date();

d.setDate(today.getDate()+i);

const value=d.toISOString().split("T")[0];

const option=document.createElement("option");

option.value=value;

dateSelect.appendChild(option);

const card=document.createElement("div");

card.className="day";

if(i===0){

card.classList.add("active");

dateSelect.value=value;

}

card.innerHTML=`

<div class="day-name">

${d.toLocaleDateString("fr-FR",{weekday:"short"})}

</div>

<div class="day-number">

${d.getDate()}

</div>

<div class="day-month">

${d.toLocaleDateString("fr-FR",{month:"short"})}

</div>

`;

card.onclick=()=>{

document.querySelectorAll(".day").forEach(c=>c.classList.remove("active"));

card.classList.add("active");

dateSelect.value=value;

updateHours();

};

calendar.appendChild(card);

}

}

generateDates();

async function loadReservations() {

    const res = await fetch("/api/reservations");

    reservations = await res.json();

    updateHours();

}

function updateHours() {

    const date = dateSelect.value;

    heureSelect.innerHTML = "";

    hourButtons.forEach(btn => {

        const hour = btn.dataset.hour;

        const reserved = reservations.find(r =>
            r.date === date &&
            r.heure === hour
        );

        btn.disabled = false;

        btn.classList.remove("locked");

        btn.textContent = hour;

        if (reserved) {

            btn.disabled = true;

            btn.classList.add("locked");

            btn.textContent = "🔒 " + hour;

        }

    });

}

dateSelect.addEventListener("change", updateHours);

hourButtons.forEach(button => {

    button.addEventListener("click", () => {

        if (button.disabled) return;

        hourButtons.forEach(b => b.classList.remove("active"));

        button.classList.add("active");

        heureSelect.value = button.dataset.hour;

    });

});

form.addEventListener("submit", async e => {

    e.preventDefault();

    const body = {

        nom: nom.value,

        coupe: coupe.value,

        date: dateSelect.value,

        heure: heureSelect.value,

        service: selectService.value

    };

    const res = await fetch("/api/reserver", {

        method: "POST",

        headers: {

            "Content-Type": "application/json"

        },

        body: JSON.stringify(body)

    });

    const data = await res.json();

    if (data.success) {

        showToast("Réservation confirmée");

        form.reset();

        prixElement.textContent = "Prix : 0€";

        hourButtons.forEach(b => b.classList.remove("active"));

        await loadReservations();

    }

    else {

        showToast(data.error);

    }

});

function showToast(text) {

    message.textContent = text;

    message.classList.add("show");

    setTimeout(() => {

        message.classList.remove("show");

    }, 3500);

}

loadReservations();
const resumeDate=document.getElementById("resumeDate");
const resumeHeure=document.getElementById("resumeHeure");
const resumeService=document.getElementById("resumeService");
const resumePrix=document.getElementById("resumePrix");

function updateSummary(){

resumeDate.textContent="Date : "+dateSelect.options[dateSelect.selectedIndex]?.text;

resumeHeure.textContent="Heure : "+(heureSelect.value||"-");

resumeService.textContent="Service : "+(selectService.value||"-");

resumePrix.textContent=prixElement.textContent;

}

dateSelect.addEventListener("change",updateSummary);

heureSelect.addEventListener("change",updateSummary);

selectService.addEventListener("change",updateSummary);

hourButtons.forEach(btn=>{

btn.addEventListener("click",updateSummary);

});

updateSummary();
