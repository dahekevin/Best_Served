import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material'
import api from '../../service/api';
import './SdUserAuth.css';

export default function SdUserLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function loginUser() {
        try {
            const res = await api.post("/sd-user/login", {
                email,
                password
            });

            console.log("Resposta completa do login:", res.data);

            const user = res.data.user;

            if (user && user.type) {
                localStorage.setItem("role", user.type);
                console.log("Tipo de usuario: ", user.type);
            } else {
                console.warn("Tipo de usuário não definido.");
            }

            const token = res.data.token
            localStorage.setItem("token", token)
            console.log("Token armazenado:", token);
            console.log("Tipo de usuario: ", res.data.user.type);

            window.location.href = "/profile"; // Redireciona para a página de perfil após o login bem-sucedido

        } catch (error) {
            console.error("Erro ao fazer login:", error.response ? error.response.data : error.message);
        }
    }

    const handleLogin = (event) => {
        event.preventDefault();
        loginUser();
    }

    return (
        <>
            <div className='sd-user-auth-container'>
                <div className="sd-user-auth">
                    <h1>Best Served</h1>
                    <h2>Seja bem vindo!</h2>
                    <p></p>
                    <p>Faça login e acesse sua conta!</p>
                    <form className='sd-user-auth-form' onSubmit={handleLogin}>
                        <TextField className='sd-user-textField' required name="Email" label="E-mail" type="email" onChange={(e) => { setEmail(e.target.value) }} />
                        {/* <TextField className='sd-user-textField' required name="CNPJ" label="CNPJ" type="text" onChange={handleFormDataChange} /> */}
                        <TextField className='sd-user-textField' required name="Password" label="Senha" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                        <Button className='sd-user-button' type="submit">Entrar</Button>
                    </form>
                    <Link className='sd-user-auth-link' to="/sd-user-register">Não tem uma conta? Cadastre-se</Link>
                </div>
            </div>
        </>
    )
}