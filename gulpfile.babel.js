import gulp from "gulp";
import gpug from "gulp-pug";
import gimage from "gulp-image";
import del from "del";
import ws from "gulp-webserver";

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

const watch = () => {
  gulp.watch(routes.pug.watch, pug);
  gulp.watch(routes.img.src, img);
  // watch routes.img.src => run img function
};

const prepare = gulp.series([clean, img]);

const assets = gulp.series([pug]);

const postDev = gulp.parallel([webserver, watch]);

export const dev = gulp.series([prepare, assets, postDev]);
