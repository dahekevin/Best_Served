import './Home.css'

export default function Home() {

    return (
        <>
            <div className='home-hero'>
                <div className='home-img'>
                    <h1>
                        Encontre o melhor lugar para você
                    </h1>
                    <p className='home-subtitle'>Aqui no Best Served</p>
                </div>
            </div>
            <div className='home-description'>
                <div className='home-line1'>
                    <p className='home-p1'>Com uma variedade de restaurantes, servimos todas as refeições, incluindo café da manhã.</p>
                    <img className='home-img1' src="./back1.png" alt="" />
                </div>
                <div className='home-line1'>
                    <img className='home-img1' src="./background.jpg" alt="" />
                    <p className='home-p1'>O atendimento ao cliente vem em primeiro lugar. <br /><br /> Chefs renomados dos restaurantes mais influentes de Sobral.</p>
                </div>
                <div>
                    <p className='home-p1'>Descubra nossos restaurantes agora e aproveite o melhor que temos a oferecer.</p>
                    <div className='home-img2'></div>
                </div>
            </div>
        </>
    )
}