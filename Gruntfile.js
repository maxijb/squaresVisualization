module.exports = function (grunt) {
   grunt.initConfig({
      browserify: {
         dist: {
            options: {
               transform: [
                  ["babelify", {
                     loose: "all"
                  }]
               ]
            },
            files: {
               // if the source file has an extension of es6 then
               // we change the name of the source file accordingly.
               // The result file's extension is always .js
               "./dist/squares.js": ["./src/js/squares.js"]
            }
         }
      },
      less: {
         dist: {
            files: {
              "./dist/squares.css": ["./src/less/squares.less"]
            }
         }
      },
      watch: {
         scripts: {
            files: ["./src/**/*"],
            tasks: ["build"]
         }
      }
   });

   grunt.loadNpmTasks("grunt-browserify");
   grunt.loadNpmTasks("grunt-contrib-watch");
   grunt.loadNpmTasks("grunt-contrib-less");

   grunt.registerTask("build", ["less", "browserify"]);
   grunt.registerTask("default", ["build", "watch"]);
};