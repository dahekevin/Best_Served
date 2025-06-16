"use client"

import { useState } from "react"
import "./Tables.css"

const RestaurantTables = () => {
  const [activeFilter, setActiveFilter] = useState("todas")
  const [showModal, setShowModal] = useState(false)
  const [selectedTable, setSelectedTable] = useState(null)

  const [tables, setTables] = useState([
    { id: 1, name: "Mesa 1", status: "reservada", initials: "AM", seats: 4 },
    { id: 2, name: "Mesa 2", status: "disponivel", initials: "MB", seats: 6 },
    { id: 3, name: "Mesa 3", status: "disponivel", initials: "JS", seats: 2 },
    { id: 4, name: "Mesa 4", status: "disponivel", initials: "HR", seats: 4 },
    { id: 5, name: "Mesa 5", status: "reservada", initials: "PL", seats: 3 },
    { id: 6, name: "Mesa 6", status: "disponivel", initials: "RT", seats: 4 },
    { id: 7, name: "Mesa 7", status: "reservada", initials: "LC", seats: 5 },
    { id: 8, name: "Mesa 8", status: "disponivel", initials: "DP", seats: 5 },
    { id: 9, name: "Mesa 9", status: "reservada", initials: "NK", seats: 6 },
    { id: 10, name: "Mesa 10", status: "disponivel", initials: "SB", seats: 6 },
    { id: 11, name: "Mesa 11", status: "reservada", initials: "GT", seats: 4 },
    { id: 12, name: "Mesa 12", status: "disponivel", initials: "JS", seats: 6 },
    { id: 13, name: "Mesa 13", status: "reservada", initials: "EK", seats: 2 },
    { id: 14, name: "Mesa 14", status: "disponivel", initials: "QN", seats: 6 },
    { id: 15, name: "Mesa 15", status: "reservada", initials: "TW", seats: 3 },
  ])

  const filteredTables = tables.filter((table) => {
    if (activeFilter === "reservadas") return table.status === "reservada"
    if (activeFilter === "vagas") return table.status === "disponivel"
    return true
  })

  const handleTableClick = (table) => {
    setSelectedTable(table)
    setShowModal(true)
  }

  const handleConfirmReservation = () => {
    if (selectedTable) {
      setTables((prevTables) =>
        prevTables.map((table) => (table.id === selectedTable.id ? { ...table, status: "reservada" } : table)),
      )
    }
    setShowModal(false)
    setSelectedTable(null)
  }

  const handleCancelReservation = () => {
    setShowModal(false)
    setSelectedTable(null)
  }

  return (
    <div className="restaurant-tables">

      <div className="restaurant-container">
        <div className="header">
          <button className="back-button">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <h1 className="title">Mesas</h1>
          <div className="filter-buttons">
            <button
              className={`filter-btn ${activeFilter === "todas" ? "active" : ""}`}
              onClick={() => setActiveFilter("todas")}
            >
              Todas
            </button>
            <button
              className={`filter-btn ${activeFilter === "reservadas" ? "active" : ""}`}
              onClick={() => setActiveFilter("reservadas")}
            >
              Reservadas
            </button>
            <button
              className={`filter-btn ${activeFilter === "vagas" ? "active" : ""}`}
              onClick={() => setActiveFilter("vagas")}
            >
              Vagas
            </button>
          </div>
        </div>

        <div className="tables-grid">
          {filteredTables.map((table) => (
            <div key={table.id} className="table-card" onClick={() => handleTableClick(table)}>
              <div className="table-header">
                <span className="table-name">{table.name}</span>
                <span className={`status-badge ${table.status}`}>
                  {table.status === "reservada" ? "Reservada" : "Disponível"}
                </span>
              </div>
              <div className={`avatar ${table.status}`}>{table.initials}</div>
              {/* <div className="seats-info">Lugares: {table.seats}</div> */}
            </div>
          ))}
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Confirmar Reserva</h2>
              <p>Deseja confirmar a reserva da {selectedTable?.name}?</p>
              {/* <p>Lugares disponíveis: {selectedTable?.seats}</p> */}
              <div className="modal-buttons">
                <button className="btn-cancel" onClick={handleCancelReservation}>
                  Cancelar
                </button>
                <button className="btn-confirm" onClick={handleConfirmReservation}>
                  Confirmar Reserva
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default RestaurantTables
