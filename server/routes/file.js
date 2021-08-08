const express = require('express')
const router = express.Router()
const multer = require('multer')
const fs = require('fs')
const Zip = require('adm-zip')
const spawn = require('child_process').spawn

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

router.get('/zip/js', (req, res, next) => {
    const zips = {}

    const fileList = fs.readdirSync('uploads/', (err, list) => {
        if (err) throw err
        return list
    })

    const outputPath = Date.now() + '_output.zip'

    if (fileList.length) res.send({ msg: '압축을 시작', fileName: outputPath})
    else res.send({ msg: '다운로드 받을 파일이 없습니다.'})

    // 2147483648 Byte = 2GB
    let size = 0
    let cnt = 1
    zips[cnt] = new Zip()
    console.log('새로운 zip 객체 생성', cnt, '번째')
    
    fileList.forEach((file, idx) => {
        const fileSize = fs.statSync(`uploads/${file}`).size
        if (idx % 1000 == 0) console.log(idx, '번째 진행중')

        if (size + fileSize > 2147483648) {
            fs.writeFile(`downloads/${cnt}_${outputPath}`, zips[cnt].toBuffer(), (err) => {
                if (err) throw err
                console.log('압축 파일 생성 중', `${cnt}_${outputPath}`)
            })

            size = 0
            cnt += 1
            zips[cnt] = new Zip()
            zips[cnt].addLocalFile(`uploads/${file}`)

            console.log('새로운 zip 객체 생성', cnt, '번째')
        }

        size += fileSize

        zips[cnt].addLocalFile(`uploads/${file}`)
    })

    fs.writeFile(`downloads/${cnt}_${outputPath}`, zips[cnt].toBuffer(), (err) => {
        if (err) throw err
        console.log('압축 파일 생성 중', `${cnt}_${outputPath}`)
    })

    // Object.keys(zips).forEach(key => {
    //     fs.writeFile(`downloads/${key}_${outputPath}`, zips[key].toBuffer(), (err) => {
    //         if (err) throw err
    //         console.log('압축 파일 생성 중', `${key}_${outputPath}`)
    //     })
    // })
})

router.get('/zip/python', (req, res, next) => {
    const python = spawn('python', ['routes/app.py'])
    python.stdout.on('data', (data) => {
        console.log(data.toString())
    })

    python.stderr.on('data', (data) => {
        console.log(data.toString())
    })

    res.send({ success: true, msg: '압축 시작' })
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