const xlsx = require('xlsx')
const fs = require('fs')
const { format } = require('date-fns')
const argv = process.argv.splice(2)

function convertExcel() {
    const newBook = xlsx.utils.book_new()

    const file = xlsx.readFile(`${argv[0]}`, {cellDates: true})
    let fileData = file.Sheets[file.SheetNames[0]]
    fileData["!ref"] = "A2:" + fileData["!ref"].split(':')[1]
    fileData = xlsx.utils.sheet_to_json(fileData, {defval: null})

    const fileList = fs.readdirSync('uploads/')

    // { "pta_img_src": null, "img_eardr": null }
    const filePath = []
    for(let i=0;i<fileData.length;i++) filePath.push({ "pta_img_src": null, "img_eardr_1": null, "img_eardr_2": null })

    fileData.forEach((item, idx) => {
        // padStart(채울자리수, 채울문자) , ES2017부터 추가됨
        const identifier = `C20-${item['등록번호'].toString().padStart(4, '0')}`
        const pta = `${identifier}_정보보호.jpg`
        const eardr_img_1 = `${identifier}-1.jpg`
        const eardr_img_2 = `${identifier}-2.jpg`

        if (fileList.includes(pta)) item["pta_img_src"] = `uploads/${pta}`
        if (fileList.includes(eardr_img_1)) {
            item["img_eardr_1"] = `uploads/${eardr_img_1}`
            item["eardr_img_type"] = "image"
        }
        if (fileList.includes(eardr_img_2)) {
            item["img_eardr_2"] = `uploads/${eardr_img_2}`
            item["eardr_img_type"] = "image"
        }

        if (item["생년월일"].toString().length == 5) item["생년월일"] = `200${item["생년월일"]}`
        else item["생년월일"] = `19${item["생년월일"]}`


        item["생년월일"] = convertDate(item["생년월일"])
    })

    importData = xlsx.utils.json_to_sheet(fileData)

    xlsx.utils.book_append_sheet(newBook, importData, "editData")
    xlsx.writeFile(newBook, "export_edit.xlsx" )
}

function convertDate(date) {
    const d = date.toString() // YYMMDD
    const yyyy = d.substr(0, 4)
    const mm = d.substr(4, 2)
    const dd = d.substr(6, 2)
    return yyyy + '-' + mm + '-' + dd
}

convertExcel()