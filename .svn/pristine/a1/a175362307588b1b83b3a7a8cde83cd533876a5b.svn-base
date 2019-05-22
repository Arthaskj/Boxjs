var modules = [
    'Box',
    'Box.more',
    'Box.properties',

    'lang/*',

    'core/Base',
    'core/Class',
    'core/ClassManager',
    'core/Loader',
    'core/LoaderParse',

    'env/*',

    'dom/Element',
    'dom/Helper',

    'util/Event',
    'util/Sorter',
    'util/Sortable',
    'util/Filter',
    'util/AbstractMixedCollection',
    'util/MixedCollection',
    'util/Cookie',
    'util/JSON',
    'util/Format',
    'util/RegExp',
    'util/HashMap',
    'util/ListenerProxy',
    'util/LocalStorage',
    'util/KeyMap',
    'util/KeyNav',
    'util/LruCache',
    'util/MD5',
    'util/ImageLazyLoad',

    'tpl/Base',
    'tpl/TemplateParser',
    'tpl/TemplateCompiler',
    'tpl/Template',

    'component/TplCompile',
    'component/TplFactory',
    'component/Component',

    'ui/*',

    'app/History',
    'app/Router',
    'app/Store',
    'app/Interface',
    'app/View',
    'app/Viewport',
    'app/Application'
];

function parseConcat(dir) {
    var ms = [];
    for (var i = 0; i < modules.length; i++) {
        var name = modules[i];
        ms.push(dir + name +'.js')
    }
    return ms
}

module.exports = function(grunt) {

    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            all: {
                files: [{
                    expand: true,
                    cwd: './src',
                    src: '*.js',
                    dest: '.dist'
                },{
                    expand: true,
                    cwd: './src',
                    src: '**/*.js',
                    dest: '.dist'
                }]
            }
        },

        concat: {
            debug: {
                src: parseConcat('src/'),
                dest: 'build/box.debug.js'
            },
            min: {
                src: parseConcat('.dist/'),
                dest: 'build/box.min.js'
            }
        },

        clean: {
            build: {
                src: [".dist"]
            }
        }
    });

    grunt.registerMultiTask();

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('default', [
        'uglify:all',
        'concat:debug',
        'concat:min',
        'clean'
    ]);

};