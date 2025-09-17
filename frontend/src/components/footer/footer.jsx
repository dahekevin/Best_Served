import './Footer.css'
import { SlSocialInstagram } from "react-icons/sl";
import { FaLinkedin } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <>
            <footer className='footer'>
                <div className='footerElements'>
                    <img className='logoFooter' src="./logo2.png" alt="" />
                    <div className='footerRestaurant'>
                        <div className='footerDescription'>
                            <h2>Você tem um restaurante?</h2>
                            <Link className='link' to={'/plans'}>Venha fazer parte!</Link>
                        </div>
                    </div>
                    <div className='footerRestaurant'>
                        <div className='footerDescription'>
                            <h2>Já é um dos nossos?</h2>
                            <Link className='link' to={'/login'}>Acesse sua conta!</Link>
                        </div>
                    </div>
                    <div className='footerFollowus'>
                        <h2>Siga nossas redes sociais</h2>
                        <div className='socials'>
                            <Link to={'https://www.instagram.com/dahe_kevin/'} target='_blank' >
                                <SlSocialInstagram className='socialIcons' />
                            </Link>
                            <Link to={'https://github.com/dahekevin'} target='_blank' >
                                <FaGithub className='socialIcons' />
                            </Link>
                            <Link to={'https://www.linkedin.com/in/dahe-kevin-591a06278/'} target='_blank' >
                                <FaLinkedin className='socialIcons' />
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='footerCopyRight'>
                    <p>© Copyright Best Served. Todos os direitos reservados.
                        Desenvolvido por Dev Squad.</p>
                </div>
            </footer>
        </>
    )
}