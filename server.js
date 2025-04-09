const express = require('express');
const cors = require('cors');
require('dotenv').config();
const seatsRoute = require('./routes/seats');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Route for seat operations
app.use('/seats', seatsRoute);

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
