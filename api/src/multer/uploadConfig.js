import multer from 'multer'
import path from 'path'
import fs from 'fs'

const ensureUploadFolderExists = () => {
	const folders = ['uploads/client/avatars', 'uploads/restaurant/avatars', 'uploads/menus', 'uploads/admin/avatars']
	folders.forEach(folder => {
		const dir = path.join('src', folder)
		// Garante que o diretório exista
		if (!fs.existsSync(dir)) {
			fs.mkdirSync(dir, { recursive: true })
		}
	})
}

ensureUploadFolderExists()

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		if (file.fieldname === 'restaurant-avatar') {
			cb(null, 'src/uploads/restaurant/avatars')
		} else if (file.fieldname === 'client-avatar') {
			cb(null, 'src/uploads/client/avatars')
		} else if (file.fieldname === 'menu') {
			cb(null, 'src/uploads/menus')
		} else if (file.fieldname === 'admin-avatar') {
			cb(null, 'src/uploads/admin/avatars')
		} else {
			cb(new Error('Invalid file field'), null)
		}
	},
	filename: function (req, file, cb) {
		const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9)
		const extension = path.extname(file.originalname)
		cb(null, `${file.fieldname}-${uniqueSuffix}${extension}`)
	}
})

const upload = multer({ storage })

export default upload
