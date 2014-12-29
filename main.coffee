app = require 'app'
_ = require 'underscore'
fs = require 'fs'

globalShortcut=require 'global-shortcut'

# require('remote').require('browser-window').addDevToolsExtension('/node_modules/react-devtools')


BrowserWindow = require 'browser-window'



# BrowserWindow.addDevToolsExtension('react-devtools')

require('crash-reporter').start()



###########################




ec=null
ce=null


phoneticConvert=(src)->
	src=src.replace(/\[.*\]/,'').split('/').map((ele)->
		unless ele.length is 0
			return "[#{ele}]"
		).join(' ')




	src=src
	.replace(/A/g,'æ')
	.replace(/B/g,'ɑ')
	.replace(/C/g,'ɛ')
	.replace(/D/g,'ː')
	.replace(/E/g,'ə')
	.replace(/F/g,'ʃ')
	.replace(/G/g,'ʒ')
	.replace(/H/g,'ɜː')
	.replace(/I/g,'ɪ')
	.replace(/J/g,'ʊ')
	.replace(/K/g,'ɝ')
	.replace(/L/g,'ɒ')
	.replace(/M/g,'ɚ')
	.replace(/N/g,'ŋ')
	.replace(/O/g,'ɔ')

	.replace(/R/g,'ʌ')
	.replace(/S/g,'ɝ')



stream=null
dictLines=[]
loadDict=()->
	streamOptions={encoding:'utf8'}
	stream=fs.createReadStream("#{__dirname}/dict/ec.txt")

	remaining=''
	stream.on 'data',(data)->
		remaining += data
		index = remaining.indexOf('\n')
		while(index>1)
			line=remaining.substring(0,index)
			remaining=remaining.substring(index+1)
			# console.log "line: #{line}"
			arr=line.split('\t')
			dictLines.push {word:arr[0],pron:phoneticConvert(arr[1]),mean:arr[2]}
			index=remaining.indexOf('\n')

	stream.on 'end',()->
		if remaining.length>0
			dictLines.push remaining
			arr=line.split('\t')
			dictLines.push {word:arr[0],pron:phoneticConvert(arr[1]),mean:arr[2]}
			# console.log "last line: #{remaining}"

		console.log('loadDict fin.')
	# fs.readFile "#{__dirname}/dict/ce.txt",parseDict

loadDict()






mainWindow=null
mainWindowSize={
	height:80
	width:500
}

app.on 'window-all-closed',()->
	if(process.platform!='darwin')
		app.quit()

app.on 'ready',()->
	mainWindow=new BrowserWindow
		width:mainWindowSize.width
		height:mainWindowSize.height
		# resizable:false
		"always-on-top":true
		"skip-taskbar":false
		frame:false



	mainWindow.loadUrl "file://#{__dirname}/index.html"

	mainWindow.on 'closed',()->
		mainWindow=null

	mainWindow.on 'blur',()->
		# app.emit('windowVisible',false)



	showWindowHotkey=globalShortcut.register 'shift+ctrl+space',()->
		mainWindow.show()

	mainWindow.openDevTools()





app.on 'keyup',(keyword)->

	# reusltTpl='<div class="result"><span class="word"></span><span class="pron"></span><span class="mean"></span></div>'

	unless keyword.length is 0
		ret=_.chain(dictLines).filter(
			(dict)->return dict.word.indexOf(keyword)==0).first(5).value()
	else
		ret=[]

	app.emit('updateSearchResult',ret)

	# mainWindow.setSize(500,400)


app.on 'windowVisible',(visibility)->
	if visibility
		mainWindow.show()
	else
		mainWindow.hide()


app.on 'windowResultHeight',(height)->
	height+=mainWindowSize.height

	height = 500 if height>500

	console.log "height: #{height}"
	console.log "width: #{mainWindowSize.width}"

	mainWindow.setSize(mainWindowSize.width,height)






