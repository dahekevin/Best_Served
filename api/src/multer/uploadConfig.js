import multer from 'multer'
import path from 'path'
import fs from 'fs'

// Novo diretório: apenas 'uploads'
const uploadDir = path.join('src', 'uploads')

// Garante que o diretório exista
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true })
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
    const extension = path.extname(file.originalname)
    cb(null, uniqueSuffix + extension)
  }
})

const upload = multer({ storage })

export default upload
