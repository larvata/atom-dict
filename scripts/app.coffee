remote = require 'remote'

app=remote.require 'app'





$('.search-box').on 'keyup',(e)->

	# console.log e
	if e.keyCode is 27
		app.emit('windowVisible',false)
	else
		app.emit('keyup',@value);

app.on 'updateSearchResult',(results)->
	tpl=$("#resultTpl").html()

	compiled=_.template(tpl)

	html=compiled({results:results})

	# console.log html

	$('.result-part').html(html)

	resultHeight=72*results.length

	if resultHeight>350
		console.log "larget"
		$('.result-part').height(350)
		# ...


	console.log "new height #{resultHeight}"

	app.emit('windowResultHeight',resultHeight)


