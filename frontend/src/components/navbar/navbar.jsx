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
                        {/* <Link to={'/'} className='navbarLink'>About us</Link> */}
                        <Link to={'/profile'} className='navbarLink'>Profile</Link>
                        <Link to={'/restaurants'} className='navbarLink'>Restaurants</Link>
                        <Link to={'/'} className='navbarLink'>Login</Link>
                        <Link to={'/'} className='navbarRegisterLink'>Register</Link>
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
                        <a className='navbarLink' href="">About</a>
                        <a className='navbarLink' href="">Profile</a>
                        <a className='navbarLink' href="">Restaurants</a>
                        <a className='navbarLink' href="">Sign Up</a>
                        <a className='navbarSignInLink' href="">Sign In</a>
                    </div>
                </Drawer>
            </nav>
        </>
    )
}