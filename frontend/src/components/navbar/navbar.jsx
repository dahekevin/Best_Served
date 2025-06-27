import './navbar.css'
import { LuMenu } from "react-icons/lu"
import { Drawer } from "@mui/material"
import { useCallback, useState } from "react"
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import api from '../../service/api'

export default function Navbar() {
    const [userType, setUserType] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)
    const [avatar, setAvatar] = useState("")

    const getClientInfo = useCallback(async (token) => {
        try {
            const response = await api.get('/client/get-one', {
                headers: { Authorization: `Bearer ${token}` }
            })

            setAvatar(`http://localhost:3000/uploads/client/avatars/${response.data.avatar}`)

        } catch (error) {
            console.error("Erro ao buscar informações do usuário: ", error.response?.data || error.message || error);
        }
    }, [])

    const getRestaurantInfo = useCallback(async (token) => {
        try {
            const response = await api.get('/restaurant/get-one', {
                headers: { Authorization: `Bearer ${token}` }
            })

            setAvatar(`http://localhost:3000/uploads/restaurant/avatars/${response.data.avatar}`)

        } catch (error) {
            console.error("Erro ao buscar informações do usuário: ", error.response?.data || error.message || error);
        }
    }, [])

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')

        if (token) {
            console.log(`Token: ${token}, Role: ${role}`) // Debugging line;

            if (role === 'client') {
                getClientInfo(token)
            } else if (role === 'restaurant') {
                getRestaurantInfo(token)
            }

            setIsLoggedIn(true)
            setUserType(role)
        } else {
            setIsLoggedIn(false)
            setUserType(null)
        }
    }, [getClientInfo, getRestaurantInfo])

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    return (
        <>
            <nav className='navbarContainer enhanced-navbar'>
                <div className='navbarItems'>
                    <Link to="/">
                        <img className='logo' src="./logo.png" alt="logo" />
                    </Link>
                    <div className='navbarLinksContainer'>
                        {isLoggedIn ? (
                            <>
                                <Link to='/restaurants' className='navbarLink'>Restaurantes</Link>
                                
                                {userType === 'client' && (
                                    <>
                                        <Link to='/client-profile' className='navbarLink'>
                                            <div className='navbarProfileContainer'>
                                                <div className='navbarLinkProfile'>
                                                    {avatar && <img className='navbarAvatar' src={avatar} />}
                                                </div>
                                                <span>Perfil</span>
                                            </div>
                                        </Link>
                                    </>
                                )}

                                {userType === 'restaurant' && (
                                    <>
                                        <Link to='/restaurant-profile' className='navbarLink'>Painel do Restaurante</Link>
                                    </>
                                )}

                                <Link to='/' onClick={() => {
                                    localStorage.clear();
                                    window.location.href = "/";
                                }} className='navbarLinkLogout'>Sair</Link>
                            </>
                        ) : (
                            <>
                                <Link to='/' className='navbarLink'>Sobre Nós</Link>
                                <Link to='/restaurants' className='navbarLink'>Restaurantes</Link>
                                <Link to='/login' className='navbarLink'>Entrar</Link>
                                <Link to='/client-registration' className='navbarRegisterLink'>Cadastrar</Link>
                            </>
                        )}
                    </div>
                </div>

                <div className='mobileNavbarItems'>
                    <img className='logo' src="./logo.png" alt="" />
                    <div className='mobileNabarBtns'>
                        <LuMenu onClick={handleOpenMenu} className='navbarLink' />
                    </div>
                </div>

                <Drawer
                    anchor='right'
                    open={openMenu}
                    onClose={handleOpenMenu}
                >
                    <div className='drawer'>
                        <a className='navbarLink' href="">Sobre</a>
                        <a className='navbarLink' href="">Perfil</a>
                        <a className='navbarLink' href="">Restaurantes</a>
                        <a className='navbarLink' href="">Cadastrar</a>
                        <a className='navbarSignInLink' href="">Entrar</a>
                    </div>
                </Drawer>
            </nav>
        </>
    )
}