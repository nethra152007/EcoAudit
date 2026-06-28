const map = L.map('map').setView([13.0827, 80.2707], 10);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
).addTo(map);

const form = document.getElementById("wasteForm");
const logsDiv = document.getElementById("logs");

form.addEventListener(
"submit",
async (e) => {

e.preventDefault();

navigator.geolocation.getCurrentPosition(
async (position) => {

const data = {
category: document.getElementById("category").value,
weight: document.getElementById("weight").value,
latitude: position.coords.latitude,
longitude: position.coords.longitude
};

await fetch(
"http://localhost:5000/api/waste",
{
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify(data)
}
);

document.getElementById("weight").value = "";

loadLogs();

}
);

}
);

async function loadLogs() {

const res = await fetch(
"http://localhost:5000/api/waste"
);

const logs = await res.json();

logsDiv.innerHTML = "";

// Remove old markers
map.eachLayer(layer => {
if (layer instanceof L.Marker) {
map.removeLayer(layer);
}
});

logs.forEach(log => {

logsDiv.innerHTML += `
<div class="log-card">
<p><strong>${log.category}</strong> - ${log.weight} kg</p>
</div>
`;

L.marker([
log.latitude,
log.longitude
])
.addTo(map)
.bindPopup(
`${log.category} - ${log.weight} kg`
);

});

}

loadLogs();