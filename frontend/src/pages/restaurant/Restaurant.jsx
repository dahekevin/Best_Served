import "./Restaurant.css"
import api from "../../service/api"
import Swal from "sweetalert2"
import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

export default function RestaurantPage() {
	const [searchParams] = useSearchParams()
	const restaurantId = searchParams.get('restaurantId')
	const [userRating, setUserRating] = useState(0)
	const [hoverRating, setHoverRating] = useState(0)
	// const [isRatingMode, setIsRatingMode] = useState(false)
	const [pdfSize, setPdfSize] = useState('')

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
	})

	// Calcular média das avaliações (sempre retorna número)
	function calculateAverageRating() {
		if (reviews.length === 0) return 4.2 // valor padrão
		const sum = reviews.reduce((acc, review) => acc + review.rating, 0)
		return sum / reviews.length
	}

	const averageRating = calculateAverageRating()

	// Calcular distribuição de avaliações
	const calculateRatingDistribution = () => {
		const distribution = [0, 0, 0, 0, 0] // 1 a 5 estrelas

		reviews.forEach((review) => {
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

	const handleSubmitReview = (e) => {
		e.preventDefault()
		console.log("Submetendo avaliação:", newReview);
		
		if (newReview.name.trim() && newReview.comment.trim() && newReview.rating > 0) {
			
			const review = {
				// id: Date.now(), // Gerar um ID único baseado no timestamp
				name: newReview.name.trim(),
				comment: newReview.comment.trim(),
				rating: newReview.rating,
				date: new Date().toISOString().split("T")[0],
				tags: newReview.tags,
				// Adicionar ID do usuario
				// Adicionar ID do restaurante
				clientId: localStorage.getItem("clientId") || "default-client-id",
			}

			console.log(averageRating);

			const updatedReviews = [review, ...reviews]
			setReviews(updatedReviews)
			// localStorage.setItem("restaurant-reviews", JSON.stringify(updatedReviews))

			setNewReview({ name: "", comment: "", rating: 0, tags: [] })
			setUserRating(0)
			setHoverRating(0)
			setShowReviewForm(false)

			Swal.fire("Avaliação Enviada!", "Obrigado pela sua avaliação!", "success")
		}
	}

	const formatDate = (dateString) => {
		const date = new Date(dateString)
		return date.toLocaleDateString("pt-BR", { day: "numeric", month: "long", year: "numeric" })
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

	const displayedReviews = showAllReviews ? reviews : reviews.slice(0, 3)
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
			})

			return data
		} catch (error) {
			console.error("Falha ao carregar informações do restaurante.", error)
			alert("Falha ao carregar informações do restaurante.")
		}
	}, [restaurantId])

	useEffect(() => {
		getRestaurantInfo();
	}, [])

	useEffect(() => {
		if (restaurantInfo.menu) {
			const url = `http://localhost:3000/${restaurantInfo.menu.replace('src\\', '')}`
			getPdfSize(url).then(size => { setPdfSize(size) }).catch(error => {
				console.log('Erro ao obter tamanho do PDF:', error);
			})
		}
	}, [restaurantInfo.menu, getPdfSize]);

	useEffect(() => {
		// const savedReviews = localStorage.getItem("restaurant-reviews")
		const savedReviews = false
		if (savedReviews) {
			setReviews(JSON.parse(savedReviews))
		} else {
			// Reviews iniciais para demonstração
			const initialReviews = [
				{
					id: 1,
					name: "Maria Silva",
					comment: "Excelente restaurante! A comida é deliciosa e o atendimento é impecável. Recomendo muito!",
					rating: 5,
					date: "2024-01-15",
					tags: ["Comida", "Atendimento"],
				},
				{
					id: 2,
					name: "João Santos",
					comment: "Ambiente muito agradável e pratos bem preparados. O preço é justo pela qualidade oferecida.",
					rating: 4,
					date: "2024-01-10",
					tags: ["Ambiente", "Preço"],
				},
				{
					id: 3,
					name: "Ana Costa",
					comment: "Adorei a experiência! Os pratos são saborosos e a apresentação é linda. Voltarei com certeza.",
					rating: 5,
					date: "2024-01-08",
					tags: ["Comida", "Ambiente"],
				},
				{
					id: 4,
					name: "Carlos Oliveira",
					comment: "Boa comida, mas o atendimento poderia ser mais rápido. No geral, uma experiência positiva.",
					rating: 3,
					date: "2024-01-05",
					tags: ["Comida", "Atendimento"],
				},
				{
					id: 5,
					name: "NETTO",
					comment:
						"NÃO RECOMENDO ESSE RESTAURANTE. ELE É MUITO RUIM. TEM O PIOR ATENDIMENTO QUE JA VI, NAO VALE A PENA.",
					rating: 1,
					date: "2024-06-10",
					tags: ["Atendimento"],
				},
			]
			setReviews(initialReviews)
			// localStorage.setItem("restaurant-reviews", JSON.stringify(initialReviews))
		}
	}, []);

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
										<div className="total-reviews-res-page">{reviews.length} avaliações</div>
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

								<button className="rate-button-res-page" onClick={() => setShowReviewForm(true)}>
									Avaliar Restaurante
								</button>
							</div>

							{/* Add Review Form */}
							{showReviewForm && (
								<div className="add-review-form-res-page">
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

										<div className="review-name-input-res-page">
											<label>Seu nome:</label>
											<input
												type="text"
												placeholder="Digite seu nome"
												value={newReview.name}
												onChange={(e) => setNewReview({ ...newReview, name: e.target.value })}
											/>
										</div>

										<button
											className="submit-review-button-res-page"
											onClick={(e) => {
												if (userRating > 0) {
													handleSubmitReview(e)
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

								{displayedReviews.map((review) => (
									<div key={review.id} className="review-item-res-page">
										<div className="review-header-res-page">
											<div className="reviewer-avatar-res-page">{review.name.charAt(0).toUpperCase()}</div>
											<div className="reviewer-info-res-page">
												<div className="reviewer-name-res-page">{review.name}</div>
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
													<div className="review-date-res-page">{formatDate(review.date)}</div>
												</div>
											</div>
											{/* <button className="review-options-res-page">⋮</button> */}
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
