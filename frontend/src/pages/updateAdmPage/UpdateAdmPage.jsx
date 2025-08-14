import { useState, useEffect } from "react"
import "./UpdateAdmPage.css"
import api from "../../service/api"

const UpdateAdmProfile = () => {
    const [profile, setProfile] = useState({ name: "", email: "", phone: "", avatar: "", password: "" })
    const [previewImage, setPreviewImage] = useState(profile.avatar)

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setProfile({
            ...profile,
            [name]: value,
        })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setProfile({
                ...profile,
                avatar: file, // salve o arquivo, não uma string
            })

            const reader = new FileReader()
            reader.onloadend = () => {
                setPreviewImage(reader.result) // apenas para visualização
            }
            reader.readAsDataURL(file)
        }
    }

    const fetchAdm = async () => {
        const token = localStorage.getItem('token')
        
        try {
            const response = await api.get('/adm/get-one', {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            console.log("Dados do adm: ", response.data);

            const adm = response.data

            setProfile({ ...response.data, password: "" });

            console.log("Adm avatar: ", adm.avatar);

            // Se o adm tiver um avatar salvo, atualiza o previewImage
            if (adm.avatar) {
                setPreviewImage(`http://localhost:3000/uploads/${adm.avatar}`)  // <-- Caminho correto
            }
        } catch (error) {
            console.error("Erro ao buscar perfil:", error.response?.data || error.message || error);
        }
    }

    useEffect(() => {
        console.log("Fetching adm profile...");
        
        fetchAdm();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault()
        // Here you would typically send the updated profile to your backend

        const token = localStorage.getItem('token')

        const formData = new FormData();
        formData.append("name", profile.name)
        formData.append("email", profile.email)
        formData.append("phone", profile.phone)
        formData.append("password", profile.password)     
        
        if (profile.avatar instanceof File) {
            formData.append("admin-avatar", profile.avatar)
        }

        try {
            await api.patch('/admin/update', formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"
                }
            });			

            alert("Perfil atualizado com sucesso!")
        } catch (error) {
            console.error("Erro ao buscar perfil:", error.response?.data || error.message || error);
        }

        console.log("Updated profile:", profile)
    }

    return (
        <div className="adm-profile-container">
            <form onSubmit={handleSubmit}>
                <h1 className="adm-profile-title">Atualizar Perfil</h1>
                <div className="adm-profile-layout">
                    <div className="adm-profile-image-section">
                        <div className="adm-profile-image-container">
                            <img src={previewImage} alt=" " className="adm-profile-image" />
                        </div>
                        <label htmlFor="adm-image-upload" className="adm-change-image-button">
                            Alterar imagem
                        </label>
                        <input
                            id="adm-image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            style={{ display: "none" }}
                        />
                    </div>

                    <div className="adm-profile-details">
                        <div className="adm-form-group">
                            <label htmlFor="adm-name">Nome completo</label>
                            <input
                                type="text"
                                id="adm-name"
                                name="name"
                                value={profile.name}
                                onChange={handleInputChange}
                                className="adm-form-input"
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="adm-email">E-mail</label>
                            <input
                                type="email"
                                id="adm-email"
                                name="email"
                                value={profile.email}
                                onChange={handleInputChange}
                                className="adm-form-input"
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="adm-phone">Telefone</label>
                            <input
                                type="tel"
                                id="adm-phone"
                                name="phone"
                                value={profile.phone}
                                onChange={handleInputChange}
                                className="adm-form-input"
                            />
                        </div>

                        <div className="adm-form-group">
                            <label htmlFor="adm-password">Senha</label>
                            <input
                                type="password"
                                id="adm-password"
                                name="password"
                                value={profile.password}
                                onChange={handleInputChange}
                                className="adm-form-input"
                            />
                        </div>

                        <div className="adm-form-actions">
                            <button type="submit" className="adm-save-button">
                                Salvar Alterações
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
}

export default UpdateAdmProfile
