import './footer.css'
import { SlSocialInstagram } from "react-icons/sl";
import { SlSocialFacebook } from "react-icons/sl";
import { TiSocialTwitter } from "react-icons/ti";
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
                            <Link className='link' to={'/register-restaurant'}>Venha fazer parte!</Link>
                        </div>
                    </div>
                    <div className='footerRestaurant'>
                        <div className='footerDescription'>
                            <h2>Já é um dos nossos?</h2>
                            <Link className='link' to={'/sd-user-login'}>Acesse sua conta!</Link>
                        </div>
                    </div>
                    <div className='footerFollowus'>
                        <h2>Siga nossas redes sociais</h2>
                        <div className='socials'>
                            <SlSocialInstagram className='socialIcons' />
                            <SlSocialFacebook className='socialIcons' />
                            <TiSocialTwitter className='socialIcons' />
                        </div>
                    </div>
                </div>
                <div className='footerCopyRight'>
                    <p>© Copyright Best Served. Todos os direitos reservados.
                        Desenvolvido por DevSquad</p>
                </div>
            </footer>
        </>
    )
}