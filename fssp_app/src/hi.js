const { argv } = require('node:process');

function hi(num){
    console.log(num)
}

hi(argv[2])