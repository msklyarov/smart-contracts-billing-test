const fs = require("fs");
const babel = require("@babel/core");
const injectBillingCode = require('./injectBillingCode');
const bootstrapCode = require("./bootstrapCode");

// read the filename from the command line arguments
const fileName = "./testCode.js";

let hasUnsupportedCode = false;
const totalCoins = 1000;

const setHasUnsupportedCode = (value) => { hasUnsupportedCode = value };

const billCoins = (cost, comment) =>
   `if ((billedCoins += ${cost}) > totalCoins) throw new Error('Coins limit reached: ' + billedCoins); // ${comment}`;

// read the code from this file
fs.readFile(fileName, function(err, data) {
   if (err) throw err;

   // convert from a buffer to a string
   const src = data.toString();

   // use our plugin to transform the source
   const out = babel.transform(src, {
      plugins: [[injectBillingCode, { setHasUnsupportedCode }]]
   });

   const preFinal = babel.transform(out.code, {
      plugins: [[bootstrapCode, { hasUnsupportedCode, totalCoins }]]
   });

   const finalCode = preFinal.code.replace(/\/\/ #Bill#(?<COST>\d+)#(?<COMMENT>\w+)/g, (all ,cost, comment) => {
      return billCoins(cost, comment);
   });

   console.log(finalCode)
   console.log(eval(finalCode));
});
