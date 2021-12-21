let gulp=require('gulp');
let shell=require('gulp-shell');
let eslint=require('gulp-eslint');
let fs=require('fs');
let mocha = require('gulp-mocha');


gulp.task('run',shell.task([
    'node app.js',
    'node validation.js'
]))

gulp.task('lint',()=>{
    return gulp.src(['src/app.js','src/validation.js','!node_modules/**']) 
    .pipe(eslint()) 
    .pipe(eslint.format())
    .pipe(eslint.format('html', fs.createWriteStream('lintReports/lint_report.html')))
    .pipe(eslint.format('checkstyle', fs.createWriteStream('lintReports/checkstyle.xml')))
    .pipe(eslint.failAfterError())
})

gulp.task('test', () => {
    return gulp.src(['test/*.js'])
    
      .pipe(mocha(
        {
          reporter: 'mocha-junit-reporter', 
          reporterOptions: {
            mochaFile: './testReport/JUnit/file.xml',
            jenkinsMode:true
          }
        }
      )) 
      .on('error', console.error)
  });
  
  gulp.task('coverage', shell.task([
    'nyc --reporter=lcov --reporter=text mocha --exit'
    
  ]));
