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

const plasticWasteElement =
    document.getElementById("plasticWaste");

const paperWasteElement =
    document.getElementById("paperWaste");

const metalWasteElement =
    document.getElementById("metalWaste");

const ewasteWasteElement =
    document.getElementById("ewasteWaste");
const treesSavedElement =
    document.getElementById("treesSaved");

const wasteRecycledElement =
    document.getElementById("wasteRecycled");

const co2PreventedElement =
    document.getElementById("co2Prevented");
const topCategoryElement =
    document.getElementById("topCategory");

const goalProgressElement =
    document.getElementById("goalProgress");

const goalTextElement =
    document.getElementById("goalText");


const locationStatus =
    document.getElementById("locationStatus");

async function loadLogs() {

    try {

        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load data");
        }

        const logs = await response.json();

        if (!Array.isArray(logs)) {
            console.error("Invalid response:", logs);
            return;
        }

        logsDiv.innerHTML = "";

        let totalWaste = 0;
        let plasticWaste = 0;
        let paperWaste = 0;
        let metalWaste = 0;
        let ewasteWaste = 0;

        map.eachLayer(layer => {

            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }

        });

        logs.forEach(log => {

            const weight =
                parseFloat(log.weight) || 0;

            totalWaste += weight;

            switch (log.category) {

                case "Plastic":
                    plasticWaste += weight;
                    break;

                case "Paper":
                    paperWaste += weight;
                    break;

                case "Metal":
                    metalWaste += weight;
                    break;

                case "E-Waste":
                    ewasteWaste += weight;
                    break;

            }

            const logCard =
                document.createElement("div");

            logCard.className = "log-card";

            logCard.innerHTML = `

                <h3>${log.category}</h3>

                <p>⚖️ Weight: ${log.weight} kg</p>

                <p>📍 Latitude: ${log.latitude}</p>

                <p>📍 Longitude: ${log.longitude}</p>

                <p>🕒 ${new Date(
                    log.createdAt
                ).toLocaleString()}</p>

                ${
                    log.image
                        ? `
                        <div class="proof-badge">
                            📷 Proof Verified
                        </div>

                        <img
                            src="${log.image}"
                            alt="Waste Proof"
                        >
                        `
                        : ""
                }

            `;

            logsDiv.appendChild(logCard);

            if (
                log.latitude &&
                log.longitude
            ) {

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
            `${totalWaste.toFixed(1)} kg`;

        totalReportsElement.textContent =
            logs.length;

        if (plasticWasteElement) {
            plasticWasteElement.textContent =
                `${plasticWaste.toFixed(1)} kg`;
        }

        if (paperWasteElement) {
            paperWasteElement.textContent =
                `${paperWaste.toFixed(1)} kg`;
        }

        if (metalWasteElement) {
            metalWasteElement.textContent =
                `${metalWaste.toFixed(1)} kg`;
        }

        if (ewasteWasteElement) {
            ewasteWasteElement.textContent =
                `${ewasteWaste.toFixed(1)} kg`;
        }
        const treesSaved =
    (totalWaste * 0.5).toFixed(1);

const wasteRecycled =
    totalWaste.toFixed(1);

const treesSaved =
    (totalWaste * 0.5).toFixed(1);

const wasteRecycled =
    totalWaste.toFixed(1);

const co2Prevented =
    (totalWaste * 0.75).toFixed(1);

if (treesSavedElement) {
    treesSavedElement.textContent =
        treesSaved;
}

if (wasteRecycledElement) {
    wasteRecycledElement.textContent =
        `${wasteRecycled} kg`;
}

if (co2PreventedElement) {
    co2PreventedElement.textContent =
        `${co2Prevented} kg`;
}

/* Top Category */

let topCategory = "Plastic";
let maxWaste = plasticWaste;

if (paperWaste > maxWaste) {
    maxWaste = paperWaste;
    topCategory = "Paper";
}

if (metalWaste > maxWaste) {
    maxWaste = metalWaste;
    topCategory = "Metal";
}

if (ewasteWaste > maxWaste) {
    maxWaste = ewasteWaste;
    topCategory = "E-Waste";
}

if (topCategoryElement) {
    topCategoryElement.textContent =
        `${topCategory} (${maxWaste.toFixed(1)} kg)`;
}

/* Community Goal */

const goalTarget = 100;

const progress =
    Math.min(
        (totalWaste / goalTarget) * 100,
        100
    );

if (goalProgressElement) {
    goalProgressElement.style.width =
        `${progress}%`;
}

if (goalTextElement) {
    goalTextElement.textContent =
        `${totalWaste.toFixed(1)} / ${goalTarget} kg`;
}
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

                const formData =
                    new FormData();

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

                    const response =
                        await fetch(
                            API_URL,
                            {
                                method: "POST",
                                body: formData
                            }
                        );

                    if (!response.ok) {
                        throw new Error(
                            "Upload failed"
                        );
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