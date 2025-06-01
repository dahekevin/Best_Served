import { useState } from "react"

export default function AuthServices() {
    const [authLoading, setAuthLoading] = useState(false)

    const url = 'http://localhost:3000'

    
    const login = () => {
        const newUser = {
            name: 'Paula',
            email: 'paula@email.com'
        }
        setAuthLoading(true)

        fetch(`http://localhost:3000/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(newUser)
        })
        .then((res) => {
            res.json()
        })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    const signup = (formData) => {
        setAuthLoading(true)

        fetch(`${url}/user/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        })
        .then((res) => {
            res.json()
        })
        .then((result) => {
            console.log(result);
        })
        .catch((error) => {
            console.log(error);
        })
        .finally(() => {
            setAuthLoading(false)
        })
    }

    return { login, signup, authLoading }    
}