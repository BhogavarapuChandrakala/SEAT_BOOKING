import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [seats, setSeats] = useState([]);
  const [bookCount, setBookCount] = useState("");
  const [bookedSeats, setBookedSeats] = useState([]);

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    const res = await axios.get("http://localhost:5000/api/seats");
    setSeats(res.data);
  };

  const handleBook = async () => {
    const count = parseInt(bookCount);
    if (!count || count < 1 || count > 7) return alert("Enter 1 to 7 seats");

    try {
      const res = await axios.post("http://localhost:5000/api/seats/book", { count });
      setBookedSeats(res.data.booked.map(seat => seat.seat_number));
      fetchSeats();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  const handleReset = async () => {
    await axios.post("http://localhost:5000/api/seats/reset");
    fetchSeats();
    setBookedSeats([]);
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Ticket Booking</h2>
      <div className="row">
        <div className="col-md-6 d-flex flex-wrap justify-content-center">
          {seats.map(seat => (
            <div
              key={seat.id}
              className={`m-1 btn ${
                seat.is_booked ? "btn-warning" : "btn-success"
              }`}
              style={{ width: "50px" }}
            >
              {seat.seat_number}
            </div>
          ))}
        </div>
        <div className="col-md-6 text-center">
          <h5>Book Seats</h5>
          <input
            type="number"
            className="form-control w-50 mx-auto"
            value={bookCount}
            onChange={e => setBookCount(e.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleBook}>
            Book
          </button>
          <button className="btn btn-secondary mt-2 ml-2" onClick={handleReset}>
            Reset Booking
          </button>
          <div className="mt-3">
            {bookedSeats.length > 0 && (
              <>
                <h6>Booked Seats:</h6>
                {bookedSeats.map(num => (
                  <span className="badge bg-warning text-dark mx-1" key={num}>
                    {num}
                  </span>
                ))}
              </>
            )}
          </div>
        </div>
      </div>
      <div className="mt-4 text-end">
        <span className="badge bg-success">Available</span>
        <span className="badge bg-warning text-dark ms-2">Booked</span>
      </div>
    </div>
  );
}

export default App;
