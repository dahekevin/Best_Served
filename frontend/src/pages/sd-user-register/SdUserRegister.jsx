
import { useRef } from "react";
import api from "../../service/api";
import { Link } from "react-router-dom";

export default function SdUserRegister() {
    const nameRef = useRef();
    const phoneRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    async function registerUser() {
        await api.post("/sd-user/register", {
            name: nameRef.current.value,
            phone: phoneRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        });
    }

    return (
        <div className="sd-user-register">
            <h2>Registrar Usuário SD</h2>
            <Link to="/sd-user-login">Já tem uma conta? Faça login</Link>
            <form onSubmit={registerUser}>
                <div>
                    <label htmlFor="name">Nome:</label>
                    <input type="text" id="name" name="name" ref={nameRef} required />
                </div>
                <div>
                    <label htmlFor="phone">Telefone:</label>
                    <input type="text" id="phone" name="phone" ref={phoneRef} required />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input type="email" id="email" name="email" ref={emailRef} required />
                </div>
                <div>
                    <label htmlFor="password">Senha:</label>
                    <input type="password" id="password" name="password" ref={passwordRef} required />
                </div>
                <button type="submit">Registrar</button>
            </form>
        </div>
    );
}
