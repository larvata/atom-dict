app = require 'app'
_ = require 'underscore'
fs = require 'fs'
# require('remote').require('browser-window').addDevToolsExtension('/node_modules/react-devtools')


BrowserWindow = require 'browser-window'

# BrowserWindow.addDevToolsExtension('react-devtools')

require('crash-reporter').start()


ec=null
ce=null

parseDict=(err,data)->

		# lines=data.split('\r\n')
		# console.log lines[0]
		# console.log lines[1]
		ce='11'

stream=null
loadDict=()->
	stream=fs.createReadStream("#{__dirname}/dict/ce.txt"),{
		flags: 'r'
		encoding: 'utf-8'
		fd:null
		bufferSize:1
	})
	# fs.readFile "#{__dirname}/dict/ce.txt",parseDict

loadDict()


mainWindow=null

app.on 'window-all-closed',()->
	if(process.platform!='darwin')
		app.quit()

app.on 'ready',()->
	mainWindow=new BrowserWindow(
		width:650
		height:120
		# resizable:false
		"skip-taskbar":false
		frame:false

	)

	mainWindow.loadUrl "file://#{__dirname}/index.html"

	mainWindow.on 'closed',()->
		mainWindow=null

	mainWindow.openDevTools()


app.on 'keydown',()->
	mainWindow.setSize(500,500)




