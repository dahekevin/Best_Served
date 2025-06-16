import './navbar.css'
import { LuMenu } from "react-icons/lu"
import { Drawer } from "@mui/material"
import { useState } from "react"
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

export default function Navbar() {
    const [userType, setUserType] = useState(null)
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const [openMenu, setOpenMenu] = useState(false)

    useEffect(() => {
        const token = localStorage.getItem('token')
        const role = localStorage.getItem('role')

        if (token) {
            console.log(`Token: ${token}, Role: ${role}`) // Debugging line;

            setIsLoggedIn(true)
            setUserType(role)
        } else {
            setIsLoggedIn(false)
            setUserType(null)
        }
    }, [])

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

                                {userType === 'client' && (
                                    <>
                                        <Link to='/restaurants' className='navbarLink'>Restaurantes</Link>
                                        <Link to='/profile' className='navbarLink'>
                                            <div className='navbarProfileContainer'>
                                                <div className='navbarLinkProfile'></div>
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
                                <Link to='/about' className='navbarLink'>Sobre Nós</Link>
                                <Link to='/sd-user-login' className='navbarLink'>Entrar</Link>
                                <Link to='/sd-user-register' className='navbarRegisterLink'>Cadastrar</Link>
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