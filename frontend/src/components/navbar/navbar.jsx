import './navbar.css'
import { LuMenu } from "react-icons/lu"
import { Drawer } from "@mui/material"
import { useState } from "react"
import { Link } from 'react-router-dom'

export default function Navbar() {
    const [openMenu, setOpenMenu] = useState(false)

    const handleOpenMenu = () => {
        setOpenMenu(!openMenu)
    }

    return (
        <>
            <nav className='navbarContainer'>
                <div className='navbarItems'>
                    <Link>
                        <img className='logo' src="./logo.png" alt="logo" />
                    </Link>
                    <div className='navbarLinksContainer'>
                        {/* <Link to={'/'} className='navbarLink'>Sobre nós</Link> */}
                        <Link to={'/profile'} className='navbarLink'>Perfil</Link>
                        <Link to={'/restaurants'} className='navbarLink'>Restaurantes</Link>
                        <Link to={'/'} className='navbarLink'>Entrar</Link>
                        <Link to={'/'} className='navbarRegisterLink'>Cadastrar</Link>
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