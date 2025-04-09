const express = require('express');
const router = express.Router();
const pool = require('../db');

// Get all seats
router.get('/', async (req, res) => {
  const result = await pool.query('SELECT * FROM seats ORDER BY seat_number');
  res.json(result.rows);
});

// Book seats
router.post('/book', async (req, res) => {
  const { count } = req.body;

  if (count < 1 || count > 7) return res.status(400).json({ error: 'Book between 1-7 seats only' });

  try {
    await pool.query('BEGIN');

    const availableSeats = await pool.query(
      'SELECT * FROM seats WHERE is_booked = false ORDER BY seat_number'
    );

    if (availableSeats.rows.length < count) {
      await pool.query('ROLLBACK');
      return res.status(400).json({ error: 'Not enough seats available' });
    }

    const seatsToBook = availableSeats.rows.slice(0, count).map(seat => seat.seat_number);
    for (let seat of seatsToBook) {
      await pool.query('UPDATE seats SET is_booked = true WHERE seat_number = $1', [seat]);
    }

    await pool.query('COMMIT');
    res.json({ booked: seatsToBook });
  } catch (err) {
    await pool.query('ROLLBACK');
    res.status(500).json({ error: err.message });
  }
});

// Reset Booking
router.post('/reset', async (req, res) => {
  await pool.query('UPDATE seats SET is_booked = false');
  res.json({ message: 'All seats reset!' });
});

module.exports = router;
