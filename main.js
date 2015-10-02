//
// createjsを使ったやつ
//
const BLACK = "#000000"
const RED = "#FF0000"
var x = 0;
var y = 0;
var canvas = null ;
var cj= createjs;
var textHash= {};
var hash={} ;

/**
 * ドラッグが終わった時の処理
 * 終わったらデータを更新する
 */
function stopDrag(eventObject){
    var instance = eventObject.target ;

    x = eventObject.stageX ;
    y = eventObject.stageY ;

    var key = hash[instance] ;    //インスタンスに関連付けてあるkeyを取得

    data = textHash[key] ;      //そのkeyを元にテキストデータを取得
    data.text = instance.text ;
    data.x= x;
    data.y= y;
    textHash[key] = data ;
    localStorage.setItem("memo",null) ;
    localStorage.setItem("memo",JSON.stringify(textHash)) ;
}

/**
 * ドラッグ処理
 */
function drag(eventObject){
    var instance = eventObject.target ;
    instance.x = eventObject.stageX ;
    instance.y = eventObject.stageY ;
    canvas.update()  ;
}

/**
 * 形を何か作る時の処理
 */
function createShape(x, y){
    var instance = new cj.Shape() ;
    instance.x = x ;
    instance.y = y ;
    drawRectange(instance.graphics) ;
    // drawText(instance.graphics) ;
    instance.addEventListener("mousedown", startDrag) ;
    return instance ;
}

/**
 * テキストオブジェクトを作成するメソッド
 */
function createTextObj(text, x, y, writting_now){
    var instance = null ; 
    // var colorCode = getColorCode() ;
    
        
    if (writting_now){    // 今書き込まれたものであったら
        // instance = new cj.Text(text, "18px Arial", colorCode) ;
        instance = new cj.Text(text, "18px Arial",RED) ;
    }else{    //以前に書き込まれたものであったら
        instance = new cj.Text(text, "18px Arial", BLACK) ;
    }
    instance.x = x ;
    instance.y = y ;
    // instance.addEventListener("mousedown", startDrag) ;
    instance.addEventListener("mousedown",function(e){
        var instance = e.target ;
        instance.addEventListener("pressmove", drag) ;    //ドラッグしたときの処理
        instance.addEventListener("pressup", stopDrag) ;  //
        instance.addEventListener("dblclick",dblclick) ;
    }) ;

    return instance ;
}

function getColorCode(){
  // var colorCode = document.getElementById('colorValue') ;
  var colorCode = document.color.colorValue;
  return colorCode.options[colorCode.selectedIndex].value ;
}

function drawRectange(myGraphics){
    var randomNumber = Math.floor(Math.random()*0xFFFFFF) ;
    myGraphics.beginStroke("blue") ;
    myGraphics.beginFill("cyan") ;
    myGraphics.drawRect(-20, -20, 40, 40) ;
}

/**
 * ダブルクリックが押された時の処理
 * ダブルクリックされたインスタンスを削除する。
 */
function dblclick(eventObject){
    var instance = eventObject.target ;
    deleteWord(instance) ;
}

/**
 * 単語を消去するメソッド
 */
function deleteWord(instance){
    x = instance.stageX ;
    y = instance.stageY ;

    var key = hash[instance] ;

    // textHash[key] = null ;
    delete textHash[key] ;  //ハッシュデータの削除
    localStorage.setItem("memo",JSON.stringify(textHash)) ;   //
    canvas.removeChild(instance) ;    //キャンパス上からデータを削除
    canvas.update() ;

    // displayWordNum() ;
}

// This callback function is called when the content script has been 
// injected and returned its results
function onPageDetailsReceived(pageDetails)  { 
}

// Global reference to the status display SPAN
var statusDisplay = null;

// POST the data to the server using XMLHttpRequest
// サブミットされた時の
function addBookmark() {
    // Cancel the form submit
    event.preventDefault();

    // var title = encodeURIComponent(document.getElementById('title').value);
    var title = document.getElementById('title').value;
    var instance = createTextObj(title, canvas.canvas.width/2, canvas.canvas.height/2, true) ;
    canvas.addChild(instance) ;

    var data = {text:instance.text, x:instance.x, y:instance.y}
    var key = uniqueID() ;
    textHash[key] = data ;
    hash[instance] = key;

    localStorage.setItem("memo",JSON.stringify(textHash)) ;
    // displayWordNum() ;    //文字数をカウントして返す
    canvas.update() ;
}


// When the popup HTML has loaded
//
// ポップアップが表示された時に呼び出される
window.addEventListener('load', function(evt) {

    canvas = new cj.Stage('canvas') ;
    // Cache a reference to the status display SPAN
    statusDisplay = document.getElementById('status-display');
    // Handle the bookmark form submit event with our addBookmark function
    // 上のaddBookmark関数を呼び出す
    document.getElementById('addbookmark').addEventListener('submit', addBookmark);

    chrome.runtime.getBackgroundPage(function(eventPage) {
        // Call the getPageInfo function in the event page, passing in 
        // our onPageDetailsReceived function as the callback. This injects 
        // content.js into the current tab's HTML
        eventPage.getPageDetails(onPageDetailsReceived);
    });

    // localStorage.setItem("memo", null) ;
    textHash = JSON.parse(localStorage.getItem("memo")) ;   //過去のメモデータの取得
    hash = {} ;   //各メモのキー用のハッシュ
    if (textHash == null){    //何もデータがなければ
        textHash = {}  ;  //初期化
    }else{    //データが存在すれば
        for (var key in textHash){    //各目もをcanvas上に描画する
            it = textHash[key] ;
                var instance = createTextObj(it.text,it.x,it.y, false) ;
                canvas.addChild(instance) ;
                hash[instance] = key ;    //各メモのキーを保存
        }
    }
    // displayWordNum() ;
    canvas.update() ;
});


/**
 *  現在の単語数を表示する
 */
function displayWordNum(){
    var word_num = Object.keys(textHash).length ;
    document.getElementById('word_num').innerHTML ="word num:"+word_num ;
}


/**
 * 固有のID作成用メソッド
 */
function uniqueID(){
    var randam = Math.floor(Math.random()*10)
        var date = new Date() ;
    var time = date.getTime() ;
    return randam + time.toString() ;
}

