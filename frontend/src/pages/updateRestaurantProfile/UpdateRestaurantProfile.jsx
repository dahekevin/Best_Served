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
      "Culinária brasileira autêntica com um toque moderno. Oferecemos uma variedade de pratos tradicionais feitos com ingredientes frescos e locais.",
    googleMapsLink: "https://maps.google.com/?q=Av.+Paulista,+1234,+São+Paulo",
    image: "/logo2.png",
    tables: 0,
  })

  const [previewImage, setPreviewImage] = useState(profile.image)
  const [menuPdf, setMenuPdf] = useState(null)
  const [menuPdfName, setMenuPdfName] = useState("")

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

  const handleMenuPdfChange = (e) => {
    const file = e.target.files[0]
    if (file && file.type === "application/pdf") {
      setMenuPdf(file)
      setMenuPdfName(file.name)
    } else {
      alert("Por favor, selecione apenas arquivos PDF.")
    }
  }

  const handleRemoveMenuPdf = () => {
    setMenuPdf(null)
    setMenuPdfName("")
    // Reset the file input
    const fileInput = document.getElementById("menu-pdf-upload")
    if (fileInput) {
      fileInput.value = ""
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Here you would typically send the updated profile and plates to your backend
    console.log("Updated profile:", profile)
    alert("Perfil do restaurante e menu atualizados com sucesso!")
  }

  return (
    <div className="profile-container">
      <form onSubmit={handleSubmit}>
        <h1 className="profile-title">Atualizar Perfil</h1>

        <div className="profile-layout">
          <div className="profile-image-section">
            <div className="profile-image-container">
              <img src={previewImage || "/logo.png"} alt="Logo do Restaurante" className="profile-image" />
            </div>
            <label htmlFor="image-upload" className="change-image-button">
              Alterar imagem
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
              <label htmlFor="restaurantName">Nome do Restaurante</label>
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
              <label htmlFor="description">Descrição</label>
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
              <label htmlFor="email">E-mail</label>
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
              <label htmlFor="address">Endereço Completo</label>
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
              <label htmlFor="googleMapsLink">Link do Google Maps</label>
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
              <label htmlFor="phone">Telefone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profile.phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="tables">Quantidade de Mesas</label>
              <input
                type="number"
                id="tables"
                name="tables"
                value={profile.tables}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
          </div>
        </div>

        <div className="menu-section">
          <h2 className="section-title">Menu do Restaurante</h2>
          <p className="menu-description">
            Anexe o menu do seu restaurante em formato PDF. Este arquivo será disponibilizado para os clientes
            visualizarem os pratos e preços oferecidos.
          </p>

          <div className="menu-upload-section">
            {!menuPdf ? (
              <div className="upload-area">
                <label htmlFor="menu-pdf-upload" className="upload-button">
                  <div className="upload-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M21 15V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V15"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M7 10L12 15L17 10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M12 15V3"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="upload-text">
                    <span className="upload-title">Clique para anexar o menu</span>
                    <span className="upload-subtitle">Apenas arquivos PDF são aceitos</span>
                  </div>
                </label>
                <input
                  id="menu-pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleMenuPdfChange}
                  style={{ display: "none" }}
                />
              </div>
            ) : (
              <div className="uploaded-file">
                <div className="file-info">
                  <div className="file-icon">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M14 2H6C5.46957 2 4.96086 2.21071 4.58579 2.58579C4.21071 2.96086 4 3.46957 4 4V20C4 20.5304 4.21071 21.0391 4.58579 21.4142C4.96086 21.7893 5.46957 22 6 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V8L14 2Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 2V8H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 13H8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M16 17H8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M10 9H9H8"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <div className="file-details">
                    <span className="file-name">{menuPdfName}</span>
                    <span className="file-size">{menuPdf ? `${(menuPdf.size / 1024 / 1024).toFixed(2)} MB` : ""}</span>
                  </div>
                </div>
                <div className="file-actions">
                  <label htmlFor="menu-pdf-upload" className="replace-button">
                    Substituir
                  </label>
                  <button type="button" className="remove-button" onClick={handleRemoveMenuPdf}>
                    Remover
                  </button>
                </div>
                <input
                  id="menu-pdf-upload"
                  type="file"
                  accept=".pdf"
                  onChange={handleMenuPdfChange}
                  style={{ display: "none" }}
                />
              </div>
            )}
          </div>

          <div className="menu-requirements">
            <h4>Requisitos do arquivo:</h4>
            <ul>
              <li>Formato: PDF apenas</li>
              <li>Tamanho máximo: 10 MB</li>
              <li>Recomendação: Use imagens de alta qualidade para melhor visualização</li>
              <li>Certifique-se de que o texto esteja legível</li>
            </ul>
          </div>
        </div>

        <div className="form-actions main-actions">
          <button type="submit" className="save-button">
            Salvar Todas as Alterações
          </button>
        </div>
      </form>
    </div>
  )
}

export default ProfileUpdate
