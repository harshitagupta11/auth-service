import express from 'express';
const app = express();

app.get('/', (req, res) => {
    return res.send('Auth Service is running');
});

export default app;
