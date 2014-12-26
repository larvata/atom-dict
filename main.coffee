app = require 'app'
_ = require 'underscore'
# require('remote').require('browser-window').addDevToolsExtension('/node_modules/react-devtools')


BrowserWindow = require 'browser-window'

# BrowserWindow.addDevToolsExtension('react-devtools')

require('crash-reporter').start()

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

