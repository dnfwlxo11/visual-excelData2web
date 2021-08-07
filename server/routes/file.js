const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const Zip = require('adm-zip')
const { spawn } = require('child_process')

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

router.get('/zip', (req, res, next) => {
    const python = spawn('python3', ['app.py'])
    python.stdout.on('data', (data) => {
        console.log(data, 'asd')
    })
})

router.get('/download/:filename', (req, res, next) => {
    console.log(`${req.params.filename} 파일 전송 시작`)

    const filePath = `downloads/${req.params.filename}`

    let sendData = fs.createReadStream(filePath)

    res.setHeader('Content-Disposition', `attachment; filename=${req.params.filename}`)
    res.setHeader('Content-Type', 'application/zip')
    
    sendData.pipe(res).on('finish', () => {
        res.status(200).end()
        console.log(`${req.params.filename} 파일 전송 완료`)
    }).on('error', () => {
        res.send({ success: false, msg: "파일 전송 간 문제가 발생했습니다."})
    })
})

module.exports = router