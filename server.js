const http = require('http');
const url = require('url');
const fs = require('fs');
const uuid = require('uuid');
var md5 = require('md5'); 
const QRCode = require('easyqrcodejs-nodejs');

const store = "store/";
const path = 'qrs/'

http.createServer(async function (req, res) {
  
  var q = url.parse(req.url, true).query;
 
  var options = {
    text: q.text,
    //colorDark: "#04b17b",
    colorDark: "#00C473",
    logo: "logo.png",
    logoWidth: 80,
    logoHeight: 80,
    logoBackgroundTransparent: true,
    //logoBackgroundColor: '#ffffff'
  };
  var qrcode = new QRCode(options);
  
  var file =  md5(q.text) + '.png';

  qrcode.saveImage({
    path: path + file
 }).then(data=>{
    console.log(file + " has been Created!");
    /* Output filename only
    res.setHeader('Content-Type', 'text/plain');
    res.end(file)
    */
    
    //Return png
    var s = fs.createReadStream(path + file);
    s.on('open', function () {
        res.setHeader('Content-Type', 'image/png');
        s.pipe(res);
    });
    
   if (q.store == 'yes') {
    fs.copyFile(path + file, store + file, (err) => {
      if (err) throw err;
      console.log('Copied qr code to store');
    });
   }
 });

}).listen(3000);