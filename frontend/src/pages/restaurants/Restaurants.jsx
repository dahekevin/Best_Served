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
			const response = await api.get(`/restaurant/get-orderByRating`);

			if (!response) { return console.log('Restaurantes não encontrados.'); }

			console.log('Lista de restaurantes: ', response.data);

			setRestaurants(response.data.restaurants)

		} catch (error) {
			console.log('Erro ao buscar restaurantes.', error);
			alert('Erro ao buscar restaurantes.')
		}
	}, [])

	useEffect(() => {
		getRestaurants()
	}, [getRestaurants])

	const handleSearchChange = (e) => {
		setSearch(e.target.value)
	}

	const handleShowMore = () => {
		setVisibleCount((prevCount) => prevCount + 3)
	}

	const approvedRestaurants = () => {
		if (!Array.isArray(restaurants)) { return [] }

		const restaurantList = restaurants.filter(res => {
			return res.status === 'Approved'
		})

		return restaurantList
	}
	
	const approvedRestaurantsList = approvedRestaurants()

	const searchResult = () => {
		if (search.trim() === '') {
			return approvedRestaurantsList;
		}

		const searchTerm = search.toLowerCase().trim(); // Limpa espaços e normaliza

		return approvedRestaurantsList.filter(res => {
			const restaurantNameMatch = res.name && res.name.toLowerCase().includes(searchTerm);
			const restaurantEmailMatch = res.email && res.email.toLowerCase().includes(searchTerm);
			const restaurantTagsMatch = res.tags && res.tags.some(tag => ( tag && tag.toLowerCase().includes(searchTerm)));
			const restaurantAddressMatch = res.fullAddress && res.fullAddress.toLowerCase().includes(searchTerm);
			const restaurantRatingMatch = res.rating && parseInt(res.rating) === parseInt(searchTerm);
			const restaurantDescriptionMatch = res.description && res.description.toLowerCase().includes(searchTerm);

			return restaurantNameMatch || restaurantEmailMatch || restaurantTagsMatch || restaurantAddressMatch || restaurantRatingMatch || restaurantDescriptionMatch;
		});
	};

	const displayedRestaurants = searchResult()

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
				{displayedRestaurants.slice(0, visibleCount).map((restaurant) => (
					<RestaurantCard
						key={restaurant.id}
						id={restaurant.id}
						title={restaurant.name}
						email={restaurant.email}
						tags={restaurant.tags}
						phone={restaurant.phone}
						address={restaurant.fullAddress}
						rating={restaurant.rating}
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
