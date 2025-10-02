// single-file Node/Express backend with car rental + CSV analytics endpoints
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import csv from 'csv-parser';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const upload = multer({ dest: path.join(__dirname, 'uploads/') });

// In-memory stores
const cars = new Map(); // carId -> { carId, brand, model, pricePerDay, available }
const customers = new Map(); // customerId -> { customerId, name }
const rentals = []; // { carId, customerId, days, startAt, id }
const rentalHistory = []; // finished rentals
const salesDataFiles = new Map(); // filename -> parsed data (array of objects)

// utils
const genId = (prefix = '') => prefix + Math.random().toString(36).slice(2, 9);
const nowISO = () => new Date().toISOString();

// Seed a few cars
[
  { carId: 'C001', brand: 'Toyota', model: 'Fortuner', pricePerDay: 60, available: true },
  { carId: 'C002', brand: 'Hyundai', model: 'Creta', pricePerDay: 70, available: true },
  { carId: 'C003', brand: 'Mahindra', model: 'Thar', pricePerDay: 150, available: true },
  { carId: 'C004', brand: 'Tesla', model: 'Model 3', pricePerDay: 200, available: true },
  { carId: 'C005', brand: 'BMW', model: 'X5', pricePerDay: 250, available: true }
].forEach(c => cars.set(c.carId, c));

// ========== Car API ==========
app.get('/cars', (req, res) => {
  const arr = Array.from(cars.values());
  res.json(arr);
});

app.post('/cars', (req, res) => {
  const { brand, model, pricePerDay } = req.body;
  if (!brand || !model || !pricePerDay) return res.status(400).json({ error: 'brand, model, pricePerDay required' });
  const carId = genId('C');
  const car = { carId, brand, model, pricePerDay: Number(pricePerDay), available: true };
  cars.set(carId, car);
  res.status(201).json(car);
});

app.get('/cars/:id', (req, res) => {
  const car = cars.get(req.params.id);
  if (!car) return res.status(404).json({ error: 'car not found' });
  res.json(car);
});

// search by brand/model query ?q=
app.get('/cars/search', (req, res) => {
  const q = (req.query.q || '').toLowerCase();
  const result = Array.from(cars.values()).filter(c => c.brand.toLowerCase().includes(q) || c.model.toLowerCase().includes(q));
  res.json(result);
});

// ========== Rental API ==========
app.post('/rent', (req, res) => {
  const { carId, customerName, days } = req.body;
  if (!carId || !customerName || !days) return res.status(400).json({ error: 'carId, customerName, days required' });
  const car = cars.get(carId);
  if (!car) return res.status(404).json({ error: 'car not found' });
  if (!car.available) return res.status(409).json({ error: 'car not available' });

  const customerId = genId('CUS');
  const customer = { customerId, name: customerName };
  customers.set(customerId, customer);

  car.available = false;
  cars.set(carId, car);

  const rentalId = genId('R');
  const rental = { id: rentalId, carId, customerId, days: Number(days), startAt: nowISO() };
  rentals.push(rental);
  rentalHistory.push({ ...rental, action: 'rented' });

  res.status(201).json({ rental, totalPrice: car.pricePerDay * Number(days) });
});

app.post('/return', (req, res) => {
  const { carId } = req.body;
  if (!carId) return res.status(400).json({ error: 'carId required' });
  const idx = rentals.findIndex(r => r.carId === carId);
  if (idx === -1) return res.status(404).json({ error: 'rental not found' });

  const rental = rentals.splice(idx, 1)[0];
  const car = cars.get(carId);
  if (car) { car.available = true; cars.set(carId, car); }

  rentalHistory.push({ ...rental, returnedAt: nowISO(), action: 'returned' });
  res.json({ message: 'car returned', rental });
});

app.post('/extend', (req, res) => {
  const { carId, extraDays } = req.body;
  if (!carId || !extraDays) return res.status(400).json({ error: 'carId and extraDays required' });
  const r = rentals.find(r => r.carId === carId);
  if (!r) return res.status(404).json({ error: 'rental not found' });
  r.days += Number(extraDays);
  rentalHistory.push({ ...r, action: 'extended', extraDays: Number(extraDays), at: nowISO() });
  const car = cars.get(carId);
  res.json({ message: 'rental extended', newDays: r.days, newTotal: car.pricePerDay * r.days });
});

app.get('/rentals', (req, res) => res.json(rentals));
app.get('/rental-history', (req, res) => res.json(rentalHistory));

// ========== Analytics CSV Upload & Parsing ==========
app.post('/upload-sales', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'file required' });
  const filepath = req.file.path;
  const results = [];
  fs.createReadStream(filepath)
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      salesDataFiles.set(req.file.filename, results);
      res.json({ message: 'file uploaded', fileId: req.file.filename, rows: results.length });
    })
    .on('error', (err) => {
      res.status(500).json({ error: String(err) });
    });
});

// Helper: convert parsed CSV (array of objects) into timeseries columns
function normalizeSalesData(rows) {
  if (!rows || !rows.length) return null;
  // Expect first column be a date/month field (try first column name)
  const cols = Object.keys(rows[0]);
  const dateCol = cols[0];
  const seriesCols = cols.slice(1);
  const parsed = rows.map(r => {
    const out = { date: new Date(r[dateCol]) };
    seriesCols.forEach(c => out[c] = Number(r[c] || 0));
    return out;
  }).filter(x => !isNaN(x.date.getTime()));
  return { dateCol, seriesCols, parsed };
}

