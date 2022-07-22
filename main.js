const fs = require("fs");
const babel = require("@babel/core");
const injectBillingCode = require('./injectBillingCode');
const bootstrapCode = require("./bootstrapCode");


// read the filename from the command line arguments
const fileName = "./testCode.js";

// read the code from this file
fs.readFile(fileName, function(err, data) {
   if (err) throw err;

   // convert from a buffer to a string
   const src = data.toString();

   // use our plugin to transform the source
   const out = babel.transform(src, {
      plugins: [injectBillingCode]
   });

   const outFinal = babel.transform(out.code, {
      plugins: [bootstrapCode]
   });

   // print the generated code to screen
   console.log(outFinal.code);
   console.log(eval(outFinal.code));
});
