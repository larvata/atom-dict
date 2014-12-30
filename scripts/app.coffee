remote = require 'remote'

app=remote.require 'app'



$(document).on 'keyup',(e)->
	if e.keyCode is 27
		$('.search-box').val("")
		$('.search-box').focus()
		app.emit('updateSearchResult',[])
		app.emit 'windowVisible',false



$('.search-box').on 'keyup',(e)->
	# console.log e
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


app.on 'onBrowserWindowShow',()->






