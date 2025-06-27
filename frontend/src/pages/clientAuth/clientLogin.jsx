import { useState } from 'react';
import { Link } from 'react-router-dom';
import { TextField, Button } from '@mui/material'
import api from '../../service/api';
import './clientAuth.css';

export default function ClientLogin() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function loginUser() {
        try {
            const response = await api.post('/login', { email, password })

            console.log("Resposta completa do login: ", response.data);

            const user = response.data.user;

            if (user && user.type) {
                localStorage.setItem('role', user.type)
                console.log('Tipo de usuárioo: ', user.type);
            } else {
                console.warn('Tipo de usuário não definido.');
            }

            const token = response.data.token

            localStorage.setItem('token', token)  // <--- ESSENTIAL

            console.log('Token armazenado response.data.token: ', token);

            if (user.type === 'client') {
                window.location.href = '/client-profile'
            } else if (user.type === 'restaurant') {
                window.location.href = '/restaurant-profile'
            }

            alert('Seja bem vindo ao nosso sistema!')

        } catch (error) {
            console.error("Erro ao fazer login:", error.response ? error.response.data : error.message);
            alert("Erro ao fazer login. Verifique suas credenciais e tente novamente.");
        }
    }

    const handleLogin = (event) => {
        event.preventDefault();
        // A if structure to ensure the user is not logged in already

        console.log("Email a ser enviado (frontend):", email);
        console.log("Password a ser enviado (frontend):", password);

        if (!localStorage.getItem("token")) {
            loginUser();
        } else {
            alert("Você já está logado!");
        }
    }

    return (
        <>
            <div className='client-auth-container'>
                <div className="client-auth">
                    <h1>Best Served</h1>
                    <h2>Seja bem vindo!</h2>
                    <p></p>
                    <p>Faça login e acesse sua conta!</p>
                    <form className='client-auth-form' onSubmit={handleLogin}>
                        <TextField className='client-textField' value={email} required name="Email" label="E-mail" type="email" onChange={(e) => { setEmail(e.target.value) }} />
                        <TextField className='client-textField' value={password} required name="Password" label="Senha" type="password" onChange={(e) => { setPassword(e.target.value) }} />
                        <Button className='client-button' type="submit">Entrar</Button>
                    </form>
                    <Link className='client-auth-link' to="/client-registration">Não tem uma conta? Cadastre-se</Link>
                </div>
            </div>
        </>
    )
}