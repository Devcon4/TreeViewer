var wallabyWebpack = require('wallaby-webpack');
var path = require('path');

var compilerOptions = Object.assign(
  require('./tsconfig.json').compilerOptions);

module.exports = function (wallaby) {

  var webpackPostprocessor = wallabyWebpack({
    entryPatterns: [
      'src/wallabyTest.js',
      'src/**/*spec.js'
    ],

    module: {
      loaders: [
        {test: /\.css$/, loader: 'raw-loader'},
        {test: /\.html$/, loader: 'raw-loader'},
        {test: /\.ts$/, loader: '@ngtools/webpack', include: /node_modules/, query: {tsConfigPath: 'tsconfig.json'}},
        {test: /\.js$/, loader: 'source-map-loader', exclude: path.join(__dirname, 'node_modules', '@angular/compiler')},
        {test: /\.json$/, loader: 'json-loader'},
        {test: /\.styl$/, loaders: ['raw-loader', 'stylus-loader']},
        {test: /\.less$/, loaders: ['raw-loader', 'less-loader']},
        {test: /\.scss$|\.sass$/, loaders: ['raw-loader', 'sass-loader']},
        {test: /\.(jpg|png)$/, loader: 'url-loader?limit=128000'}
      ]
    },

    resolve: {
      extensions: ['.js', '.ts'],
      modules: [
        path.join(wallaby.projectCacheDir, 'src/app'),
        path.join(wallaby.projectCacheDir, 'src')
      ]
    }
  });

  return {
    files: [
      {pattern: 'src/**/*.ts', load: false},
      {pattern: 'src/**/*.d.ts', ignore: true},
      {pattern: 'src/**/*.css', load: false},
      {pattern: 'src/**/*.less', load: false},
      {pattern: 'src/**/*.scss', load: false},
      {pattern: 'src/**/*.sass', load: false},
      {pattern: 'src/**/*.styl', load: false},
      {pattern: 'src/**/*.html', load: false},
      {pattern: 'src/**/*.json', load: false},
      {pattern: 'src/**/*spec.ts', ignore: true}
    ],

    tests: [
      {pattern: 'src/**/*spec.ts', load: false}
    ],

    testFramework: 'jasmine',

    compilers: {
      'src/**/*.ts': wallaby.compilers.typeScript(compilerOptions)
    },
    
    middleware: function (app, express) {
      var path = require('path');
      app.use('/favicon.ico', express.static(path.join(__dirname, 'client/favicon.ico')));
      app.use('/assets', express.static(path.join(__dirname, 'client/assets')));
    },

    env: {
      kind: 'chrome'
    },

    postprocessor: webpackPostprocessor,

    setup: function () {
      window.__moduleBundler.loadTests();
    },

    debug: true
  };
};