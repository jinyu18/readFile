var express = require('express');
var router = express.Router();
const readline = require('readline');
const fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {

    const rl = readline.createInterface({
    input: fs.createReadStream('TestPR.edl')
    });
    var edlObj = {};
    var inSector = false;
    edlObj.sectorList = [];
    var sectorObj = {};

    rl.on('line', (line) => {
    //console.log('Line from file:', line);
        var array = line.split(/\s+/);
        //console.log('array from file:', array);

        if (line.indexOf("TITLE:") != -1) { //取得edl title
            edlObj.title = line.substring(6);
            return;
        }

        if (line == '' && array[0] == '') {//sector开始的标志
            inSector = true;
            return;
        }

        if (inSector) {//开始按sector解析

            if (line.indexOf("* KEY CLIP NAME:") != -1 || line.indexOf("* FROM CLIP NAME:") != -1) {
                //解析sector结束
                sectorObj.name = line.substring(18);
                inSector = false;
                edlObj.sectorList.push(sectorObj);
                sectorObj = {};
                return;
            }

            if (sectorObj.id == null) {
                sectorObj.id = array[0];
                sectorObj.list = [];
            }

            sectorObj.list.push({
                id: array[0],
                type1: array[1],
                type2: array[2],
                type3: array[3],
                time1: array[4],
                time2: array[5],
                time3: array[6],
                time4: array[7],
            });
            return;


        }


    });

    rl.on('close', (line) => {
        console.log(edlObj);
        fs.writeFile('edl.txt', JSON.stringify(edlObj), function (err) {
                if (err) throw err;
                 console.log('It\'s saved!');
        });
    });


    res.render('index', { title: 'Express' });
});

module.exports = router;
