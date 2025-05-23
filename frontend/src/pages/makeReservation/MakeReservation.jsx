"use client"

import { useState } from "react"
import DatePicker from "../../components/datepicker/DatePicker.jsx"
import TimePicker from "../../components/timepicker/TimePicker.jsx"
import "./MakeReservation.css"

export default function ReservationForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        guests: 2,
        date: "",
        time: "",
        specialRequests: "",
    })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSuccess, setIsSuccess] = useState(false)

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleDateChange = (date) => {
        setFormData((prev) => ({
            ...prev,
            date,
        }))
    }

    const handleTimeChange = (time) => {
        setFormData((prev) => ({
            ...prev,
            time,
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate API call
        setTimeout(() => {
            console.log("Reservation submitted:", formData)
            setIsSubmitting(false)
            setIsSuccess(true)

            // Reset form after 3 seconds
            setTimeout(() => {
                setIsSuccess(false)
                setFormData({
                    name: "",
                    email: "",
                    phone: "",
                    guests: 2,
                    date: "",
                    time: "",
                    specialRequests: "",
                })
            }, 3000)
        }, 1500)
    }

    return (
        <div className="reservation-form-container">
            {isSuccess ? (
                <div className="success-message">
                    <h2>Reservation Confirmed!</h2>
                    <p>Thank you for your reservation. We've sent a confirmation to your email.</p>
                </div>
            ) : (
                <form className="reservation-form" onSubmit={handleSubmit}>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                placeholder="John Doe"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                placeholder="your@email.com"
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phone">Phone</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                                placeholder="(123) 456-7890"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="guests">Number of Guests</label>
                            <select id="guests" name="guests" value={formData.guests} onChange={handleChange} required>
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                                    <option key={num} value={num}>
                                        {num} {num === 1 ? "Guest" : "Guests"}
                                    </option>
                                ))}
                                <option value="11">More than 10</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label>Date</label>
                            <DatePicker onDateChange={handleDateChange} selectedDate={formData.date} />
                        </div>

                        <div className="form-group">
                            <label>Time</label>
                            <TimePicker onTimeChange={handleTimeChange} selectedTime={formData.time} />
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="specialRequests">Special Requests</label>
                        <textarea
                            className="special-requests"
                            id="specialRequests"
                            name="specialRequests"
                            value={formData.specialRequests}
                            onChange={handleChange}
                            placeholder="Any dietary restrictions or special occasions?"
                            rows={3}
                        />
                    </div>

                    <button type="submit" className="submit-button" disabled={isSubmitting}>
                        {isSubmitting ? "Processing..." : "Confirm Reservation"}
                    </button>
                </form>
            )}
        </div>
    )
}
