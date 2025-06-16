import "./Restaurant.css"
import { useState } from "react"

export default function RestaurantPage() {
  const [userRating, setUserRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [isRatingMode, setIsRatingMode] = useState(false)
  const [activeMenu, setActiveMenu] = useState("principal")
  const [showMenuModal, setShowMenuModal] = useState(false)

  // Nota média do restaurante (simulada)
  const restaurantRating = 4.2
  const totalReviews = 127

  // Informações do restaurante
  const restaurantInfo = {
    name: "São & Salvo",
    address: "Rua das Flores, 123 - Centro",
    city: "São Paulo, SP",
    zipCode: "01234-567",
    phone: "(11) 3456-7890",
    hours: {
      weekdays: "11:00 - 23:00",
      weekends: "11:00 - 00:00",
    },
    coordinates: {
      lat: -23.55052,
      lng: -46.633308,
    },
  }

  const renderStars = (rating, interactive = false, size = "normal") => {
    const starSize = size === "large" ? "star-large-res-page" : "star-res-page"

    return (
      <div className="stars-container-res-page">
        {[1, 2, 3, 4, 5].map((star) => {
          let filled = false
          if (interactive) {
            filled = star <= (hoverRating || userRating)
          } else {
            filled = star <= Math.floor(rating) || (star === Math.ceil(rating) && rating % 1 >= 0.5)
          }

          return (
            <button
              key={star}
              className={`${starSize} ${filled ? "filled-res-page" : ""} ${interactive ? "interactive-res-page" : "display-res-page"}`}
              onClick={interactive ? () => setUserRating(star) : undefined}
              onMouseEnter={interactive ? () => setHoverRating(star) : undefined}
              onMouseLeave={interactive ? () => setHoverRating(0) : undefined}
              disabled={!interactive}
            >
              ★
            </button>
          )
        })}
      </div>
    )
  }

  const handleWhatsAppContact = () => {
    const phoneNumber = "5511999999999" // Número do restaurante
    const message = encodeURIComponent("Olá! Gostaria de fazer uma reserva no São & Salvo.")
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const handleMenuDownload = (menuType) => {
    // Simula download do PDF do menu
    const menuUrls = {
      principal: "/menu-principal.pdf",
      bebidas: "/menu-bebidas.pdf",
      sobremesas: "/menu-sobremesas.pdf",
    }

    const link = document.createElement("a")
    link.href = menuUrls[menuType]
    link.download = `cardapio-${menuType}-sao-salvo.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const openGoogleMaps = () => {
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${restaurantInfo.coordinates.lat},${restaurantInfo.coordinates.lng}`
    window.open(mapUrl, "_blank")
  }

  return (
    <div className="restaurant-page-res-page">
      {/* Hero Section */}
      <section className="hero-res-page">
        <div className="container-res-page">
          <div className="hero-content-res-page">
            <div className="hero-image-res-page">
              <img src="./back3.png" alt="São & Salvo Restaurant" />

              {/* Informações do Restaurante */}
              <div className="restaurant-info-container-res-page">
                <div className="restaurant-info-grid-res-page">
                  <div className="info-card-res-page">
                    <div className="info-icon-res-page">📍</div>
                    <div className="info-content-res-page">
                      <h4>Endereço</h4>
                      <p>{restaurantInfo.address}</p>
                      <p>{restaurantInfo.city}</p>
                      <p>{restaurantInfo.zipCode}</p>
                      <button className="directions-btn-res-page" onClick={openGoogleMaps}>
                        Como Chegar
                      </button>
                    </div>
                  </div>

                  {/* <div className="info-card-res-page">
                    <div className="info-icon-res-page">🕒</div>
                    <div className="info-content-res-page">
                      <h4>Horário de Funcionamento</h4>
                      <p>
                        <strong>Segunda a Sexta:</strong> {restaurantInfo.hours.weekdays}
                      </p>
                      <p>
                        <strong>Sábado e Domingo:</strong> {restaurantInfo.hours.weekends}
                      </p>
                    </div>
                  </div> */}

                  <div className="info-card-res-page">
                    <div className="info-icon-res-page">📞</div>
                    <div className="info-content-res-page">
                      <h4>Contato</h4>
                      <p>Telefone: {restaurantInfo.phone}</p>
                      <button
                        className="call-btn-res-page"
                        onClick={() => (window.location.href = `tel:${restaurantInfo.phone.replace(/\D/g, "")}`)}
                      >
                        Ligar Agora
                      </button>
                    </div>
                  </div>
                </div>

                {/* Google Maps Embed */}
                <div className="map-container-res-page">
                  <div className="map-header-res-page">
                    <h4>Localização</h4>
                    <button className="view-larger-map-res-page" onClick={openGoogleMaps}>
                      Ver Mapa Ampliado
                    </button>
                  </div>
                  <div className="map-embed-res-page">
                    <iframe
                      src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1976900292897!2d${restaurantInfo.coordinates.lng}!3d${restaurantInfo.coordinates.lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjPCsDMzJzAxLjkiUyA0NsKwMzcnNTkuOSJX!5e0!3m2!1spt-BR!2sbr!4v1622213269367!5m2!1spt-BR!2sbr`}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      title="Localização do Restaurante"
                    ></iframe>
                  </div>
                </div>
              </div>
            </div>

            <div className="restaurant-card-res-page">
              <div className="restaurant-badge-res-page">Bar e Restaurante</div>
              <h1 className="restaurant-name-res-page">São & Salvo</h1>
              <p className="restaurant-description-res-page">O melhor restaurante que existe</p>

              {/* Rating Section */}
              <div className="rating-section-res-page">
                {!isRatingMode ? (
                  // Modo de visualização da nota do restaurante
                  <div className="restaurant-rating-res-page">
                    <div className="rating-display-res-page">
                      {renderStars(restaurantRating, false, "large")}
                      <div className="rating-info-res-page">
                        <span className="rating-number-res-page">{restaurantRating}</span>
                        <span className="rating-reviews-res-page">({totalReviews} avaliações)</span>
                      </div>
                    </div>
                    <button className="rate-button-res-page" onClick={() => setIsRatingMode(true)}>
                      Avaliar Restaurante
                    </button>
                  </div>
                ) : (
                  // Modo de avaliação do usuário
                  <div className="user-rating-res-page">
                    <span className="rating-label-res-page">Sua avaliação:</span>
                    {renderStars(userRating, true)}
                    {userRating > 0 && <span className="rating-text-res-page">{userRating} de 5 estrelas</span>}
                    <div className="rating-actions-res-page">
                      <button
                        className="submit-rating-res-page"
                        onClick={() => {
                          setIsRatingMode(false)
                          alert(`Obrigado! Você avaliou com ${userRating} estrelas.`)
                        }}
                        disabled={userRating === 0}
                      >
                        Enviar Avaliação
                      </button>
                      <button
                        className="cancel-rating-res-page"
                        onClick={() => {
                          setIsRatingMode(false)
                          setUserRating(0)
                          setHoverRating(0)
                        }}
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="action-buttons-res-page">
                <button className="reservation-btn-res-page">Fazer Reserva</button>
                <button className="whatsapp-btn-res-page" onClick={handleWhatsAppContact}>
                  <img className="whatsapp-icon-res-page" src="./whatsapp-logo1.png" alt="" />
                  Falar no WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Section */}
      <section className="menu-section-res-page">
        <div className="container-res-page">
          <h2 className="section-title-res-page">Nosso Cardápio</h2>
          <p className="section-subtitle-res-page">Confira todas as delícias que preparamos para você</p>

          <div className="menu-container-res-page">
            <div className="menu-options-res-page">
              <button
                className={`menu-tab-res-page ${activeMenu === "principal" ? "active-res-page" : ""}`}
                onClick={() => setActiveMenu("principal")}
              >
                Cardápio Principal
              </button>
              <button
                className={`menu-tab-res-page ${activeMenu === "bebidas" ? "active-res-page" : ""}`}
                onClick={() => setActiveMenu("bebidas")}
              >
                Bebidas
              </button>
              <button
                className={`menu-tab-res-page ${activeMenu === "sobremesas" ? "active-res-page" : ""}`}
                onClick={() => setActiveMenu("sobremesas")}
              >
                Sobremesas
              </button>
            </div>

            <div className="menu-content-res-page">
              {activeMenu === "principal" && (
                <div className="menu-item-res-page">
                  <div className="menu-header-res-page">
                    <h3>Cardápio Principal</h3>
                    <div className="menu-actions-res-page">
                      <button className="download-btn-res-page" onClick={() => handleMenuDownload("principal")}>
                        📥 Baixar PDF
                      </button>
                      <button className="view-btn-res-page" onClick={() => setShowMenuModal(true)}>
                        👁️ Visualizar
                      </button>
                    </div>
                  </div>
                  <div className="menu-preview-res-page">
                    <img
                      src="./cardapio-principal.png"
                      alt="Cardápio Principal - São & Salvo"
                      className="menu-image-res-page"
                      onClick={() => setShowMenuModal(true)}
                    />
                    <div className="menu-info-res-page">
                      <p>Clique na imagem ou no botão "Visualizar" para ver o cardápio completo</p>
                      <span className="menu-size-res-page">PDF • 2.3 MB</span>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === "bebidas" && (
                <div className="menu-item-res-page">
                  <div className="menu-header-res-page">
                    <h3>Cardápio de Bebidas</h3>
                    <div className="menu-actions-res-page">
                      <button className="download-btn-res-page" onClick={() => handleMenuDownload("bebidas")}>
                        📥 Baixar PDF
                      </button>
                      <button className="view-btn-res-page" onClick={() => setShowMenuModal(true)}>
                        👁️ Visualizar
                      </button>
                    </div>
                  </div>
                  <div className="menu-preview-res-page">
                    <img
                      src="./cardapio-bebidas.jpg"
                      alt="Carta de Bebidas - São & Salvo"
                      className="menu-image-res-page"
                      onClick={() => setShowMenuModal(true)}
                    />
                    <div className="menu-info-res-page">
                      <p>Vinhos, cervejas, coquetéis e bebidas não alcoólicas</p>
                      <span className="menu-size-res-page">PDF • 1.8 MB</span>
                    </div>
                  </div>
                </div>
              )}

              {activeMenu === "sobremesas" && (
                <div className="menu-item-res-page">
                  <div className="menu-header-res-page">
                    <h3>Cardápio de Sobremesas</h3>
                    <div className="menu-actions-res-page">
                      <button className="download-btn-res-page" onClick={() => handleMenuDownload("sobremesas")}>
                        📥 Baixar PDF
                      </button>
                      <button className="view-btn-res-page" onClick={() => setShowMenuModal(true)}>
                        👁️ Visualizar
                      </button>
                    </div>
                  </div>
                  <div className="menu-preview-res-page">
                    <img
                      src="./cardapio-sobremesa.png"
                      alt="Cardápio de Sobremesas - São & Salvo"
                      className="menu-image-res-page"
                      onClick={() => setShowMenuModal(true)}
                    />
                    <div className="menu-info-res-page">
                      <p>Doces tradicionais e criações especiais da casa</p>
                      <span className="menu-size-res-page">PDF • 1.2 MB</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal para visualização do menu */}
          {showMenuModal && (
            <div className="menu-modal-res-page" onClick={() => setShowMenuModal(false)}>
              <div className="menu-modal-content-res-page" onClick={(e) => e.stopPropagation()}>
                <div className="menu-modal-header-res-page">
                  <h3>Cardápio - {activeMenu.charAt(0).toUpperCase() + activeMenu.slice(1)}</h3>
                  <button className="close-modal-res-page" onClick={() => setShowMenuModal(false)}>
                    ✕
                  </button>
                </div>
                <div className="menu-modal-body-res-page">
                  <img
                    src="./back7.png"
                    alt={`Cardápio ${activeMenu}`}
                    className="menu-modal-image-res-page"
                  />
                </div>
                <div className="menu-modal-footer-res-page">
                  <button className="download-btn-res-page" onClick={() => handleMenuDownload(activeMenu)}>
                    📥 Baixar PDF
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Content Section */}
      <section className="content-section-res-page">
        <div className="container-res-page">
          <div className="content-grid-res-page">
            <div className="content-text-res-page">
              <h2 className="content-heading-res-page">Sobre o São & Salvo</h2>
              <h3 className="content-subheading-res-page">Uma experiência gastronômica única</h3>
              <p className="content-body-res-page">
                Descubra o sabor autêntico em cada prato, preparado com ingredientes frescos e paixão pela culinária.
                Nosso restaurante oferece uma experiência gastronômica única, onde cada detalhe é pensado para
                satisfazer seu paladar.
              </p>
              <p className="content-body-res-page">
                Desfrute de um ambiente acolhedor e um serviço impecável, enquanto saboreia nossos pratos exclusivos.
                Deixe-se levar pelos aromas e sabores que tornam cada refeição uma celebração.
              </p>
              <p className="content-body-res-page">
                Venha nos visitar e descubra por que somos o destino preferido dos amantes da boa comida. Esperamos por
                você para uma experiência inesquecível!
              </p>
            </div>
            <div className="content-image-res-page">
              <img src="./back7.png" alt="Interior do restaurante" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
