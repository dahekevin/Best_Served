import "./UpdateRestaurantProfile.css"
import api from "../../service/api"

import { useEffect, useState } from "react"
import { TextField, Button } from "@mui/material"
import Select from 'react-select'

const RestaurantProfileUpdate = () => {
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

	const [previewImage, setPreviewImage] = useState(profile.image)
	const [menuPdf, setMenuPdf] = useState(null)
	const [menuPdfName, setMenuPdfName] = useState("")

	const [numberOfTables, setNumberOfTables] = useState(0)
	const [tableCapacities, setTableCapacities] = useState([4, 4, 6, 8, 2])
	const [tablesToUpdate, setTablesToUpdate] = useState([])
	const [existingTables, setExistingTables] = useState([]);

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

	// Função para comparar se as mesas foram alteradas
	const areTablesChanged = (newCapacities, oldTables) => {
		// Caso 1: O número de mesas mudou
		if (newCapacities.length !== oldTables.length) {
			return true;
		}
		// Caso 2: A capacidade de alguma mesa mudou
		// Mapeie os `seats` dos dados antigos para um array para comparação
		const oldCapacities = oldTables.map(table => table.seats);
		for (let i = 0; i < newCapacities.length; i++) {
			// Lembre-se de converter para o mesmo tipo para comparar
			if (Number(newCapacities[i] || 0) !== Number(oldCapacities[i] || 0)) {
				return true;
			}
		}
		// Se nenhum dos casos acima for verdadeiro, as mesas não mudaram
		return false;
	};

	const handleNumberOfTablesChange = (e) => {
		const newNumber = parseInt(e.target.value) || 0
		setNumberOfTables(newNumber)

		// Adjust table capacities array
		const currentCapacities = [...tableCapacities]
		if (newNumber > currentCapacities.length) {
			// Add new tables with default capacity of 4
			const newTables = Array(newNumber - currentCapacities.length).fill(4)
			setTableCapacities([...currentCapacities, ...newTables])
		} else if (newNumber < currentCapacities.length) {
			// Remove excess tables
			setTableCapacities(currentCapacities.slice(0, newNumber))
		}
	}

	const handleTableCapacityChange = (tableIndex, capacity) => {
		const newCapacities = [...tableCapacities]
		newCapacities[tableIndex] = parseInt(capacity) || 0
		setTableCapacities(newCapacities)
	}

	const getRestaurant = async () => {
		const token = localStorage.getItem('token')

		try {
			const response = await api.get('/restaurant/get-one', {
				headers: { Authorization: `Bearer ${token}` }
			})

			console.log("Dados do restaurante: ", response.data.restaurant)

			const restaurant = response.data.restaurant

			setProfile({ ...restaurant, password: "", mapsUrl: (restaurant.mapsUrl !== 'null' && restaurant.mapsUrl !== null && restaurant.mapsUrl !== undefined && restaurant.mapsUrl !== '') ? restaurant.mapsUrl : "" })

			if (restaurant.tags && Array.isArray(restaurant.tags)) {
				// CONVERTA O ARRAY DE STRINGS PARA UM ARRAY DE OBJETOS
				const formattedTags = restaurant.tags.map(tag => ({
					value: tag,
					label: tag
				}));

				// ATUALIZE O ESTADO 'profile' COM AS TAGS FORMATADAS
				setProfile(prevProfile => ({
					...prevProfile,
					tags: formattedTags
				}));
			}

			console.log("number of tables: ", restaurant.tables.length);

			if (restaurant.tables && restaurant.tables.length > 0) {
				// Se houver mesas, atualize os estados de mesas com os dados do backend
				setNumberOfTables(restaurant.tables.length);

				// Crie um array de capacidades a partir dos dados das mesas existentes
				// Mapeie os dados para um array de capacidades
				const capacities = restaurant.tables.map(table => table.seats);
				setTableCapacities(capacities);

				// IMPORTANTE: Preencha o novo estado com as mesas completas do banco
				setExistingTables(restaurant.tables);

			} else {
				// Se não houver mesas cadastradas, inicie com 0
				setNumberOfTables(0);
				setTableCapacities([]);
				setExistingTables([]); // Limpa se não houver mesas
			}

			if (restaurant.avatar) {
				setPreviewImage(`http://localhost:3000/${restaurant.avatar.replace("src\\", "")}`)
			}

		} catch (error) {
			console.error("Erro ao buscar perfil:", error.response?.data || error.message || error);
		}
	}

	useEffect(() => {
		getRestaurant()
	}, [])

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

		// if (numberOfTables > 0) {
		// 	// Supondo que você tem um estado `existingTables`
		// 	const tables = tableCapacities.map((capacity, index) => {
		// 		// Use o ID da mesa existente se ela já existe, caso contrário, não passe o ID.
		// 		// O `existingTables` precisa ter a mesma ordem do `tableCapacities`.
		// 		const existingTable = profile.tables[index];

		// 		return {
		// 			id: existingTable ? existingTable.id : undefined, // Envia o ID real ou undefined para novas mesas
		// 			seats: String(Number(capacity || 0)),
		// 		};
		// 	});
		// 	formData.append('tables', JSON.stringify(tables));
		// }

		// --- LÓGICA OTIMIZADA PARA AS MESAS ---
		// 1. Verifique se o número de mesas foi reduzido a zero
		if (numberOfTables === 0 && existingTables.length > 0) {
			console.log('aquiiiiiiiiiiiiiiiiii');
			
			// Envie um array vazio para o backend, indicando que todas as mesas devem ser removidas
			formData.append('tables', JSON.stringify([]));
		}
		// 2. Se o número de mesas for maior que zero, verifique se houve alguma mudança
		else if (numberOfTables > 0 && areTablesChanged(tableCapacities, existingTables)) {
			// Apenas envie os dados das mesas se houver uma mudança real
			const newTablesData = tableCapacities.map((capacity, index) => ({
				seats: String(Number(capacity || 0)),
				id: existingTables[index] ? existingTables[index].id : undefined
			}));
			formData.append('tables', JSON.stringify(newTablesData));
		}

		const tagValues = profile.tags.map(tag => tag.value)
		formData.append('tags', JSON.stringify(tagValues))

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
							<label htmlFor="descricao">Descrição</label>
							<TextField
								id="description"
								name="description"
								value={profile.description}
								onChange={handleInputChange}
								className="form-textarea"
								multiline
								rows={0}
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
						{/* 
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
						</div> */}

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

				{/* Configuração das mesas */}
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
											{tableCapacities.reduce((total, capacity) => parseInt(total) + (parseInt(capacity) || 0), 0)} pessoas
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
							{/* <li>Tamanho máximo: 10 MB</li> */}
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
