remote = require 'remote'

app=remote.require 'app'

clipboard = require 'clipboard'

searchBox=$('.search-box')

$(document).on 'keyup',(e)->
	if e.keyCode is 27
		searchBox.focus()
		app.emit('updateSearchResult',[])
		app.emit 'windowVisible',false


searchBox.on 'keyup',(e)->
	# console.log e
	app.emit('keyup',@value);

app.on 'updateSearchResult',(results)->
	tpl=$("#resultTpl").html()

	compiled=_.template(tpl)

	html=compiled({results:results})

	# console.log html

	$('.result-part').html(html)

	resultHeight=78*results.length

	if resultHeight>350
		console.log "larget"
		$('.result-part').height(350)

	console.log "new height #{resultHeight}"

	app.emit('windowResultHeight',resultHeight+80)


app.on 'onBrowserWindowHide',()->
	searchBox.val("")


app.on 'onBrowserWindowShow',()->
	word=clipboard.readText('string').trim()
	if /^\w+$/.test(word)
		searchBox.val(word)
		app.emit('keyup',word)
		searchBox[0].select()

