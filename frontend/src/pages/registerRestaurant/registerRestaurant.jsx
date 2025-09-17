import "./RegisterRestaurant.css"
import api from "../../service/api"

import { useState } from "react"
import { TextField } from '@mui/material'
import Select from 'react-select'

const RestaurantRegistration = () => {
	const [profile, setProfile] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
		cnpj: "",
		fullAddress: "",
		opensAt: "",
		closesAt: "",
		description:
			"",
		mapsUrl: "",
		avatar: "",
		tables: 0,
		capacity: 0,
		tags: [],
	})

	const tagOptions = [
		{ value: "Churrascaria", label: "Churrascaria" },
		{ value: "Restaurante", label: "Restaurante" },
		{ value: "Lanchonete", label: "Lanchonete" },
		{ value: "Sorveteria", label: "Sorveteria" },
		{ value: "Pizzaria", label: "Pizzaria" },
		{ value: "Karaokê", label: "Karaokê" },
		{ value: "Boteco", label: "Boteco" },
		{ value: "Bar", label: "Bar" }
	];

	const [paymentMethod, setPaymentMethod] = useState("credit")
	const [creditCardInfo, setCreditCardInfo] = useState({
		cardNumber: "",
		cardName: "",
		expiryDate: "",
		cvv: "",
	})

	const [previewImage, setPreviewImage] = useState(profile.image)
	const [menuPdf, setMenuPdf] = useState(null)
	const [menuPdfName, setMenuPdfName] = useState("")

	const [numberOfTables, setNumberOfTables] = useState(0)
	const [tableCapacities, setTableCapacities] = useState([4, 4, 6, 8, 2])

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setProfile({
			...profile,
			[name]: value,
		})
	}

	const handleTagChange = (selectedTags) => {
		setProfile({
			...profile,
			tags: selectedTags || [],
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

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			setProfile({
				...profile,
				avatar: file,
			})

			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewImage(reader.result)
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
		const fileInput = document.getElementById("menu-pdf-upload")
		if (fileInput) {
			fileInput.value = ""
		}
	}

	const handleNumberOfTablesChange = (e) => {
		const newNumber = parseInt(e.target.value) || 0
		setNumberOfTables(newNumber)

		const currentCapacities = [...tableCapacities]
		if (newNumber > currentCapacities.length) {
			const newTables = Array(newNumber - currentCapacities.length).fill(4)
			setTableCapacities([...currentCapacities, ...newTables])
		} else if (newNumber < currentCapacities.length) {
			setTableCapacities(currentCapacities.slice(0, newNumber))
		}
	}

	const handleTableCapacityChange = (tableIndex, capacity) => {
		const newCapacities = [...tableCapacities]
		newCapacities[tableIndex] = parseInt(capacity) || 0
		setTableCapacities(newCapacities)
	}

	const registerRestaurantData = async () => {
		try {
			console.log("Atualizando dados do restaurante:", profile);

			const formData = new FormData();
			formData.append('email', profile.email);
			formData.append('name', profile.name);
			formData.append('password', profile.password);
			formData.append('phone', profile.phone);
			formData.append('cnpj', profile.cnpj);
			formData.append('fullAddress', profile.fullAddress);
			formData.append('opensAt', profile.opensAt);
			formData.append('closesAt', profile.closesAt);
			formData.append('description', profile.description);
			formData.append('mapsUrl', profile.mapsUrl);

			if (numberOfTables > 0) {
				const tables = tableCapacities.map((capacity, index) => ({
					id: index + 1,
					seats: capacity
				}));
				formData.append('tables', JSON.stringify(tables));
			}

			const tagValues = profile.tags.map(tag => tag.value)
			formData.append('tags', JSON.stringify(tagValues))

			console.log('Avatar: ', profile.avatar);
			console.log('Menu: ', menuPdf);

			if (profile.avatar instanceof File) {
				formData.append('restaurant-avatar', profile.avatar);
			}

			if (menuPdf) {
				formData.append('menu', menuPdf);
			}

			console.log("FormData being sent:", formData);

			const response = await api.post('/restaurant/register', formData, {
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			})

			if (!response) {
				alert('Erro ao criar informações de usuário.');
				return console.log('Erro ao criar informações de usuário.');
			}

			console.log("Dados do restaurante criados com sucesso!", response.data);
			alert("Dados do restaurante criados com sucesso!");

			window.location.href = "/login"

		} catch (error) {
			console.error("Falha na criação de pedido!", error);
			if (error.response) {
				console.log("Erro do servidor:", error.response.data)
				alert(`Erro: ${error.response.data.message || "Erro ao criar dados do restaurante"}`)
			}
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		console.log("Payment method:", paymentMethod)
		if (paymentMethod === "credit") {
			console.log("Credit card info:", creditCardInfo)
		}
		registerRestaurantData()
	}

	const renderPaymentMethodFields = () => {
		switch (paymentMethod) {
			case "pix":
				return (
					<div className="payment-info">
						<p className="payment-instruction">
							Após o cadastro, geraremos um QR Code Pix para você concluir o pagamento.
						</p>
						<div className="pix-placeholder">
							<div className="pix-qr-placeholder">
								<span>O QR Code será gerado após o cadastro</span>
							</div>
						</div>
					</div>
				)
			case "boleto":
				return (
					<div className="payment-info">
						<p className="payment-instruction">
							Após o cadastro, geraremos um Boleto para você concluir o pagamento.
						</p>
						<div className="boleto-placeholder">
							<span>O boleto será gerado e enviado para seu e-mail</span>
						</div>
					</div>
				)
			case "credit":
				return (
					<div className="payment-info">
						<div className="credit-card-form">
							<div className="form-group">
								<TextField
									type="text"
									id="cardNumber"
									name="cardNumber"
									value={creditCardInfo.cardNumber}
									onChange={handleCreditCardChange}
									className="form-input"
									fullWidth
									label="Número do Cartão"
									placeholder="Ex: 1234 5678 9012 3456"
								/>
							</div>
							<div className="form-group">
								<TextField
									type="text"
									id="cardName"
									name="cardName"
									value={creditCardInfo.cardName}
									onChange={handleCreditCardChange}
									className="form-input"
									fullWidth
									label="Nome no Cartão"
									placeholder="João da Silva"
								/>
							</div>
							<div className="card-row">
								<div className="form-group">
									<TextField
										type="text"
										id="expiryDate"
										name="expiryDate"
										value={creditCardInfo.expiryDate}
										onChange={handleCreditCardChange}
										className="form-input"
										fullWidth
										label="Validade"
										placeholder="MM/AA"
									/>
								</div>
								<div className="form-group">
									<TextField
										type="text"
										id="cvv"
										name="cvv"
										value={creditCardInfo.cvv}
										onChange={handleCreditCardChange}
										className="form-input"
										fullWidth
										label="CVV"
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
				<h1 className="profile-title">Cadastrar Restaurante</h1>

				<div className="profile-layout">
					<div className="profile-image-section">
						<div className="profile-image-container">
							<img src={previewImage} className="profile-image" />
						</div>
						<label htmlFor="image-upload" className="change-image-button">
							Alterar imagem
						</label>
						<TextField
							id="image-upload"
							name="restaurant-avatar"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							style={{ display: "none" }}
						/>

						<div className="payment-methods-section">
							<h3 className="payment-title">Forma de Pagamento</h3>
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
							<TextField
								type="text"
								id="name"
								name="name"
								value={profile.name}
								onChange={handleInputChange}
								className="form-input"
								label="Nome do Restaurante"
								placeholder="Digite o nome do restaurante"
							/>
						</div>

						<div className="form-group">
							<TextField
								id="description"
								name="description"
								value={profile.description}
								onChange={handleInputChange}
								className="form-textarea"
								multiline
								rows={0}
								label="Descrição"
								placeholder="Descreva o restaurante"
							/>
						</div>

						<div className="form-group">
							<TextField
								type="email"
								id="email"
								name="email"
								value={profile.email}
								onChange={handleInputChange}
								className="form-input"
								fullWidth
								label="E-mail"
								placeholder="Ex: contato@restaurante.com"
							/>
						</div>

						<div className="form-group">
							<TextField
								type="password"
								id="password"
								name="password"
								value={profile.password}
								onChange={handleInputChange}
								className="form-input"
								fullWidth
								label="Senha"
								placeholder="Ex: senha123"
							/>
						</div>

						<div className="form-group">
							<TextField
								type="text"
								id="cnpj"
								name="cnpj"
								value={profile.cnpj}
								onChange={handleInputChange}
								className="form-input"
								fullWidth
								label="CNPJ"
								placeholder="Ex: 12.345.678/0001-90"
							/>
						</div>

						<div className="form-group">
							<TextField
								type="text"
								id="fullAddress"
								name="fullAddress"
								value={profile.fullAddress}
								onChange={handleInputChange}
								className="form-input"
								fullWidth
								label="Endereço Completo"
								placeholder="Ex: Av. Paulista, 1234, São Paulo, SP"
							/>
						</div>

						<div className="form-group">
							<TextField
								type="url"
								id="mapsUrl"
								name="mapsUrl"
								value={profile.mapsUrl}
								onChange={handleInputChange}
								className="form-input"
								fullWidth
								label="Link do Google Maps"
								placeholder="Cole o link do Google Maps"
							/>
						</div>

						<div className="form-group">
							<TextField
								type="tel"
								id="phone"
								name="phone"
								value={profile.phone}
								onChange={handleInputChange}
								className="form-input"
								fullWidth
								label="Telefone"
								placeholder="Ex: (11) 91234-5678"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="opensAt">Horário de Abertura</label>
							<TextField
								type="time"
								id="opensAt"
								name="opensAt"
								value={profile.opensAt}
								onChange={handleInputChange}
								className="form-input"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="closesAt">Horário de Fechamento</label>
							<TextField
								type="time"
								id="closesAt"
								name="closesAt"
								value={profile.closesAt}
								onChange={handleInputChange}
								className="form-input"
							/>
						</div>

						<div className="form-group">
							<Select
								id="tags"
								name="tags"
								isMulti
								className="form-input"
								options={tagOptions}
								value={profile.tags}
								onChange={handleTagChange}
								fullWidth
								label="Tags do estabelecimento"
								placeholder="Tags"
							/>
						</div>
					</div>
				</div>

				<div className="tables-section">
					<h2 className="section-title">Configuração das Mesas</h2>
					<p className="tables-description">
						Configure a quantidade de mesas do seu restaurante e a capacidade de cada uma.
					</p>

					<div className="tables-config">
						<div className="form-group">
							<label htmlFor="numberOfTables">Número de Mesas</label>
							<input
								type="number"
								id="numberOfTables"
								name="numberOfTables"
								value={numberOfTables}
								onChange={handleNumberOfTablesChange}
								className="form-input"
								min="0"
							/>
						</div>

						{numberOfTables > 0 && (
							<div className="tables-capacity-section">
								<h3>Capacidade de Cada Mesa</h3>
								<div className="tables-grid">
									{Array.from({ length: numberOfTables }, (_, index) => (
										<div key={index} className="table-capacity-item">
											<label htmlFor={`table-${index + 1}`}>Mesa {index + 1}</label>
											<div className="capacity-input-wrapper">
												<input
													type="number"
													id={`table-${index + 1}`}
													value={tableCapacities[index] || 0}
													onChange={(e) => handleTableCapacityChange(index, e.target.value)}
													className="form-input capacity-input"
													min="0"
												/>
												<span className="capacity-label">pessoas</span>
											</div>
										</div>
									))}
								</div>
								<div className="tables-summary">
									<div className="summary-item">
										<span className="summary-label">Total de Mesas:</span>
										<span className="summary-value">{numberOfTables}</span>
									</div>
									<div className="summary-item">
										<span className="summary-label">Capacidade Total:</span>
										<span className="summary-value">
											{tableCapacities.reduce((total, capacity) => total + (capacity || 0), 0)} pessoas
										</span>
									</div>
								</div>
							</div>
						)}
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
									name="menu"
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
									name="menu"
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
							<li>Recomendação: Use imagens de alta qualidade para melhor visualização</li>
							<li>Certifique-se de que o texto esteja legível</li>
						</ul>
					</div>
				</div>

				<div className="form-actions main-actions">
					<button type="submit" className="save-button">
						Cadastrar Restaurante
					</button>
				</div>
			</form>
		</div>
	)
}

export default RestaurantRegistration
