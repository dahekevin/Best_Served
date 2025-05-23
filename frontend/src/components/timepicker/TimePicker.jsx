export default function TimePicker({ onTimeChange, selectedTime }) {
  // Available time slots
  const timeSlots = [
    "11:30",
    "12:00",
    "12:30",
    "13:00",
    "13:30",
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00",
    "20:30",
    "21:00",
  ]

  return (
    <div className="time-picker">
      <div className="time-slots">
        {timeSlots.map((time, index) => (
          <button
            key={index}
            type="button"
            className={`time-slot ${selectedTime === time ? "selected" : ""}`}
            onClick={() => onTimeChange(time)}
          >
            {time}
          </button>
        ))}
      </div>
    </div>
  )
}
