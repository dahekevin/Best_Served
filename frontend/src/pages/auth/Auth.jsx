import './Auth.css'
import { useState } from "react"
import { TextField, Button } from '@mui/material'

export default function Auth() {
    const [formType, setFormType] = useState('login')
    const [formData, setFormData] = useState(null)

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
        console.log(formData)
    }

    if (formType === 'login') {
        return (
            <div className="authPageContainer">
                <h1>Access your account</h1>
                <form onSubmit={handleSubmitForm}>
                    <TextField className='textField' required name="Email" label="E-mail" type="email" onChange={handleFormDataChange} />
                    {/* <TextField className='textField' required name="CNPJ" label="CNPJ" type="text" onChange={handleFormDataChange} /> */}
                    <TextField className='textField' required name="Password" label="Password" type="password" onChange={handleFormDataChange} />
                </form>
                <Button onClick={handleChangeFormType} className='button' type="submit">Login</Button>
            </div>
        )
    }

    if (formType === 'signup') {
        return (
            <div className="authPageContainer">
                <h1>Create your account</h1>
                <form>
                    <TextField className='textField' required name="Name" label="Name" type="text" />
                    <TextField className='textField' required name="Email" label="E-mail" type="email" />
                    <TextField className='textField' required name="Password" label="Password" type="password" />
                </form>
                <Button className='button' type="submit">Register</Button>
            </div>
        )
    }
}