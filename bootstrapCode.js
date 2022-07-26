const unsupportedCodeError = `
  throw new Error('Found unsupported code in the smart contract');
`;

const topCodeInjection = (totalCoins) => `
   const totalCoins = ${totalCoins};
   let billedCoins = 0;
`;

const bottomCodeInjection = "console.log(`Total coins spent ${billedCoins} of ${totalCoins}`);";

module.exports = (babel, { hasUnsupportedCode, totalCoins }) => {
  return {
    visitor: {
      Program: (path) => {
        if (hasUnsupportedCode) {
          path.unshiftContainer("body", babel.parse(unsupportedCodeError + topCodeInjection(totalCoins)).program.body);
        } else {
          path.unshiftContainer("body", babel.parse(topCodeInjection(totalCoins)).program.body);
        }
        path.pushContainer("body", babel.parse(bottomCodeInjection).program.body);
      },
    }
  }
};
