import "./RestaurantCard.css"
import { Link } from "react-router-dom"

export default function RestaurantCard({ id, title, description, image }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-image">
        <img src={image || "/placeholder.svg"} alt={title} />
      </div>
      <div className="restaurant-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <Link to={`/restaurant-page?restaurantId=${id}`} className="restaurant-button">Fazer Reserva</Link>
      </div>
    </div>
  )
}
