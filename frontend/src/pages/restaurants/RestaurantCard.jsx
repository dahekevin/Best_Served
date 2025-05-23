import "./RestaurantCard.css"

export default function RestaurantCard({ title, description, image }) {
  return (
    <div className="restaurant-card">
      <div className="restaurant-image">
        <img src={image || "/placeholder.svg"} alt={title} />
      </div>
      <div className="restaurant-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <button className="restaurant-button">Make Reservation</button>
      </div>
    </div>
  )
}
