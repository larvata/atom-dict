gulp = require("gulp")
coffee = require("gulp-coffee")
pkg = require("./package.json")
fs = require('fs')
debug = require('gulp-debug')
del = require('del')

src="./src"
dest="./build"


build=()->
	exportPackageJson()

	gulp.src "./node_modules/zepto/*.min.js"
		# .pipe debug(title:"copy: zepto")
		.pipe gulp.dest("#{dest}/scripts/vendor/")

	gulp.src "./node_modules/underscore/*-min.js"
		# .pipe debug(title:"copy: underscore")
		.pipe gulp.dest("#{dest}/scripts/vendor/")

	gulp.src "./node_modules/fuse.js/src/*.min.js"
		# .pipe debug(title:"copy: fusejs")
		.pipe gulp.dest("#{dest}/scripts/vendor/")

	# compile coffeefile
	gulp.src "#{src}/**/*.coffee"
		# .pipe debug(title:"compile: coffee-script")
		.pipe coffee(bare: true)
		.pipe gulp.dest("#{dest}/")

	# copy html files
	gulp.src "#{src}/**/*.html"
		# .pipe debug(title: "copy: html files")
		.pipe gulp.dest("#{dest}/")

	# copy tempalte
	gulp.src "#{src}/templates/*.tpl"
		# .pipe debug(title:"copy: templates")
		.pipe gulp.dest("#{dest}/templates/")

	# copy dict
	gulp.src "#{src}/dict/ec.txt"
		# .pipe debug(title:"copy: dictionary files")
		.pipe gulp.dest("#{dest}/dict/")


exportPackageJson=()->
	# extract package.json
	fs.mkdirSync "#{dest}"

	filename="#{dest}/package.json"
	packageData=
		name:pkg.name
		version:pkg.version
		main:pkg.main
	fs.writeFileSync filename,JSON.stringify(packageData)

gulp.task "clean",(cb)->
	del "#{dest}/",cb



gulp.task "build",['clean'],build





