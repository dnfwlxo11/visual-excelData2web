const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const JSzip = require('jszip')
const fileSaver = require('file-saver')

const upload = multer({
    storae: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'uploads/')
        },

        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })
})

router.get('/', (req, res, next) => {
    console.log('Hi')
    res.send({
        success: true
    })
})

router.post('/upload', (req, res, next) => {
    const data = Buffer.from(req.body.img, 'base64')
    const fileName = `uploads/${req.body.fileName.split('.')[0]}.png`

    fs.writeFile(fileName, data, (err => {
        if (err) throw err
        res.send({
            success: true
        })
    }))
})

router.get('/download', (req, res, next) => {
    const zip = new JSzip()

    // zip.folder('images')

    const img = fs.readFile('uploads/t5.png', 'base64', (err, data) => {
        if (err) throw err
        return data
    })

    zip.file('test.png', img, {base64: true})

    zip.generateAsync({type: "base64"})
    .then((content) => {
        console.log("data:application/zip;base64," + content)
        const url = "data:application/zip;base64," + content;
    })

    res.send({
        success: true
    })
})

module.exports = router