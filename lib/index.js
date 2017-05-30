var gutil = require('gulp-util');
var merge = require('merge');
var through2 = require('through2');
var compilers = require('./compilers');

module.exports = function(options) {
  options = merge({
    modules: 'cjs'
  }, options);

  var files = {}
  var compiler = compilers[options.modules];

  return through2.obj(function(file, enc, cb) {
    if (file.isNull()) {
      this.push(file);
      return cb();
    }

    if (file.isStream()) {
      this.emit('error', new gutil.PluginError('gulp-file2js', 'Streaming not supported'));
      return cb();
    }

    var name = file.relative
    files[name] = file.contents.toString()

    cb();
  }, function flush() {
    this.push(new gutil.File({
      cwd: process.cwd(),
      base: process.cwd(),
      path: 'index.js',
      contents: new Buffer(compiler(files))
    }));
  });
};
