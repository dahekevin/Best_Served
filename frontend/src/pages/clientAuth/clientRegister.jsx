import { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button } from '@mui/material'
import api from "../../service/api";
import './clientAuth.css';

export default function ClientRegister() {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function registerClient(event) {
        event.preventDefault(); // Evita o recarregamento da página
        console.log("Registrando usuário com os seguintes dados:");
        console.log("Nome:", name);
        console.log("Telefone:", phone);
        console.log("E-mail:", email);

        try {
            await api.post("/client/register", {
                name,
                phone,
                email,
                password,
            });

            alert("Usuário registrado com sucesso!");
            // Redirecionar para login se quiser:
            window.location.href = "/login";

        } catch (error) {
            console.error("Erro ao registrar usuário:", error.response?.data || error.message);
            if (error.response) {
				console.log("Erro do servidor:", error.response.data)
				alert(`Erro: ${error.response.data.message || "Erro ao criar cliente"}`)
			}
        }
    }


    return (
        <div className='client-auth-container'>
            <div className="client-auth">
                <h1>Best Served</h1>
                <h2>Crie sua conta</h2>
                <p>* Usuário (Cliente) *</p>
                <form className='client-auth-form' onSubmit={registerClient}>
                    <TextField className='client-textField' value={name} required name="Name" label="Nome" type="text" onChange={(e) => { setName(e.target.value) }} />
                    <TextField className='client-textField' value={phone} required name="Phone" label="Telefone" type="tel" onChange={(e) => { setPhone(e.target.value) }} />
                    <TextField className='client-textField' value={email} required name="Email" label="E-mail" type="email" onChange={(e) => { setEmail(e.target.value) }} />
                    <TextField className='client-textField' value={password} required name="Password" label="Senha" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                    <Button className='client-button' type="submit">Cadastrar</Button>
                </form>
                <Link className='client-auth-link' to="/login">Já tem uma conta? Faça login</Link>
            </div>
        </div>
    );
}
