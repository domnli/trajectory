module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		transport: {
			options: {
		      paths : ['.'],
		    },
		    trajectory: {
		      files: [{
		      		expand:true,
		            cwd: 'trajectory',
		            src: '**/*.js',
		            dest: 'dist'
		        }]
		    },
		}
	});

	grunt.loadNpmTasks('grunt-cmd-transport');

	grunt.registerTask('default', ['transport']);
};