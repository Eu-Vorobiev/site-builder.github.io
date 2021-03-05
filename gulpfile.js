const { src, dest, watch, parallel } = require("gulp");
const scss                           = require("gulp-sass");
const autoprefix                     = require("gulp-autoprefixer");
const sync                           = require("browser-sync").create();
const imagemin                       = require("gulp-imagemin");

const fs = require("fs"); /* создание файлов через nodejs*/ 

function struct () {
  createFolders();
  setTimeout( function () {
    fs.writeFile("src/index.html", "!", function(error) {
      if (error) {
        throw error;
      }
      console.log("Html done");
    })
    fs.writeFile("src/scss/style.scss", "", function(error) {
      if (error) {
        throw error;
      }
      console.log("Scss done");
    })
    fs.writeFile("src/js/draft/main.js", "", function(error) {
      if (error) {
        throw error;
      }
      console.log("Draft js done");
    });
  }, 500);
};

function createFolders () {
  return src("*.*", { read: false })
  .pipe(dest("src/scss"))
  .pipe(dest("src/css"))
  .pipe(dest("src/js"))
  .pipe(dest("src/js/draft"))
  .pipe(dest("src/img"))
  .pipe(dest("src/img_unopt"))
  .pipe(dest("src/fonts"))
  .pipe(dest("build"))
}

function convertStyles () {
  return src("src/scss/style.scss")
  .pipe(scss({
    outputStyle: 'expanded'
  }))
  .pipe(autoprefix())
  .pipe(dest("src/css"))
  .pipe(sync.stream())
};

function browserSync () {
  sync.init({
    server: {
      baseDir: "src",
    },
    browser: "chrome",
    notify: false
  });
}

function compressImg () {
  return src("src/img_unopt/*.{jpg,png,svg}")
  .pipe(imagemin())
  .pipe(dest("src/img"))
}

function watcher () {
  watch("src/scss/**/*.scss", convertStyles);
  watch("src/img_unopt", compressImg);

  watch("src/*.html").on("change", sync.reload);
  watch("src/css/*.css").on("change", sync.reload);
  watch("src/js/*.js").on("change", sync.reload);
}

exports.struct        = struct;
exports.convertStyles = convertStyles;
exports.watcher       = watcher;
exports.browserSync   = browserSync;
exports.compressImg   = compressImg;

exports.default = parallel(convertStyles, watcher, browserSync)

// BUILD
function moveHtml () {
  return("src/*.html")
  .pipe(dest("build"))
}

function moveStyles () {
  return("src/css/*.css")
  .pipe(dest("build/css"))
}

function moveJS () {
  return("src/js/*.js")
  .pipe(dest("build/js"))
}

function moveImg () {
  return("src/img/*")
  .pipe(dest("build/img"))
}

exports.moveHtml   = moveHtml;
exports.moveStyles = moveStyles;
exports.moveJS     = moveJS;
exports.moveImg    = moveImg;

exports.build = series(moveHtml, moveStyles, moveJS, moveImg);