import "./Plans.css"

import React from "react"

function PricingSection() {
  const [billingCycle, setBillingCycle] = React.useState("monthly")

  const handleBillingToggle = (cycle) => {
    setBillingCycle(cycle)
  }

  return (
    <div className="pricing-container">
      <div className="hero-image"></div>

      <div className="billing-toggle">
        <button className={billingCycle === "monthly" ? "active" : ""} onClick={() => handleBillingToggle("monthly")}>
          Mensal
        </button>
        <button className={billingCycle === "yearly" ? "active" : ""} onClick={() => handleBillingToggle("yearly")}>
          Anual
        </button>
      </div>

      <div className="pricing-cards">
        <div className="pricing-card basic">
          <h2>Básico</h2>
          <div className="price">
            <span className="dollar">R$</span>
            <span className="amount">50</span>
            <span className="period">/mês</span>
          </div>
          <ul className="features">
            <li>Item da lista</li>
            <li>Item da lista</li>
            <li>Item da lista</li>
            <li>Item da lista</li>
            <li>Item da lista</li>
          </ul>
          <button className="cta-button">Selecionar</button>
        </div>

        <div className="pricing-card advanced">
          <h2>Avançado</h2>
          <div className="price">
            <span className="dollar">R$</span>
            <span className="amount">50</span>
            <span className="period">/mês</span>
          </div>
          <ul className="features">
            <li>Item da lista</li>
            <li>Item da lista</li>
            <li>Item da lista</li>
            <li>Item da lista</li>
            <li>Item da lista</li>
          </ul>
          <button className="cta-button">Selecionar</button>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">ⓘ</div>
          <div className="info-content">
            <h3>Título</h3>
            <p>
              Texto para o que você quiser dizer. Adicione pontos principais, citações, curiosidades ou até mesmo uma história bem curta.
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">ⓘ</div>
          <div className="info-content">
            <h3>Título</h3>
            <p>
              Texto para o que você quiser dizer. Adicione pontos principais, citações, curiosidades ou até mesmo uma história bem curta.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSection
