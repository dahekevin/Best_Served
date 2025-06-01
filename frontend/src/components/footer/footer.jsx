import './footer.css'
import { SlSocialInstagram } from "react-icons/sl";
import { SlSocialFacebook } from "react-icons/sl";
import { TiSocialTwitter } from "react-icons/ti";

export default function Footer() {
    return (
        <>
            <footer className='footer'>
                <div className='footerElements'>

                    <img className='logoFooter' src="./logo2.png" alt="" />
                    <div className='footerRestaurant'>
                        <div className='footerDescription'>
                            <h1>Você tem um restaurante?</h1>
                            <a className='link' href="">Venha fazer parte!</a>
                        </div>
                    </div>
                    <div className='footerRestaurant'>
                        <div className='footerDescription'>
                            <h1>Já é um dos nossos?</h1>
                            <a className='link' href="">Acesse sua conta!</a>
                        </div>
                    </div>
                    <div className='footerFollowus'>
                        <h1>Siga nossas redes sociais</h1>
                        <div className='socials'>
                            <SlSocialInstagram className='socialIcons' />
                            <SlSocialFacebook className='socialIcons' />
                            <TiSocialTwitter className='socialIcons' />
                        </div>
                    </div>
                </div>
                <hr className='division' />
                <div className='footerCopyRight'>
                    <p>© Copyright Best Served. Todos os direitos reservados.
                        Desenvolvido por DevSquad</p>
                </div>
            </footer>
        </>
    )
}