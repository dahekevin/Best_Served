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
          Monthly
        </button>
        <button className={billingCycle === "yearly" ? "active" : ""} onClick={() => handleBillingToggle("yearly")}>
          Yearly
        </button>
      </div>

      <div className="pricing-cards">
        <div className="pricing-card basic">
          <h2>Basic</h2>
          <div className="price">
            <span className="dollar">$</span>
            <span className="amount">50</span>
            <span className="period">/mo</span>
          </div>
          <ul className="features">
            <li>List item</li>
            <li>List item</li>
            <li>List item</li>
            <li>List item</li>
            <li>List item</li>
          </ul>
          <button className="cta-button">Button</button>
        </div>

        <div className="pricing-card advanced">
          <h2>Advanced</h2>
          <div className="price">
            <span className="dollar">$</span>
            <span className="amount">50</span>
            <span className="period">/mo</span>
          </div>
          <ul className="features">
            <li>List item</li>
            <li>List item</li>
            <li>List item</li>
            <li>List item</li>
            <li>List item</li>
          </ul>
          <button className="cta-button">Button</button>
        </div>
      </div>

      <div className="info-section">
        <div className="info-card">
          <div className="info-icon">ⓘ</div>
          <div className="info-content">
            <h3>Title</h3>
            <p>
              Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very
              short story.
            </p>
          </div>
        </div>

        <div className="info-card">
          <div className="info-icon">ⓘ</div>
          <div className="info-content">
            <h3>Title</h3>
            <p>
              Body text for whatever you'd like to say. Add main takeaway points, quotes, anecdotes, or even a very very
              short story.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSection
