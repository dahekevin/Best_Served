import { useEffect, useState } from "react"
// import axios from "axios"
import api from "../../service/api"
import "./Profile.css"
import { Link } from "react-router-dom"

// ATENÇÃO! MUDAR OS USURARIOS PARA RESERVAS

export default function Profile() {
    const [reservations, setReservations] = useState([])
    const [user, setUser] = useState({ name: "", email: "", phone: "", avatar: "" })

    async function getUserInfo() {
        const token = localStorage.getItem('token')

        try {
            const response = await api.get('/sd-user/get-one', {
                headers: { Authorization: `Bearer ${token}` }
            })

            setUser({
                ...user,
                name: response.data.name,
                email: response.data.email,
                phone: response.data.phone,
                avatar: `http://localhost:3000/uploads/${response.data.avatar}`
            })

            console.log('Usuário encontrado com sucesso!', response.data.avatar);
        } catch (error) {
            console.error("Erro ao buscar informações do usuário: ", error.response?.data || error.message || error);
        }
    }

    async function fetchReservations() {
        try {
            const response = await api.get("/sd-user/get-many")
            setReservations(response.data)
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao buscar reservas: ", error.response?.data || error.message || error);
        }
    }

    useEffect(() => {
        getUserInfo()
        fetchReservations()
    }, [])

    async function deleteAccount (e) {
        e.preventDefault()
        const token = localStorage.getItem("token")
        
        try {
            const response = await api.delete("/sd-user/delete", {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log("Tentando apagar usuário:", response.data);

            localStorage.clear()
            window.location.href = '/';
        } catch (error) {
            console.error("Erro ao apagar perfil: ", error.response?.data || error.message || error);
        }
    }

    return (
        <div className="sd-user-hero-section">
            <div className="sd-user-profile-container">
                <div className="sd-user-profile-header">
                    <h1>Seu Perfil</h1>
                    <div className="sd-user-header-buttons">
                        <Link to={`/update-sd-user`} className="sd-user-edit-button">Editar Perfil</Link>
                        <button onClick={(e) => { deleteAccount(e) }} className="sd-user-delete-button">Excluir</button>
                    </div>
                </div>

                <div className="sd-user-profile-info">
                    <div className="sd-user-avatar-container">
                        <img className="sd-user-avatar" src={user.avatar} alt="" />
                    </div>
                    <div className="sd-user-user-details">
                        <h2>Olá, {user.name}</h2>
                        <p className="sd-user-email">Email: {user.email}</p>
                        <p className="sd-user-phone">Telefone: {user.phone}</p>
                    </div>
                </div>

                <div className="sd-user-section">
                    <h3 className="sd-user-section-title">Suas Reservas</h3>

                    <div className="sd-user-reservations">
                        {reservations.map((reservation, index) => (
                            <div className="sd-user-reservation-card" key={index}>
                                <div className="sd-user-date-box">
                                    <div className="sd-user-day">25</div>
                                    <div className="sd-user-month">MAI</div>
                                </div>
                                <div className="sd-user-reservation-details">
                                    <p>19:30 • Sábado</p>
                                    <p className="sd-user-confirmation">Restaurante: São & Salvo</p>
                                </div>
                                <div className="sd-user-reservation-actions">
                                    <button className="sd-user-modify-button">Modificar</button>
                                    <button className="sd-user-cancel-button">Cancelar</button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div >
    )
}
