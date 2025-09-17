import express from 'express'
import cors from 'cors'
import clientRoutes from './src/routes/clientRoutes.js'
import restaurantRoutes from './src/routes/restaurantRoutes.js'
import reservationRoutes from './src/routes/reservationRoutes.js'
import adminRoutes from './src/routes/adminRoutes.js'
import reviewRoutes from './src/routes/reviewRoutes.js'
import notificationRoutes from './src/routes/notificationRoutes.js'
import path from 'path'
import './src/utils/cronJobs.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { config } from 'dotenv'

config()

const app = express()

app.use(cors())

app.use(express.json())

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use('/uploads', express.static(path.join(__dirname, 'src', 'uploads')));

// Routes
app.use('/', clientRoutes)
app.use('/', restaurantRoutes)
app.use('/', adminRoutes)
app.use('/', reservationRoutes)
app.use('/', reviewRoutes)
app.use('/', notificationRoutes)

app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}`))
