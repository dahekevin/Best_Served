import './Home.css'

export default function Home() {

    return (
        <>
            <div className='home-hero'>
                    <h1>Encontre o melhor lugar para você</h1>
                    <p className='home-subtitle'>Aqui no Best Served</p>
            </div>
            <div className='home-description'>
                <div className='home-line'>
                    <p className='home-p'>Com uma variedade de restaurantes, servimos todas as refeições, incluindo café da manhã.</p>
                    <img className='home-img' src="./back1.png" alt="" />
                </div>
                <div className='home-line'>
                    <img className='home-img' src="./background.jpg" alt="" />
                    <p className='home-p'>O atendimento ao cliente vem em primeiro lugar. <br /> Chefs renomados dos restaurantes mais influentes de Sobral.</p>
                </div>
                <div>
                    <p className='home-p2'>Descubra nossos restaurantes agora e aproveite o melhor que temos a oferecer.</p>
                    <div className='home-img2'></div>
                </div>
            </div>
        </>
    )
}