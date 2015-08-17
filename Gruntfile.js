module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		clean: {
			before:['dest','.build'],
			after:['.build']
		},

		jshint: {
			all: ['Gruntfile.js', 'trajectory/*.js']
		},

		transport: {
			options: {
				paths : ['.'],
				idleading:'trajectory/',
				debug:true,
				alias:{
					jquery:'lib/jquery'
				}
			},
			trajectory: {
				files: [{
					expand:true,
					cwd: 'trajectory',
					src: ['**/*.js'],
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
						'dest/trajectory-debug.js': ['.build/*-debug.js','.build/util/*-debug.js'],
						'dest/trajectory.js': ['.build/*.js','.build/util/*.js']
					}
				]
			}
		},
		copy: {
			pattern: {
				files:[
					{expand: true,cwd: 'trajectory', src: ['pattern/**/*.js'], dest: 'dest/'}
				]
			}
		},
		uglify:{
			dest:{
				files: [
					{
						expand: true,
						cwd: 'dest/',
						src: ['**/*.js','!*-debug.js'],
						dest: 'dest/',
						ext: '.js'
					}
				]
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-cmd-transport');
	grunt.loadNpmTasks('grunt-cmd-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-uglify');

	grunt.registerTask('default', ['clean:before','jshint','transport','concat','copy','uglify','clean:after']);
};