import { useState } from "react"

export default function AuthServices() {
    const [authLoading, setAuthLoading] = useState(false)

    const url = 'http://localhost:3000'

    const login = (formData) => {
        setAuthLoading(true)

        fetch(`${url}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(formData)
        })
        .then((response) => response.json())
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

    return { login, authLoading }    
}