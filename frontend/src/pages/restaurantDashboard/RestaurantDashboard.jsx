import { useState, useEffect, useMemo, useCallback } from "react"
import { Link } from "react-router-dom"
import "./RestaurantDashboard.css"
import api from "../../service/api"
import Swal from "sweetalert2"

export default function RestaurantDashboard() {
	const [currentTime, setCurrentTime] = useState(new Date())
	const [searchReservation, setSearchReservation] = useState('')
	const [showAllReservations, setShowAllReservations] = useState(false)
	const [showAllReviews, setShowAllReviews] = useState(false)
	const [showClientNoteModal, setShowClientNoteModal] = useState(false)
	const [selectedReservation, setSelectedReservation] = useState([])
	const [note, setNote] = useState([])
	const [restaurantInfo, setRestaurantInfo] = useState({ name: "", email: "", phone: "", fullAdress: "", avatar: "", reservations: [], review: [] })

	// Calcular média das avaliações (sempre retorna número)
	function calculateAverageRating() {
		if (restaurantInfo.review.length === 0) return 0 // valor padrão
		const sum = restaurantInfo.review.reduce((acc, review) => acc + review.rating, 0)
		return sum / restaurantInfo.review.length
	}

	const averageRating = calculateAverageRating()

	// Calcular distribuição de avaliações
	const calculateRatingDistribution = () => {
		const distribution = [0, 0, 0, 0, 0] // 1 a 5 estrelas

		restaurantInfo.review.forEach((review) => {
			if (review.rating >= 1 && review.rating <= 5) {
				distribution[review.rating - 1]++
			}
		})

		const total = distribution.reduce((acc, count) => acc + count, 0)

		return distribution.map((count) => {
			return total > 0 ? (count / total) * 100 : 0
		})
	}

	const ratingDistribution = calculateRatingDistribution()

	const reorderedReviews = useMemo(() => {
		if (!Array.isArray(restaurantInfo.review)) {
			return [];
		}

		const sorted = [...restaurantInfo.review].sort((a, b) => {
			return new Date(b.updatedAt || '') - new Date(a.updatedAt || '');
		});

		return sorted;
	}, [restaurantInfo.review]);

	const displayedReviews = showAllReviews ? reorderedReviews : reorderedReviews.slice(0, 3);

	const reorderedReservations = useMemo(() => {
		if (!Array.isArray(restaurantInfo.reservations)) {
			return [];
		}

		// Definir a ordem de prioridade dos status
		const statusOrder = {
			'Pending': 1,    // Primeiro
			'Confirmed': 2,  // Segundo
			// Adicione outros status aqui com números maiores
			'Completed': 3,
			'Cancelled': 4,
			// Qualquer status não listado aqui terá um valor undefined,
			// que pode ser tratado como a menor prioridade (maior número)
		};

		const sorted = [...restaurantInfo.reservations].sort((a, b) => {
			const orderA = statusOrder[a.status] || Infinity; // Se status não existe, vai para o final
			const orderB = statusOrder[b.status] || Infinity; // Infinity garante que status desconhecidos fiquem por último

			// 1. Comparar por status (prioridade principal)
			if (orderA < orderB) {
				return -1; // 'a' vem antes de 'b'
			}
			if (orderA > orderB) {
				return 1; // 'b' vem antes de 'a'
			}

			// 2. Se os status são iguais, desempate pela data de atualização (mais recente primeiro)
			// Usar `updatedAt` é bom para ver as mudanças mais recentes.
			return new Date(b.updatedAt || '') - new Date(a.updatedAt || '');
		});

		return sorted;
	}, [restaurantInfo.reservations]);

	const searchResult = () => {

		if (searchReservation.trim() === '') {
			return restaurantInfo.reservations;
		}

		const searchTerm = searchReservation.toLowerCase().trim(); // Limpa espaços e normaliza

		return restaurantInfo.reservations.filter(res => {
			const statusMatch = res.status && res.status.toLowerCase().includes(searchTerm)
			const monthMatch = res.month && res.month.toLowerCase().includes(searchTerm)
			const dayMatch = res.day && res.day.toLowerCase().includes(searchTerm)
			const tableIdMatch = res.tableId && res.tableId.toLowerCase().includes(searchTerm);
			const clientNameMatch = res.customerName && res.customerName.toLowerCase().includes(searchTerm);

			return statusMatch || monthMatch || dayMatch || tableIdMatch || clientNameMatch;
		});
	};

	const displayedResevations = searchReservation.trim() === ''
		? (showAllReservations ? reorderedReservations : reorderedReservations.slice(0, 5))
		: searchResult();

	const getRestaurantInfo = useCallback(async () => {
		try {
			const token = localStorage.getItem('token')

			const response = await api.get('/restaurant/get-one', {
				headers: { Authorization: `Bearer ${token}` }
			})

			if (!response) { return console.log('Erro ao acessar informações no banco'); }

			const avatarURL = response.data.restaurant.avatar.replace('src\\', '')

			setRestaurantInfo({
				...restaurantInfo,
				id: response.data.restaurant.id,
				name: response.data.restaurant.name,
				email: response.data.restaurant.email,
				phone: response.data.restaurant.phone,
				status: response.data.restaurant.status,
				fullAdress: response.data.restaurant.fullAddress,
				avatar: `http://localhost:3000/${avatarURL}`,
				tables: response.data.restaurant.tables,
				review: response.data.restaurant.review,
				reservations: response.data.restaurant.reservations
			})

			console.log('Usuário encontrado com sucesso! Avatar:', response.data.restaurant);
			console.log('AvatarURL', avatarURL);

		} catch (error) {
			console.error('Erro ao carregar informações do restaurante: ', error);
		}
	})

	// let res = []

	// async function fetchReservations() {
	// 	res = await api.get("/restaurant/get-many")
	// 	setReservations(res.data.restaurants)
	// }

	useEffect(() => {
		getRestaurantInfo()
		// fetchReservations()
	}, [])

	const handleDeleteAccount = async (e) => {
		Swal.fire({
			title: "Tem certeza?",
			text: "Esta ação excluirá sua conta atual. Você não poderá reverter isso!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: "Sim, apagar!",
			cancelButtonText: "Não, cancelar!",
			reverseButtons: true
		}).then((result) => {
			if (result.isConfirmed) {

				deleteAccount(e)

				Swal.fire({
					position: "top-end",
					icon: "warning",
					title: "Conta Apagada!",
					showConfirmButton: false,
					timer: 1500,
					willClose: () => {
						window.location.href = '/';
					}
				});

			} else if (
				result.dismiss === Swal.DismissReason.cancel
			) {/**/ }
		});
	}

	async function deleteAccount(e) {
		e.preventDefault()

		const token = localStorage.getItem('token')

		try {
			const response = await api.delete(`/restaurant/delete?id=${restaurantInfo.id}`, {
				headers: { Authorization: `Bearer ${token}` }
			})

			if (!response) { return console.log('Falha na exclusão de conta'); }

			console.log("Tentando apagar usuário:", response.data.restaurant);

			localStorage.clear()
			// alert("Perfil excluído com sucesso!");

		} catch (error) {
			console.error('Erro ao deletar conta! ', error);
		}
	}

	const updateReservation = async (reservationID, status) => {
		const token = localStorage.getItem('token')

		const data = {
			id: reservationID,
			status: status
		}

		try {
			const response = api.patch('/reservation/update-status', data, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			})

			console.log('Status atualizado! ', response);

			getRestaurantInfo();

			Swal.fire({
				position: 'top-end',
				showConfirmButton: false,
				icon: 'success',
				title: 'Atualizado',
				text: 'Reserva atualizada com sucesso!',
				timer: 1500
			})

		} catch (error) {
			console.error('Erro na atulização.', error);
			Swal.fire({
				icon: 'warning',
				title: 'Oops',
				text: 'Erro ao tentar atualizar status de reserva, tente novamente.'
			})
		}
	}

	const handleCancelReservation = async (reservationID) => {
		Swal.fire({
			title: "Tem certeza?",
			text: "Esta ação cancelará a reserva selecionada. Você não poderá reverter isso!",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: "Sim, cancelar reserva!",
			cancelButtonText: "Não, manter reserva!",
			reverseButtons: true
		}).then((result) => {
			if (result.isConfirmed) {

				updateReservation(reservationID, 'Cancelled')

				Swal.fire({
					position: "top-end",
					icon: "warning",
					title: "Reserva Cancelada!",
					showConfirmButton: false,
					timer: 1500,
				});

			} else if (
				result.dismiss === Swal.DismissReason.cancel
			) {/**/ }
		});
	}

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date())
		}, 1000)

		return () => clearInterval(timer)
	}, [])

	const formatTime = (date) => {
		return date.toLocaleTimeString("pt-BR", {
			hour12: true,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		})
	}

	const formatDate = (date) => {
		return date.toLocaleDateString("pt-BR", {
			month: "long",
			day: "numeric",
			year: "numeric",
		})
	}

	// const popularDishes = [
	// 	{ id: "01", name: "Butter Chicken", orders: 250, image: "/placeholder.svg?height=60&width=60" },
	// 	{ id: "02", name: "Palak Paneer", orders: 190, image: "/placeholder.svg?height=60&width=60" },
	// 	{ id: "03", name: "Hyderabadi Biryani", orders: 300, image: "/placeholder.svg?height=60&width=60" },
	// 	{ id: "04", name: "Masala Dosa", orders: 220, image: "/placeholder.svg?height=60&width=60" },
	// 	{ id: "05", name: "Chole Bhature", orders: 270, image: "/placeholder.svg?height=60&width=60" },
	// 	{ id: "06", name: "Rajma Chawal", orders: 180, image: "/placeholder.svg?height=60&width=60" },
	// 	{ id: "07", name: "Paneer Tikka", orders: 210, image: "/placeholder.svg?height=60&width=60" },
	// ]

	const renderStars = (
		rating,
		interactive = false,
		size = "normal",
		onStarClick = null,
		onStarHover = null,
		onStarLeave = null,
	) => {
		const starSize = size === "large" ? "star-large-res-page" : "star-res-page"

		return (
			<div className="stars-container-res-page">
				{[1, 2, 3, 4, 5].map((star) => {
					let filled = false
					filled = star <= Math.floor(rating) || (star === Math.ceil(rating) && rating % 1 >= 0.5)

					return (
						<button
							key={star}
							className={`${starSize} ${filled ? "filled-res-page" : ""} ${interactive ? "interactive-res-page" : "display-res-page"}`}
							onClick={interactive ? () => onStarClick(star) : undefined}
							onMouseEnter={interactive ? () => onStarHover(star) : undefined}
							onMouseLeave={interactive ? () => onStarLeave() : undefined}
							disabled={!interactive}
						>
							★
						</button>
					)
				})}
			</div>
		)
	}

	const handleSeeNote = (order) => {
		setNote(order)
		setShowClientNoteModal(true)
	}

	return (
		<div className="dashboard">
			<div className="dashboard-header">
				<div className="greeting">
					<h1>Olá, {restaurantInfo.name}</h1>
					<p>Dê o seu melhor no atendimento ao cliente 😊</p>
				</div>
				<div className="time-display">
					<h2>{formatTime(currentTime)}🕜</h2>
					<p> <span style={{fontStyle: "italic"}}>• Status de Restaurante:</span> {restaurantInfo && restaurantInfo.status === 'Approved' ? <span style={{color: "yellowgreen", fontStyle: "italic"}}>Aprovado ✓</span> : <span style={{color: "yellow", fontStyle: "italic"}}>Pendente ⏳</span>} • {formatDate(currentTime)}</p>
				</div>
			</div>

			<div className="dashboard-stats">
				<div className="rp-card earnings">
					<div className="rp-avatar-container">
						{restaurantInfo.avatar && <img className="rp-avatar" src={restaurantInfo.avatar} />}
					</div>
					<div className="stat-content">
						<h2>Seu Perfil</h2>
						<div className="profile-actions">
							<Link to={'/update-restaurant-profile'} className="editBtn">Editar Perfil</Link>
							<span> | </span>
							<span onClick={(e) => handleDeleteAccount(e)} className="deleteBtn">Encerrar Conta</span>
						</div>
						<h3>Endereço: {restaurantInfo.fullAdress}</h3>
						<h3>E-mail: {restaurantInfo.email}</h3>
						<h3>Telefone: {restaurantInfo.phone}</h3>
					</div>
				</div>
			</div>

			<div className="dashboard-content">
				<div className="recent-orders">
					<div className="section-header">
						<h2>Pedidos de Reservas</h2>
						<button className="view-all" onClick={() => setShowAllReservations(!showAllReservations)}>
							{showAllReservations ? "Ver Menos Reservas" : `Ver Todas as Reservas`}
						</button>
					</div>

					<div className="search-container">
						<input
							type="text"
							placeholder="Pesquise suas reservas"
							value={searchReservation}
							onChange={(e) => setSearchReservation(e.target.value)}
						/>
						<span className="search-icon">🔍</span>
					</div>

					<div className="orders-list">
						{displayedResevations.length > 0
							?
							displayedResevations.map((order) => (
								<div className="order-item-container" onClick={() => { selectedReservation === order.id ? setSelectedReservation('') : setSelectedReservation(order.id) }}>
									<div className="order-item" key={order.id}>
										<div className="order-initials">
											<div className="reservationDay">
												<span>{String(new Date(order.date).getDate()).padStart(2, '0')}</span>
											</div>
											<div className="reservationMonth">
												<span>{String(new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date(order.date))).toUpperCase()}</span>
											</div>
										</div>
										{order.notes &&
											<div className="client-notes-btn">
												<p className="client-notes-title" onClick={() => { handleSeeNote(order) }} >• Nota de Cliente </p>
											</div>
										}
										<div>

											<div className="order-box">
												<div className="client-reservation-details">
													<p>Cliente: {order.client.name}</p>
													<p>Total de pessoas: {order.guests}</p>
													<p>Horário: {order.startsAt} até {order.endsAt}</p>
													<p>Dia: {order.day}</p>
												</div>
												<div className="order-table">
													<span>Mesa Nº: {order.tables ? order.tables.codeID.padStart(3, '0') : 'SEM REGISTRO'}</span>
												</div>
												<div className="order-status">
													{
														order.status && (
															<>
																{order.status === 'Confirmed' ? <span className="status-text">Confirmado ✓</span> : (order.status === 'Pending' ? <> <span className="status-text">Pendente</span> <span className="timerIcon">⏳</span></> : <> <span className="status-text">Cancelado</span> <span className="timerIcon">❌</span></>)}
															</>
														)
													}
												</div>
												{order.status && order.status !== 'Cancelled' &&
													<div className="restaurant-reservation-actions">
														{order.tables && order.status && order.status !== 'Confirmed' &&
															<button onClick={() => updateReservation(order.id, 'Confirmed')} className="restaurant-confirm-button">Confirmar</button>
														}
														<button onClick={() => handleCancelReservation(order.id)} className="restaurant-cancel-button">Cancelar</button>
													</div>
												}
											</div>
										</div>
									</div>
								</div>
							))
							:
							<div className="restaurant-reservation-placeholder" >
								<hr />
								<h2>*** Sem Pedidos no Momento ***</h2>
								<hr />
							</div>
						}
					</div>
				</div>

				<div className="reviews">
					<div className="review-section-header">
						<h2>Avalições dos Clientes</h2>
					</div>

					<div className="rating-overview-container-dashboard-page">
						<div className="rating-overview-res-dashboard-page">
							<div className="rating-score-res-dashboard-page">
								<div className="big-score-res-dashboard-page">{averageRating.toFixed(1).replace(".", ",")}</div>
								<div className="rating-stars-display-res-dashboard-page">{renderStars(averageRating, false, "normal")}</div>
								<div className="total-reviews-res-dashboard-page">{restaurantInfo.review.length} avaliações</div>
							</div>

							<div className="rating-bars-res-dashboard-page">
								{[5, 4, 3, 2, 1].map((star) => (
									<div key={star} className="rating-bar-container-res-dashboard-page">
										<div className="rating-bar-label-res-dashboard-page">{star}</div>
										<div className="rating-bar-background-res-dashboard-page">
											<div
												className="rating-bar-fill-res-dashboard-page"
												style={{ width: `${ratingDistribution[star - 1]}%` }}
											></div>
										</div>
									</div>
								))}
							</div>
						</div>
					</div>

					{/* Reviews List */}
					<h3 className="reviews-list-title-dashboard-page">Comentários dos clientes</h3>
					<div className="reviews-list-res-dashboard-page">
						{displayedReviews.length > 0
							?
							displayedReviews.map((review, index) => (
								<div key={index} className="review-item-res-dashboard-page">
									<div className="review-header-res-dashboard-page">
										<div className="review-avatar-res-dashboard-page">{review.clientName ? review.clientName.charAt(0).toUpperCase() : "^_^"}</div>
										<div className="review-info-res-dashboard-page">
											<div className="review-name-res-dashboard-page">{review.clientName}</div>
											<div className="review-meta-res-dashboard-page">
												<div className="review-stars-res-dashboard-page">
													{[1, 2, 3, 4, 5].map((star) => (
														<span
															key={star}
															className={`review-star-res-dashboard-page ${star <= review.rating ? "filled-res-dashboard-page" : ""}`}
														>
															★
														</span>
													))}
												</div>
												<div className="review-date-res-dashboard-page">{formatDate(new Date(review.updatedAt))}</div>
												<div className="review-date-res-dashboard-page">{formatTime(new Date(review.updatedAt))}</div>
											</div>
										</div>
									</div>

									<div className="review-content-res-dashboard-page">
										<p className="review-text-res-dashboard-page">{review.comment}</p>
									</div>

									{review.tags && review.tags.length > 0 && (
										<div className="review-tags-res-dashboard-page">
											{review.tags.map((tag) => (
												<span key={tag} className="review-tag-res-dashboard-page">
													{tag}
												</span>
											))}
										</div>
									)}
								</div>
							))
							:
							<div className="restaurant-reservation-placeholder" >
								<hr />
								<h2>*** Sem Comentários ***</h2>
								<hr />
							</div>
						}

						{displayedReviews.length > 3 && (
							<div className="reviews-actions-res-page">
								<button className="review-show-more-reviews-btn-res-page" onClick={() => setShowAllReviews(!showAllReviews)}>
									{showAllReviews ? "Ver Menos Avaliações" : `Ver Todas as Avaliações`}
								</button>
							</div>
						)}
					</div>

					{/* Show Client Note Modal */}

					{
						showClientNoteModal && (
							<div className="tables-modal-overlay">
								<div style={{ minWidth: "600px" }} className="tables-modal">
									<h2 className="table-title">Observações do Cliente <br /> <span style={{ color: "yellowgreen" }}>{note.client.name}</span></h2>
									<p>{note.notes}</p>

									<div className="tables-modal-buttons">
										<button className="tables-btn-cancel" onClick={() => { setShowClientNoteModal(false) }}>
											Fechar
										</button>
									</div>
								</div>
							</div>
						)
					}
				</div>
			</div>
		</div>
	)
}
