const { ADD, MUL, SUB, DIV, MOD, CALLCODE } = require('./pricePolicy.js');

const billCoinsStringFunc = (cost, remark) => `
   billedCoins += ${cost};
   if (billedCoins > totalCoins) {
    throw new Error('Coins limit reached: ' + billedCoins);
   } // ${remark}
`;

const getOperators = (node, operators = []) => {

  if (node.type === 'BinaryExpression') {
    operators.push(node.operator);
  }

  if (node.left && node.left !== 'NumericLiteral') {
    getOperators(node.left, operators);
  }

  if (node.right && node.right !== 'NumericLiteral') {
    getOperators(node.right, operators);
  }

  return operators;
}

const getOperatorsCost = (operators) => {
  let cost = 0;
  for (operator of operators) {
    switch (operator) {
      case "+":
      case "+=":
        cost += ADD;
        break;
      case "-":
        cost += SUB;
        break;
      case "*":
        cost += MUL;
        break;
      case "/":
        cost += DIV;
        break;
      case "%":
        cost += MOD;
        break;
      }
  }
  return cost;
}

const billOperators = (operators) => {
  return `// ${operators.join(',')}`;
}

module.exports = (babel) => {
  const t = babel.types;

  const billCoins = (cost, remark) => babel.parse(billCoinsStringFunc(cost, remark)).program.body;

  return {
    visitor: {
      ExpressionStatement: (path) => {
        if (path.toString().startsWith('billedCoins +=') || path.expression && path.expression.type === 'CallExpression') return;

        const operators = getOperators(path.node.expression);
        const operationCost = getOperatorsCost(operators);

        path.insertBefore(billCoins(operationCost, operators.join(',')));
      },
      IfStatement: (path) => {
        if (path.toString().startsWith('if (billedCoins > totalCoins)')) return;

        const operators = getOperators(path.node.test);
        const operationCost = getOperatorsCost(operators);

        path.insertBefore(billCoins(operationCost, operators.join(',')));
      },
      CallExpression: (path) => {
        path.insertBefore(billCoins(CALLCODE, 'CALLCODE'));
      },
    },
  };
};
