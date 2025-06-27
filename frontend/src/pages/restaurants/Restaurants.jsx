import { useCallback, useEffect, useState } from "react"
import RestaurantCard from "./RestaurantCard.jsx"
import "./Restaurants.css"
import api from "../../service/api"

export default function RestaurantList() {
	const [visibleCount, setVisibleCount] = useState(6)
	const [restaurants, setRestaurants] = useState([])
	const [search, setSearch] = useState('')

	const getRestaurants = useCallback(async () => {

		try {
			const response = await api.get(
				search !== ''
					? `/restaurant/get-many?name=${search}`
					: `/restaurant/get-many`
			);

			if (!response) { return console.log('Restaurantes não encontrados.'); }

			setRestaurants(response.data.restaurants)

		} catch (error) {
			console.log('Erro ao buscar restaurantes.', error);
			alert('Erro ao buscar restaurantes.')
		}
	}, [search])

	useEffect(() => {
		getRestaurants()
	}, [getRestaurants])

	const handleSearchChange = (e) => {
		setSearch(e.target.value)
	}

	const handleShowMore = () => {
		setVisibleCount((prevCount) => prevCount + 3)
	}

	return (
		<div className="restaurant-container">
			<div className="search-container">
				<span className="search-icon">&#128269;</span>
				<input value={search} onChange={handleSearchChange} type="text" placeholder="Buscar..." className="search-input" />
			</div>
			<div className="restaurant-header">
				<h1>Conheça Nossos Restaurantes</h1>
				<p>Escolha um e aproveite</p>
			</div>

			<div className="restaurant-list">
				{restaurants.slice(0, visibleCount).map((restaurant) => (
					<RestaurantCard
						key={restaurant.id}
						id={restaurant.id}
						title={restaurant.name}
						description={restaurant.description}
						image={`http://localhost:3000/${restaurant.avatar.replace("src\\", '')}`}
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
