module.exports = function(file) {
  return `export default ${JSON.stringify(file)}\n`
};
