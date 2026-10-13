const express = require('express');
const { evaluate } = require('mathjs');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/calculate', (req, res) => {
  const { expression } = req.body;

  if (!expression || typeof expression !== 'string') {
    return res.status(400).json({ error: 'Expression is required.' });
  }

  try {
    const sanitized = expression
      .replace(/×/g, '*')
      .replace(/÷/g, '/')
      .replace(/π/g, 'pi')
      .replace(/√/g, 'sqrt')
      .replace(/sin\(/g, 'sin(')
      .replace(/cos\(/g, 'cos(')
      .replace(/tan\(/g, 'tan(')
      .replace(/log\(/g, 'log(')
      .replace(/ln\(/g, 'ln(')
      .replace(/exp\(/g, 'exp(');

    const result = evaluate(sanitized);
    return res.json({ result: Number.isFinite(result) ? result : 'Error' });
  } catch (error) {
    return res.status(400).json({ error: 'Invalid expression.' });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'Scientific calculator API is running.' });
});

app.listen(port, () => {
  console.log(`Calculator server running on http://localhost:${port}`);
});
