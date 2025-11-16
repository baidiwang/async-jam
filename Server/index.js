const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 1234;
const STORAGE_DIR = path.join(__dirname, 'uploads');

app.use(cors());
app.use(express.text({ type: '*/*', limit: '5mb' }));

/**
 * POST /<uuid>
 * Saves the raw request body (the base64 string) to a file named <uuid>.txt
 */
app.post('/:uuid', async (req, res) => {
    // Basic security: prevent ".." in path to stop directory traversal
    const uuid = path.basename(req.params.uuid);
    
    if (!req.body || req.body.length === 0) {
        return res.status(400).json({ error: 'No data in request body.' });
    }
    
    const filePath = path.join(STORAGE_DIR, `${uuid}.txt`);
    
    try {
        await fs.writeFile(filePath, req.body, 'utf8');
        res.status(200).json({ success: true, id: uuid });
    } catch (err) {
        console.error('Error writing file:', err);
        res.status(500).json({ error: 'Failed to save data.' });
    }
});

/**
 * GET /<uuid>
 * Retrieves the base64 string from the file <uuid>.txt
 */
app.get('/:uuid', async (req, res) => {
    // Basic security: prevent ".." in path
    const uuid = path.basename(req.params.uuid);
    const filePath = path.join(STORAGE_DIR, `${uuid}.txt`);
    
    try {
        const data = await fs.readFile(filePath, 'utf8');
        // Send the data back as plain text
        res.setHeader('Content-Type', 'text/plain');
        res.status(200).send(data);
    } catch (err) {
        // This 'catch' block will handle file-not-found errors (ENOENT)
        res.status(404).json({ error: 'ID not found.' });
    }
});

async function main() {
    await fs.mkdir(STORAGE_DIR, { recursive: true });

    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}

main();