import "./Restaurant.css"
import api from "../../service/api"
import { useCallback, useEffect, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

export default function RestaurantPage() {
	const [ searchParams ] = useSearchParams()
	const restaurantId = searchParams.get('restaurantId')
	const [userRating, setUserRating] = useState(0)
	const [hoverRating, setHoverRating] = useState(0)
	const [isRatingMode, setIsRatingMode] = useState(false)
	const [pdfSize, setPdfSize] = useState('')

	// Nota média do restaurante (simulada)
	const restaurantRating = 4.2
	const totalReviews = 127

	// Informações do restaurante
	const [restaurantInfo, setRestaurantInfo] = useState({
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

	const renderStars = (rating, interactive = false, size = "normal") => {
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
							onClick={interactive ? () => setUserRating(star) : undefined}
							onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
							onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
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
		const mapUrl = `https://www.google.com/maps/search/?api=1&query=${restaurantInfo.coordinates.lat},${restaurantInfo.coordinates.lng}`
		window.open(mapUrl, "_blank")
	}

	const getPdfSize = async (pdfURL) => {
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
	}

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
		} catch (error) {
			console.error("Falha ao carregar informações do restaurante.", error)
			alert("Falha ao carregar informações do restaurante.")
		}
	}, [restaurantId])

	useEffect(() => {
		
		getRestaurantInfo()
		if (restaurantInfo.menu) {
			const url = `http://localhost:3000/${restaurantInfo.menu.replace('src\\', '')}`
			getPdfSize(url).then(setPdfSize)
		}
	}, [getRestaurantInfo])

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
								{!isRatingMode ? (
									// Modo de visualização da nota do restaurante
									<div className="restaurant-rating-res-page">
										<div className="rating-display-res-page">
											{renderStars(restaurantRating, false, "large")}
											<div className="rating-info-res-page">
												<span className="rating-number-res-page">{restaurantRating}</span>
												<span className="rating-reviews-res-page">({totalReviews} avaliações)</span>
											</div>
										</div>
										<button className="rate-button-res-page" onClick={() => setIsRatingMode(true)}>
											Avaliar Restaurante
										</button>
									</div>
								) : (
									// Modo de avaliação do usuário
									<div className="user-rating-res-page">
										<span className="rating-label-res-page">Sua avaliação:</span>
										{renderStars(userRating, true)}
										{userRating > 0 && <span className="rating-text-res-page">{userRating} de 5 estrelas</span>}
										<div className="rating-actions-res-page">
											<button
												className="submit-rating-res-page"
												onClick={() => {
													setIsRatingMode(false)
													alert(`Obrigado! Você avaliou com ${userRating} estrelas.`)
												}}
												disabled={userRating === 0}
											>
												Enviar Avaliação
											</button>
											<button
												className="cancel-rating-res-page"
												onClick={() => {
													setIsRatingMode(false)
													setUserRating(0)
													setHoverRating(0)
												}}
											>
												Cancelar
											</button>
										</div>
									</div>
								)}
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
