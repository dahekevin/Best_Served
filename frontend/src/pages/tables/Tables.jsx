import { useState } from "react"
import "./Tables.css"

export default function Tables() {
  const [filter, setFilter] = useState("All")

  const tables = [
    { id: 1, name: "Table 1", status: "Booked", initials: "AM", seats: 4, color: "white" },
    { id: 2, name: "Table 2", status: "Available", initials: "MB", seats: 6, color: "yellow" },
    { id: 3, name: "Table 3", status: "Available", initials: "JS", seats: 2, color: "green" },
    { id: 4, name: "Table 4", status: "Available", initials: "HR", seats: 4, color: "green" },
    { id: 5, name: "Table 5", status: "Booked", initials: "PL", seats: 3, color: "yellow" },
    { id: 6, name: "Table 6", status: "Available", initials: "RT", seats: 4, color: "green" },
    { id: 7, name: "Table 7", status: "Booked", initials: "LC", seats: 5, color: "yellow" },
    { id: 8, name: "Table 8", status: "Available", initials: "DP", seats: 5, color: "green" },
    { id: 9, name: "Table 9", status: "Booked", initials: "NK", seats: 6, color: "white" },
    { id: 10, name: "Table 10", status: "Available", initials: "SB", seats: 6, color: "white" },
    { id: 11, name: "Table 11", status: "Booked", initials: "GT", seats: 4, color: "yellow" },
    { id: 12, name: "Table 12", status: "Available", initials: "JS", seats: 6, color: "green" },
    { id: 13, name: "Table 13", status: "Booked", initials: "EK", seats: 2, color: "white" },
    { id: 14, name: "Table 14", status: "Available", initials: "QN", seats: 6, color: "green" },
    { id: 15, name: "Table 15", status: "Booked", initials: "TW", seats: 3, color: "green" },
  ]

  const filteredTables = filter === "All" ? tables : tables.filter((table) => table.status === filter)

  return (
    <div className="container">
      <header className="header">
        <button className="back-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 className="title">Mesas</h1>
        <div className="filter-buttons">
          <button className={`filter-button ${filter === "All" ? "active" : ""}`} onClick={() => setFilter("All")}>
            Todas
          </button>
          <button
            className={`filter-button ${filter === "Booked" ? "active" : ""}`}
            onClick={() => setFilter("Booked")}
          >
            Reservadas
          </button>
        </div>
      </header>

      <div className="tables-grid">
        {filteredTables.map((table) => (
          <div key={table.id} className="table-card">
            <div className="table-header">
              <h2 className="table-name">{table.name.replace("Table", "Mesa")}</h2>
              <span className={`table-status ${table.status.toLowerCase()}`}>
                {table.status === "Booked" ? "Reservada" : "Disponível"}
              </span>
            </div>
            <div className="table-content">
              <div className={`initials-circle ${table.color}`}>{table.initials}</div>
            </div>
            <div className="table-footer">
              <span className="seats-info">Lugares: {table.seats}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
