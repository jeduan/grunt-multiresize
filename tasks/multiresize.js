/*
 * grunt-multiresize
 * https://github.com/jeduan/icons-yogome
 *
 * Copyright (c) 2013 Jeduan Cornejo
 * Licensed under the MIT license.
 */

'use strict';
var gm = require('gm'),
    async = require('async');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks

  grunt.registerMultiTask('multiresize', 'Allows to create multiple resized images from an image', function() {
    var done = this.async();

    async.each(this.files, function(f, next) {
      var src, i = 0;

      //Ignores all but first src file
      if (f.src.length >= 1) {
        src = f.src[0];
      } else {
        return next();
      }

      if (!grunt.file.exists(src)) {
        return next(new Error('Source file "'+ src +'" not found.'));
      }

      async.map(f.dest, function(dest, callback) {
        var size = f.destSizes[i++].split('x'),
            folder = dest.substr(0, dest.lastIndexOf('/'));

        if (! grunt.file.exists(folder)) {
          grunt.log.write('Creating folder "' + folder + '".');
          grunt.file.mkdir(folder);
        }

        gm(src).thumb(size[0], size[1], dest, 90, function(err){
          if(err) { return callback(err); }
          callback(null);
        });

      }, next);

    }, function(err) {
      if(err) {
        grunt.log.error(err.message);
        return done(false);
      }
      done();
    });

  });

};
