import "./registerRestaurant.css"

import { useState } from "react"

const ProfileUpdate = () => {
  const [profile, setProfile] = useState({
    restaurantName: "Sabor Brasileiro",
    email: "contato@saborbrasileiro.com",
    phone: "12345678",
    cnpj: "12.345.678/0001-90",
    address: "Av. Paulista, 1234, São Paulo, SP",
    description:
      "Authentic Brazilian cuisine with a modern twist. We offer a variety of traditional dishes made with fresh, local ingredients.",
    googleMapsLink: "https://maps.google.com/?q=Av.+Paulista,+1234,+São+Paulo",
    image: "/placeholder.svg?height=200&width=200",
  })

  const [plates, setPlates] = useState([
    {
      id: 1,
      name: "Feijoada Completa",
      description: "Traditional black bean stew with pork",
      price: "45.90",
      category: "Main Course",
    },
    {
      id: 2,
      name: "Moqueca de Peixe",
      description: "Fish stew with coconut milk and palm oil",
      price: "52.00",
      category: "Main Course",
    },
    {
      id: 3,
      name: "Pão de Queijo",
      description: "Cheese bread made with cassava flour",
      price: "12.50",
      category: "Appetizer",
    },
  ])

  const [paymentMethod, setPaymentMethod] = useState("credit")
  const [creditCardInfo, setCreditCardInfo] = useState({
    cardNumber: "",
    cardName: "",
    expiryDate: "",
    cvv: "",
  })
  const [newPlate, setNewPlate] = useState({ name: "", description: "", price: "", category: "Main Course" })
  const [editingPlateId, setEditingPlateId] = useState(null)
  const [previewImage, setPreviewImage] = useState(profile.image)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })
  }

  const handlePaymentMethodChange = (e) => {
    if (typeof e === "string") {
      setPaymentMethod(e)
    } else {
      setPaymentMethod(e.target.value)
    }
  }

  const handleCreditCardChange = (e) => {
    const { name, value } = e.target
    setCreditCardInfo({
      ...creditCardInfo,
      [name]: value,
    })
  }

  const handlePlateInputChange = (e) => {
    const { name, value } = e.target
    setNewPlate({
      ...newPlate,
      [name]: value,
    })
  }

  const handleEditPlateInputChange = (e, plateId) => {
    const { name, value } = e.target
    setPlates(plates.map((plate) => (plate.id === plateId ? { ...plate, [name]: value } : plate)))
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewImage(reader.result)
        setProfile({
          ...profile,
          image: reader.result,
        })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddPlate = (e) => {
    e.preventDefault()
    if (newPlate.name && newPlate.price) {
      const newId = plates.length > 0 ? Math.max(...plates.map((plate) => plate.id)) + 1 : 1
      setPlates([...plates, { ...newPlate, id: newId }])
      setNewPlate({ name: "", description: "", price: "", category: "Main Course" })
    }
  }

  const handleEditPlate = (plateId) => {
    setEditingPlateId(plateId)
  }

  const handleSaveEdit = (plateId) => {
    setEditingPlateId(null)
  }

  const handleDeletePlate = (plateId) => {
    setPlates(plates.filter((plate) => plate.id !== plateId))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the registration data to your backend
    console.log("Restaurant profile:", profile)
    console.log("Menu items:", plates)
    console.log("Payment method:", paymentMethod)
    if (paymentMethod === "credit") {
      console.log("Credit card info:", creditCardInfo)
    }
    alert("Restaurant registered successfully!")
  }

  const renderPaymentMethodFields = () => {
    switch (paymentMethod) {
      case "pix":
        return (
          <div className="payment-info">
            <p className="payment-instruction">
              After registration, we'll generate a Pix QR code for you to complete the payment.
            </p>
            <div className="pix-placeholder">
              <div className="pix-qr-placeholder">
                <span>QR Code will be generated after registration</span>
              </div>
            </div>
          </div>
        )
      case "boleto":
        return (
          <div className="payment-info">
            <p className="payment-instruction">
              After registration, we'll generate a Boleto for you to complete the payment.
            </p>
            <div className="boleto-placeholder">
              <span>Boleto will be generated and sent to your email</span>
            </div>
          </div>
        )
      case "credit":
        return (
          <div className="payment-info">
            <div className="credit-card-form">
              <div className="form-group">
                <label htmlFor="cardNumber">Card Number</label>
                <input
                  type="text"
                  id="cardNumber"
                  name="cardNumber"
                  value={creditCardInfo.cardNumber}
                  onChange={handleCreditCardChange}
                  className="form-input"
                  placeholder="1234 5678 9012 3456"
                />
              </div>
              <div className="form-group">
                <label htmlFor="cardName">Name on Card</label>
                <input
                  type="text"
                  id="cardName"
                  name="cardName"
                  value={creditCardInfo.cardName}
                  onChange={handleCreditCardChange}
                  className="form-input"
                  placeholder="John Doe"
                />
              </div>
              <div className="card-row">
                <div className="form-group">
                  <label htmlFor="expiryDate">Expiry Date</label>
                  <input
                    type="text"
                    id="expiryDate"
                    name="expiryDate"
                    value={creditCardInfo.expiryDate}
                    onChange={handleCreditCardChange}
                    className="form-input"
                    placeholder="MM/YY"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cvv">CVV</label>
                  <input
                    type="text"
                    id="cvv"
                    name="cvv"
                    value={creditCardInfo.cvv}
                    onChange={handleCreditCardChange}
                    className="form-input"
                    placeholder="123"
                  />
                </div>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit}>
        <h1 className="profile-title">Register Account</h1>

        <div className="profile-layout">
          <div className="profile-image-section">
            <div className="profile-image-container">
              <img src={previewImage || "/placeholder.svg"} alt="Restaurant Logo" className="profile-image" />
            </div>
            <label htmlFor="image-upload" className="change-image-button">
              Change image
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />

            <div className="payment-methods-section">
              <h3 className="payment-title">Payment Method</h3>
              <div className="payment-options">
                <div
                  className={`payment-option ${paymentMethod === "credit" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("credit")}
                >
                  <input
                    type="radio"
                    id="credit"
                    name="paymentMethod"
                    value="credit"
                    checked={paymentMethod === "credit"}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="payment-icon credit-card-icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect>
                      <line x1="1" y1="10" x2="23" y2="10"></line>
                    </svg>
                  </div>
                  <label htmlFor="credit">Cartão de Crédito</label>
                </div>
                <div
                  className={`payment-option ${paymentMethod === "pix" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("pix")}
                >
                  <input
                    type="radio"
                    id="pix"
                    name="paymentMethod"
                    value="pix"
                    checked={paymentMethod === "pix"}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="payment-icon pix-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M12 2L2 7L12 12L22 7L12 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 17L12 22L22 17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M2 12L12 17L22 12"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <label htmlFor="pix">Pix</label>
                </div>
                <div
                  className={`payment-option ${paymentMethod === "boleto" ? "selected" : ""}`}
                  onClick={() => setPaymentMethod("boleto")}
                >
                  <input
                    type="radio"
                    id="boleto"
                    name="paymentMethod"
                    value="boleto"
                    checked={paymentMethod === "boleto"}
                    onChange={handlePaymentMethodChange}
                  />
                  <div className="payment-icon boleto-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21 8V21H3V8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M23 3H1V8H23V3Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 12H14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 16H14"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <label htmlFor="boleto">Boleto</label>
                </div>
              </div>
              {renderPaymentMethodFields()}
            </div>
          </div>

          <div className="profile-details">
            <div className="form-group">
              <label htmlFor="restaurantName">Restaurant Name</label>
              <input
                type="text"
                id="restaurantName"
                name="restaurantName"
                value={profile.restaurantName}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                value={profile.description}
                onChange={handleInputChange}
                className="form-textarea"
                rows="4"
              ></textarea>
            </div>

            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profile.email}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="cnpj">CNPJ</label>
              <input
                type="text"
                id="cnpj"
                name="cnpj"
                value={profile.cnpj}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Full Address</label>
              <input
                type="text"
                id="address"
                name="address"
                value={profile.address}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="googleMapsLink">Google Maps Link</label>
              <input
                type="url"
                id="googleMapsLink"
                name="googleMapsLink"
                value={profile.googleMapsLink}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="menu-section">
          <h2 className="section-title">Menu Items</h2>

          <div className="plates-list">
            {plates.map((plate) => (
              <div key={plate.id} className="plate-item">
                {editingPlateId === plate.id ? (
                  <>
                    <div className="plate-edit-form">
                      <div className="plate-form-row">
                        <div className="plate-form-group">
                          <label>Name</label>
                          <input
                            type="text"
                            name="name"
                            value={plate.name}
                            onChange={(e) => handleEditPlateInputChange(e, plate.id)}
                            className="form-input"
                          />
                        </div>
                        <div className="plate-form-group">
                          <label>Price (R$)</label>
                          <input
                            type="text"
                            name="price"
                            value={plate.price}
                            onChange={(e) => handleEditPlateInputChange(e, plate.id)}
                            className="form-input"
                          />
                        </div>
                      </div>
                      <div className="plate-form-group">
                        <label>Category</label>
                        <select
                          name="category"
                          value={plate.category}
                          onChange={(e) => handleEditPlateInputChange(e, plate.id)}
                          className="form-input"
                        >
                          <option value="Appetizer">Appetizer</option>
                          <option value="Main Course">Main Course</option>
                          <option value="Dessert">Dessert</option>
                          <option value="Beverage">Beverage</option>
                        </select>
                      </div>
                      <div className="plate-form-group">
                        <label>Description</label>
                        <textarea
                          name="description"
                          value={plate.description}
                          onChange={(e) => handleEditPlateInputChange(e, plate.id)}
                          className="form-textarea"
                          rows="2"
                        ></textarea>
                      </div>
                      <div className="plate-actions">
                        <button type="button" className="save-button" onClick={() => handleSaveEdit(plate.id)}>
                          Save
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="plate-info">
                      <div className="plate-header">
                        <h3 className="plate-name">{plate.name}</h3>
                        <span className="plate-price">R$ {plate.price}</span>
                      </div>
                      <div className="plate-category">{plate.category}</div>
                      <p className="plate-description">{plate.description}</p>
                    </div>
                    <div className="plate-actions">
                      <button type="button" className="edit-button" onClick={() => handleEditPlate(plate.id)}>
                        Edit
                      </button>
                      <button type="button" className="delete-button" onClick={() => handleDeletePlate(plate.id)}>
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          <div className="add-plate-section">
            <h3>Add New Menu Item</h3>
            <div className="plate-form">
              <div className="plate-form-row">
                <div className="plate-form-group">
                  <label htmlFor="plateName">Name</label>
                  <input
                    type="text"
                    id="plateName"
                    name="name"
                    value={newPlate.name}
                    onChange={handlePlateInputChange}
                    className="form-input"
                  />
                </div>
                <div className="plate-form-group">
                  <label htmlFor="platePrice">Price (R$)</label>
                  <input
                    type="text"
                    id="platePrice"
                    name="price"
                    value={newPlate.price}
                    onChange={handlePlateInputChange}
                    className="form-input"
                  />
                </div>
              </div>
              <div className="plate-form-group">
                <label htmlFor="plateCategory">Category</label>
                <select
                  id="plateCategory"
                  name="category"
                  value={newPlate.category}
                  onChange={handlePlateInputChange}
                  className="form-input"
                >
                  <option value="Appetizer">Appetizer</option>
                  <option value="Main Course">Main Course</option>
                  <option value="Dessert">Dessert</option>
                  <option value="Beverage">Beverage</option>
                </select>
              </div>
              <div className="plate-form-group">
                <label htmlFor="plateDescription">Description</label>
                <textarea
                  id="plateDescription"
                  name="description"
                  value={newPlate.description}
                  onChange={handlePlateInputChange}
                  className="form-textarea"
                  rows="2"
                ></textarea>
              </div>
              <button type="button" className="add-button" onClick={handleAddPlate}>
                Add Item
              </button>
            </div>
          </div>
        </div>

        <div className="form-actions main-actions">
          <button type="submit" className="save-button">
            Register Restaurant
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileUpdate
