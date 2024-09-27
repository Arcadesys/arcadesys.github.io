const path = require("path");
const express = require("express");
const fetch = require("node-fetch");
const { fetchResponse } = require("./openai.js");
const { constructPrompt, promptTemplate } = require("./mealplan.js"); // Import functions
const { engine } = require('express-handlebars');

// Prompts (hardcoded for now)
const eightySixPrompt = `
  You are a fellow writer. Do a first pass of editing my document. 
  I know I have the following habits. Your response should do a first pass over my document, changing little more than the habits I've indicated above. 
  Your response should never, ever include adverbs:\n\n`;

// Create an Express application
const app = express();

// Set up Handlebars
app.engine('handlebars', engine({
  defaultLayout: 'main',
  layoutsDir: path.join(__dirname, 'views', 'layouts'),
  partialsDir: path.join(__dirname, 'views', 'partials') // Ensure this line is present
}));
app.set('view engine', 'handlebars');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// View engine setup
app.set("views", path.join(__dirname, "views"));

// Home page route
// Home page route
app.get("/", (req, res) => {
    res.render("index", { layout: "main" });
  });

// POST route to handle AI calls
app.post("/api/whatNow", async (req, res) => {
  const prompt = req.body.prompt;
  console.log(`${prompt} received!`);

  // Get the prompt from the request body
  const whatNowPrompt = `Please suggest three different directions this incomplete scene could go so that I can get unblocked and keep writing: ${prompt}`;

  try {
    const result = await fetchResponse(whatNowPrompt);
    console.log(result.choices[0].message.content);
    res.json({ response: result.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with the OpenAI request" });
  }
});

app.post("/api/eightySix", async (req, res) => {
  const prompt = req.body.prompt;
  console.log(`${prompt} received!`);

  // Get the prompt from the request body
  const whatNowPrompt = `Please take a first pass at this document. Correct tense issues, remove adverbs, and add comments about the text in [Content ed.] format. Your response should consist solely of the edited text, with no explanations or tailing calls to action. \n ${prompt}`;

  try {
    const result = await fetchResponse(whatNowPrompt);
    console.log(result.choices[0].message.content);
    res.json({ response: result.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with the OpenAI request" });
  }
});

app.get("/mealplan", (req, res) => {
  res.render("mealplan");
});

// Meal Plan Route
app.post("/api/mealplan", async (req, res) => {
  // Extract the data from the request body
  const data = req.body;

  // Construct the final prompt
  const finalPrompt = constructPrompt(promptTemplate, data);

  console.log("Constructed Prompt:\n", finalPrompt);

  try {
    // Call the OpenAI API with the constructed prompt
    const result = await fetchResponse(finalPrompt);
    console.log("AI Response:\n", result.choices[0].message.content);
    res.json({ mealPlan: result.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong with the OpenAI request" });
  }
});

// Run the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Your app is listening on http://localhost:${PORT}`);
});