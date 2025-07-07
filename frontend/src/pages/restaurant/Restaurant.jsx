import "./Restaurant.css"
import api from "../../service/api"
import Swal from "sweetalert2"
import { useMemo, useRef, useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

export default function RestaurantPage() {
	const [searchParams] = useSearchParams()
	const restaurantId = searchParams.get('restaurantId')
	const [userRating, setUserRating] = useState(0)
	const [hoverRating, setHoverRating] = useState(0)
	// const [isRatingMode, setIsRatingMode] = useState(false)
	const [pdfSize, setPdfSize] = useState('')
	const [client, setClient] = useState([])
	const [selectedReview, setSelectedReview] = useState(null)
	const [update, setUpdate] = useState(false)
	const [alreadyAClient, setAlreadyAClient] = useState(false)
	const reviewFormRef = useRef(null)

	// Nota média do restaurante (simulada)

	// Estados para reviews
	const [reviews, setReviews] = useState([])
	const [showReviewForm, setShowReviewForm] = useState(false)
	const [newReview, setNewReview] = useState({
		name: "",
		comment: "",
		rating: 0,
		tags: [],
	})
	// const [reviewHoverRating, setReviewHoverRating] = useState(0)
	const [showAllReviews, setShowAllReviews] = useState(false)

	// Tags disponíveis para reviews
	const availableTags = [
		"Comida",
		"Atendimento",
		"Ambiente",
		"Preço",
		"Limpeza",
		"Localização",
		"Estacionamento",
		"Música",
	]

	// Informações do restaurante
	const [restaurantInfo, setRestaurantInfo] = useState({
		id: "",
		name: "",
		email: "",
		address: "",
		phone: "",
		mapsURL: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3981.5561571487106!2d-40.349510099999996!3d-3.6879321999999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x7eac76c6e4976df%3A0x1bcff210ca65456c!2sS%C3%A3o%20e%20Salvo%20Boteco!5e0!3m2!1spt-BR!2sbr!4v1750567249437!5m2!1spt-BR!2sbr" width="600" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade',
		description: "",
		opensAt: "",
		closesAt: "",
		avatar: "",
		menu: "",
		review: [],
	})

	// Calcular média das avaliações (sempre retorna número)
	function calculateAverageRating() {
		if (restaurantInfo.review.length === 0) return 4.2 // valor padrão
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
					if (interactive) {
						filled = star <= (hoverRating || userRating)
					} else {
						filled = star <= Math.floor(rating) || (star === Math.ceil(rating) && rating % 1 >= 0.5)
					}

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

	const handleWhatsAppContact = () => {
		const phoneNumber = restaurantInfo.phone ? restaurantInfo.phone.replace(/\D/g, "") : ''
		const message = encodeURIComponent("Olá! Gostaria de fazer uma reserva no " + restaurantInfo.name)
		const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
		window.open(whatsappUrl, "_blank")
	}

	const handleMenuDownload = () => {
		const menu_url = restaurantInfo.menu ? `http://localhost:3000/${restaurantInfo.menu.replace('src\\', '')}` : ''
		window.open(menu_url, '_blank')
	}

	const openGoogleMaps = () => {
		const mapUrl = restaurantInfo.mapsURL || 'https://www.google.com/maps'
		window.open(mapUrl, "_blank")
	}

	const handleSubmitReview = async (e, update) => {
		e.preventDefault()
		const token = localStorage.getItem('token')

		console.log("Submetendo avaliação:", newReview);
		console.log('Update: ', update);

		if (newReview.comment.trim() && newReview.rating > 0) {

			if (token) {
				const review = {
					// id: Date.now(), // Gerar um ID único baseado no timestamp
					clientName: client.name || "Anônimo",
					comment: newReview.comment.trim(),
					rating: newReview.rating,
					// date: new Date(),
					tags: newReview.tags,
					clientId: client.id,
					restaurantId: restaurantId
				}

				if (!review) { return console.log('Erro na criação da review. Tente novamente.'); }

				if (!update) {

					try {
						const response = await api.post('/review/register', review)

						console.log('Registrar Review: ', response);

						Swal.fire('Review publicada!', "success", 1500)

					} catch (error) {
						Swal.fire('Falha ao publicar review', 1500)
						return console.error('Falha ao criar review. Erro ao alimentar banco com informações.', error);
					}
				} else {
					try {
						const response = await api.put(`/review/update/${selectedReview.id}`, review, {
							headers: { Authorization: `Bearer ${token}` }
						})

						console.log('Atualizar Review: ', response);

						Swal.fire('Review atualizada!', "success", 1500)

					} catch (error) {
						Swal.fire('Falha ao publicar review', 1500)
						return console.error('Falha ao criar review. Erro ao alimentar banco com informações.', error);
					}
				}


				console.log(averageRating);

				const updatedReviews = [review, ...reviews]
				setReviews(updatedReviews)

				setNewReview({ name: "", comment: "", rating: 0, tags: [] })
				setUserRating(0)
				setHoverRating(0)
				setShowReviewForm(false)

				Swal.fire("Avaliação Enviada!", "Obrigado pela sua avaliação!", "success")

				getRestaurantInfo();
			} else {
				console.log('Você não está logado, faça login para escrever uma review.');
				Swal.fire({
					position: 'top-end',
					icon: 'warning',
					title: 'Você não está logado.',
					text: 'Faça login para escrever uma review.',
					showConfirmButton: false,
					timer: 1500,
					willClose: () => {
						window.location.href = '/login'
					}
				})
			}
		}
	}

	function formatDate(isoDateString) {
		if (!isoDateString) return '';

		const date = new Date(isoDateString);

		const options = {
			year: 'numeric',
			month: 'long',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit',
			second: '2-digit',
			// timeZone: 'America/Sao_Paulo', // Opcional: force um fuso horário específico
			timeZoneName: 'shortOffset', // Mostra o offset (ex: GMT-3)
		};
		return new Intl.DateTimeFormat('pt-BR', options).format(date);
	}

	const handleTagToggle = (tag) => {
		if (newReview.tags.includes(tag)) {
			setNewReview({
				...newReview,
				tags: newReview.tags.filter((t) => t !== tag),
			})
		} else {
			setNewReview({
				...newReview,
				tags: [...newReview.tags, tag],
			})
		}
	}

	const reorderedReviews = useMemo(() => {
		if (!Array.isArray(restaurantInfo.review)) {
			return [];
		}

		const sorted = [...restaurantInfo.review].sort((a, b) => {
			if (client.id && a.clientId === client.id && b.clientId !== client.id) {
				return -1;
			}
			if (client.id && a.clientId !== client.id && b.clientId === client.id) {
				return 1;
			}

			return new Date(b.updatedAt || '') - new Date(a.updatedAt || '');
		});

		return sorted;
	}, [client.id, restaurantInfo.review]); // Dependências: client.id e o array client.review

	console.log('Reordered Reviews: ', reorderedReviews);
	

	const displayedReviews = showAllReviews ? reorderedReviews : reorderedReviews.slice(0, 3);



	// const displayedReviews = showAllReviews ? restaurantInfo.review : restaurantInfo.review.slice(0, 3)
	const ratingDistribution = calculateRatingDistribution()

	const getPdfSize = useCallback(async (pdfURL) => {
		try {
			const response = await api.head(pdfURL)

			const contentLength = response.headers['content-length']
			if (contentLength) {
				const sizeInMb = (parseInt(contentLength) / (1024 * 1024)).toFixed(2)
				return `${sizeInMb} MB`
			} else {
				return 'Tamanho desconhecido'
			}
		} catch (error) {
			console.error('Erro ao obter o tamanho do pdf:', error);
			return 'Erro ao obter tamanho'
		}
	}, [])

	const getClientInfo = useCallback(async () => {
		const token = localStorage.getItem('token')

		try {
			const response = await api.get('/client/get-one', {
				Authorization: `Bearer ${token}`
			})

			console.log('Cliente Info: ', response.data);

			setClient(response.data)

		} catch (error) {
			console.error('É preciso estar logado para fazer um reserva.', error);
			Swal.fire({
				position: 'top-end',
				icon: 'warning',
				title: 'Você não está logado!',
				text: 'Faça login para fazer uma reserva.',
				timer: 1500,
				showConfirmButton: false,
				willClose: () => {
					window.location.href = '/login'
				}
			})
		}
	}, [])

	const getRestaurantInfo = useCallback(async () => {
		try {

			const response = await api.get(
				restaurantId
					? `/restaurant/get-many?id=${restaurantId}`
					: "/restaurant/get-many"
			)

			console.log('Response Front:', response.data);

			const data = response.data.restaurants[0]

			setRestaurantInfo({
				id: data.id,
				name: data.name,
				email: data.email,
				address: data.fullAddress,
				phone: data.phone,
				mapsURL: data.mapsUrl,
				description: data.description,
				opensAt: data.opensAt,
				closesAt: data.closesAt,
				avatar: data.avatar,
				menu: data.menu,
				review: data.review,
			})

			console.log('REvciew: ', data.review);

			return data
		} catch (error) {
			console.error("Falha ao carregar informações do restaurante.", error)
			alert("Falha ao carregar informações do restaurante.")
		}
	}, [restaurantId])

	useEffect(() => {
		getClientInfo();
		getRestaurantInfo();
	}, [getClientInfo, getRestaurantInfo])

	useEffect(() => {
		if (restaurantInfo.review) {
			console.log('Restaurante Reviews: ', restaurantInfo.review);
			setReviews(restaurantInfo.review)
		}
	}, [restaurantInfo.review])

	useEffect(() => {
		if (restaurantInfo.menu) {
			const url = `http://localhost:3000/${restaurantInfo.menu.replace('src\\', '')}`
			getPdfSize(url).then(size => { setPdfSize(size) }).catch(error => {
				console.log('Erro ao obter tamanho do PDF:', error);
			})
		}
	}, [restaurantInfo.menu, getPdfSize]);

	useEffect(() => {
		if (showReviewForm && reviewFormRef) {
			const timer = setTimeout(() => {
				reviewFormRef.current.scrollIntoView({ behavior: 'instant', block: 'center' });
			}, 50);

			return () => clearTimeout(timer);
		}
	}, [showReviewForm])

	useEffect(() => {
		if (client.restaurantHistory && restaurantInfo.id) {
			const hasReserved = client.restaurantHistory.some(historyItem => {
				return historyItem === restaurantInfo.id
			})

			setAlreadyAClient(hasReserved)

			console.log(`Cliente ${client.name} já fez reserva no restaurante ${restaurantInfo.name}`);
			
		} else {
			setAlreadyAClient(false)
		}
	}, [client.restaurantHistory, client.name, restaurantInfo])

	return (
		<div className="restaurant-page-res-page">
			{/* Hero Section */}
			<section className="hero-res-page">
				<div className="container-res-page">
					<div className="hero-content-res-page">
						<div className="hero-image-res-page">
							{restaurantInfo.avatar &&
								<img
									src={
										restaurantInfo.avatar
											? `http://localhost:3000/${restaurantInfo.avatar.replace(/^src[\\/]/, '')}`
											: './logo.png'
									}
									alt={restaurantInfo.name}
								/>
							}

							{/* Informações do Restaurante */}
							<div className="restaurant-info-container-res-page">
								<div className="restaurant-info-grid-res-page">
									<div className="info-card-res-page">
										<div className="info-icon-res-page">📍</div>
										<div className="info-content-res-page">
											<h4>Endereço</h4>
											<p>{restaurantInfo.address}</p>
											<button className="directions-btn-res-page" onClick={openGoogleMaps}>
												Como Chegar
											</button>
										</div>
									</div>

									<div className="info-card-res-page">
										<div className="info-icon-res-page">🕒</div>
										<div className="info-content-res-page">
											<h4>Horário de Funcionamento</h4>
											<p>
												<strong>Segunda a Sexta:</strong> {restaurantInfo.opensAt}
											</p>
											<p>
												<strong>Sábado e Domingo:</strong> {restaurantInfo.closesAt}
											</p>
										</div>
									</div>

									<div className="info-card-res-page">
										<div className="info-icon-res-page">📞</div>
										<div className="info-content-res-page">
											<h4>Contato</h4>
											<p>Telefone: {restaurantInfo.phone}</p>
											<button
												className="call-btn-res-page"
												onClick={() => (window.location.href = `tel:${restaurantInfo.phone.replace(/\D/g, "")}`)}
											>
												Ligar Agora
											</button>
										</div>
									</div>
								</div>

								{/* Google Maps Embed */}
								{restaurantInfo.mapsURL &&
									<div className="map-container-res-page">
										<div className="map-header-res-page">
											<h4>Localização</h4>
											<button className="view-larger-map-res-page" onClick={openGoogleMaps}>
												Ver Mapa Ampliado
											</button>
										</div>
										<div className="map-embed-res-page">
											<iframe
												src={restaurantInfo.mapsURL}
												width="100%"
												height="250"
												style={{ border: 0 }}
												allowFullScreen={true}
												loading="lazy"
												title="Localização do Restaurante"
											></iframe>
										</div>
									</div>
								}
							</div>
						</div>

						<div className="restaurant-card-res-page">
							<div className="restaurant-badge-res-page">Bar e Restaurante</div>
							<h1 className="restaurant-name-res-page">{restaurantInfo.name}</h1>
							<p className="restaurant-description-res-page">{restaurantInfo.description}</p>

							{/* Rating Section */}
							<div className="rating-section-res-page">
								<div className="restaurant-rating-res-page">
									<div className="rating-display-res-page">
										{renderStars(averageRating, false, "large")}
										<div className="rating-info-res-page">
											<span className="rating-number-res-page">{averageRating.toFixed(1)}</span>
											<span className="rating-reviews-res-page">({reviews.length} avaliações)</span>
										</div>
									</div>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="action-buttons-res-page">
								<Link to={!localStorage.getItem('token') ? '/login' : `/tables?restaurantId=${restaurantId}`} className="reservation-btn-res-page">Fazer Reserva</Link>
								<button className="whatsapp-btn-res-page" onClick={handleWhatsAppContact}>
									<img className="whatsapp-icon-res-page" src="/whatsapp-logo1.png" alt="" />
									Falar no WhatsApp
								</button>
							</div>
						</div>
					</div>
				</div>
			</section>

			<div className="restaurant-content-res-page">
				{/* Menu Section */}
				{restaurantInfo.menu &&
					<section className="menu-section-res-page">
						<div className="container-res-page">
							<h2 className="section-title-res-page">Nosso Cardápio</h2>
							<p className="section-subtitle-res-page">Confira todas as delícias que preparamos para você</p>

							<div className="menu-container-res-page">
								<div className="menu-content-res-page">
									<div className="menu-item-res-page">
										<div className="menu-header-res-page">
											<h3>Cardápio</h3>
											<div className="menu-actions-res-page">
												<button className="view-btn-res-page" onClick={handleMenuDownload}>
													👁️ Visualizar
												</button>
											</div>
										</div>
										<div className="menu-preview-res-page">
											<img
												src="/menu-placeholder.png"
												alt=""
												className="menu-image-res-page"
												width="100%"
												height="400px"
											/>
											<div className="menu-info-res-page">
												<p>Clique no botão "Visualizar" para ver o cardápio completo</p>
												<span className="menu-size-res-page">PDF • {pdfSize}</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</section>
				}

				{/* Reviews Section */}
				<section className="reviews-section-res-page">
					<div className="container-res-page">
						<h2 className="section-title-res-page">Avaliações dos Clientes</h2>
						<p className="section-subtitle-res-page">Veja o que nossos clientes estão dizendo sobre nós!</p>

						<div className="reviews-container-res-page">
							{/* Rating Overview */}
							<div className="rating-overview-container-res-page">
								<div className="rating-overview-res-page">
									<div className="rating-score-res-page">
										<div className="big-score-res-page">{averageRating.toFixed(1).replace(".", ",")}</div>
										<div className="rating-stars-display-res-page">{renderStars(averageRating, false, "normal")}</div>
										<div className="total-reviews-res-page">{restaurantInfo.review.length} avaliações</div>
									</div>

									<div className="rating-bars-res-page">
										{[5, 4, 3, 2, 1].map((star) => (
											<div key={star} className="rating-bar-container-res-page">
												<div className="rating-bar-label-res-page">{star}</div>
												<div className="rating-bar-background-res-page">
													<div
														className="rating-bar-fill-res-page"
														style={{ width: `${ratingDistribution[star - 1]}%` }}
													></div>
												</div>
											</div>
										))}
									</div>
								</div>

								{alreadyAClient && client.review && !(client.review.length > 0) &&
									<button className="rate-button-res-page" onClick={
										() => {
											setShowReviewForm(true);
											setUpdate(false)
										}
									}>
										Avaliar Restaurante
									</button>
								}
							</div>

							{/* Add Review Form */}
							{showReviewForm && (
								<div ref={reviewFormRef} className="add-review-form-res-page">
									<div className="add-review-header-res-page">
										<h3 className="add-review-title-res-page">Deixe sua avaliação</h3>
										<button className="close-review-form-btn-res-page" onClick={() => setShowReviewForm(false)}>
											&times;
										</button>
									</div>

									<div className="review-form-content-res-page">
										<div className="review-rating-input-res-page">
											<label>Sua nota:</label>
											<div className="stars-input-res-page">
												{[1, 2, 3, 4, 5].map((star) => (
													<button
														key={star}
														className={`star-input-res-page ${userRating >= star ? "filled-res-page" : ""}`}
														onClick={() => {
															setUserRating(star)
															setNewReview({ ...newReview, rating: star })
														}}
														onMouseEnter={() => setHoverRating(star)}
														onMouseLeave={() => setHoverRating(0)}
													>
														★
													</button>
												))}
											</div>
											{userRating > 0 && <span className="rating-text-res-page">{userRating} estrelas</span>}
										</div>

										<div className="review-tags-input-res-page">
											<label>Selecione as tags relevantes:</label>
											<div className="tags-container-res-page">
												{availableTags.map((tag) => (
													<button
														key={tag}
														className={`tag-button-res-page ${newReview.tags.includes(tag) ? "selected-res-page" : ""}`}
														onClick={() => handleTagToggle(tag)}
														type="button"
													>
														{tag}
													</button>
												))}
											</div>
										</div>

										<div className="review-comment-input-res-page">
											<label>Seu comentário:</label>
											<textarea
												placeholder="Conte sua experiência no restaurante..."
												value={newReview.comment}
												onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
												rows="4"
											></textarea>
										</div>

										<button
											className="submit-review-button-res-page"
											onClick={(e) => {
												if (userRating > 0) {
													handleSubmitReview(e, update)
												} else {
													Swal.fire("Erro!", "Por favor, preencha todos os campos obrigatórios (nota, nome e comentário).", "error")
												}
											}}
										>
											Enviar Avaliação
										</button>
									</div>
								</div>
							)}

							{/* Reviews List */}
							<h3 className="reviews-list-title-res-page">Comentários dos clientes</h3>
							<div className="reviews-list-res-page">

								{displayedReviews.map((review, index) => (
									<div key={index} className="review-item-res-page">
										<div className="review-header-res-page">
											<div className="reviewer-avatar-res-page">{review.clientName ? review.clientName.charAt(0).toUpperCase() : "^_^"}</div>
											<div className="reviewer-info-res-page">
												<div className="reviewer-name-res-page">{review.clientName}</div>
												<div className="review-meta-res-page">
													<div className="review-stars-res-page">
														{[1, 2, 3, 4, 5].map((star) => (
															<span
																key={star}
																className={`review-star-res-page ${star <= review.rating ? "filled-res-page" : ""}`}
															>
																★
															</span>
														))}
													</div>
													<div className="review-date-res-page">{formatDate(new Date(review.updatedAt).toISOString())}</div>
												</div>
											</div>
											{review.clientId === client.id &&
												<button onClick={
													() => {
														setShowReviewForm(true)
														setSelectedReview(review)
														setUpdate(true)
													}
												} className="review-options-res-page">Editar📝</button>
											}
										</div>

										<div className="review-content-res-page">
											<p className="review-text-res-page">{review.comment}</p>
										</div>

										{review.tags && review.tags.length > 0 && (
											<div className="review-tags-res-page">
												{review.tags.map((tag) => (
													<span key={tag} className="review-tag-res-page">
														{tag}
													</span>
												))}
											</div>
										)}
									</div>
								))}

								{reviews.length > 3 && (
									<div className="reviews-actions-res-page">
										<button className="show-more-reviews-btn-res-page" onClick={() => setShowAllReviews(!showAllReviews)}>
											{showAllReviews ? "Ver Menos Avaliações" : `Ver Todas as Avaliações`}
										</button>
									</div>
								)}
							</div>
						</div>
					</div>
				</section>
			</div>

			{/* Content Section */}
			<section className="content-section-res-page">
				<div className="container-res-page">
					<div className="content-grid-res-page">
						<div className="content-text-res-page">
							<h2 className="content-heading-res-page">Sobre o restaurante {restaurantInfo.name}</h2>
							<h3 className="content-subheading-res-page">Uma experiência gastronômica única</h3>
							<p className="content-body-res-page">
								Descubra o sabor autêntico em cada prato, preparado com ingredientes frescos e paixão pela culinária.
								Nosso restaurante oferece uma experiência gastronômica única, onde cada detalhe é pensado para
								satisfazer seu paladar.
							</p>
							<p className="content-body-res-page">
								Desfrute de um ambiente acolhedor e um serviço impecável, enquanto saboreia nossos pratos exclusivos.
								Deixe-se levar pelos aromas e sabores que tornam cada refeição uma celebração.
							</p>
							<p className="content-body-res-page">
								Venha nos visitar e descubra por que somos o destino preferido dos amantes da boa comida. Esperamos por
								você para uma experiência inesquecível!
							</p>
						</div>
						{restaurantInfo.avatar &&
							<div className="content-image-res-page">
								<img src={`http://localhost:3000/${restaurantInfo.avatar.replace('src\\', '')}`} alt="Interior do restaurante" />
							</div>
						}
					</div>
				</div>
			</section>
		</div>
	)
}
