"use client"

import { useEffect, useMemo, useState } from "react"
import "./admPage.css"
import api from '../../service/api.js'
import NotificationSystem from "../../components/notification/notification.jsx"
import ThemeToggle from "../../components/themetoggle/ThemeToggle.jsx"
import AdmChart from "../../components/admChart/AdmChart.jsx"
import { Link } from "react-router-dom"
import Swal from "sweetalert2"

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState("dashboard")
    const [totalReservations, setTotalReservations] = useState('')
    const [totalClients, setTotalClients] = useState('')
    const [showAllReservations, setShowAllReservations] = useState(false)
    const [showAllRestaurants, setShowAllRestaurants] = useState(false)
    const [showAllTopRestaurants, setShowAllTopRestaurants] = useState(false)
    const [showActivitiesModal, setShowActivitiesModal] = useState(false)
    const [showReservationsModal, setShowReservationsModal] = useState(false)
    const [showAllReservationsModal, setShowAllReservationsModal] = useState(false)
    const [selectedReservation, setSelectedReservation] = useState(null)
    const [showRestaurantsModal, setShowRestaurantsModal] = useState(false)
    const [selectedRestaurant, setSelectedRestaurant] = useState(null)
    const [admin, setAdmin] = useState({ name: "", email: "", phone: "", avatar: "", password: "" })
    const [allReservationsOfTheDay, setAllReservationsOfTheDay] = useState([])
    const [showAllClientsModal, setShowAllClientsModal] = useState(false)
    const [allClients, setAllClients] = useState([])
    const [showActiveRestaurantsModal, setShowActiveRestaurantsModal] = useState(false)
    const [showNonActiveRestaurantsModal, setShowNonActiveRestaurantsModal] = useState(false)

    const stats = [
        {
            title: "Total de Reservas",
            value: "2,847",
            change: "+12%",
            positive: true,
            icon: "📅",
            color: "blue",
        },
        {
            title: "Restaurantes Ativos",
            value: "156",
            change: "+3%",
            positive: true,
            icon: "🏪",
            color: "green",
        },
        {
            title: "Usuários Registrados",
            value: "8,924",
            change: "+18%",
            positive: true,
            icon: "👥",
            color: "purple",
        },
        {
            title: "Receita Mensal",
            value: "R$ 45.2k",
            change: "+8%",
            positive: true,
            icon: "💰",
            color: "orange",
        },
    ]

    const [recentReservations, setRecentReservations] = useState([])

    const [topRestaurants, setTopRestaurants] = useState([])

    const recentActivity = [
        {
            type: "reservation",
            text: "Nova reserva criada por João Silva",
            time: "2 min atrás",
            icon: "📅",
        },
        {
            type: "restaurant",
            text: 'Restaurante "Pizzaria Napoli" foi aprovado',
            time: "15 min atrás",
            icon: "🏪",
        },
        {
            type: "user",
            text: "Novo usuário registrado: Maria Costa",
            time: "1 hora atrás",
            icon: "👤",
        },
        {
            type: "reservation",
            text: "Reserva cancelada no Bella Vista",
            time: "2 horas atrás",
            icon: "❌",
        },
    ]

    const handleSeeAllClients = async () => {
        setShowAllClientsModal(true)
        getAllClients()
    }

    const getAllClients = async () => {
        try {
            const response = await api.get('/client/get-many')

            console.log('Todos os clientes da plataforma: ', response.data);

            setAllClients(response.data)

        } catch (error) {
            console.error('Falha ao acessar lista de clientes registrados no sistema, tente novamente.', error);
        }
    }

    const handleSeeAllReservations = async () => {
        setShowAllReservationsModal(true)
        getAllReservationsOfTheDay()
    }

    const getAllReservationsOfTheDay = async () => {
        try {
            const response = await api.get('/reservation/get-many')

            if (!response) { return console.log('Algo deu errado, não é possível mostrar todas as reservas. Tente novamente.'); }

            console.log('Todas as reservas: ', response.data.reservations);

            setAllReservationsOfTheDay(response.data.reservations)

        } catch (error) {
            console.error('Falha ao acessar informações de reservas no banco, tente novamente.', error);
        }
    }

    const handleConfirmRestaurant = async () => {
        try {
            const response = await api.patch(`/restaurant/update-status?id=${selectedRestaurant.id}`, {
                status: "Approved"
            })

            console.log('Status de restaurante atualizado com sucesso!', response);

            setShowRestaurantsModal(false)

            Swal.fire({
                title: "Restaurante Aprovado!",
                icon: "success",
                showConfirmButton: false,
                timer: 1500,
                position: "top-end"
            })

            getRestaurantsByRating()

        } catch (error) {
            console.error('Erro ao atualizar status do restaurante, tente novamente.', error);
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            Approved: { text: "Aprovado", class: "status-approved" },
            Pending: { text: "Pendente", class: "status-pending" },
        }

        const statusInfo = statusMap[status] || statusMap.Pending

        return <span className={`status-badge ${statusInfo.class}`}>{statusInfo.text}{
            status &&
            <span style={{ fontSize: "18px" }}>{status === "Approved"
                ? "✓"
                : "‼️"
            }</span>
        }</span>
    }

    const getRestaurantsByRating = async () => {
        try {
            const response = await api.get('/restaurant/get-orderByRating')

            setTopRestaurants(response.data.restaurants)

            console.log('Lista de restaurantes ordenados por rating', response);

        } catch (error) {
            console.error('Falha ao buscar a lista de restaurantes no servidor.', error);
        }
    }

    const activeRestaurants = useMemo(() => {
        if (!Array.isArray(topRestaurants)) {
            return []
        }

        return topRestaurants.filter(res => {
            return res.status && res.status === 'Approved' && res.isActive === true
        })
    }, [topRestaurants])
    
    const nonActiveRestaurants = useMemo(() => {
        if (!Array.isArray(topRestaurants)) {
            return []
        }

        return topRestaurants.filter(res => {
            return res.status && res.status === 'Approved' && res.isActive === false
        })
    }, [topRestaurants])

    const pendingRestaurants = useMemo(() => {

        if (!Array.isArray(topRestaurants)) {
            return []
        }

        return topRestaurants.filter(res => {
            return res.status && res.status === 'Pending'
        })
    }, [topRestaurants])

    const rest = useMemo(() => {
        if (!Array.isArray(topRestaurants)) {
            return []
        }

        return topRestaurants.filter(res => {
            return res.status && res.status !== 'Pending'
        })
    }, [topRestaurants])

    const displayedRestaurants = showAllTopRestaurants ? rest : rest.slice(0, 4);
    const displayedPendingRestaurants = showAllRestaurants ? topRestaurants : pendingRestaurants

    // console.log('Restaurantes pendentes: ', displayedPendingRestaurants);


    const getTotalClients = async () => {
        try {
            const response = await api.get('/client/get-total')

            setTotalClients(response.data.total)

            console.log('Total de clientes: ', response);

        } catch (error) {
            console.error('Falha ao buscar a quantidade de clientes no servidor.', error);
        }
    }

    const getTotalReservations = async () => {
        try {
            const response = await api.get('/reservation/get-total')

            setTotalReservations(response.data.total)

            console.log('Total de reservas: ', response.data.total);

        } catch (error) {
            console.error('Falha ao buscar a quantidade de reservas no servidor.', error);
        }
    }

    const getReservations = async () => {
        try {
            const today = new Date().toISOString().split('T')[0];

            console.log(today);

            const response = await api.get(`/reservation/get-many?date=${today}`)

            console.log('Reservas de Hoje: ', response.data);

            setRecentReservations(response.data.reservations)

        } catch (error) {
            console.error('Falha ao buscar informações do banco.', error);
        }
    }

    const reservations = useMemo(() => {
        if (!Array.isArray(recentReservations)) {
            return []
        }

        return recentReservations
    }, [recentReservations])

    const displayedReservations = showAllReservations ? reservations : reservations.slice(0, 2)

    const getAdminInfo = async () => {
        const token = localStorage.getItem('token')

        try {
            const response = await api.get('/admin/get', {
                headers: { Authorization: `Bearer ${token}` }
            })

            if (!response) { return console.log('Erro ao carregar informações do usuário.'); }

            console.log('Dados do admin:', response.data);

            setAdmin({
                ...admin,
                name: response.data.admin.name,
                email: response.data.admin.email,
                phone: response.data.admin.phone,
                avatar: `http://localhost:3000/uploads/admin/avatars/${response.data.admin.avatar}`,
                prevMonthReservations: response.data.admin.prevMonthInfo[0],
                prevMonthClients: response.data.admin.prevMonthInfo[1],
                prevMonthRestaurants: response.data.admin.prevMonthInfo[2],
                prevMonthIncome: response.data.admin.prevMonthInfo[3],
            })

        } catch (error) {
            console.error("Erro ao buscar perfil:", error.response?.data || error.message || error);
        }
    }

    useEffect(() => {
        getAdminInfo()
        getReservations()
        getTotalReservations()
        getTotalClients()
        getRestaurantsByRating()
    }, [])

    const deleteRestaurant = async () => {
        try {
            const response = await api.delete(`/restaurant/delete?id=${selectedRestaurant.id}`)

            console.log('Restaurante deletado com sucesso!', response);

            setSelectedRestaurant(null)

            getRestaurantsByRating()

        } catch (error) {
            console.error('Erro ao apagar restaurante, tente novamente.', error);
        }
    }

    const handleDeleteRestaurant = async () => {
        setShowRestaurantsModal(false)
        deleteRestaurant()
    }

    return (
        <div className="admin-container">

            {/* Main Content */}
            <main className="main-content">
                <header className="header">
                    <div>
                        <h1 className="page-title">Olá, gerente!</h1>
                        <h2 className="page-subtitle">Acompanhe o funcionamento do seu negócio!</h2>
                    </div>
                    <div className="user-menu">
                        {/* <ThemeToggle /> */}
                        {/* <NotificationSystem /> */}
                        {/* <div onClick={() => { setShowActivitiesModal(true); }} className="user-info">
                            <span className="recent-activities-label">Atividades Recentes</span>
                            <span>🔔</span>
                        </div> */}
                    </div>
                </header>

                <div className="admin-info-container">
                    <div className="admin-info-subcontainer">
                        {admin.avatar && <img className="admin-avatar" src={admin.avatar} />}
                        <div className="admin-content">
                            <h2>Seu Perfil</h2>
                            <div className="profile-actions">
                                <Link to={'/admin-update'} className="editBtn">Editar Perfil</Link>
                                <span> | </span>
                                <span onClick={() => { window.location.href = '/'; localStorage.clear(); }} className="deleteBtn">Deslogar</span>
                            </div>
                            <h3>Nome: {admin.name}</h3>
                            <h3>E-mail: {admin.email}</h3>
                            <h3>Telefone: {admin.phone}</h3>
                        </div>
                    </div>
                </div>

                <div className="stats-grid">
                    {/* {stats.map((stat, index) => (
                        <div key={index} className="stat-card">
                            <div className="stat-header">
                                <span className="stat-title">{stat.title}</span>
                                <div className={`stat-icon ${stat.color}`}>{stat.icon}</div>
                            </div>
                            <div className="stat-value">{stat.value}</div>
                            <div className={`stat-change ${stat.positive ? "positive" : "negative"}`}>
                                <span>{stat.positive ? "↗" : "↘"}</span>
                                {stat.change} vs mês anterior
                            </div>
                        </div>
                    ))} */}

                    <div onClick={() => { handleSeeAllReservations() }} className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Total de Reservas</span>
                            <div className={`stat-icon`}>📅</div>
                        </div>
                        <div className="stat-value">{totalReservations}</div>
                        {/* <div className={`stat-change ${admin.prevMonthReservations <= totalReservations ? "positive" : "negative"}`}>
                            <span>{admin.prevMonthReservations <= totalReservations ? "↗" : "↘"}</span>
                            {(Math.abs(((100 * parseFloat(totalReservations)) / parseFloat(admin.prevMonthReservations)) - 100)).toFixed(2)}% vs mês anterior
                        </div> */}
                    </div>

                    <div onClick={() => { handleSeeAllClients() }} className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Clientes Registrados</span>
                            <div className={`stat-icon`}>👥</div>
                        </div>
                        <div className="stat-value">{totalClients}</div>
                        {/* <div className={`stat-change ${admin.prevMonthClients <= totalClients ? "positive" : "negative"}`}>
                            <span>{admin.prevMonthClients <= totalClients ? "↗" : "↘"}</span>
                            {(Math.abs(((100 * parseFloat(totalClients)) / parseFloat(admin.prevMonthClients)) - 100)).toFixed(2)}% vs mês anterior
                        </div> */}
                    </div>

                    <div onClick={() => { setShowActiveRestaurantsModal(true); }} className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Restaurantes Ativos no Momento</span>
                            <div className={`stat-icon`}>🏪</div>
                        </div>
                        <div className="stat-value">{activeRestaurants.length}</div>
                        {/* <div className={`stat-change ${admin.prevMonthRestaurants <= (topRestaurants.length - activeRestaurants.length - pendingRestaurants.length) ? "positive" : "negative"}`}>
                            <span>{admin.prevMonthRestaurants <= (topRestaurants.length - activeRestaurants.length - pendingRestaurants.length) ? "↗" : "↘"}</span>
                            {(Math.abs(((100 * parseFloat((topRestaurants.length - activeRestaurants.length - pendingRestaurants.length))) / parseFloat(admin.prevMonthRestaurants)) - 100)).toFixed(2)}% vs mês anterior
                        </div> */}
                    </div>
                    
                    <div onClick={() => { setShowNonActiveRestaurantsModal(true); }} className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Restaurantes Não Ativos no momento</span>
                            <div className={`stat-icon`}>🏪</div>
                        </div>
                        <div className="stat-value">{nonActiveRestaurants.length}</div>
                        {/* <div className={`stat-change ${admin.prevMonthRestaurants <= (topRestaurants.length - activeRestaurants.length - pendingRestaurants.length) ? "positive" : "negative"}`}>
                            <span>{admin.prevMonthRestaurants <= (topRestaurants.length - activeRestaurants.length - pendingRestaurants.length) ? "↗" : "↘"}</span>
                            {(Math.abs(((100 * parseFloat((topRestaurants.length - activeRestaurants.length - pendingRestaurants.length))) / parseFloat(admin.prevMonthRestaurants)) - 100)).toFixed(2)}% vs mês anterior
                        </div> */}
                    </div>

                    {/* <div className="stat-card">
                        <div className="stat-header">
                            <span className="stat-title">Receita Mensal</span>
                            <div className={`stat-icon`}>💰</div>
                        </div>
                        <div className="stat-value">R$</div>
                        <div className={`stat-change ${admin.prevMonthClients <= totalClients ? "positive" : "negative"}`}>
                            <span>{admin.prevMonthClients <= totalClients ? "↗" : "↘"}</span>
                            {(Math.abs(((100 * parseFloat(totalClients)) / parseFloat(admin.prevMonthClients)) - 100)).toFixed(2)}% vs mês anterior
                        </div>
                    </div> */}
                </div>

                {/* Content Grid */}
                <div className="content-grid">
                    {/* Recent Reservations */}
                    <div className="table-container">
                        <div className="table-header">
                            {showAllRestaurants
                                ? <h2 className="table-title">Todos os restaurantes</h2>
                                : <h2 className="table-title">Cadastros de Restaurantes Pendentes</h2>
                            }
                            <button onClick={() => { setShowAllRestaurants(!showAllRestaurants) }} className="btn btn-primary">
                                {showAllRestaurants
                                    ? <span>Ver Pendentes</span>
                                    : <span>Ver Todos</span>
                                }
                            </button>
                        </div>
                        <table className="table">
                            <thead className="table-title-container">
                                <tr>
                                    <th className="table-title">Restaurante</th>
                                    <th className="table-title">E-mail</th>
                                    <th className="table-title">Telefone</th>
                                    <th className="table-title">Data/Hora</th>
                                    <th className="table-title">Endereço</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            {(displayedPendingRestaurants && displayedPendingRestaurants.length > 0)
                                &&
                                <tbody>
                                    {displayedPendingRestaurants.map((restaurant) => (
                                        <tr onClick={() => { setSelectedRestaurant(restaurant); setShowRestaurantsModal(true); }} className="table-rows" key={restaurant.id}>
                                            <td>{restaurant.name}</td>
                                            <td>{restaurant.email}</td>
                                            <td>{restaurant.phone}</td>
                                            <td>
                                                {new Date(restaurant.createdAt).toLocaleDateString('pt-BR', {
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })} às {new Date(restaurant.createdAt).toLocaleTimeString('pt-BR', {
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </td>
                                            <td>{restaurant.fullAddress}</td>
                                            {/* <td>{reservation.guests}</td> */}
                                            <td>{
                                                <div>
                                                    {getStatusBadge(restaurant.status)}
                                                </div>
                                            }</td>
                                        </tr>
                                    ))}
                                </tbody>
                            }
                        </table>
                        {(!displayedPendingRestaurants || displayedPendingRestaurants.length === 0) &&
                            <h1 className="table-default-placeholder">Nenhum cadastro de restaurante encontrado</h1>
                        }
                    </div>

                    {/* Right Column */}
                    <div>
                        {/* Top Restaurants */}
                        <div className="table-container" style={{ marginBottom: "24px" }}>
                            <div className="table-header">
                                <h2 className="table-title">Top Restaurantes</h2>
                                <button onClick={() => { setShowAllTopRestaurants(!showAllTopRestaurants) }} className="btn btn-secondary">Ver Todos</button>
                            </div>
                            <div>
                                {displayedRestaurants.map((restaurant, index) => (
                                    <div
                                        key={index}
                                        className="restaurant-info"
                                        onClick={() => { window.location.href = `/restaurant-page?restaurantId=${restaurant.id}` }}
                                        style={{
                                            borderBottom: index < topRestaurants.length - 1 ? "1px solid #00a65b60" : "none",
                                        }}
                                    >
                                        <div className="restaurant-avatar">{restaurant.name.charAt(0)}</div>
                                        <div className="restaurant-details" style={{ flex: 1 }}>
                                            <h4>{restaurant.name}</h4>
                                            <p>
                                                {restaurant._count.reservations} reservas
                                                •
                                                {restaurant.tags.slice(0, 4).map((tag) => (
                                                    <span className="restaurant-tag">{tag}</span>
                                                ))}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: "right" }}>
                                            <div style={{ fontSize: "14px", fontWeight: "600", color: "white" }}>
                                                ⭐ {restaurant.rating}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    <div className="table-header">
                        <h2 className="table-title">Reservas do Dia</h2>
                        <button onClick={() => { setShowAllReservations(!showAllReservations) }} className="btn btn-primary">
                            Ver todos
                        </button>
                    </div>
                    <table className="table">
                        <thead className="table-title-container">
                            <tr>
                                <th className="table-title">ID</th>
                                <th className="table-title">Cliente</th>
                                <th className="table-title">Restaurante</th>
                                <th className="table-title">Data/Hora</th>
                                <th className="table-title">Pessoas</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        {displayedReservations && displayedReservations.length > 0 &&
                            <tbody>
                                {displayedReservations.map((reservation) => (
                                    <tr onClick={() => { setSelectedReservation(reservation); setShowReservationsModal(true) }} className="table-rows" key={reservation.id}>
                                        <td>{reservation.id}</td>
                                        <td>{reservation.client.name}</td>
                                        <td>{reservation.restaurant.name}</td>
                                        <td>
                                            {/* CORREÇÃO: Crie o objeto Date a partir da data e da hora */}
                                            {new Date(`${reservation.date.split('T')[0]}T${reservation.startsAt}`).toLocaleDateString('pt-BR', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })} às {reservation.startsAt}
                                        </td>
                                        <td>{reservation.guests}</td>
                                        <td>{getStatusBadge(reservation.status)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        }
                    </table>
                    {(!displayedReservations || displayedReservations.length === 0) &&
                        <h1 className="table-default-placeholder">Nenhuma reserva hoje</h1>
                    }
                </div>

                {/* Chart Section */}
                {/* <div className="chart-container" style={{ marginTop: "24px" }}>
                    <div className="chart-header">
                    <h2 className="chart-title">Reservas por Período</h2>
                    <p className="chart-subtitle">Últimos 30 dias</p>
                    </div>
                    <AdmChart />
                </div> */}

                {
                    showActivitiesModal && (
                        <div className="tables-modal-overlay">
                            <div style={{ minWidth: "600px" }} className="tables-modal">
                                <h2 className="table-title">Atividades do Dia</h2>
                                {/* Recent Activity */}
                                <div className="table-container">
                                    <div className="activity-list">
                                        {recentActivity.map((activity, index) => (
                                            <div key={index} className="activity-item">
                                                <div className={`activity-icon ${activity.type}`}>{activity.icon}</div>
                                                <div className="activity-content">
                                                    <div className="activity-text">{activity.text}</div>
                                                    <div className="activity-time">{activity.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="tables-modal-buttons">
                                    <button className="tables-btn-cancel" onClick={() => { setShowActivitiesModal(false) }}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    showAllReservationsModal && (
                        <div className="tables-modal-overlay">
                            <div style={{ minWidth: "600px" }} className="tables-modal">
                                <h2 className="table-title">Todas as Reservas na Plataforma</h2>
                                {/* Recent Activity */}
                                <div className="table-container">
                                    <div className="activity-list">
                                        {allReservationsOfTheDay.map((reservation, index) => (
                                            <div key={index} className="activity-item">
                                                <div className={`activity-icon`}>📅</div>
                                                <div className="activity-content">
                                                    <div className="activity-text">{reservation.restaurant.name}</div>
                                                    <div className="activity-time">{reservation.client.name}</div>
                                                </div>
                                                <div className="activity-content">
                                                    <div className="activity-text">{reservation.date.split("T")[0]}</div>
                                                    <div className="activity-time">{reservation.time}</div>
                                                    <div className="activity-time">{reservation.status === 'Confirmed' ? 'Confirmado' : (reservation.status === 'Pending' ? 'Pendente' : 'Cancelado')}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="tables-modal-buttons">
                                    <button className="tables-btn-cancel" onClick={() => { setShowAllReservationsModal(false) }}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    showAllClientsModal && (
                        <div className="tables-modal-overlay">
                            <div style={{ minWidth: "600px" }} className="tables-modal">
                                <h2 className="table-title">Todas os Clientes Registrados no Sistema</h2>
                                {/* Recent Activity */}
                                <div className="table-container">
                                    <div className="activity-list">
                                        {allClients.map((client, index) => (
                                            <div key={index} className="activity-item">
                                                <img style={{ height: "50px", width: "50px", objectFit: "cover" }} src={`http://localhost:3000/uploads/client/avatars/${client.avatar}`} alt="" />
                                                <div className="activity-content">
                                                    <div className="activity-text">{client.name}</div>
                                                </div>
                                                <div className="activity-content">
                                                    <div className="activity-time">{String(client.createdAt).split("T")[0]}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="tables-modal-buttons">
                                    <button className="tables-btn-cancel" onClick={() => { setShowAllClientsModal(false) }}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    showActiveRestaurantsModal && (
                        <div className="tables-modal-overlay">
                            <div style={{ minWidth: "600px" }} className="tables-modal">
                                <h2 className="table-title">Restaurantes Ativos no Momento</h2>
                                {/* Recent Activity */}
                                <div className="table-container">
                                    <div className="activity-list">
                                        {activeRestaurants.map((restaurant, index) => (
                                            <div key={index} className="activity-item">
                                                <img style={{ height: "50px", width: "50px", objectFit: "cover" }} src={`http://localhost:3000/${restaurant.avatar.replace('src\\', '')}`} alt="" />
                                                <div className="activity-content">
                                                    <div className="activity-text">{restaurant.name}</div>
                                                </div>
                                                <div className="activity-content">
                                                    <div className="activity-time">{String(restaurant.createdAt).split("T")[0]}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="tables-modal-buttons">
                                    <button className="tables-btn-cancel" onClick={() => { setShowActiveRestaurantsModal(false) }}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
                
                {
                    showNonActiveRestaurantsModal && (
                        <div className="tables-modal-overlay">
                            <div style={{ minWidth: "600px" }} className="tables-modal">
                                <h2 className="table-title">Restaurantes Ativos no Momento</h2>
                                {/* Recent Activity */}
                                <div className="table-container">
                                    <div className="activity-list">
                                        {nonActiveRestaurants.map((restaurant, index) => (
                                            <div key={index} className="activity-item">
                                                <img style={{ height: "50px", width: "50px", objectFit: "cover" }} src={`http://localhost:3000/uploads/restaurant/avatars/${restaurant.avatar}`} alt="" />
                                                <div className="activity-content">
                                                    <div className="activity-text">{restaurant.name}</div>
                                                </div>
                                                <div className="activity-content">
                                                    <div className="activity-time">{String(restaurant.createdAt).split("T")[0]}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="tables-modal-buttons">
                                    <button className="tables-btn-cancel" onClick={() => { setShowNonActiveRestaurantsModal(false) }}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    showRestaurantsModal && (
                        <div className="tables-modal-overlay">
                            <div className="tables-modal">
                                <h2>Detalhes do Restaurante</h2>
                                <div className="tables-modal-info">
                                    <p>
                                        <strong>Restaurante:</strong> {selectedRestaurant?.name}
                                    </p>
                                    <p>
                                        <strong>E-mail:</strong> {selectedRestaurant?.email}
                                    </p>
                                    <p>
                                        <strong>Telefone:</strong> {selectedRestaurant?.phone}
                                    </p>
                                    <p>
                                        <strong>Edereço:</strong> {selectedRestaurant?.fullAddress}
                                    </p>
                                    <p>
                                        <strong>Tags:</strong> {selectedRestaurant?.tags.map((tag) => (
                                            <span>{tag}; </span>
                                        ))}
                                    </p>
                                    <p>
                                        <strong>Data do pedido:</strong> {selectedRestaurant?.createdAt.split("T")[0]}
                                    </p>
                                    <p>
                                        <strong>Status:</strong> {selectedRestaurant?.status === "Pending" ? "Pendente" : "Confirmado"}
                                    </p>
                                </div>

                                <div className="tables-modal-buttons">
                                    <button className="tables-btn-cancel" onClick={() => { setShowRestaurantsModal(false); setSelectedRestaurant(null) }}>
                                        Fechar
                                    </button>
                                    <button style={{ background: "red", }} className="tables-btn-cancel" onClick={() => { handleDeleteRestaurant() }}>
                                        Excluir Restaurante
                                    </button>
                                    <button className="tables-btn-confirm" onClick={handleConfirmRestaurant}>
                                        Aprovar Restaurante
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }

                {
                    showReservationsModal && (
                        <div className="tables-modal-overlay">
                            <div className="tables-modal">
                                <h2>Detalhes da Reserva</h2>
                                <div className="tables-modal-info">
                                    <p>
                                        <strong>Cliente:</strong> {selectedReservation?.client.name}
                                    </p>
                                    <p>
                                        <strong>Restaurante:</strong> {selectedReservation?.restaurant.name}
                                    </p>
                                    <p>
                                        <strong>Convidados:</strong> {selectedReservation?.guests}
                                    </p>
                                    <p>
                                        <strong>ID da mesa:</strong> {selectedReservation?.tableId}
                                    </p>
                                    {selectedReservation?.status !== "Available" && (
                                        <>
                                            <p>
                                                <strong>Dia:</strong> {selectedReservation?.day}
                                            </p>
                                            <p>
                                                <strong>Data:</strong> {selectedReservation?.date.split("T")[0]}
                                            </p>
                                            <p>
                                                <strong>Horário:</strong> {selectedReservation?.time}
                                            </p>
                                            {selectedReservation?.notes && (
                                                <p>
                                                    <strong>Observações do Cliente:</strong> {selectedReservation?.notes}
                                                </p>
                                            )}
                                        </>
                                    )}
                                </div>

                                <div className="tables-modal-buttons">
                                    <button className="tables-btn-cancel" onClick={() => { setShowReservationsModal(false); setSelectedReservation(null) }}>
                                        Fechar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )
                }
            </main >
        </div >
    )
}
