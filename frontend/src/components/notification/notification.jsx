"use client"

import { useState, useEffect, useRef } from "react"
import api from '../../service/api.js'

export default function NotificationSystem() {
	const [notifications, setNotifications] = useState([])
	const [notifDB, setNotifDB] = useState([])
	const [showPanel, setShowPanel] = useState(false)
	const [allNotifications, setAllNotifications] = useState([])
	const panelRef = useRef(null)
	const bellRef = useRef(null)

	const loadNotifications = async () => {
		const token = localStorage.getItem('token')
		const role = localStorage.getItem('role')

		try {
			const response = await api.get(`/notification/get-by-user?role=${role}`, {
				headers: { Authorization: `Bearer ${token}` }
			})

			setNotifDB(response.data)

		} catch (error) {
			console.error('Erro ao carregar notificações.', error);
			return []
		}
	}

	useEffect(() => {
		loadNotifications()
	}, [])

	useEffect(() => {
		if (notifDB.length <= 0) { return }

		let currentIndex = 0

		const interval = setInterval(() => {
			const notification = notifDB[currentIndex]
			currentIndex++

			if (!notification) { clearInterval(interval); return; }

			const newNotification = {
				...notification,
				timestamp: new Date(),
			}

			if (!newNotification.read) {
				// Adicionar à lista de notificações ativas (toast)
				setNotifications((prev) => [...prev, newNotification])
			}

			// Adicionar ao histórico completo
			setAllNotifications((prev) => [newNotification, ...prev])

			// Remover automaticamente após 5 segundos
			setTimeout(() => {
				removeNotification(newNotification.id)
			}, 8000)
		}, 300) // Nova notificação a cada 3/10 de segundos

		return () => clearInterval(interval)
	}, [notifDB])

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

	const markAsRead = async (id) => {
		setAllNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
		const token = localStorage.getItem('token')

		try {
			await api.patch(`/notification/update?id=${id}`, { read: true }, {
				headers: { Authorization: `Bearer ${token}` },
			})
			
		} catch (error) {
			console.error('Erro ao atualizar notificação.', error);
		}
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
				<button style={{fontSize: '1.1em'}} ref={bellRef} className="notification-bell" onClick={() => setShowPanel(!showPanel)}>
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
									<div style={{ fontSize: "24px", marginBottom: "8px" }}>🔔</div>
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
