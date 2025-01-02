import express from 'express';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;
const dataFile = path.join(__dirname, 'data', 'representatives.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to read data from file
async function readData() {
  try {
    const data = await fs.readFile(dataFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If file doesn't exist, return an empty object
      return {};
    }
    throw error;
  }
}

// Helper function to write data to file
async function writeData(data) {
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
}

// GET endpoint to fetch representatives
app.get('/api/representatives/:locality', async (req, res) => {
  try {
    const representatives = await readData();
    const locality = req.params.locality.toLowerCase();
    if (representatives[locality]) {
      res.json(representatives[locality]);
    } else {
      res.status(404).json({ message: "Locality not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error reading data" });
  }
});

// POST endpoint to update representative information
app.post('/api/update-representative', async (req, res) => {
  try {
    const { locality, name, designation, phone, email } = req.body;

    if (!locality || !name) {
      return res.status(400).json({ message: "Locality and name are required" });
    }

    const representatives = await readData();

    if (!representatives[locality]) {
      representatives[locality] = [];
    }

    const index = representatives[locality].findIndex(rep => rep.name === name);

    if (index !== -1) {
      // Update existing representative
      representatives[locality][index] = { ...representatives[locality][index], designation, phone, email };
    } else {
      // Add new representative
      representatives[locality].push({ name, designation, phone, email });
    }

    await writeData(representatives);

    res.json({ message: "Representative information updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error updating data" });
  }
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

