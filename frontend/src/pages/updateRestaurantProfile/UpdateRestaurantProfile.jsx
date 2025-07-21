import "./UpdateRestaurantProfile.css"
import api from "../../service/api"

import { useState } from "react"
import { TextField, Button } from "@mui/material"
import Select from 'react-select'

const RestaurantProfileUpdate = () => {
	const [profile, setProfile] = useState({
		name: "São & Salvo",
		email: "sao@salvo.com",
		password: "123@321",
		phone: "12345678",
		cnpj: "12.345.678/0001-90",
		fullAddress: "Av. Paulista, 1234, São Paulo, SP",
		opensAt: "07:00",
		closesAt: "12:00",
		description:
			"Culinária brasileira autêntica com um toque moderno. Oferecemos uma variedade de pratos tradicionais feitos com ingredientes frescos e locais.",
		mapsUrl: "https://maps.google.com/?q=Av.+Paulista,+1234,+São+Paulo",
		avatar: null,
		tables: 0,
		capacity: 0,
		tags: [],
	})

	const tagOptions = [
		{ value: "Churrascaria", label: "Churrascaria" },
		{ value: "Sorveteria", label: "Sorveteria" },
		{ value: "Karaokê", label: "Karaokê" },
		{ value: "Bar", label: "Bar" }
	];

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

	const handleTagChange = (selectedTags) => {
		setProfile({
			...profile,
			tags: selectedTags || [],
		})
	}

	// const handleImageChange = (e) => {
	// 	const file = e.target.files[0]
	// 	if (file) {
	// 		const reader = new FileReader()
	// 		reader.onloadend = () => {
	// 			setPreviewImage(reader.result)
	// 			setProfile({
	// 				...profile,
	// 				avatar: reader.result,
	// 			})
	// 		}
	// 		reader.readAsDataURL(file)
	// 	}
	// }

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setProfile(prevProfile => ({
				...prevProfile,
				// Salve o objeto File diretamente no avatar, não a string base64
				avatar: file,
			}));

			const reader = new FileReader();
			reader.onloadend = () => {
				// Apenas para pré-visualização no frontend
				setPreviewImage(reader.result);
			};
			reader.readAsDataURL(file);
		} else {
			// Se o usuário desselecionar a imagem, redefina o avatar e previewImage
			setProfile(prevProfile => ({
				...prevProfile,
				avatar: profile.avatar, // Mantenha o avatar anterior se não houver novo
			}));
			// setPreviewImage(profile.avatar); // Ou para um placeholder padrão se o avatar anterior não deve ser mostrado
		}
	};

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

	async function updateRestaurantData() {

		const token = localStorage.getItem('token')

		const formData = new FormData();
		formData.append('name', profile.name)
		formData.append('email', profile.email)
		formData.append('password', profile.password)
		formData.append('cnpj', profile.cnpj)
		formData.append('phone', profile.phone)
		formData.append('fullAddress', profile.fullAddress)
		formData.append('mapsUrl', profile.mapsUrl)
		formData.append('description', profile.description)
		formData.append('opensAt', profile.opensAt);
		formData.append('closesAt', profile.closesAt);
		formData.append('capacity', (profile.capacity))

		const tagValues = profile.tags.map(tag => tag.value)
		formData.append('tags', JSON.stringify(tagValues))

		// formData.append('tables', profile.tables);

		console.log('Instace of file:', profile.avatar);

		if (profile.avatar instanceof File) {
			formData.append("restaurant-avatar", profile.avatar)
		} else {
			console.log("Avatar não é um novo arquivo File, não será anexado ao FormData como File.");
		}

		if (menuPdf) {
			formData.append('menu', menuPdf);
		}

		console.log('MENUUU', menuPdf);
		

		console.log("FormData being sent:", formData);

		try {
			const response = await api.put('/restaurant/update', formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data"
				}
			})

			if (!response) {
				alert('Erro ao atualizar informações de usuário.');
				return console.log('Erro ao atualizar informações de usuário.');
			}

			alert('Atualização Completa!');
			console.log('Atualização Completa!');

		} catch (error) {
			console.error('Erro ao atualizar informações de usuário.', error);
		}
	}

	const handleSubmit = (e) => {
		e.preventDefault()
		updateRestaurantData()
		console.log("Updated profile:", profile)
	}

	return (
		<div className="profile-container">
			<form onSubmit={handleSubmit}>
				<h1 className="profile-title">Atualizar Perfil</h1>

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
					</div>

					<div className="profile-details">
						<div className="form-group">
							<label htmlFor="name">Nome do Restaurante</label>
							<TextField
								type="text"
								id="name"
								name="name"
								value={profile.name}
								onChange={handleInputChange}
								className="form-input"
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
							<label htmlFor="email">E-mail</label>
							<TextField
								type="email"
								id="email"
								name="email"
								value={profile.email}
								onChange={handleInputChange}
								className="form-input"
								placeholder="Ex: contato@restaurante.com"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="password">Senha</label>
							<TextField
								type="password"
								id="password"
								name="password"
								value={profile.password}
								onChange={handleInputChange}
								className="form-input"
								placeholder="Ex: senha123"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="cnpj">CNPJ</label>
							<TextField
								type="text"
								id="cnpj"
								name="cnpj"
								value={profile.cnpj}
								onChange={handleInputChange}
								className="form-input"
								placeholder="Ex: 12.345.678/0001-90"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="fullAddress">Endereço Completo</label>
							<TextField
								type="text"
								id="fullAddress"
								name="fullAddress"
								value={profile.fullAddress}
								onChange={handleInputChange}
								className="form-input"
								placeholder="Ex: Av. Paulista, 1234, São Paulo, SP"
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
							<label htmlFor="mapsUrl">Link do Google Maps</label>
							<TextField
								type="url"
								id="mapsUrl"
								name="mapsUrl"
								value={profile.mapsUrl}
								onChange={handleInputChange}
								className="form-input"
								placeholder="Cole o link do Google Maps"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="phone">Telefone</label>
							<TextField
								type="tel"
								id="phone"
								name="phone"
								value={profile.phone}
								onChange={handleInputChange}
								className="form-input"
								placeholder="Ex: (11) 91234-5678"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="tables">Quantidade de Mesas</label>
							<TextField
								type="number"
								id="tables"
								name="tables"
								value={profile.tables}
								onChange={handleInputChange}
								className="form-input"
								placeholder="Digite a quantidade de mesas"
							/>
						</div>

						<div className="form-group">
							<label htmlFor="tables">Capacidade das Mesas</label>
							<TextField
								type="number"
								id="capacity"
								name="capacity"
								value={profile.capacity}
								onChange={handleInputChange}
								className="form-input"
								fullWidth
								placeholder="Digite a capacidade das mesas"
								/>
						</div>

						<div className="form-group">
							<label htmlFor="tables">Tags do estabelecimento</label>
							<Select
								id="tags"
								name="tags"
								isMulti
								className="form-input"
								options={tagOptions}
								value={profile.tags}
								onChange={handleTagChange}
								fullWidth
								placeholder="Tags"
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
							<li>Tamanho máximo: 10 MB</li>
							<li>Recomendação: Use imagens de alta qualidade para melhor visualização</li>
							<li>Certifique-se de que o texto esteja legível</li>
						</ul>
					</div>
				</div>

				<div className="form-actions main-actions">
					<button type="submit" className="save-Button">
						Salvar Todas as Alterações
					</button>
				</div>
			</form>
		</div>
	)
}

export default RestaurantProfileUpdate
