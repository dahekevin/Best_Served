import { useEffect, useState } from "react";
import api from "../../service/api";

function ProfileTeste() {
	const [user, setUser] = useState(null);
	const [form, setForm] = useState({ name: "", email: "", telefone: "", password: "" });

	const fetchUser = async () => {
		const token = localStorage.getItem("token");
		console.log("Token enviado:", token);

		try {
			console.log("Buscando dados do usuário com token:", token);
			
			const response = await api.get("/sd-user/get-one", {
				headers: { Authorization: `Bearer ${token}` }
			});
			console.log("Dados do usuário:", response.data);
			setUser(response.data);
			setForm({ ...response.data, password: "" });
		} catch (error) {
			console.error("Erro ao buscar perfil:", error.response?.data || error.message || error);
		}
	};

	useEffect(() => {
		fetchUser();
	}, []);

	const handleChange = (e) => {
		setForm({ ...form, [e.target.name]: e.target.value });
	};

	const handleUpdate = async (e) => {
		e.preventDefault();
		const token = localStorage.getItem("token");

		try {
			await api.put("/sd-user/edit", form, {
				headers: { Authorization: `Bearer ${token}` }
			});
			alert("Dados atualizados com sucesso");
		} catch (err) {
			console.error("Erro ao atualizar dados:", err.response?.data || err.message || err);
			alert("Erro ao atualizar dados");
		}
	};

	console.log(user);
	

	if (!user) return <p>Carregando...</p>;

	return (
		<form onSubmit={handleUpdate}>
			<input name="name" value={form.name} onChange={handleChange} />
			<input name="email" value={form.email} onChange={handleChange} />
			<input name="phone" value={form.phone || ""} onChange={handleChange} />
			<input name="password" type="password" value={form.password} onChange={handleChange} />
			<button type="submit">Salvar alterações</button>
		</form>
	);
}

export default ProfileTeste;
