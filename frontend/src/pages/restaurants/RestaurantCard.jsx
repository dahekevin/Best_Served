import "./RestaurantCard.css"
import { Link } from "react-router-dom"

export default function RestaurantCard({ id, title, email, phone, address, tags, rating, description, image }) {
	const renderStars = (rating) => {
		// Array para armazenar as estrelas
		const stars = [];
		const fullStars = Math.floor(rating); // Estrelas inteiras

		// Caso o rating não seja um número, ou seja 0, retorna vazio
		if (!rating || typeof rating !== 'number' || rating < 0) {
			for (let i = 0; i < 5; i++) {
				stars.push(<span style={{ fontSize: "1.3em" }} key={`full-${i}`}>★</span>);
			}

			return stars
		}

		// Adiciona as estrelas cheias
		for (let i = 0; i < fullStars; i++) {
			stars.push(<span style={{ color: "yellowgreen", fontSize: "1.3em" }} key={`full-${i}`}>★</span>);
		}

		// Preenche o restante com estrelas vazias para completar 5, se desejar
		const emptyStars = 5 - stars.length;
		for (let i = 0; i < emptyStars; i++) {
			stars.push(<span style={{ fontSize: "1.3em" }} key={`empty-${i}`}>★</span>); // Você pode usar um ícone diferente aqui
		}

		return stars;
	};

	return (
		<div className="restaurant-card">
			<div className="restaurant-image">
				<img src={image || "/placeholder.svg"} alt={title} />
			</div>
			<div className="restaurant-content">
				<div className="restaurant-content-header">
					<div>
						<h2>{title}</h2>
						<p style={{marginTop: "-5px"}}>{renderStars(rating)}</p>
						<p>{rating}</p>
					</div>
					<div>
						{tags.map((tag) => (
							<p className="restaurant-content-tags">• {tag}</p>
						))}
					</div>
				</div>
				<div className="restaurant-content-body">
					<p className="restaurant-content-body-contact">
						<span>
							<span style={{ fontWeight: "700" }}>E-mail</span>: {email}
						</span>
						<span>
							<span style={{ fontWeight: "700" }}>Telefone</span>: {phone}
						</span>
						<span>
							<span style={{ fontWeight: "700" }}>Endereço</span>: {address}
						</span>
					</p>
					<p><span style={{ fontWeight: "700" }}>Descrição:</span> {description}</p>
				</div>
				<Link to={`/restaurant-page?restaurantId=${id}`} className="restaurant-button">Fazer Reserva</Link>
			</div>
		</div>
	)
}
