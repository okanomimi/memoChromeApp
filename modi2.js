var ctx = null ;
var x = 0;
var y = 0;
var canvas = null ;
var is_rect = true;

function draw(){

    canvas = document.getElementById('canvas') ;
    // document.addEventListener('mousemove', test) ;
    //
    // var ctx = canvas.getContext('2d') ;
    ctx = canvas.getContext('2d') ;
    // canvas.addEventListener('mousemove', test) ;
    canvas.addEventListener('click',onClick) ;



    // document.addEventListener(test) ;
    // if (canvas.getContext){
    //     var ctx = canvas.getContext('2d') ;
    // }
}
function createShape(x, y){
    var instance = new createsjs.Shape() ;
    instance.x = x ;
    instance.y = y ;
}
function onClick(e){
    var rect = e.target.getBoundingClientRect() ;
    x = e.clientX - rect.left ;
    y = e.clientY - rect.top;
    var keys = ['value'] ;
    var kk = null ;
    chrome.storage.local.get(keys, function(items){
        kk = items.value  ;
        console.log(items.value) ;

        ctx.fillText(kk, x, y) ;
    }) ;
    if (is_rect){
        // ctx.fillRect(x, y, 10, 10) ;
        // ctx.fillText(kk, x, y) ;
    }else{
        ctx.clearRect(0, 0, canvas.width, canvas.height) ;
    }
        // is_rect = !is_rect ;
}

function test(e){
    ctx.clearRect(0, 0, canvas.width, canvas.height) ;
    var rect = e.target.getBoundingClientRect() ;
    x = e.clientX - rect.left ;
    y = e.clientY - rect.top;
    ctx.fillRect(x, y, 10, 10) ;
}
draw()
