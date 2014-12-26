remote = require 'remote'

app=remote.require 'app'





$('.search-box').on 'keydown',()->
	console.log "aaa"
	app.emit('keydown');
