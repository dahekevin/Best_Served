import { useState } from "react"
import "./UpdateRestaurantProfile.css"

const ProfileUpdate = () => {
  const [profile, setProfile] = useState({
    restaurantName: "São & Salvo",
    email: "sao@salvo.com",
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
    // Here you would typically send the updated profile and plates to your backend
    console.log("Updated profile:", profile)
    console.log("Updated menu:", plates)
    alert("Restaurant profile and menu updated successfully!")
  }

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit}>
        <h1 className="profile-title">Update Profile</h1>

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
            Save All Changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileUpdate
