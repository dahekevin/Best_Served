import './Home.css'

export default function Home() {

    return (
        <>
            <div className='hero'>
                <div className='img'>
                    <h1>
                        Find the best place for you
                    </h1>
                    <p className='subtitle'>Here on the Best Served</p>
                </div>
            </div>
            <div className='description'>
                <div className='line1'>
                    <p className='p1'>With a variety of restaurants, we serve all meals including breakfast.</p>
                    <img className='img1' src="./back1.png" alt="" />
                </div>
                <div className='line1'>
                    <img className='img1' src="./background.jpg" alt="" />
                    <p className='p1'>Customer service comes first. <br /><br /> Top-notch chefs from Sobral's most influential restaurants.</p>
                </div>
                <div>
                    <p className='p1'>Discover our restaurants now and enjoy the best we have to offer.</p>
                    <div className='img2'></div>
                </div>
            </div>
        </>
    )
}