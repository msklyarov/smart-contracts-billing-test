const config = require('./config.js');
const { ADD, MUL, SUB, DIV, MOD, CALLCODE, LOOPITER } = config.executionPrice;

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

module.exports = (babel, { setHasUnsupportedCode }) => {
  const t = babel.types;

  const billCoins = (cost, comment) => babel.parse(`
    // #Bill#${cost}#${comment}
  `);

  const loopInjection = path => {
    const bodyType = path.get("body").type;
    if (bodyType === 'BlockStatement') {
      path.get("body").unshiftContainer("body", billCoins(LOOPITER, 'LOOPITER'));
    }

    if (bodyType === 'EmptyStatement') {
      path.get("body").replaceWithMultiple(billCoins(LOOPITER, 'LOOPITER'));
    }

    if (bodyType === 'ExpressionStatement') {
      path.get("body").replaceWith(t.blockStatement([
        path.get("body").node
      ]));
      path.get("body").unshiftContainer("body", billCoins(LOOPITER, 'LOOPITER'));
    }
  }

  return {
    visitor: {
      ExpressionStatement: (path) => {
        const operators = getOperators(path.node.expression);
        if (operators.length !== 0) {
          const operationCost = getOperatorsCost(operators);
          path.insertBefore(billCoins(operationCost, operators.join(',')));
        }
      },
      // IfStatement: (path) => {
      //   if (path.toString().startsWith('if (billedCoins > totalCoins)')) return;

      //   const operators = getOperators(path.node.test);
      //   const operationCost = getOperatorsCost(operators);

      //   path.insertBefore(billCoins(operationCost, operators.join(',')));
      // },
      CallExpression: (path) => {
        for (const command of config.unsupportedCode) {
          if (path.toString().startsWith(command)) {
            setHasUnsupportedCode(true);
            return;
          }
        }
        path.insertBefore(billCoins(CALLCODE, 'CALLCODE'));
      },
      WhileStatement: (path) => {
        loopInjection(path);
      },
      DoWhileStatement: (path) => {
        loopInjection(path);
      },
      ForStatement: (path) => {
        loopInjection(path);
      },
    },
  };
};
