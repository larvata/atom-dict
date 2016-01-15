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
mainWindowProps={
    height:80
    width:500
}

app.dock.hide();

app.on 'window-all-closed',()->
    if(process.platform!='darwin')
        app.quit()

app.on 'ready',()->
    mainWindow=new BrowserWindow
        width:mainWindowProps.width
        height:mainWindowProps.height
        alwaysOnTop:true
        frame:false

    mainWindow.loadURL "file://#{__dirname}/index.html"

    mainWindow.on 'closed',()->
        mainWindow=null

    mainWindow.on 'blur',()->
        setBrowserVisibility(false)

    showWindowHotkey=globalShortcut.register 'shift+ctrl+space',()->
        setBrowserVisibility(true)

    # mainWindow.openDevTools({detach:true})

setBrowserPostion=()->
    screen = require('screen');
    displays = screen.getAllDisplays();
    cursor = screen.getCursorScreenPoint();

    currentDisplay = null
    for display in displays
        if display.bounds.x < cursor.x
            if display.bounds.x+ display.bounds.width > cursor.x
                if display.bounds.y < cursor.y
                    if display.bounds.y + display.bounds.height > cursor.y
                        currentDisplay = display
                        break

    mainWindowProps.x = currentDisplay.bounds.x + (currentDisplay.bounds.width - mainWindowProps.width) /2
    mainWindowProps.y = currentDisplay.bounds.y + (currentDisplay.bounds.height - mainWindowProps.height) /2
    mainWindow.setPosition(mainWindowProps.x, mainWindowProps.y)


setBrowserVisibility=(visibility)->

    if visibility
        setBrowserPostion()
        mainWindow.show()
        app.emit('onBrowserWindowShow')
    else
        app.emit('onBrowserWindowHide')
        mainWindow.hide()



app.on 'keyup',(keyword)->
    unless keyword.length is 0
        ret=_.chain(dictLines).filter(
            (dict)->
                return true if dict.indexer.indexOf(keyword.toLowerCase())==0
            ).sortBy((word)->
                word.word.length
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

    mainWindow.setSize(mainWindowProps.width,height)






