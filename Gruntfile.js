module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            build: {
                src: 'build/*'
            },
            fonts: {
                src: 'source/fonts/*'
            }
        },
        copy: {
            bootstrap: {
                cwd: 'source/bower/bootstrap/fonts/',
                src: '**',
                dest: 'public/fonts/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            font_awesome: {
                cwd: 'source/bower/font-awesome/fonts/',
                src: '**',
                dest: 'public/fonts/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.registerTask('copy fonts', ['clean:fonts', 'copy:bootstrap', 'copy:font_awesome']);
};