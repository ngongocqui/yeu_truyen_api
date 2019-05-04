const download = require('image-downloader')
const fs = require('fs');

function checkFile(dest){
    let arr = dest.split("/");

    for(let i=0; i<arr.length-1; i++){
        if (!fs.existsSync("./"+arr[0]) && i === 0){
            fs.mkdirSync("./"+arr[0]);
        }else if (!fs.existsSync("./"+getPath(arr, i))){
            fs.mkdirSync("."+getPath(arr, i));
        }
    }
}

function getPath(data, length){
    let path = ""

    for(let i=0; i<=length; i++){
        path += "/"+data[i]
    }

    return path
}
   
async function downloadIMG(url, dest) {
    checkFile(dest)

    const options = {
        url: url,
        // dest: './public/b/a.jpg'   
        dest: dest               
    }

    try {
        const { filename, image } = await download.image(options)
        console.log(filename) // => /path/to/dest/image.jpg 
        return true
    } catch (e) {
        console.log(e, "lỗi tải hình ảnh!")
    }

    return false
}

exports.dowloadImage = async(req, res) => {
    let url = req.body.url
    let dest = req.body.dest

    let result = await downloadIMG(url, dest);
    if(result){
        res.send({message: "ok"})
    }else{
        res.send({message: "lỗi dowload hình ảnh!"})
    }
};