import { useState } from "react";
import { Link } from "react-router-dom";
import { TextField, Button } from '@mui/material'
import api from "../../service/api";
import './SdUserAuth.css';

export default function SdUserRegister() {

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function registerUser(event) {
        event.preventDefault(); // Evita o recarregamento da página
        console.log("Registrando usuário com os seguintes dados:");
        console.log("Nome:", name);
        console.log("Telefone:", phone);
        console.log("E-mail:", email);

        try {
            await api.post("/sd-user/register", {
                name,
                phone,
                email,
                password,
            });

            alert("Usuário registrado com sucesso!");
            // Redirecionar para login se quiser:
            window.location.href = "/sd-user-login";

        } catch (error) {
            console.error("Erro ao registrar usuário:", error.response?.data || error.message);
            alert("Erro ao registrar usuário!");
        }
    }


    return (
        <div className='sd-user-auth-container'>
            <div className="sd-user-auth">
                <h1>Best Served</h1>
                <h2>Crie sua conta</h2>
                <p>* Usuário (Cliente) *</p>
                <form className='sd-user-auth-form' onSubmit={registerUser}>
                    <TextField className='sd-user-textField' required name="Name" label="Nome" type="text" onChange={(e) => { setName(e.target.value) }} />
                    <TextField className='sd-user-textField' required name="Phone" label="Telefone" type="tel" onChange={(e) => { setPhone(e.target.value) }} />
                    <TextField className='sd-user-textField' required name="Email" label="E-mail" type="email" onChange={(e) => { setEmail(e.target.value) }} />
                    <TextField className='sd-user-textField' required name="Password" label="Senha" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                    <Button className='sd-user-button' type="submit">Cadastrar</Button>
                </form>
                <Link className='sd-user-auth-link' to="/sd-user-login">Já tem uma conta? Faça login</Link>
            </div>
        </div>
    );
}
