import { useState } from "react"
import "./Reservation.css"

export default function ReservationList() {
  const [reservations, setReservations] = useState([
    {
      id: 1,
      name: "Dahe Kevin",
      date: "27/10/2022",
      time: "08:00 PM",
      phone: "+0123456789",
      email: "test@test.com",
      partySize: 4,
    },
    {
      id: 2,
      name: "Alessandro",
      date: "27/10/2022",
      time: "08:00 PM",
      phone: "+0123456789",
      email: "test@test.com",
      partySize: 4,
    },
    {
      id: 3,
      name: "Pedro Eduardo",
      date: "27/10/2022",
      time: "08:00 PM",
      phone: "+0123456789",
      email: "test@test.com",
      partySize: 4,
    },
    {
      id: 4,
      name: "Pedro Brilhante",
      date: "27/10/2022",
      time: "08:00 PM",
      phone: "+0123456789",
      email: "test@test.com",
      partySize: 4,
    },
    {
      id: 4,
      name: "Teste",
      date: "27/10/2022",
      time: "08:00 PM",
      phone: "+0123456789",
      email: "test@test.com",
      partySize: 4,
    },
    {
      id: 4,
      name: "Teste",
      date: "27/10/2022",
      time: "08:00 PM",
      phone: "+0123456789",
      email: "test@test.com",
      partySize: 4,
    },
    {
      id: 4,
      name: "Teste",
      date: "27/10/2022",
      time: "08:00 PM",
      phone: "+0123456789",
      email: "test@test.com",
      partySize: 4,
    },
    {
      id: 4,
      name: "Teste",
      date: "27/10/2022",
      time: "08:00 PM",
      phone: "+0123456789",
      email: "test@test.com",
      partySize: 4,
    }
  ])

  return (
    <div className="app-container">
      <div className="hero-section">
        <h1 className="page-title">Reservations</h1>
        <div className="search-container">
          <span className="search-icon">&#128269;</span>
          <input type="text" placeholder="Search..." className="search-input" />
        </div>
      </div>

      <main className="reservations-container">
        {reservations.map((reservation) => (
          <div key={reservation.id} className="reservation-card">
            <div className="reservation-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="icon">&#128197;</span>
                  <span>{reservation.date}</span>
                </div>
                <div className="detail-item">
                  <h3 className="guest-name">{reservation.name}</h3>
                </div>
                <div className="detail-item">
                  <span className="icon">&#128336;</span>
                  <span>{reservation.time}</span>
                </div>
              </div>
              <div className="detail-row">
                <div className="detail-item">
                  <span className="icon">&#128222;</span>
                  <span>{reservation.phone}</span>
                </div>
                <div className="party-size">
                  <span className="icon">&#128101;</span>
                  <span>{reservation.partySize}</span>
                </div>
                <div className="detail-item">
                  <span className="icon">&#9993;</span>
                  <span>{reservation.email}</span>
                  <div>
                    <button className="confirmBtn">Confirmar Reserva</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </main>
    </div>
  )
}
