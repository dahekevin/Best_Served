import "./Restaurant.css"
import { useState } from "react"


export default function RestaurantLayout() {
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)

  return (
    <div className="container">
      <header className="header">
        <div className="header-left">
          <img src="./back3.png" alt="Restaurant" className="header-image" />
        </div>
        <div className="header-right">
          <div>
            <span className="tag">Bar & Restaurant</span>
            <div className="star-rating">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`star ${star <= (hoverRating || rating) ? "active" : ""}`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  ★
                </span>
              ))}
              {rating > 0 && <span className="rating-value">({rating}/5)</span>}
            </div>
          </div>
          <h1 className="main-title">São & Salvo</h1>
          <p className="subtitle">The best restaurant there is</p>
          <button className="button dark-button">Make Reservation</button>
        </div>
      </header>

      <section className="popular-plates">
        <h2 className="section-title">Popular Plates</h2>
        <p className="section-subtitle">São & Salvo Cuizine</p>

        <div className="plates-container">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="plate-card">
              <div className="plate-image-container">
                <img src="./food2.png" alt="Plate" className="plate-image" />
              </div>
              <div className="plate-content">
                <h3 className="plate-title">Title</h3>
                <p className="plate-description">
                  Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very
                  very short story. Lorem ipsum dolor sit, amet consectetur adipisicing elit. Libero doloremque quisquam delectus ab odio dolorum, voluptate suscipit ut similique tenetur eum sequi molestiae? Hic, distinctio magni repudiandae ratione repellat odit.
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="bottom-section">
        <div className="bottom-left">
          <h2 className="heading">Heading</h2>
          <p className="subheading">Subheading</p>
          <p className="body-text">
            Body text for your whole article or post. We'll put in some lorem ipsum to show how a filled-out page might
            look.
          </p>
          <p className="body-text">
            Exercitise efficienti emergins, minim vortam anim auto carefully curated cillus consectetur explicabo
            perfect nostrud nisi integrated growth. Qui interesante fuit consequat, in incididunt adipisicing, essential
            newly quam intrinsic spanned nulla. Exclusive takimata charming Scandinavian impeccable quis quality of life
            soft power pariatur Melbourne occaecat adipisicing. Qui exercitation aliquip, ut Porter assumenda Tote
            remarkable officia reiciendis excepteur Dusseri nostrud. Zürich sleepy perfect consectetur.
          </p>
          <p className="body-text">Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident obcaecati aliquam vitae alias praesentium id molestiae at perferendis voluptas maiores saepe eos iure, hic corrupti adipisci necessitatibus velit commodi exercitationem.</p>
        </div>
        <div className="bottom-right">
          <img src="./back7.png" alt="Feature" className="bottom-image" />
        </div>
      </section>
    </div>
  )
}
