import { useState } from "react"
import "./Profile.css"

export default function Profile() {
    const [activeTab, setActiveTab] = useState("upcoming")

    const handleTabChange = (tab) => {
        setActiveTab(tab)
    }

    return (
        <div className="hero-section">
            <div className="profile-container">
                <div className="profile-header">
                    <h1>Your Profile</h1>
                    <div className="header-buttons">
                        <button className="edit-button">Edit Profile</button>
                        <button className="delete-button">Delete</button>
                    </div>
                </div>

                <div className="profile-info">
                    <div className="avatar-container">
                        <div className="avatar"></div>
                    </div>
                    <div className="user-details">
                        <h2>São & Salvo</h2>
                        <p className="email">sao.salvo@example.com</p>
                        <p className="phone">+1 (555) 123-4567</p>
                    </div>
                </div>

                <div className="plates-container">
                    <section className="popular-plates">
                        <h2 className="section-title">Your Plates</h2>
                        <p className="section-subtitle">São & Salvo Cuizine</p>

                        <div className="plates-container">
                            {[1, 2, 3].map((item) => (
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
                </div>

                <div className="section">
                    <h3 className="section-title">Your Reservations</h3>

                    <div className="reservations">
                        <div className="reservation-card">
                            <div className="date-box">
                                <div className="day">25</div>
                                <div className="month">MAY</div>
                            </div>
                            <div className="reservation-details">
                                <h4>La Bella Italia</h4>
                                <p>7:30 PM • Table for 2</p>
                                <p className="confirmation">Restaurant: São & Salvo</p>
                            </div>
                            <div className="reservation-actions">
                                <button className="modify-button">Modify</button>
                                <button className="cancel-button">Cancel</button>
                            </div>
                        </div>

                        <div className="reservation-card">
                            <div className="date-box">
                                <div className="day">10</div>
                                <div className="month">JUN</div>
                            </div>
                            <div className="reservation-details">
                                <h4>Sakura Sushi</h4>
                                <p>6:00 PM • Table for 4</p>
                                <p className="confirmation">Restaurant: São & Salvo</p>
                            </div>
                            <div className="reservation-actions">
                                <button className="modify-button">Modify</button>
                                <button className="cancel-button">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}
