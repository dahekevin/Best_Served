import express from 'express'
import cors from 'cors'
import userRoutes from './src/routes/userRoutes.js'
import { config } from 'dotenv'

config()

const app = express()

app.use(cors())

app.use(express.json())

// Routes
app.use('/sd-user', userRoutes)

app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}`))
