import "./Plans.css"

import { useState } from "react"

function PricingSection() {
	const [billingCycle, setBillingCycle] = useState("monthly")

	const handleBillingToggle = (cycle) => {
		setBillingCycle(cycle)
	}

	const handleSelectPlan = (planType) => {
		localStorage.setItem("planType", planType)
		console.log("Tipo de plano: ", planType);
		window.location.href = '/restaurant-registration';
	}

	return (
		<div className="pricing-container">
			<div className="hero-image"></div>

			<div className="billing-toggle">
				<button className={billingCycle === "monthly" ? "active" : ""} onClick={() => handleBillingToggle("monthly")}>
					Mensal
				</button>
				<button className={billingCycle === "yearly" ? "active" : ""} onClick={() => handleBillingToggle("yearly")}>
					Anual (★ Mais Popular)
				</button>
			</div>

			<div className={`pricing-cards-${billingCycle === "monthly" ? "active" : ""}`}>
				<div className="pricing-card basic">
					<h2>Básico</h2>
					<div className="price">
						<span className="dollar">R$</span>
						<span className="amount">49,90</span>
						<span className="period">/mês</span>
					</div>
					<ul className="features">
						<li>✅ Até 30 reservas por mês</li>
						<li>✅ Perfil com foto e endereço</li>
						<li>❌ Notificações</li>
						<li>❌ Gestão de Mesa</li>
						<li>❌ Meio de comunicação</li>
						<li>❌ Não aparece na página de recomendação</li>
					</ul>
					<button onClick={() => { handleSelectPlan("mb") }} className="cta-button">Selecionar</button>
				</div>

				<div className="pricing-card advanced">
					<div>
						<h2>Avançado</h2>
					</div>
					<div className="price">
						<span className="dollar">R$</span>
						<span className="amount">99,90</span>
						<span className="period">/mês</span>
					</div>
					<ul className="features">
						<li>✅ Reservas ilimitadas</li>
						<li>✅ Perfil completo com galeria</li>
						<li>✅ Notificações (SMS/Email)</li>
						<li>✅ Gestão de Mesa</li>
						<li>✅ Meio de comunicação (WhatsApp/E-mail/Telefone)</li>
						<li>✅ Não aparece na página de recomendação</li>
					</ul>
					<button onClick={() => { handleSelectPlan("ma") }} className="cta-button">Selecionar</button>
				</div>
			</div>

			<div className={`pricing-cards-${billingCycle === "yearly" ? "active" : ""}`}>
				<div className="pricing-card basic">
					<h2>Básico</h2>
					<div className="price">
						<span className="dollar">R$</span>
						<span className="amount">499,90</span>
						<span className="period">/ano</span>
					</div>
					<ul className="features">
						<li>✅ Até 30 reservas por ano</li>
						<li>✅ Perfil com foto e endereço</li>
						<li>❌ Notificações</li>
						<li>❌ Gestão de Mesa</li>
						<li>❌ Meio de comunicação</li>
						<li>❌ Não aparece na página de recomendação</li>
					</ul>
					<button onClick={() => { handleSelectPlan("yb") }} className="cta-button">Selecionar</button>
				</div>

				<div className="pricing-card advanced">
					<div>
						<h2>Avançado</h2>
					</div>
					<div className="price">
						<span className="dollar">R$</span>
						<span className="amount">999,00</span>
						<span className="period">/anos</span>
					</div>
					<ul className="features">
						<li>✅ Reservas ilimitadas</li>
						<li>✅ Perfil completo com galeria</li>
						<li>✅ Notificações (SMS/Email)</li>
						<li>✅ Gestão de Mesa</li>
						<li>✅ Meio de comunicação (WhatsApp/E-mail/Telefone)</li>
						<li>✅ Não aparece na página de recomendação</li>
					</ul>
					<button onClick={() => { handleSelectPlan("ya") }} className="cta-button">Selecionar</button>
				</div>
			</div>

			<div className="info-section">
				<div className="info-card">
					<div className="info-icon">ⓘ</div>
					<div className="info-content">
						<h3>Comece simples, comece agora</h3>
						<p>
							Ideal para pequenos restaurantes que estão dando os primeiros passos no digital. Com este plano, você garante uma presença online com seu perfil visível, recebe reservas de forma prática e começa a atrair mais clientes — tudo isso com custo reduzido.
						</p>
					</div>

				</div>

				<div className="info-card">
					<div className="info-icon">ⓘ</div>
					<div className="info-content">
						<h3>Mais reservas, mais controle, mais visibilidade</h3>
						<p>
							Pensado para restaurantes que querem se destacar. Com reservas ilimitadas, notificações automáticas, gestão de mesas e destaque na plataforma, você oferece uma experiência de alto nível ao seu cliente — e ainda ganha ferramentas poderosas para crescer e fidelizar.
						</p>
					</div>

				</div>
			</div>
		</div>
	)
}

export default PricingSection
