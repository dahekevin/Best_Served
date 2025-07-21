"use client"

import { useState, useEffect, useRef } from "react"

export default function NotificationSystem() {
	const [notifications, setNotifications] = useState([])
	const [showPanel, setShowPanel] = useState(false)
	const [allNotifications, setAllNotifications] = useState([])
	const panelRef = useRef(null)
	const bellRef = useRef(null)

	// Simulação de notificações em tempo real
	useEffect(() => {
		const notificationTypes = [
			{
				type: "success",
				title: "Reserva Confirmada",
				message: "Nova reserva confirmada no Bella Vista para hoje às 19:30",
				icon: "✓",
			},
			{
				type: "info",
				title: "Novo Restaurante",
				message: "Pizzaria Napoli solicitou cadastro na plataforma",
				icon: "ℹ",
			},
			{
				type: "warning",
				title: "Reserva Pendente",
				message: "Reserva aguardando confirmação há mais de 2 horas",
				icon: "⚠",
			},
			{
				type: "error",
				title: "Pagamento Falhou",
				message: "Erro no processamento do pagamento da reserva #1234",
				icon: "✕",
			},
			{
				type: "success",
				title: "Meta Atingida",
				message: "Meta mensal de reservas foi atingida com sucesso!",
				icon: "🎯",
			},
			{
				type: "info",
				title: "Novo Usuário",
				message: "Maria Silva se cadastrou na plataforma",
				icon: "👤",
			},
		]

		const interval = setInterval(() => {
			const randomNotification = notificationTypes[Math.floor(Math.random() * notificationTypes.length)]
			const newNotification = {
				id: Date.now(),
				...randomNotification,
				timestamp: new Date(),
				read: false,
			}

			// Adicionar à lista de notificações ativas (toast)
			setNotifications((prev) => [...prev, newNotification])

			// Adicionar ao histórico completo
			setAllNotifications((prev) => [newNotification, ...prev])

			// Remover automaticamente após 5 segundos
			setTimeout(() => {
				removeNotification(newNotification.id)
			}, 5000)
		}, 8000) // Nova notificação a cada 8 segundos

		return () => clearInterval(interval)
	}, [])

	// Fechar painel ao clicar fora
	useEffect(() => {
		function handleClickOutside(event) {
			if (
				panelRef.current &&
				!panelRef.current.contains(event.target) &&
				bellRef.current &&
				!bellRef.current.contains(event.target)
			) {
				setShowPanel(false)
			}
		}

		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	const removeNotification = (id) => {
		setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, removing: true } : notif)))

		setTimeout(() => {
			setNotifications((prev) => prev.filter((notif) => notif.id !== id))
		}, 300)
	}

	const markAsRead = (id) => {
		setAllNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
	}

	const clearAllNotifications = () => {
		setAllNotifications([])
		setShowPanel(false)
	}

	const unreadCount = allNotifications.filter((notif) => !notif.read).length

	const formatTime = (timestamp) => {
		const now = new Date()
		const diff = now - timestamp
		const minutes = Math.floor(diff / 60000)

		if (minutes < 1) return "Agora"
		if (minutes < 60) return `${minutes}min atrás`

		const hours = Math.floor(minutes / 60)
		if (hours < 24) return `${hours}h atrás`

		const days = Math.floor(hours / 24)
		return `${days}d atrás`
	}

	return (
		<>
			{/* Toast Notifications */}
			<div className="notification-container">
				{notifications.map((notification) => (
					<div
						key={notification.id}
						className={`notification ${notification.type} ${notification.removing ? "removing" : ""}`}
						onClick={() => removeNotification(notification.id)}
					>
						<div className={`notification-icon ${notification.type}`}>{notification.icon}</div>
						<div className="notification-content">
							<div className="notification-title">{notification.title}</div>
							<div className="notification-message">{notification.message}</div>
							<div className="notification-time">{formatTime(notification.timestamp)}</div>
						</div>
						<button
							className="notification-close"
							onClick={(e) => {
								e.stopPropagation()
								removeNotification(notification.id)
							}}
						>
							✕
						</button>
					</div>
				))}
			</div>

			{/* Notification Bell */}
			<div style={{ position: "relative" }}>
				<button ref={bellRef} className="notification-bell" onClick={() => setShowPanel(!showPanel)}>
					🔔{unreadCount > 0 && <span className="notification-badge">{unreadCount > 99 ? "99+" : unreadCount}</span>}
				</button>

				{/* Notification Panel */}
				{showPanel && (
					<div ref={panelRef} className="notification-panel">
						<div className="notification-panel-header">
							<h3 className="notification-panel-title">Notificações</h3>
							{allNotifications.length > 0 && (
								<button className="clear-all-btn" onClick={clearAllNotifications}>
									Limpar Tudo
								</button>
							)}
						</div>

						<div className="notification-list">
							{allNotifications.length === 0 ? (
								<div className="empty-notifications">
									<div style={{ fontSize: "30px", marginBottom: "8px" }}>🔔</div>
									<div>Nenhuma notificação</div>
								</div>
							) : (
								allNotifications.slice(0, 10).map((notification) => (
									<div
										key={notification.id}
										className={`notification-item ${!notification.read ? "unread" : ""}`}
										onClick={() => markAsRead(notification.id)}
									>
										<div className={`notification-icon ${notification.type}`}>{notification.icon}</div>
										<div className="notification-content">
											<div className="notification-title">{notification.title}</div>
											<div className="notification-message">{notification.message}</div>
											<div className="notification-time">{formatTime(notification.timestamp)}</div>
										</div>
									</div>
								))
							)}
						</div>
					</div>
				)}
			</div>
		</>
	)
}
