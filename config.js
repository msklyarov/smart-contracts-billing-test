const unsupportedCode = [
    'require(', 'Math.random(',
    'setTimeout(', 'clearTimeout(',
    'setImmediate(', 'clearImmediate(',
    'setInterval(', 'clearInterval(',
    'eval(', 'console.', 'process.'
];

// https://ethereum.stackexchange.com/questions/11474/is-there-a-table-of-evm-instructions-and-their-gas-costs
const executionPrice = {
    ADD: 3,
    MUL: 5,
    SUB: 3,
    DIV: 5,
    MOD: 10,
    CALLCODE: 20,
};

module.exports = {
    unsupportedCode, executionPrice
}
