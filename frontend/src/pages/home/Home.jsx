import './Home.css'

export default function Home() {

    return (
        <>
            <div className='hero'>
                <div className='img'>
                    <h1>
                        Encontre o melhor lugar para você
                    </h1>
                    <p className='subtitle'>Aqui no Best Served</p>
                </div>
            </div>
            <div className='description'>
                <div className='line1'>
                    <p className='p1'>Com uma variedade de restaurantes, servimos todas as refeições, incluindo café da manhã.</p>
                    <img className='img1' src="./back1.png" alt="" />
                </div>
                <div className='line1'>
                    <img className='img1' src="./background.jpg" alt="" />
                    <p className='p1'>O atendimento ao cliente vem em primeiro lugar. <br /><br /> Chefs renomados dos restaurantes mais influentes de Sobral.</p>
                </div>
                <div>
                    <p className='p1'>Descubra nossos restaurantes agora e aproveite o melhor que temos a oferecer.</p>
                    <div className='img2'></div>
                </div>
            </div>
        </>
    )
}