import { useState } from "react"
import "./UpdateUserProfile.css"

const ProfileUpdate = () => {
  const [profile, setProfile] = useState({
    firstName: "Dawid Paszko",
    email: "dawid.paszko@gmail.com",
    phone: "12345678",
    image: "./user-profile.jpeg",
  })

  const [previewImage, setPreviewImage] = useState(profile.image)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setProfile({
      ...profile,
      [name]: value,
    })
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

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the updated profile to your backend
    console.log("Updated profile:", profile)
    alert("Profile updated successfully!")
  }

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit}>
        <h1 className="profile-title">Update Profile</h1>
        <div className="profile-layout">
          <div className="profile-image-section">
            <div className="profile-image-container">
              <img src={previewImage || "/placeholder.svg"} alt="Profile" className="profile-image" />
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
              <label htmlFor="firstName">First and last name</label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={profile.firstName}
                onChange={handleInputChange}
                className="form-input"
              />
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

            <div className="form-actions">
              <button type="submit" className="save-button">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

export default ProfileUpdate
