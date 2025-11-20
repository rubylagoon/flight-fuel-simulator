let airports = [];
let blend = 0;

const app = document.getElementById("app");

async function loadAirports() {
  const res = await fetch("airports.json");
  airports = await res.json();
}

function haversine(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = v => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a = Math.sin(dLat/2)**2 +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon/2)**2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

function findNearestAirport(term) {
  const t = term.toLowerCase();
  let best = null;
  let score = Infinity;

  for (const ap of airports) {
    const text = (ap.city + " " + ap.name + " " + ap.iata).toLowerCase();
    if (text.includes(t)) {
      return ap;
    }
    // fallback: choose first if no direct match
    if (score === Infinity) best = ap;
  }
  return best;
}

function showIntro() {
  app.innerHTML = `
    <div class="screen">
      <button onclick="showFuel()">Start</button>
    </div>
  `;
}

function showFuel() {
  app.innerHTML = `
    <div class="screen">
      <h2>Select Fuel Type</h2>
      <button onclick="setFuel(0)">Traditional Jet Fuel</button>
      <button onclick="setFuel(0.2)">20% Biofuel</button>
      <button onclick="setFuel(0.5)">50% Biofuel</button>
      <button onclick="setFuel(1)">100% SAF</button>
    </div>
  `;
}

function setFuel(b) {
  blend = b;
  showDestination();
}

function showDestination() {
  app.innerHTML = `
    <div class="screen">
      <h2>Destination</h2>
      <input id="dest" placeholder="City or Airport">
      <button onclick="calculate()">Calculate</button>
    </div>
  `;
}

function calculate() {
  const term = document.getElementById("dest").value;
  const dest = findNearestAirport(term);
  const origin = airports.find(a => a.iata === "LHR");

  const distance = haversine(origin.lat, origin.lon, dest.lat, dest.lon);
  const fuelBurn = distance * 3.6;
  const co2Traditional = fuelBurn * 3.16;
  const reductionFactor = 0.8;
  const effective = 1 - (blend * reductionFactor);
  const co2Bio = co2Traditional * effective;
  const saved = co2Traditional - co2Bio;
  const percent = (saved / co2Traditional) * 100;

  app.innerHTML = `
    <div class="screen">
      <h2>Results</h2>
      <p>Destination: ${dest.city} (${dest.iata})</p>
      <p>Distance: ${distance.toFixed(0)} km</p>
      <p>Fuel burn: ${fuelBurn.toFixed(0)} kg</p>
      <p>CO₂ (Traditional): ${co2Traditional.toFixed(0)} kg</p>
      <p>CO₂ (Your Fuel): ${co2Bio.toFixed(0)} kg</p>
      <p>CO₂ Saved: ${saved.toFixed(0)} kg (${percent.toFixed(1)}%)</p>
      <button onclick="showIntro()">Restart</button>
    </div>
  `;
}

loadAirports().then(showIntro);
