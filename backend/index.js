// Import necessary modules
const express = require('express');
const morgan = require('morgan');
require("dotenv").config()
const OpenAI = require("openai")
const openai = new OpenAI()


// Create an Express application
const app = express();
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Use Morgan middleware to log all requests in the 'dev' format
app.use(morgan('dev'));

// Define a route for the root of the app
app.get('/', (req, res) => {
  res.send(
    `
      <main style="display:flex; justify-content:center; align-items:center; min-height:100vh">
        <h1>Power Automate Integration</h1>
      </main>
    `
  );
});

app.post("/test", async (req, res) => {
  console.log(req.body)
  if (Object.keys(req.body) == 0) {
    return res.status(400).send("no email body")
  }
  try {
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "Summarize the email, with perspective, like this 'you received an email from [], about []'" },
        { role: "user", content: JSON.stringify(req.body) ?? "{'to':'zaki@ugm.ac.id', 'from': 'arif@ugm.ac.id', snippet:'hello, when can I see you this week'}"}
      ],
      model: "gpt-3.5-turbo",
    });
    // const completion = JSON.stringify(req.body)
    // res.send(completion);
    res.send(completion.choices[0].message.content);
  } catch(err) {
    res.status(400).send(err)
  }
})

// Set the port for the application
const PORT = process.env.PORT || 5000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
