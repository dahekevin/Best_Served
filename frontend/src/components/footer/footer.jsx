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
                            <h1>Do you have a restaurant?</h1>
                            <a className='link' href="">Come join us!</a>
                        </div>
                    </div>
                    <div className='footerFollowus'>
                        <h1>Follow Our Socials</h1>
                        <div className='socials'>
                            <SlSocialInstagram className='socialIcons' />
                            <SlSocialFacebook className='socialIcons' />
                            <TiSocialTwitter className='socialIcons' />
                        </div>
                    </div>
                </div>
                <hr className='division' />
                <div className='footerCopyRight'>
                    <p>© Copyright Best Served. All Rights Reserved
                        Designed by DevSquad</p>
                </div>
            </footer>
        </>
    )
}