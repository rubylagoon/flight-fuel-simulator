// Simple demo version of the simulator
const app = document.getElementById("app");

let blend = 0;

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
      <input id="dest" placeholder="Type a destination">
      <button onclick="calculate()">Calculate</button>
    </div>
  `;
}

function calculate() {
  const dest = document.getElementById("dest").value || "Unknown";

  const distance = 1000; // placeholder
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
      <p>Destination: ${dest}</p>
      <p>Fuel burn: ${fuelBurn.toFixed(0)} kg</p>
      <p>CO₂ (Traditional): ${co2Traditional.toFixed(0)} kg</p>
      <p>CO₂ (Your Fuel): ${co2Bio.toFixed(0)} kg</p>
      <p>CO₂ Saved: ${saved.toFixed(0)} kg (${percent.toFixed(1)}%)</p>
      <button onclick="showIntro()">Restart</button>
    </div>
  `;
}

showIntro();
