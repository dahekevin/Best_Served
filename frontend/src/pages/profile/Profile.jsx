import { useState } from "react"
import "./Profile.css"

export default function Profile() {
    const [activeTab, setActiveTab] = useState("upcoming")

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div className="hero-section">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Seu Perfil</h1>
                    <div className="header-buttons">
                        <button className="edit-button">Editar Perfil</button>
                        <button className="delete-button">Excluir</button>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="avatar-container">
                        <div className="avatar"></div>
                    </div>
                    <div className="user-details">
                        <h2>São & Salvo</h2>
                        <p className="email">sao.salvo@example.com</p>
                        <p className="phone">+1 (555) 123-4567</p>
                    </div>
                </div>

                <div className="section">
                    <h3 className="section-title">Suas Reservas</h3>

                    <div className="reservations">
                        <div className="reservation-card">
                            <div className="date-box">
                                <div className="day">25</div>
                                <div className="month">MAI</div>
                            </div>
                            <div className="reservation-details">
                                <h4>La Bella Italia</h4>
                                <p>19:30 • Mesa para 2</p>
                                <p className="confirmation">Restaurante: São & Salvo</p>
                            </div>
                            <div className="reservation-actions">
                                <button className="modify-button">Modificar</button>
                                <button className="cancel-button">Cancelar</button>
                            </div>
                        </div>

                        <div className="reservation-card">
                            <div className="date-box">
                                <div className="day">10</div>
                                <div className="month">JUN</div>
                            </div>
                            <div className="reservation-details">
                                <h4>Sakura Sushi</h4>
                                <p>18:00 • Mesa para 4</p>
                                <p className="confirmation">Restaurante: São & Salvo</p>
                            </div>
                            <div className="reservation-actions">
                                <button className="modify-button">Modificar</button>
                                <button className="cancel-button">Cancelar</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
