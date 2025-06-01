import './Auth.css'
import { useState } from "react"
import { TextField, Button } from '@mui/material'
import AuthServices from '../../service/Service.jsx'

export default function Auth() {
    const [formType, setFormType] = useState('login')
    const [formData, setFormData] = useState(null)
    const { login, signup } = AuthServices()

    const handleChangeFormType = () => {
        if (formType === 'login') {
            setFormType('signup')
        } else {
            setFormType('login')
        }
    }

    const handleFormDataChange = (e) => {
        setFormData({
            ...formData,
            [e.target.value]: e.target.value
        })
    }

    const handleSubmitForm = (e) => {
        e.preventDefault()
        
        switch (formType) {
            case 'login':
                login(formData);
                break;
            case 'signup':
                signup(formData);
                break;
            default:
                break;
        }
    }

    if (formType === 'login') {
        return (
            <div className="authPageContainer">
                <h1>Access your account</h1>
                <button onClick={handleChangeFormType}>Don't you have an account? Sign up</button>
                <form onSubmit={handleSubmitForm}>
                    <TextField className='textField' required name="Email" label="E-mail" type="email" onChange={handleFormDataChange} />
                    {/* <TextField className='textField' required name="CNPJ" label="CNPJ" type="text" onChange={handleFormDataChange} /> */}
                    <TextField className='textField' required name="Password" label="Password" type="password" onChange={handleFormDataChange} />
                    <Button className='button' type="submit">Login</Button>
                </form>
            </div>
        )
    }

    if (formType === 'signup') {
        return (
            <div className="authPageContainer">
                <h1>Create your account</h1>
                <button onClick={handleChangeFormType}>Already have an account? Login</button>
                <form onSubmit={handleSubmitForm}>
                    <TextField onChange={handleFormDataChange} className='textField' required name="Name" label="Name" type="text" />
                    <TextField onChange={handleFormDataChange} className='textField' required name="Phone" label="Telefone" type="tel" />
                    <TextField onChange={handleFormDataChange} className='textField' required name="Email" label="E-mail" type="email" />
                    <TextField onChange={handleFormDataChange} className='textField' required name="Password" label="Password" type="password" />
                    <Button classN ame='button' type="submit">Register</Button>
                </form>
            </div>
        )
    }
}