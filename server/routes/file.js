const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const Zip = require('adm-zip')
const AdmZip = require('adm-zip')

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

function decodeBase64Image(dataString) {
    var matches = dataString.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/),
      response = {};
  
    if (matches.length !== 3) {
      return new Error('Invalid input string');
    }
  
    response.type = matches[1];
    response.data = new Buffer(matches[2], 'base64');
  
    return response;
}

router.post('/upload', (req, res, next) => {
    const data = decodeBase64Image(req.body.img).data
    const fileName = `uploads/${req.body.fileName.split('.')[0]}.png`

    fs.writeFile(fileName, data, (err => {
        if (err) throw err
        res.send({
            success: true
        })
    }))
})

router.get('/download', (req, res, next) => {
    console.log('다운로드 시작')
    const zip = new Zip()    
    
    zip.addLocalFolder('uploads')
    fs.writeFileSync('test.zip', zip.toBuffer())
    console.log('다운로드 종료')
})

module.exports = router