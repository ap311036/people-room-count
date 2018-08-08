const sass = require('node-sass');
const colors = require('colors');
const fs = require('fs');

let ScssCompiler = function( sassFiles ) {
 let sassFilesKeys = Object.keys( sassFiles );
 let optionVerfiy = {
  sassFiles: typeof sassFiles === 'object' && sassFilesKeys.length > 0
 };
 if ( optionVerfiy.sassFiles ) {
  for (let i = 0; i < sassFilesKeys.length; i++) {
   let key = sassFilesKeys[i];
   sass.render({
    file: key,
    outputStyle: 'compressed',
    outFile: sassFiles[key]
   }, function(err, result) {
    // console.log(err, result);
    fs.writeFileSync( sassFiles[key], result.css );
    if ( i === 0 ) {
     console.log('\nMagaele Sass Compiler:');
     console.log('    Compiled saved css file: ' + sassFiles[key]);
     console.log('hello'.green); // outputs green text 
    } else { 
     console.log('    Compiled saved css file: ' + sassFiles[key]);
    }
   });
  }
 }
};

ScssCompiler({
 './css.scss': './css.css'
})