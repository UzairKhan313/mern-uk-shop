import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/') // null for error.
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

const checkFileType = (file, cb) => {
  const fileTypes = /jpg|jpeg|png/
  const extname = fileTypes.test(path.extname(file.originalname).toLowerCase())
  const mimType = fileTypes.test(file.mimType)
  if (extname && mimType) {
    return cb(null, true)
  } else {
    cb('Images Only')
  }
}

const upload = multer({
  storage,
})

router.post('/', upload.single('image'), (req, res, next) => {
  res.send({
    message: 'Message uploaded successfully',
    image: `/${req.file.path}`,
  })
})
export default router
