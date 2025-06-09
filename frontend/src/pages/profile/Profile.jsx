import { useEffect, useState } from "react"
// import axios from "axios"
import api from "../../service/api"
import "./Profile.css"
import { Link } from "react-router-dom"

// ATENÇÃO! MUDAR OS USURARIOS PARA RESERVAS

export default function Profile() {
    // const [activeTab, setActiveTab] = useState("upcoming")

    // const handleTabChange = (tab) => {
    //     setActiveTab(tab)
    // }

    const [reservations, setReservations] = useState([])

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const res = await axios.get("http://localhost:3000/sd-user/get-many")
    //             setReservations(res.data)
    //             console.log("Data fetched successfully:", res.data);
    //         } catch (error) {
    //             console.log("Error fetching data:", error);
    //         }
    //     };
    //     fetchData()
    // }, [])

    let res = []

    async function fetchReservations() {
        res = await api.get("/sd-user/get-many")
        setReservations(res.data)
        console.log(res.data);
    }

    useEffect(() => {
        fetchReservations()
    })

    return (
        <div className="hero-section">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Seu Perfil</h1>
                    <div className="header-buttons">
                        <Link to={`/update-sd-user`} className="edit-button">Editar Perfil</Link>
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
                        {reservations.map((reservation, index) => (
                            <div className="reservation-card" key={index}>
                                <div className="date-box">
                                    <div className="day">25</div>
                                    <div className="month">MAI</div>
                                </div>
                                <div className="reservation-details">
                                    <h4 className="clientName">{reservation.name}</h4>
                                    <p>19:30 • Mesa para 2</p>
                                    <p className="confirmation">Restaurante: São & Salvo</p>
                                </div>
                                <div className="reservation-actions">
                                    <button className="modify-button">Modificar</button>
                                    <button className="cancel-button">Cancelar</button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div >
    )
}
