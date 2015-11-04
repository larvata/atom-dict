app = require 'app'
_ = require 'underscore'
fs = require 'fs'
xml = require 'xml2js'
path = require 'path'

jpconv = require 'jp-conversion'
globalShortcut=require 'global-shortcut'


BrowserWindow = require 'browser-window'


require('crash-reporter').start()

###########################



dictLines=[]


loadDict = (dictName)->
  path = "#{__dirname}/dict/#{dictName}.json"
  fs.readFile path,'utf8',(err,data)->
    json = JSON.parse(data)
    json.forEach (entry)->
      dictLines.push entry

    console.log dictLines.length



loadDict('youdao_lite')
loadDict('edict2u_lite')



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
    "always-on-top":true
    "skip-taskbar":false
    frame:false

  mainWindow.loadUrl "file://#{__dirname}/index.html"

  mainWindow.on 'closed',()->
    mainWindow=null

  mainWindow.on 'blur',()->
    setBrowserVisibility(false)
    # app.emit('windowVisible',false)


  showWindowHotkey=globalShortcut.register 'shift+ctrl+space',()->
    setBrowserVisibility(true)

  # mainWindow.openDevTools({detach:true})


setBrowserVisibility=(visibility)->
  if visibility
    mainWindow.show()
    app.emit('onBrowserWindowShow')
  else
    mainWindow.hide()
    app.emit('onBrowserWindowHide')


app.on 'keyup',(keyword)->
  unless keyword.length is 0
    ret=_.chain(dictLines).filter(
      (dict)->
        return true if dict.indexer.indexOf(keyword.toLowerCase())==0
      ).first(4).value()
  else
    ret=[]
  app.emit('updateSearchResult',ret)


app.on 'windowVisible',(visibility)->
  setBrowserVisibility(visibility)

app.on 'windowResultHeight',(height)->
  maxHeight = 500

  
  while height > maxHeight
    height -= 82

  mainWindow.setSize(mainWindowSize.width,height)






