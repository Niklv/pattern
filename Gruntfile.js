module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: {
            fonts: {
                src: 'public/fonts/*'
            }
        },
        copy: {
            bootstrap: {
                cwd: 'public/bower/bootstrap/fonts/',
                src: '**',
                dest: 'public/fonts/',
                expand: true,
                flatten: true,
                filter: 'isFile'
            },
            font_awesome: {
                cwd: 'public/bower/font-awesome/fonts/',
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