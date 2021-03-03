import gulp from "gulp";
import gpug from "gulp-pug";
import gimage from "gulp-image";
import gsass from "gulp-sass";
import del from "del";
import ws from "gulp-webserver";
import autoprefixer from "gulp-autoprefixer";
import miniCSS from "gulp-csso";
import gbro from "gulp-bro";
import babelify from "babelify";

gsass.compiler = require("node-sass");

const routes = {
  pug: {
    watch: "src/**/*.pug",
    src: "src/*.pug",
    dest: "build",
  },
  img: {
    src: "src/img/*",
    dest: "build/img",
  },
  scss: {
    watch: "src/scss/**/*.scss",
    src: "src/scss/styles.scss",
    dest: "build/css",
  },
  js: {
    watch: "src/js/**/*.js",
    src: "src/js/main.js",
    dest: "build/js",
  },
};

const pug = () =>
  gulp.src(routes.pug.src).pipe(gpug()).pipe(gulp.dest(routes.pug.dest));

const clean = () => del(["build"]);

const webserver = () =>
  gulp.src("build").pipe(
    ws({
      livereload: true,
      open: true,
    })
  );

const img = () =>
  gulp.src(routes.img.src).pipe(gimage()).pipe(gulp.dest(routes.img.dest));

const styles = () =>
  gulp
    .src(routes.scss.src)
    .pipe(gsass().on("error", gsass.logError))
    .pipe(autoprefixer())
    .pipe(miniCSS())
    .pipe(gulp.dest(routes.scss.dest));

const js = () =>
  gulp
    .src(routes.js.src)
    .pipe(
      gbro({
        transform: [
          babelify.configure({ presets: ["@babel/preset-env"] }, [
            "uglifyify",
            { global: true },
          ]),
        ],
      })
    )
    .pipe(gulp.dest(routes.js.dest));

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  // watch routes.img.src => run img function
  gulp.watch(routes.scss.watch, styles);
  gulp.watch(routes.js.watch, js);
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug, styles, js]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
