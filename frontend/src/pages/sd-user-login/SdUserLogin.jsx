
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../service/api';

export default function SdUserLogin() {
    const emailRef = useRef();
    const passwordRef = useRef();

    async function loginUser() {
        try {
            const res = await api.post("/sd-user/login", {
                email: emailRef.current.value,
                password: passwordRef.current.value
            });

            const token = res.data.token
            localStorage.setItem("token", token)
            console.log("Token armazenado:", token);
            // window.location.href = "/sd-user-profile/me";
            
        } catch (error) {
            console.error("Erro ao fazer login:", error.response ? error.response.data : error.message); 
        }
    }

    const handleLogin = (event) => {
        event.preventDefault();
        loginUser();
    }

    return(
        <div className="sd-user-login">
            <h2>Login como Usuário SD</h2>
            <Link to="/sd-user-register">Criar conta</Link>
            <form onSubmit={handleLogin}>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" ref={emailRef} required />
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input type="password" id="password" name="password" ref={passwordRef} required />
                </div>
                <button type="submit">Entrar</button>
            </form>
                <Link to="/sd-user-profile/me">Perfil</Link>
        </div>
    )
}