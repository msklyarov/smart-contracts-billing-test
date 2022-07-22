const topCodeInjection = `
   const { ADD, MUL, SUB, DIV, CALLCODE } = require('./pricePolicy.js');

   const totalCoins = 1000;
   let billedCoins = 0;
   const billCoins = (cost) => {
      billedCoins += cost;
      if (billedCoins > totalCoins) {
         console.log('coins limit reached: ', billedCoins);
         throw new Exception('AAAAAAAAAA!!!!');
      }
   }

    const add = (left, right) => {
       billCoins(ADD);
       return left + right;
    };

    const subtract = (left, right) => {
       billCoins(SUB);
       return left - right;
    };

    const multiply = (left, right) => {
       billCoins(MUL);
       return left * right;
    };

    const divide = (left, right) => {
       billCoins(DIV);
       return left / right;
    };

    const callFunction = () => {
       billCoins(CALLCODE);
    };
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
