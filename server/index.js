import express from 'express';
import path from 'path'

const PORT = 5000
const __dirname = path.resolve()

const app = express()

app.get('/test', (req, res) => {
    res.send('Testing!')
});

app.listen(PORT, () => {
    console.log(`Running on PORT: ${PORT}`);
});