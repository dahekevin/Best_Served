import { useState, useEffect } from "react"
import "./UpdateUserProfile.css"
import api from "../../service/api"

const ProfileUpdate = () => {
	const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "", password: "" })
	const [previewImage, setPreviewImage] = useState(profile.avatar)

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
			setPreviewImage(URL.createObjectURL(file))
			setProfile({
				...profile,
				avatar: file
			})
		}
	}

	const fetchUser = async () => {
		const token = localStorage.getItem('token')

		try {
			const response = await api.get('/sd-user/get-one', {
				headers: { Authorization: `Bearer ${token}` }
			});
			console.log("Dados do usuário: ", response.data);

			const user = response.data

			setProfile({ ...response.data, password: "" });

			console.log("user avatar: ", user.avatar);

			// Se o usuário tiver um avatar salvo, atualiza o previewImage
			if (user.avatar) {
				setPreviewImage(`http://localhost:3000/uploads/${user.avatar}`)  // <-- Caminho correto
			}
		} catch (error) {
			console.error("Erro ao buscar perfil:", error.response?.data || error.message || error);
		}
	}

	useEffect(() => {
		fetchUser();
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
			formData.append("avatar", profile.avatar)
		}

		try {
			await api.put('/sd-user/edit', formData, {
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
		<div className="profile-container">
			<form onSubmit={handleSubmit}>
				<h1 className="profile-title">Atualizar Perfil</h1>
				<div className="profile-layout">
					<div className="profile-image-section">
						<div className="profile-image-container">
							<img src={previewImage} alt=" " className="profile-image" />
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
							<label htmlFor="name">Nome completo</label>
							<input
								type="text"
								id="name"
								name="name"
								value={profile.name}
								onChange={handleInputChange}
								className="form-input"
							/>
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
							<label htmlFor="password">Senha</label>
							<input
								type="password"
								id="password"
								name="password"
								value={profile.password}
								onChange={handleInputChange}
								className="form-input"
							/>
						</div>

						<div className="form-actions">
							<button type="submit" className="save-button">
								Salvar Alterações
							</button>
						</div>
					</div>
				</div>
			</form>
		</div>
	)
}

export default ProfileUpdate
