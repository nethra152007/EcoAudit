const API_URL = "https://ecoaudit-kgty.onrender.com/api/waste";

const map = L.map("map").setView([13.0827, 80.2707], 10);

L.tileLayer(
    "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    {
        attribution: "© OpenStreetMap contributors"
    }
).addTo(map);

const form = document.getElementById("wasteForm");
const logsDiv = document.getElementById("logs");

const totalWasteElement =
    document.getElementById("totalWaste");

const totalReportsElement =
    document.getElementById("totalReports");

const locationStatus =
    document.getElementById("locationStatus");

async function loadLogs() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load data");
        }

        const logs = await response.json();

        logsDiv.innerHTML = "";

        let totalWaste = 0;

        map.eachLayer(layer => {

            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }

        });

        if (!Array.isArray(logs)) {
            console.error("Invalid response:", logs);
            return;
        }

        logs.forEach(log => {

            const weight = parseFloat(log.weight);

            if (!isNaN(weight)) {
                totalWaste += weight;
            }

            const logCard = document.createElement("div");

            logCard.className = "log-card";

            logCard.innerHTML = `
                <h3>${log.category}</h3>

                <p>⚖️ Weight: ${log.weight} kg</p>

                <p>📍 Latitude: ${log.latitude}</p>

                <p>📍 Longitude: ${log.longitude}</p>

                <p>🕒 ${new Date(log.createdAt).toLocaleString()}</p>

                ${
                    log.image
                        ? `
                        <img
                            src="${log.image}"
                            alt="Waste Proof"
                            style="
                                width:100%;
                                max-height:250px;
                                object-fit:cover;
                                border-radius:12px;
                                margin-top:10px;
                            "
                        >
                        `
                        : ""
                }
            `;

            logsDiv.appendChild(logCard);

            if (log.latitude && log.longitude) {

                L.marker([
                    log.latitude,
                    log.longitude
                ])
                    .addTo(map)
                    .bindPopup(`
                        <b>${log.category}</b><br>
                        ${log.weight} kg
                    `);

            }

        });

        totalWasteElement.textContent =
            `${totalWaste} kg`;

        totalReportsElement.textContent =
            logs.length;

    }
    catch (error) {

        console.error(error);

        locationStatus.textContent =
            "❌ Failed to load reports";

    }

}

form.addEventListener(
    "submit",
    async (e) => {

        e.preventDefault();

        locationStatus.textContent =
            "📍 Getting location...";

        navigator.geolocation.getCurrentPosition(

            async (position) => {

                const formData = new FormData();

                formData.append(
                    "category",
                    document.getElementById("category").value
                );

                formData.append(
                    "weight",
                    document.getElementById("weight").value
                );

                formData.append(
                    "latitude",
                    position.coords.latitude
                );

                formData.append(
                    "longitude",
                    position.coords.longitude
                );

                const imageFile =
                    document.getElementById("image").files[0];

                if (imageFile) {

                    formData.append(
                        "image",
                        imageFile
                    );

                }

                try {

                    const response = await fetch(
                        API_URL,
                        {
                            method: "POST",
                            body: formData
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Upload failed");
                    }

                    locationStatus.textContent =
                        "✅ Waste report submitted";

                    form.reset();

                    loadLogs();

                }
                catch (error) {

                    console.error(error);

                    locationStatus.textContent =
                        "❌ Failed to submit report";

                }

            },

            () => {

                locationStatus.textContent =
                    "❌ Location permission denied";

            }

        );

    }
);

loadLogs();