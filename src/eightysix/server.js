const express = require('express');
const path = require('path');

const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

app.get('/', (req, res) => {
  console.log("serving index.html")
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API route for OpenAI requests
app.post('/api/openai', async (req, res) => {
  console.log("api/openai called")
  const { prompt } = req.body;
  const response = await openai.createCompletion({
    model: 'text-davinci-003',
    prompt: prompt,
    max_tokens: 1000,
  });
});

// Set dynamic path for stylesheet
app.locals.stylePath = process.env.NODE_ENV === 'production' ? '/views/styles/style.css' : '/views/styles/style.css';

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});