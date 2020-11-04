const ENV = process.env.NODE_ENV || "development";

const testData = require("./test-data/index");
const devData = require("./development-data/index");
console.log(testData);
const data = { development: devData, test: testData, production: devData };
module.exports = data[ENV];