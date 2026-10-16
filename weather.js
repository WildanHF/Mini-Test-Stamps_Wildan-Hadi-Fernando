const API_KEY = process.env.OPENWEATHER_API_KEY;

if (!API_KEY) {
  console.error("Error: environment variable OPENWEATHER_API_KEY belum diset.");
  process.exit(1);
}

const URL =
  "https://api.openweathermap.org/data/2.5/forecast" +
  `?q=Jakarta,ID&units=metric&appid=${API_KEY}`;

const TZ_OFFSET = 7 * 3600; 
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


const toLocal = (dt) => new Date((dt + TZ_OFFSET) * 1000);

function formatDate(d) {
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${DAYS[d.getUTCDay()]}, ${day} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

async function main() {
  const res = await fetch(URL);
  if (!res.ok) {
    throw new Error(`Request gagal: ${res.status} ${res.statusText}`);
  }
  const data = await res.json();

  const perDay = new Map();
  for (const item of data.list) {
    const local = toLocal(item.dt);
    const key = local.toISOString().slice(0, 10);
    const diff = Math.abs(local.getUTCHours() - 12);
    const current = perDay.get(key);
    if (!current || diff < current.diff) {
      perDay.set(key, { diff, local, temp: item.main.temp });
    }
  }

  console.log("Weather Forecast:");
  [...perDay.values()].slice(0, 5).forEach(({ local, temp }) => {
    console.log(`${formatDate(local)}: ${temp.toFixed(2)}°C`);
  });
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});