import cron from 'node-cron'
import { PrismaClient } from '../../generated/prisma/client.js'

const prisma = new PrismaClient()

cron.schedule('*/15 * * * *' /* Checa a cada 15 min */, async () => {
    console.trace('📌 cronJobs.js carregado')

    console.log('⏰ Verificando reservas com horário vencido...')

    const now = new Date()

    try {
        const reservations = await prisma.reservations.findMany({
            where: {
                status: {
                    in: ['Pending', 'Confirmed', 'Cancelled'],
                },
            },
        })

        for (const res of reservations) {
            console.log('Verificando reserva:', res.id, res.date, res.endsAt)         
            
            // Junta a data e a hora da reserva
            const dateOnly = res.date.toISOString().split('T')[0] 
            const fullDateTime = new Date(`${dateOnly}T${res.endsAt}:00Z`)
            
            // console.log('Agora:', now.toISOString())
            console.log('Reserva:', fullDateTime.toISOString()) 

            if (fullDateTime < now || res.status === 'Cancelled') {
                await prisma.reservations.delete({
                    where: { id: res.id },
                })
                console.log(`LIXEIRA 🗑️  - Reserva ${res.id} removida (expirada às ${fullDateTime}).`)
            }
        }
    } catch (error) {
        console.error('Erro ao deletar reservas expiradas:', error)
    }
})
