import { useState, useEffect } from "react"
import "./Dashboard.css"

export default function RestaurantDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date())
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    })
  }

  const popularDishes = [
    { id: "01", name: "Butter Chicken", orders: 250, image: "/placeholder.svg?height=60&width=60" },
    { id: "02", name: "Palak Paneer", orders: 190, image: "/placeholder.svg?height=60&width=60" },
    { id: "03", name: "Hyderabadi Biryani", orders: 300, image: "/placeholder.svg?height=60&width=60" },
    { id: "04", name: "Masala Dosa", orders: 220, image: "/placeholder.svg?height=60&width=60" },
    { id: "05", name: "Chole Bhature", orders: 270, image: "/placeholder.svg?height=60&width=60" },
    { id: "06", name: "Rajma Chawal", orders: 180, image: "/placeholder.svg?height=60&width=60" },
    { id: "07", name: "Paneer Tikka", orders: 210, image: "/placeholder.svg?height=60&width=60" },
  ]

  const recentOrders = [
    { id: 1, name: "Amrit Raj", items: 8, table: 3, status: "Ready" },
    { id: 2, name: "Amrit Raj", items: 8, table: 3, status: "Ready" },
    { id: 3, name: "Amrit Raj", items: 8, table: 3, status: "Ready" },
    { id: 4, name: "Amrit Raj", items: 8, table: 3, status: "Ready" },
    { id: 5, name: "Amrit Raj", items: 8, table: 3, status: "Ready" },
  ]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="greeting">
          <h1>Good Morning, Amrit</h1>
          <p>Give your best services for customers 😊</p>
        </div>
        <div className="time-display">
          <h2>{formatTime(currentTime)}</h2>
          <p>{formatDate(currentTime)}</p>
        </div>
      </div>

      <div className="dashboard-stats">
        <div className="stat-card earnings">
          <div className="stat-icon">
            <span className="icon">💰</span>
          </div>
          <div className="stat-content">
            <h3>Total Earnings</h3>
            <h2>₹512</h2>
            <p className="positive">1.6% than yesterday</p>
          </div>
        </div>

        <div className="stat-card progress">
          <div className="stat-icon">
            <span className="icon">⏳</span>
          </div>
          <div className="stat-content">
            <h3>In Progress</h3>
            <h2>16</h2>
            <p className="positive">3.6% than yesterday</p>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="recent-orders">
          <div className="section-header">
            <h2>Recent Orders</h2>
            <a href="#" className="view-all">
              View all
            </a>
          </div>

          <div className="search-container">
            <input
              type="text"
              placeholder="Search recent orders"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <span className="search-icon">🔍</span>
          </div>

          <div className="orders-list">
            {recentOrders.map((order) => (
              <div className="order-item" key={order.id}>
                <div className="order-initials">
                  <span>AM</span>
                </div>
                <div className="order-details">
                  <h3>{order.name}</h3>
                  <p>{order.items} Items</p>
                </div>
                <div className="order-table">
                  <span>Table No: {order.table}</span>
                </div>
                <div className="order-status">
                  <span className="status-icon">✓</span>
                  <span className="status-text">{order.status}</span>
                  <p>Ready to serve</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="popular-dishes">
          <div className="section-header">
            <h2>Popular Dishes</h2>
            <a href="#" className="view-all">
              View all
            </a>
          </div>

          <div className="dishes-list">
            {popularDishes.map((dish) => (
              <div className="dish-item" key={dish.id}>
                <div className="dish-number">{dish.id}</div>
                <div className="dish-image">
                  <img src={dish.image || "/placeholder.svg"} alt={dish.name} />
                </div>
                <div className="dish-details">
                  <h3>{dish.name}</h3>
                  <p>Orders: {dish.orders}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
