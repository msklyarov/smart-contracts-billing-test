const topCodeInjection = `
   const { ADD, MUL, SUB, DIV, CALLCODE } = require('./pricePolicy.js');

   const totalCoins = 1000;
   let billedCoins = 0;
`;

const bottomCodeInjection = "console.log(`Total coins spent ${billedCoins} of ${totalCoins}`);";

module.exports = (babel) => ({
  visitor: {
    Program: (path) => {
      path.unshiftContainer("body", babel.parse(topCodeInjection).program.body);
      path.pushContainer("body", babel.parse(bottomCodeInjection).program.body);
    },
  },
});