// ========== Analytics endpoints ==========

// top-seller across uploaded file: POST { fileId }
app.post('/analytics/top-seller', (req, res) => {
  const { fileId } = req.body;
  const rows = salesDataFiles.get(fileId);
  const normalized = normalizeSalesData(rows);
  if (!normalized) return res.status(400).json({ error: 'invalid or missing fileId' });
  const totals = {};
  normalized.seriesCols.forEach(col => totals[col] = 0);
  normalized.parsed.forEach(r => normalized.seriesCols.forEach(c => totals[c] += r[c] || 0));
  const top = Object.entries(totals).sort((a,b) => b[1] - a[1])[0];
  res.json({ topProduct: top[0], total: top[1] });
});

// moving average: POST { fileId, product, window }
app.post('/analytics/moving-average', (req, res) => {
  const { fileId, product, window = 3 } = req.body;
  const rows = salesDataFiles.get(fileId);
  const normalized = normalizeSalesData(rows);
  if (!normalized) return res.status(400).json({ error: 'invalid or missing fileId' });
  if (!normalized.seriesCols.includes(product)) return res.status(400).json({ error: 'product not found' });
  const values = normalized.parsed.map(r => r[product] || 0);
  const mov = [];
  for (let i = 0; i < values.length; i++) {
    const start = Math.max(0, i - window + 1);
    const slice = values.slice(start, i + 1);
    const avg = slice.reduce((a,b)=>a+b,0) / slice.length;
    mov.push({ index: i, date: normalized.parsed[i].date.toISOString(), ma: avg });
  }
  res.json({ product, window: Number(window), movingAverage: mov });
});

// correlation matrix: POST { fileId }
app.post('/analytics/correlation', (req, res) => {
  const { fileId } = req.body;
  const rows = salesDataFiles.get(fileId);
  const normalized = normalizeSalesData(rows);
  if (!normalized) return res.status(400).json({ error: 'invalid or missing fileId' });
  const cols = normalized.seriesCols;
  const values = {};
  cols.forEach(c => values[c] = normalized.parsed.map(r => r[c] || 0));
  function pearson(x, y) {
    const n = x.length;
    const mx = x.reduce((a,b)=>a+b,0)/n;
    const my = y.reduce((a,b)=>a+b,0)/n;
    const num = x.map((xi,i) => (xi-mx)*(y[i]-my)).reduce((a,b)=>a+b,0);
    const denx = Math.sqrt(x.map(xi => (xi-mx)**2).reduce((a,b)=>a+b,0));
    const deny = Math.sqrt(y.map(yi => (yi-my)**2).reduce((a,b)=>a+b,0));
    const den = denx*deny;
    return den === 0 ? 0 : num/den;
  }
  const matrix = {};
  for (let i=0;i<cols.length;i++){
    matrix[cols[i]] = {};
    for (let j=0;j<cols.length;j++){
      matrix[cols[i]][cols[j]] = Number(pearson(values[cols[i]], values[cols[j]]).toFixed(4));
    }
  }
  res.json({ correlation: matrix });
});

// basic linear regression forecast: POST { fileId, product, monthsForecast }
app.post('/analytics/forecast', (req, res) => {
  const { fileId, product, monthsForecast = 3 } = req.body;
  const rows = salesDataFiles.get(fileId);
  const normalized = normalizeSalesData(rows);
  if (!normalized) return res.status(400).json({ error: 'invalid or missing fileId' });
  if (!normalized.seriesCols.includes(product)) return res.status(400).json({ error: 'product not found' });

  const y = normalized.parsed.map((r, i) => r[product] || 0);
  const X = normalized.parsed.map((r, i) => i); // months as index

  const n = X.length;
  const xMean = X.reduce((a,b)=>a+b,0)/n;
  const yMean = y.reduce((a,b)=>a+b,0)/n;
  const num = X.map((xi, i) => (xi - xMean)*(y[i] - yMean)).reduce((a,b)=>a+b,0);
  const den = X.map(xi => (xi - xMean)**2).reduce((a,b)=>a+b,0);
  const slope = den === 0 ? 0 : num/den;
  const intercept = yMean - slope * xMean;

  const forecast = [];
  for (let m=1; m<=monthsForecast; m++) {
    const idx = n + (m - 1);
    const pred = intercept + slope * idx;
    forecast.push({ monthIndex: idx, predicted: Number(pred.toFixed(2)) });
  }

  res.json({ product, slope: Number(slope.toFixed(4)), intercept: Number(intercept.toFixed(4)), forecast });
});

// health
app.get('/health', (req, res) => res.json({ status: 'ok', time: nowISO() }));

// cleanup uploads dir on exit (best-effort)
process.on('exit', () => {
  try {
    const up = path.join(__dirname, 'uploads');
    if (fs.existsSync(up)) {
      fs.readdirSync(up).forEach(f => fs.unlinkSync(path.join(up, f)));
    }
  } catch(e){}
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, ()=> console.log(`Server running on http://localhost:${PORT}`));
