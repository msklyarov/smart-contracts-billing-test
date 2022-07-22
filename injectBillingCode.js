module.exports = (babel) => {
  const t = babel.types;
  return {
    visitor: {
      BinaryExpression: (path) => {
        switch (path.node.operator) {
          case "+":
            path.replaceWith(t.callExpression(t.identifier("add"), [path.node.left, path.node.right]));
            break;
          case "-":
            path.replaceWith(t.callExpression(t.identifier("subtract"), [path.node.left, path.node.right]));
            break;
          case "*":
            path.replaceWith(t.callExpression(t.identifier("multiply"), [path.node.left, path.node.right]));
            break;
          case "/":
            path.replaceWith(t.callExpression(t.identifier("divide"), [path.node.left, path.node.right]));
            break;
        }
      },
      FunctionDeclaration: (path) => {
        path.get("body").pushContainer("body", t.callExpression(t.identifier("callFunction"), []));
      },
    },
  };
};
