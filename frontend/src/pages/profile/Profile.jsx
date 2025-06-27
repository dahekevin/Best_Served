import { useEffect, useState } from "react"
// import axios from "axios"
import api from "../../service/api"
import "./Profile.css"
import { Link } from "react-router-dom"

// ATENÇÃO! MUDAR OS USURARIOS PARA RESERVAS

export default function Profile() {
    const [reservations, setReservations] = useState([])
    const [client, setClient] = useState({ name: "", email: "", phone: "", avatar: "" })

    async function getClientInfo() {
        const token = localStorage.getItem('token')

        try {
            const response = await api.get('/client/get-one', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!response) { return console.log('Erro ao carregar informações do usuário.'); }

            // const avatarURL = replace.apply()

            setClient({
                ...client,
                name: response.data.name,
                email: response.data.email,
                phone: response.data.phone,
                avatar: `http://localhost:3000/uploads/client/avatars/${response.data.avatar}`
            })

            console.log('Usuário encontrado com sucesso! Avatar:', response.data);
        } catch (error) {
            console.error("Erro ao buscar informações do usuário: ", error.response?.data || error.message || error);
        }
    }

    async function fetchReservations() {
        try {
            const response = await api.get("/client/get-many")
            setReservations(response.data)
            console.log(response.data);
        } catch (error) {
            console.error("Erro ao buscar reservas: ", error.response?.data || error.message || error);
        }
    }

    useEffect(() => {
        getClientInfo()
        fetchReservations()
    }, [])

    async function deleteAccount (e) {
        e.preventDefault()
        const token = localStorage.getItem("token")
        
        try {
            const response = await api.delete("/client/delete", {
                headers: { Authorization: `Bearer ${token}` }
            })

            console.log("Tentando apagar usuário:", response.data);

            localStorage.clear()
            window.location.href = '/';
            alert("Perfil excluído com sucesso!");
        } catch (error) {
            console.error("Erro ao apagar perfil: ", error.response?.data || error.message || error);
        }
    }

    return (
        <div className="client-hero-section">
            <div className="client-profile-container">
                <div className="client-profile-header">
                    <h1>Seu Perfil</h1>
                    <div className="client-header-buttons">
                        <Link to={`/update-client-profile`} className="client-edit-button">Editar Perfil</Link>
                        <button onClick={(e) => { deleteAccount(e) }} className="client-delete-button">Excluir</button>
                    </div>
                </div>

                <div className="client-profile-info">
                    <div className="client-avatar-container">
                        {client.avatar && <img className="client-avatar" src={client.avatar} />}
                    </div>
                    <div className="client-client-details">
                        <h2>Olá, {client.name}</h2>
                        <p className="client-email">Email: {client.email}</p>
                        <p className="client-phone">Telefone: {client.phone}</p>
                    </div>
                </div>

                <div className="client-section">
                    <h3 className="client-section-title">Suas Reservas</h3>

                    <div className="client-reservations">
                        {reservations.map((reservation, index) => (
                            <div className="client-reservation-card" key={index}>
                                <div className="client-date-box">
                                    <div className="client-day">25</div>
                                    <div className="client-month">MAI</div>
                                </div>
                                <div className="client-reservation-details">
                                    <p>19:30 • Sábado</p>
                                    <p className="client-confirmation">Restaurante: São & Salvo</p>
                                </div>
                                <div className="client-reservation-actions">
                                    <button className="client-modify-button">Modificar</button>
                                    <button className="client-cancel-button">Cancelar</button>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div >
    )
}
