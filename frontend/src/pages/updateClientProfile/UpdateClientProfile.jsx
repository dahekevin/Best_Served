import { useState, useEffect } from "react"
import "./UpdateClientProfile.css"
import api from "../../service/api"

const UpdateClientProfile = () => {
	const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "", password: "" })
	const [previewImage, setPreviewImage] = useState(profile.avatar)

	const handleInputChange = (e) => {
		const { name, value } = e.target
		setProfile({
			...profile,
			[name]: value,
		})
	}

	// const handleImageChange = (e) => {
	// 	const file = e.target.files[0]
	// 	if (file) {
	// 		setPreviewImage(URL.createObjectURL(file))
	// 		setProfile({
	// 			...profile,
	// 			avatar: file
	// 		})
	// 	}
	// }

	const handleImageChange = (e) => {
		const file = e.target.files[0]
		if (file) {
			setProfile({
				...profile,
				avatar: file, // salve o arquivo, não uma string
			})

			const reader = new FileReader()
			reader.onloadend = () => {
				setPreviewImage(reader.result) // apenas para visualização
			}
			reader.readAsDataURL(file)
		}
	}

	const fetchClient = async () => {
		const token = localStorage.getItem('token')
		
		try {
			const response = await api.get('/client/get-one', {
				headers: { Authorization: `Bearer ${token}` }
			});
			
			console.log("Dados do cliente: ", response.data);

			const client = response.data

			setProfile({ ...response.data, password: "" });

			console.log("Client avatar: ", client.avatar);

			// Se o cliente tiver um avatar salvo, atualiza o previewImage
			if (client.avatar) {
				setPreviewImage(`http://localhost:3000/uploads/${client.avatar}`)  // <-- Caminho correto
			}
		} catch (error) {
			console.error("Erro ao buscar perfil:", error.response?.data || error.message || error);
		}
	}

	useEffect(() => {
		console.log("Fetching client profile...");
		
		fetchClient();
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault()
		// Here you would typically send the updated profile to your backend

		const token = localStorage.getItem('token')

		const formData = new FormData();
		formData.append("name", profile.name)
		formData.append("email", profile.email)
		formData.append("phone", profile.phone)
		formData.append("password", profile.password)

		if (profile.avatar instanceof File) {
			formData.append("client-avatar", profile.avatar)
		}

		try {
			await api.put('/client/update', formData, {
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "multipart/form-data"
				}
			});			

			alert("Perfil atualizado com sucesso!")
		} catch (error) {
			console.error("Erro ao buscar perfil:", error.response?.data || error.message || error);
		}

		console.log("Updated profile:", profile)
	}

	return (
		<div className="client-profile-container">
			<form onSubmit={handleSubmit}>
				<h1 className="client-profile-title">Atualizar Perfil</h1>
				<div className="client-profile-layout">
					<div className="client-profile-image-section">
						<div className="client-profile-image-container">
							<img src={previewImage} alt=" " className="client-profile-image" />
						</div>
						<label htmlFor="client-image-upload" className="client-change-image-button">
							Alterar imagem
						</label>
						<input
							id="client-image-upload"
							type="file"
							accept="image/*"
							onChange={handleImageChange}
							style={{ display: "none" }}
						/>
					</div>

					<div className="client-profile-details">
						<div className="client-form-group">
							<label htmlFor="client-name">Nome completo</label>
							<input
								type="text"
								id="client-name"
								name="name"
								value={profile.name}
								onChange={handleInputChange}
								className="client-form-input"
							/>
						</div>

						<div className="client-form-group">
							<label htmlFor="client-email">E-mail</label>
							<input
								type="email"
								id="client-email"
								name="email"
								value={profile.email}
								onChange={handleInputChange}
								className="client-form-input"
							/>
						</div>

						<div className="client-form-group">
							<label htmlFor="client-phone">Telefone</label>
							<input
								type="tel"
								id="client-phone"
								name="phone"
								value={profile.phone}
								onChange={handleInputChange}
								className="client-form-input"
							/>
						</div>

						<div className="client-form-group">
							<label htmlFor="client-password">Senha</label>
							<input
								type="password"
								id="client-password"
								name="password"
								value={profile.password}
								onChange={handleInputChange}
								className="client-form-input"
							/>
						</div>

						<div className="client-form-actions">
							<button type="submit" className="client-save-button">
								Salvar Alterações
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

export default UpdateClientProfile
