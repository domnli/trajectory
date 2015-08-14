module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			before:['dist'],
			after:['.build']
		},

		jshint: {
			all: ['Gruntfile.js', 'trajectory/*.js']
		},

		transport: {
			options: {
				paths : ['.'],
				idleading:'trajectory/',
				debug:false,
				alias:{
					jquery:'lib/jquery'
				}
			},
			trajectory: {
				files: [{
					expand:true,
					cwd: 'trajectory',
					src: ['*.js','util/*.js'],
					dest: '.build/'
				}]
			},
		},

		concat: {
			options: {
				paths : ['.'],
				include : 'relative'
			},
			trajectory: {
				files: [
					{
						'dist/trajectory.js': ['.build/**/*.js']
					}
				]
			},
		},
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');

	grunt.registerTask('default', ['clean:before','jshint','transport','concat','clean:after']);
};