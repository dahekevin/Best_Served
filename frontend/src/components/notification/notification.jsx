"use client"

import { useState, useEffect, useRef } from "react"
import api from "../../service/api"

export default function NotificationSystem() {
	const [notifications, setNotifications] = useState([])
	const [showPanel, setShowPanel] = useState(false)
	const [allNotifications, setAllNotifications] = useState([])
	const panelRef = useRef(null)
	const bellRef = useRef(null)

	const icons = ['✓', 'ℹ', '⚠', '✕', '🎯', '👤']

	const getNotifications = async () => {
		const token = localStorage.getItem('token')
		const role = localStorage.getItem('role')

		try {
			if (token && role) {
				const response = await api.get(`/notification/get-by-user?role=${role}`, {
					headers: { Authorization: `Bearer ${token}` }
				})

				console.log('response:', response.data);

				let notif_db = []
				notif_db = response.data
				console.log('notif_db.length', notif_db.length);

				if (notif_db.length > 0) {
					let currentIndex = 0
					const interval = setInterval(() => {
						if (currentIndex >= notif_db.length) {
							clearInterval(interval)
							return
						}

						const notification = notif_db[currentIndex]
						const newNotification = {
							...notification,
							id: `${notification.id}-${Date.now()}-${Math.random()}-${currentIndex}`,
							timestamp: new Date(),
						}

						// Adicionar à lista de notificações ativas (toast)
						setNotifications((prev) => [...prev, newNotification])

						// Adicionar ao histórico completo
						setAllNotifications((prev) => [newNotification, ...prev])

						// Remover automaticamente após 5 segundos
						setTimeout(() => {
							markAsRead(newNotification.id);
							removeNotification(newNotification.id)
						}, 8000)

						currentIndex++
					}, 300) // Nova notificação a cada 8 segundos

					return () => clearInterval(interval)
				}
			}

		} catch (error) {
			console.error('Erro ao buscar as notificações do usuário.', error);
		}
	}

	useEffect(() => {
		getNotifications()
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
