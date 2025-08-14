"use client"

import { useCallback, useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import api from "../../service/api"
import Swal from 'sweetalert2'
import "./Tables.css"

const RestaurantTables = () => {
	const [searchParams] = useSearchParams()
	const restaurantId = searchParams.get('restaurantId')
	const [activeFilter, setActiveFilter] = useState("All")
	const [showModal, setShowModal] = useState(false)
	const [showListModal, setShowListModal] = useState(false)
	const [selectedTable, setSelectedTable] = useState(null)
	const [customerObservations, setCustomerObservations] = useState("")
	const [maxSeats, setMaxSeats] = useState(0)
	const [clientInfo, setClientInfo] = useState({ name: "", email: "", phone: "", avatar: "", password: "" })

	let index = 0

	const [searchFilters, setSearchFilters] = useState({
		date: "",
		starts: "",
		ends: "",
		guests: "",
	})

	const [tables, setTables] = useState([])

	// const restaurants = ["Todos", "Restaurante Central", "Restaurante Norte", "Restaurante Sul"]

	// const filteredTables = tables.filter((table) => {
	// 	const { date, starts, ends, guests } = searchFilters;

	// 	console.log('Tablessdfsdf: ', table);


	// 	// Verifica se existe conflito com alguma reserva (mesma data e opcionalmente mesmo horário)
	// 	const hasConflict = table.reservations?.some(
	// 		(res) =>
	// 			res.reservationDate?.split("T")[0] === date &&
	// 			(starts || ends || res.reservationStarts === starts) &&
	// 			table.restaurantId === restaurantId ||
	// 			table.seats >= guests
	// 	);

	// 	// Filtro por status dinâmico
	// 	if (activeFilter === "Available") return !hasConflict;
	// 	if (activeFilter === "Not-Available") return hasConflict;

	// 	// Se for "All", todas as mesas são exibidas
	// 	return true;
	// });

	const filteredTables = tables.filter((table) => {
		const { date, starts, ends, guests } = searchFilters;

		// CORREÇÃO 1: Verifica conflitos de data e hora
		const hasTimeConflict = table.reservations?.some(
			(res) => {
				// Checa se a data corresponde
				const isSameDay = date ? res.reservationDate?.split("T")[0] === date : false;

				if (!isSameDay || !starts || !ends) {
					return false; // Se não for o mesmo dia ou os horários não foram definidos, não há conflito
				}

				// Converte horários para um formato comparável (ex: HH:MM)
				const existingStarts = res.reservationStarts; // Assumindo que o `time` da reserva é o horário de início
				const existingEnds = res.reservationEnds; // Assumindo que você tem um `reservationEnds` no seu objeto de reserva

				// Lógica de sobreposição de intervalos:
				// O conflito acontece se o novo horário de início for antes do término do existente E
				// o novo horário de término for depois do início do existente.
				const hasOverlap = starts && ends ? ((existingStarts >= starts && existingStarts <= ends) || (existingEnds >= starts && existingEnds <= ends)) : false;

				console.log(`HasOverlap: ${hasOverlap} | isSameDay: ${isSameDay} | starts: ${starts} | existingStarts: ${existingStarts} | ends: ${ends} | existingEnds: ${existingEnds}`);

				return hasOverlap;
			}
		);

		// CORREÇÃO 2: Verifica a capacidade (se `guests` for um número)
		const hasCapacity = guests === "" || table.seats >= parseInt(guests, 10);

		// Lógica de filtro final
		if (activeFilter === "Available") return !hasTimeConflict && hasCapacity;
		if (activeFilter === "Not-Available") return hasTimeConflict || !hasCapacity;

		// Se for "All", a capacidade e o conflito não importam para o filtro, mas ainda serão mostrados
		return true;
	});

	const handleTableList = (table) => {
		setSelectedTable(table)
		setShowListModal(true)
	}

	const handleTableClick = (table) => {
		setSelectedTable(table)
		setCustomerObservations(table.observations || "")
		setShowModal(true)
	}

	const getClientInfo = async () => {
		const token = localStorage.getItem('token')

		try {
			const client = await api.get('/client/get-one', {
				headers: { Authorization: `Bearer ${token}` }
			})

			console.log('ClientInfo: ', client.data.name);

			setClientInfo(client.data)
		} catch (error) {
			console.log('Falha ao acessar informações do cliente no banco.', error);
		}
	}

	useEffect(() => {
		getClientInfo()
	}, [])

	const registerReservation = async () => {
		const token = localStorage.getItem('token')

		try {
			const response = await api.post('/reservation/register', {
				date: searchFilters.date,
				startsAt: searchFilters.starts,
				endsAt: searchFilters.ends,
				guests: searchFilters.guests === '' ? 0 : searchFilters.guests,
				notes: customerObservations,
				clientId: clientInfo.id,
				restaurantId: restaurantId,
				tableId: selectedTable.id
			})

			if (!response) { console.log('Erro ao acessar reservas em banco.'); }

			const history = await api.patch('/client/update-history', { restaurantId: restaurantId }, {
				headers: {
					Authorization: `Bearer ${token}`,
					'Content-Type': 'application/json'
				}
			});

			if (!history) { console.log('Erro ao atualizar o histórico do cliente.'); }

			console.log('Reservas: ', response);
			Swal.fire("Pedido de reserva feita!")
			getTables()

		} catch (error) {
			console.error('Erro ao registrar informações de cadastro.', error);
			Swal.fire({
				icon: "error",
				title: "Oops...",
				text: "Erro ao regitrar informações de cadastro."
			});
		}
	}

	// const handleConfirmReservation = () => {
	// 	// if (selectedTable) {
	// 	// 	const currentDate = new Date().toISOString().split("T")[0]
	// 	// 	const currentTime = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })

	// 	// 	setTables((prevTables) =>
	// 	// 		prevTables.map((table) =>
	// 	// 			table.id === selectedTable.id
	// 	// 				? {
	// 	// 					...table,
	// 	// 					status: "reservada",
	// 	// 					reservationDate: currentDate,
	// 	// 					reservationStarts: currentTime,
	// 	// 					observations: customerObservations,
	// 	// 				}
	// 	// 				: table,
	// 	// 		),
	// 	// 	)
	// 	// }
	// 	registerReservation()
	// 	setShowModal(false)
	// 	setSelectedTable(null)
	// 	setCustomerObservations("")
	// 	// window.location.reload()
	// }

	const handleConfirmReservation = () => {
		// CORREÇÃO 3: Lógica de reserva agora usa os filtros de pesquisa
		if (selectedTable) {
			// ... (A lógica de atualização local do estado está obsoleta se você for buscar os dados do backend novamente)
			registerReservation()
		}
		setShowModal(false)
		setSelectedTable(null)
		setCustomerObservations("")
	}

	const handleCancelReservation = () => {
		setShowListModal(false)
		setShowModal(false)
		setSelectedTable(null)
		setCustomerObservations("")
	}

	// CORREÇÃO 4: Lógica de maxSeats e horário deve ser extraída do `map`
	useEffect(() => {
		if (tables.length > 0) {
			const max = Math.max(...tables.map(table => table.seats));
			setMaxSeats(max);
		}
	}, [tables]);

	const handleSearchFilterChange = useCallback((key, value) => {
		// Definir os limites de horário (se eles forem dinâmicos, pegue do estado do restaurante)
		const minTime = filteredTables[0].opensAt;
		const maxTime = filteredTables[0].closesAt;

		console.log('MinTime: ', minTime);
		console.log('MaxTime: ', maxTime);


		if (key === 'starts' || key === 'ends') {
			// 1. Verifique se o valor está dentro do intervalo
			if (value >= minTime && value <= maxTime) {
				// Se for válido, atualize o estado
				setSearchFilters(prevFilters => ({
					...prevFilters,
					[key]: value
				}));
			} else if (value === '') {
				// Permite limpar o campo
				setSearchFilters(prevFilters => ({
					...prevFilters,
					[key]: ''
				}));
			}
			// 2. Se for inválido, não atualize o estado.
			// O valor do input voltará ao último estado válido.
		} else {
			// Lógica para outros campos de pesquisa
			setSearchFilters(prevFilters => ({
				...prevFilters,
				[key]: value
			}));
		}
	}, [filteredTables])

	const clearFilters = () => {
		setSearchFilters({
			date: "",
			starts: "",
			ends: "",
			guests: "",
		})
	}

	const getTables = useCallback(async () => {
		try {
			const response = await api.get('/restaurant/get-tables')

			if (!response) { return 'Erro ao acessar mesas no banco.' }

			console.log('Mesas Carregadas: ', response.data.formattedTables);

			setTables(response.data.formattedTables)

		} catch (error) {
			console.error('Erro ao acessar menus no banco.', error);
			alert('Erro ao acessar menus no banco.')
		}
	}, [])

	useEffect(() => {
		const role = localStorage.getItem('role')
		console.log('Role:', role)

		getTables()

	}, [restaurantId, getTables])

	return (
		<div className="tables-restaurant-container">
			<div className="tables-header">
				<h1 className="tables-title">Preencha todos os campos para realizar a reserva!</h1>
				<div className="tables-filter-buttons">
					<button
						className={`tables-filter-btn ${activeFilter === "All" ? "active" : ""}`}
						onClick={() => setActiveFilter("All")}
					>
						Todos
					</button>
					{searchFilters.date !== '' && searchFilters.starts !== '' && searchFilters.ends !== '' &&
						<>
							<button
								className={`tables-filter-btn ${activeFilter === "Not-Available" ? "active" : ""}`}
								onClick={() => setActiveFilter("Not-Available")}
							>
								Reservado
							</button>
							<button
								className={`tables-filter-btn ${activeFilter === "Available" ? "active" : ""}`}
								onClick={() => setActiveFilter("Available")}
							>
								Disponível
							</button>
						</>
					}
				</div>
			</div>

			{/* Filtros de Pesquisa */}
			<div className="tables-search-filters">
				<div className="tables-search-row">
					{localStorage.getItem('role') === 'restaurant' &&
						<div className="tables-search-field">
							<label>E-mail:</label>
							<input
								type="email"
								placeholder="my_customer@email.com"
							/>
						</div>
					}
					<div className="tables-search-field">
						<label>Data:</label>
						<input
							type="date"
							value={searchFilters.date}
							onChange={(e) => handleSearchFilterChange("date", e.target.value)}
						/>
					</div>
					<div className="tables-search-field">
						<label>Horário de Início:</label>
						<input
							type="time"
							value={searchFilters.starts}
							onChange={(e) => handleSearchFilterChange("starts", e.target.value)}
						/>
					</div>
					<div className="tables-search-field">
						<label>Horário de Término:</label>
						<input
							type="time"
							value={searchFilters.ends}
							onChange={(e) => handleSearchFilterChange("ends", e.target.value)}
						/>
					</div>
					<div className="tables-search-field">
						<label>Convidados:</label>
						<input
							type="number"
							value={searchFilters.guests}
							onChange={(e) => handleSearchFilterChange("guests", e.target.value)}
							placeholder="Número de Convidados"
						/>
					</div>
					<button className="tables-clear-filters-btn" onClick={clearFilters}>
						Limpar Filtros
					</button>
				</div>
			</div>

			{/* <div className="tables-results-info">
				<span>Mostrando {filteredTables.length} mesa(s)</span>
			</div> */}

			<div className="tables-tables-grid">
				{filteredTables.map((table) => {
					const isReserved = table.reservations.some(
						(res) =>
							searchFilters.starts === '' || searchFilters.ends === '' 
							?
								(res.reservationDate?.split("T")[0] === searchFilters.date)
							:
								(res.reservationDate?.split("T")[0] === searchFilters.date) && 
								((res.reservationStarts >=  searchFilters.starts && res.reservationStarts <= searchFilters.ends) || 
								(res.reservationEnds >=  searchFilters.starts && res.reservationEnds <=  searchFilters.ends))

					)

					if (maxSeats < table.seats) { setMaxSeats(table.seats); }

					return (
						<>
							{table.restaurantId === restaurantId &&
								(searchFilters.guests === '' ? true : (table.seats >= searchFilters.guests && (searchFilters.guests <= parseInt(maxSeats)))) &&
								<>
									{(index += 1) &&
										< div
											key={table.id}
											className="tables-table-card"
										>
											<div className="tables-table-body"
												onClick={() => !isReserved && searchFilters.starts !== '' && searchFilters.ends !== '' && searchFilters.date !== '' && searchFilters.guests <= table.seats ? handleTableClick(table) : Swal.fire("Mesa já reservada ou data e hora não fornecidos")}
											>
												<div className="tables-table-header">
													<span className="tables-table-name">Mesa {table.codeID}</span>
													<span className={`tables-status-badge ${isReserved ? "Not-Available" : "Available"}`}>
														{isReserved ? "Reservada" : "Disponível"}
													</span>
												</div>

												<div className={`tables-avatar ${isReserved ? "Not-Available" : "Available"}`} >{isReserved ? "Res" : "Dis"}</div>

												<div className="tables-table-info">
													<div className="tables-seats-info">Lugares: {table.seats}</div>
													<div className="tables-restaurant-info">{table.restaurant} <br /> {table.codeID}</div>
												</div>
											</div>
											{isReserved && (
												<>
													{
														table.reservations.length > 1 ?
															<div className="tables-reservation-info">
																<div className="tables-reservation-item-info">
																	<button
																		onClick={() => handleTableList(table)}
																	>Vizualizar lista de reservas</button>
																</div>
															</div>
															: <div className="tables-reservation-info">
																{table.reservations
																	.filter((res) =>
																		(res.reservationDate?.split("T")[0] === searchFilters.date)
																	)
																	.map((res, i) => (
																		<div key={i} className="tables-reservation-item">
																			<div className="tables-reservation-item-info">
																				<div className="tables-reservation-date">
																					{new Date(res.reservationDate.split('T')[0] + 'T00:00:00').toLocaleDateString("pt-BR")}
																					<div className="tables-reservation-time">{res.reservationStarts} - {res.reservationEnds}</div>
																				</div>
																				{res.customerName && res.customerName === clientInfo.name && (
																					<div className="tables-customer-name">{res.customerName}</div>
																				)}
																			</div>
																		</div>
																	))
																}
															</div>
													}
												</>
											)}
										</div>
									}
								</>
							}
						</>
					)
				})}
			</div>

			{
				showListModal && (
					<div className="tables-modal-overlay">
						<div className="tables-modal">
							<h2>Lista de Reservas da Mesa</h2>
							{selectedTable?.reservations.map(
								(res) => (
									<div className="tables-modal-info">
										<p>
											<strong>Data:</strong> {new Date(res.reservationDate).toLocaleDateString("pt-BR")}
										</p>
										{/* <p>
											<strong>Hora:</strong> {res.reservationStarts}
										</p> */}
										<p>
											<strong>Cliente:</strong> {res.customerName}
										</p>
									</div>

								)
							)}

							<div className="tables-modal-buttons">
								<button className="tables-btn-cancel" onClick={handleCancelReservation}>
									Fechar
								</button>
							</div>
						</div>
					</div>
				)
			}

			{
				showModal && (
					<div className="tables-modal-overlay">
						<div className="tables-modal">
							<h2>Confirmar Reserva</h2>
							<p>Deseja confirmar a reserva da mesa?</p>
							<div className="tables-modal-info">
								<p>
									<strong>Restaurante:</strong> {selectedTable?.restaurant}
								</p>
								<p>
									<strong>Lugares disponíveis:</strong> {selectedTable?.seats}
								</p>
								<p>
									<strong>Quantidade de convidados:</strong> {searchFilters.guests}
								</p>
								{/* <p>
									<strong>Das:</strong> {searchFilters.starts}
								</p>
								<p>
									<strong>Até:</strong> {searchFilters.starts}
								</p> */}
								<p>
									<strong>ID da mesa:</strong> {selectedTable?.codeID}
								</p>
								{selectedTable?.status === "reservada" && (
									<>
										<p>
											<strong>Data:</strong> {selectedTable?.reservationDate}
										</p>
										<p>
											<strong>Horário:</strong> {selectedTable?.reservationStarts}
										</p>
										{selectedTable?.customerName && (
											<p>
												<strong>Cliente:</strong> {selectedTable?.customerName}
											</p>
										)}
									</>
								)}
							</div>

							<div className="tables-observations-field">
								<label htmlFor="observations">Observações do Cliente:</label>
								<textarea
									id="observations"
									value={customerObservations}
									onChange={(e) => setCustomerObservations(e.target.value)}
									placeholder="Digite observações especiais, preferências alimentares, ocasião especial, etc..."
									rows="4"
								/>
							</div>

							<div className="tables-modal-buttons">
								<button className="tables-btn-cancel" onClick={handleCancelReservation}>
									Cancelar
								</button>
								<button className="tables-btn-confirm" onClick={handleConfirmReservation}>
									Confirmar Reserva
								</button>
							</div>
						</div>
					</div>
				)
			}
		</div >
	)
}

export default RestaurantTables
