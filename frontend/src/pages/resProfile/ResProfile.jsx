import { useEffect, useState } from "react"
// import axios from "axios"
import api from "../../service/api"
import "./ResProfile.css"
import { Link } from "react-router-dom"

// ATENÇÃO! MUDAR OS USURARIOS PARA RESERVAS

export default function ResProfile() {
    // const [activeTab, setActiveTab] = useState("upcoming")

    // const handleTabChange = (tab) => {
    //     setActiveTab(tab)
    // }

    const [reservations, setReservations] = useState([])
    const [activeMenu, setActiveMenu] = useState("main")

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
        <div className="rp-hero-section">
            <div className="rp-profile-container">
                <div className="rp-profile-header">
                    <h1>Seu Perfil</h1>
                    <div className="rp-header-buttons">
                        <Link to={`/update-sd-user`} className="rp-edit-button">Editar Perfil</Link>
                        <button className="rp-delete-button">Excluir</button>
                    </div>
                </div>

                <div className="rp-profile-info">
                    <div className="rp-avatar-container">
                        <img className="rp-avatar" src="./logo-tiny.png" alt="" />
                    </div>
                    <div className="rp-user-details">
                        <div className="rp-user-name">
                            <h2>São & Salvo</h2>
                            <div className="rp-user-rating">
                                {
                                    [1, 2, 3, 4, 5].map((star) => {
                                        return <span className="rp-star" key={star}>★</span>   // Placeholder for additional user details
                                    })
                                }
                            </div>
                        </div>
                        <p className="rp-address">123 Main St, Springfield</p>
                        <p className="rp-email">sao.salvo@example.com</p>
                        <p className="rp-phone">+1 (555) 123-4567</p>
                    </div>
                </div>


                <div className="rp-section">
                    <div className="rp-menu">
                        <div className="rp-menu-btns">
                            <button
                                className={`rp-menu-tab-${activeMenu === "main" ? "active-menu" : ""}`}
                                onClick={() => { setActiveMenu("main") }}
                            >
                                Cardápio Principal
                            </button>
                            <button
                                className={`rp-menu-tab-${activeMenu === "beverage" ? "active-menu" : ""}`}
                                onClick={() => { setActiveMenu("beverage") }}
                            >
                                Bebidas
                            </button>
                            <button
                                className={`rp-menu-tab-${activeMenu === "dessert" ? "active-menu" : ""}`}
                                onClick={() => { setActiveMenu("dessert") }}
                            >
                                Sobremesas
                            </button>
                        </div>

                        <div className="rp-menu-cards">
                            {activeMenu === "main" && (
                                <div className="rp-menu-card">
                                    <div className="rp-menu-preview">
                                        <img
                                            src="./cardapio-principal.png"
                                            alt="Cardápio Principal - São & Salvo"
                                            className="menu-image-res-page"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="rp-menu-cards">
                            {activeMenu === "beverage" && (
                                <div className="rp-menu-card">
                                    <div className="rp-menu-preview">
                                        <img
                                            src="./cardapio-bebidas.jpg"
                                            alt="Cardápio Principal - São & Salvo"
                                            className="menu-image-res-page"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="rp-menu-cards">
                            {activeMenu === "dessert" && (
                                <div className="rp-menu-card">
                                    <div className="rp-menu-preview">
                                        <img
                                            src="./cardapio-sobremesa.png"
                                            alt="Cardápio Principal - São & Salvo"
                                            className="menu-image-res-page"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <h3 className="rp-section-title">Suas Reservas</h3>

                    <div className="rp-reservations">
                        {reservations.map((reservation, index) => (
                            <div className="rp-reservation-card" key={index}>
                                <div className="rp-date-box">
                                    <div className="rp-day">25</div>
                                    <div className="rp-month">MAI</div>
                                </div>
                                <div className="rp-reservation-details">
                                    <h4 className="rp-clientName">{reservation.name}</h4>
                                    <p>19:30 • Quinta-Feira</p>
                                </div>
                                <div className="rp-reservation-actions">
                                    <button className="rp-modify-button">Confirmar Pedido de Reserva</button>
                                    <button className="rp-cancel-button">Finalizar Reserva</button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div >
    )
}
