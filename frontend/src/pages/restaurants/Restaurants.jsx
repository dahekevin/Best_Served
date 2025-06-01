import { useState } from "react"
import RestaurantCard from "./RestaurantCard.jsx"
import "./Restaurants.css"

export default function RestaurantList() {
	const [visibleCount, setVisibleCount] = useState(6)

	const restaurants = [
		{
			id: 1,
			title: "São & Salvo",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "./back3.png",
		},
		{
			id: 2,
			title: "O Prego",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "./back2.png",
		},
		{
			id: 3,
			title: "Yummy",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "./back1.png",
		},
		{
			id: 4,
			title: "Delicious Dish",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "./back4.png",
		},
		{
			id: 5,
			title: "Tasty Treat",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "./back5.jpg",
		},
		{
			id: 6,
			title: "Savory Bites",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "./back6.png",
		},
		{
			id: 7,
			title: "Sweet Delights",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "./back7.png",
		},
		{
			id: 8,
			title: "Heavenly Bites",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "/placeholder.svg?height=150&width=150",
		},
		{
			id: 9,
			title: "Divine Flavors",
			description:
				"Texto descritivo para o restaurante. Adicione pontos principais, depoimentos, curiosidades ou até mesmo uma história curta.",
			image: "/placeholder.svg?height=150&width=150",
		},
	]

	const handleShowMore = () => {
		setVisibleCount((prevCount) => prevCount + 3)
	}

	return (
		<div className="restaurant-container">
			<div className="search-container">
				<span className="search-icon">&#128269;</span>
				<input type="text" placeholder="Buscar..." className="search-input" />
			</div>
			<div className="restaurant-header">
				<h1>Conheça Nossos Restaurantes</h1>
				<p>Escolha um e aproveite</p>
			</div>

			<div className="restaurant-list">
				{restaurants.slice(0, visibleCount).map((restaurant) => (
					<RestaurantCard
						key={restaurant.id}
						title={restaurant.title}
						description={restaurant.description}
						image={restaurant.image}
					/>
				))}
			</div>

			{visibleCount < restaurants.length && (
				<div className="show-more-container">
					<button className="show-more-button" onClick={handleShowMore}>
						Ver mais
					</button>
				</div>
			)}
		</div>
	)
}
