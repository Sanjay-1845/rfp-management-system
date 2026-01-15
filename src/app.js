require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use('/api/rfps', require('./routes/rfp.routes'));
app.use('/api/vendors', require('./routes/vendor.routes'));
// app.use('/api/proposals', require('./routes/proposal.routes'));


app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});