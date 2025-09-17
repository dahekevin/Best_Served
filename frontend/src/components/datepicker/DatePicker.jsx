import { useState, useEffect } from "react"

export default function DatePicker({ onDateChange, selectedDate }) {
  const [dates, setDates] = useState([])
  const [currentMonth] = useState(new Date())

  useEffect(() => {
    generateDates(currentMonth)
  }, [currentMonth])

  const generateDates = (month) => {
    const today = new Date()
    const daysArray = []
    const year = month.getFullYear()
    const monthIndex = month.getMonth()

    for (let i = 0; i < 30; i++) {
      const date = new Date(year, monthIndex, today.getDate() + i)
      daysArray.push(date)
    }

    setDates(daysArray)
  }

  const formatDateForDisplay = (date) => {
    const options = { weekday: "short", month: "short", day: "numeric" }
    return date.toLocaleDateString("en-US", options)
  }

  const formatDateValue = (date) => {
    return date.toISOString().split("T")[0]
  }

  const handleDateClick = (date) => {
    onDateChange(formatDateValue(date))
  }

  return (
    <div className="date-picker">
      <div className="dates-container">
        {dates.map((date, index) => (
          <button
            key={index}
            type="button"
            className={`date-option ${selectedDate === formatDateValue(date) ? "selected" : ""}`}
            onClick={() => handleDateClick(date)}
          >
            {formatDateForDisplay(date)}
          </button>
        ))}
      </div>
    </div>
  )
}
