var playGame = {};
var block;
var cursors;
var current_blocks = {};
var next_blocks = {};
var old_blocks;
var text;
var centerX = 276 / 2;//areaZero(increase) * 2
var areaWidth = 258;
var areaHeight = 500;
var areaZero = 18;
var areaTop = 20;
var interval_time = 0;
var angleFlag = true;
var block_width = 20;
var halfWidth = 10;
var completeNum = 240 / 20;
var score;
var level = 1000;
var scale = 0.7;
var scoreText;
var levelText;
var timeEvent;
var music_move;
var music_down;
var music_complete;
var leftBtn;
var rightBtn;
var downBtn;
var rotateBtn;
playGame.preload = function () {
    block = gameContainer.load.spritesheet('fangkuai', '../images/fangkuai.png',20,20);
    gameContainer.load.image('bg', '../images/bg.png');
    gameContainer.load.image('right_bar', '../images/right.png');
    gameContainer.load.image('scoreText', '../images/scoreText.png');
    gameContainer.load.image('next', '../images/next_blocks.png');
    gameContainer.load.image('level', '../images/level.png');
    gameContainer.load.image('pause', '../images/pause.png');
    gameContainer.load.image('sound', '../images/sound.png');

    gameContainer.load.image('rotate', '../images/btn4.png');
    gameContainer.load.image('left', '../images/btn3.png');
    gameContainer.load.image('right', '../images/btn2.png');
    gameContainer.load.image('down', '../images/btn1.png');
    
}
playGame.create = function () {
    old_blocks = [];
    score = 0;
    var bg = gameContainer.add.sprite(10,areaTop,'bg');
    //var right_bar = gameContainer.add.sprite(288,0,'right_bar');
    //bg.scale.setTo(2,2);
    current_blocks = getBlocks(centerX, 40,null,null);
    next_blocks = getBlocks(310/scale, 168 / scale, null, scale);
    
    //right bar
    var text = gameContainer.add.sprite(275, 20, 'scoreText');
    var next = gameContainer.add.sprite(275, 130, 'next');
    
    levelText = gameContainer.add.sprite(275, 240, 'level');
    var pause = gameContainer.add.sprite(285, 360, 'pause');
    pause.inputEnabled = true;
    pause.events.onInputDown.add(pauseGame, this);
    var sound = gameContainer.add.sprite(285, 420, 'sound');
    pause.scale.setTo(0.7,0.7);
    sound.scale.setTo(0.6,0.6);
    scoreText = gameContainer.add.text(290, 60, '0', {
        fill : '#ff00f6',
        align : 'center'
    });
    var levelDegree = ((1000 - level) / 100) + 1;
    // music_down = new Media('/android_asset/www/assets/audio/1996.wav', function(){}, function(e){});
    // music_move = new Media('/android_asset/www/assets/audio/14061.wav', function(){}, function(e){});
    // music_complete = new Media('/android_asset/www/assets/audio/3901.wav', function(){}, function(e){});
    levelText = gameContainer.add.text(290, 290, ""+levelDegree+"", {
        fill : '#1b00ff',
        align : 'center'
    });
    
    //game control
    
    leftBtn = gameContainer.add.sprite(20, 515, 'left');
    leftBtn.inputEnabled = true;
    rightBtn = gameContainer.add.sprite(115, 515, 'right');
    rightBtn.inputEnabled = true;
    downBtn = gameContainer.add.sprite(70, 565, 'down');
    downBtn.inputEnabled = true;
    rotateBtn = gameContainer.add.sprite(200, 520, 'rotate');
    rotateBtn.inputEnabled = true;
    
    timeEvent = gameContainer.time.events.loop(level, autoDown);
    cursors = gameContainer.input.keyboard.createCursorKeys();
    gameContainer.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).onDown.add(angleIt);
    initClick();
}
var db;

function pauseGame() {
    gameContainer.paused = true;
    document.getElementById("overlay").style.display = "block";
    document.getElementById("close-popup-resume").style.display = "block";
}
function initClick(){
    document.getElementById("overlay").style.display = "none";
    document.getElementById("close-popup-resume").style.display = "none";
    document.getElementById("close-popup-restart").style.display = "none";
    document.getElementById("commit").ontouchstart = function(){
        for (var i = 0 ; i < 4 ; i++) {
            if (db.getItem(i + 1).split(" ")[1] == min_sorces) {
                db.setItem(i + 1,document.getElementById("enter-input").value + " " + score);
                break;
            }
        }
        //db.setItem(db.getItem("change"),);
        insertList();
        document.getElementById("close-popup-entername").style.display = "none";
        document.getElementById("close-popup-restart").style.display = "block";
    }
    document.getElementById("resume").ontouchstart = function(){
        gameContainer.paused = false;
        document.getElementById("overlay").style.display = "none";
        document.getElementById("close-popup-resume").style.display = "none";
    }
    document.getElementById("restart").ontouchstart = function(){
        gameContainer.paused = false;
        document.getElementById("overlay").style.display = "none";
        //document.getElementById("game-control").style.display = "none";
        if (timeEvent) {
            gameContainer.time.events.remove(timeEvent);
        }
        gameContainer.state.start("loadGame");
        
    }
    leftBtn.events.onInputDown.add(function(){
        cursors.left.isDown = true;
    });
    leftBtn.events.onInputUp.add(function(){
        cursors.left.isDown = false;
    });
    rightBtn.events.onInputDown.add(function(){
        cursors.right.isDown = true;
    });
    rightBtn.events.onInputUp.add(function(){
        cursors.right.isDown = false;
    });
    downBtn.events.onInputDown.add(function(){
        cursors.down.isDown = true;
    });
    downBtn.events.onInputUp.add(function(){
        cursors.down.isDown = false;
    });
    rotateBtn.events.onInputDown.add(function(){
        angleIt();
    });
    db = window.localStorage;
    if (!db.getItem("1")) {
        db.setItem("1", "0 0");
        db.setItem("2", "0 0");
        db.setItem("3", "0 0");
        db.setItem("4", "0 0");
    } 
    
}
function angleIt() {
    if (!angleFlag) {
        //music_move.play();
        var x1, x2, y1, y2;
        for ( var i = 0; i < 4; i++) {
            x1 = current_blocks.data[i].x;
            y1 = current_blocks.data[i].y;
            x1 -= current_blocks.centerX;
            y1 -= current_blocks.centerY;
            x2 = -y1;
            y2 = x1;
            x2 += current_blocks.centerX;
            y2 += current_blocks.centerY;
            current_blocks.data[i].x = x2;
            current_blocks.data[i].y = y2;
        }
    }

}

function getBlocks(centerX, centerY, type, scale) {
    var fangkuai1;
    var fangkuai2;
    var fangkuai3;
    var fangkuai4;
    var block_type;
    var types = [ 'o', 't', 'l', 'j', 'i', 's', 'z' ];
    if (type) {
        block_type = type;
    } else {
        block_type = types[Math.floor(Math.random() * 7)];
    }
    
    switch (block_type) {
    case 'o':
        fangkuai1 = gameContainer.add.sprite(centerX - halfWidth, centerY - halfWidth, 'fangkuai',0);
        fangkuai2 = gameContainer.add.sprite(centerX - halfWidth, centerY + halfWidth, 'fangkuai',0);
        fangkuai3 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth, 'fangkuai',0);
        fangkuai4 = gameContainer.add.sprite(centerX + halfWidth, centerY - halfWidth, 'fangkuai',0);
        break;
    case 't':
        fangkuai1 = gameContainer.add.sprite(centerX + halfWidth, centerY - halfWidth, 'fangkuai',1);
        fangkuai2 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth, 'fangkuai',1);
        fangkuai3 = gameContainer.add.sprite(centerX - halfWidth, centerY + halfWidth, 'fangkuai',1);
        fangkuai4 = gameContainer.add.sprite(centerX + halfWidth * 3, centerY + halfWidth, 'fangkuai',1);
        break;
    case 'l':
        fangkuai1 = gameContainer.add.sprite(centerX - halfWidth, centerY - halfWidth, 'fangkuai',2);
        fangkuai2 = gameContainer.add.sprite(centerX - halfWidth, centerY + halfWidth, 'fangkuai',2);
        fangkuai3 = gameContainer.add.sprite(centerX - halfWidth, centerY + halfWidth * 3, 'fangkuai',2);
        fangkuai4 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth * 3, 'fangkuai',2);
        break;
    case 'j':
        fangkuai1 = gameContainer.add.sprite(centerX + halfWidth, centerY - halfWidth, 'fangkuai',3);
        fangkuai2 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth, 'fangkuai',3);
        fangkuai3 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth * 3, 'fangkuai',3);
        fangkuai4 = gameContainer.add.sprite(centerX - halfWidth, centerY + halfWidth * 3, 'fangkuai',3);
        break;
    case 'i':
        fangkuai1 = gameContainer.add.sprite(centerX + halfWidth, centerY - halfWidth * 3, 'fangkuai',4);
        fangkuai2 = gameContainer.add.sprite(centerX + halfWidth, centerY - halfWidth, 'fangkuai',4);
        fangkuai3 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth, 'fangkuai',4);
        fangkuai4 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth * 3, 'fangkuai',4);
        break;
    case 's':
        fangkuai1 = gameContainer.add.sprite(centerX + halfWidth * 3, centerY - halfWidth, 'fangkuai',5);
        fangkuai2 = gameContainer.add.sprite(centerX + halfWidth, centerY - halfWidth, 'fangkuai',5);
        fangkuai3 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth, 'fangkuai',5);
        fangkuai4 = gameContainer.add.sprite(centerX - halfWidth, centerY + halfWidth, 'fangkuai',5);
        break;
    case 'z':
        fangkuai1 = gameContainer.add.sprite(centerX - halfWidth, centerY - halfWidth, 'fangkuai',6);
        fangkuai2 = gameContainer.add.sprite(centerX + halfWidth, centerY - halfWidth, 'fangkuai',6);
        fangkuai3 = gameContainer.add.sprite(centerX + halfWidth, centerY + halfWidth, 'fangkuai',6);
        fangkuai4 = gameContainer.add.sprite(centerX + halfWidth * 3, centerY + halfWidth, 'fangkuai',6);
        break;
    }

    var blocks = {
        'type' : block_type,
        'data' : [ fangkuai1, fangkuai2, fangkuai3, fangkuai4 ],
        'centerX' : centerX,
        'centerY' : centerY
    };
    
    for ( var i = 0; i < 4; i++) {
        blocks.data[i].anchor.setTo(0.5, 0.5);
        
    }
    if (scale) {
        
        var group = gameContainer.add.group();
        group.add(fangkuai1);
        group.add(fangkuai2);
        group.add(fangkuai3);
        group.add(fangkuai4);
        group.scale.setTo(scale,scale);
        
    }
    
    return blocks;
}



function checkLine() {
    var lineFlag = false;
    var obj = {};
    var max = [];
    for ( var i = 0; i < old_blocks.length; i++) {
        if (obj.hasOwnProperty(old_blocks[i].y)) {
            obj[old_blocks[i].y]++;
        } else {
            obj[old_blocks[i].y] = 1;
        }

    }

    
    for ( var o in obj) {
        if (obj[o] == completeNum) {
            max.push(o);
            lineFlag = true;
        }
    }

    if (lineFlag) {
        //music_complete.play();
        for ( var i = 0; i < max.length; i++) {
            for ( var j = 0; j < old_blocks.length; j++) {
                if (old_blocks[j].y == max[i]) {
                    old_blocks[j].kill();
                    old_blocks.splice(j, 1);
                    j--;
                }
            }
        }
        

        for ( var i = 0; i < max.length; i++) {
            for ( var j = 0; j < old_blocks.length; j++) {
                if (old_blocks[j].y < max[i]) {
                    old_blocks[j].y += block_width;
                }

            }
        }
        score += 100;
        scoreText.text = ""+score+"";
        if (score == 1000 || score == 2000 || score == 3000 || score == 4000 || score == 5000 || score == 6000) {
            level -= 200;
            levelText.text = ((1000 - level) / 100) + 1;
            timeEvent.delay = level;
            alert("Awesome ,Sweetheart !");
        } else if (score == 7000) {
            alert("NIU BI");
        }
        
    }

}
function appendBlocks(){
        for ( var j = 0; j < 4; j++) {
            old_blocks.push(current_blocks.data[j]);
        }

        current_blocks = getBlocks(centerX, areaTop, next_blocks.type);
        for (var i = 0 ; i < 4 ; i++) {
            next_blocks.data[i].kill();
        }
        next_blocks = getBlocks(310/scale, 168 / scale, null, scale);
}
function checkError (){
    for (var i = 0 ; i < 4 ; i++) {
    
            if (current_blocks.data[i].y <= block_width) {
                
                return true;
            }
        }
    return false;
}
function sortArray(a){
    for (var i = 0; i < a.length - 1 ; i++) {
    for (var j = 0 ; j < a.length - i- 1 ; j++) {
        if (parseInt(a[j].index) > parseInt(a[j + 1].index)) {
            var temp = a[j + 1];
            a[j + 1] = a[j];
            a[j] = temp;
        }
        }
    }
    
}
function insertList(){
    var array = [{"index":db.getItem(1).split(' ')[1],"name" : db.getItem(1).split(' ')[0]},{"index" :db.getItem(2).split(' ')[1],"name" :db.getItem(2).split(' ')[0]},{"index":db.getItem(3).split(' ')[1],"name" :db.getItem(3).split(' ')[0]},{"index" :db.getItem(4).split(' ')[1],"name":db.getItem(4).split(' ')[0]}];
    sortArray(array);
    
    var html = "<li><p><span class='range-score'>"+array[3].index+"</span><span class='range-name'>"+array[3].name+"</span></p></li><li><p><span class='range-score'>"+array[2].index+"</span><span class='range-name'>"+array[2].name+"</span></p></li><li><p><span class='range-score'>"+array[1].index+"</span><span class='range-name'>"+array[1].name+"</span></p></li><li><p><span class='range-score'>"+array[0].index+"</span><span class='range-name'>"+array[0].name+"</span></p></li>";
    document.getElementById("range-list").innerHTML = html;
}
var min_sorces;
function autoDown() {
    
        if (checkCollide()) {
            appendBlocks();
        } 
        if (checkCollide() && checkError()) {
            gameContainer.paused = true;
            document.getElementById("overlay").style.display = "block";
            min_sorces = Math.min(db.getItem(1).split(" ")[1],db.getItem(2).split(" ")[1],db.getItem(3).split(" ")[1],db.getItem(4).split(" ")[1]);
            if (score > min_sorces) {
                document.getElementById("close-popup-entername").style.display = "block";
            } else {
                insertList();
                document.getElementById("close-popup-restart").style.display = "block";
            }
            
            
        }
    
    
    
    for ( var i = 0; i < 4; i++) {
        current_blocks.data[i].y += block_width;
    }
    current_blocks.centerY += block_width;

}

function getrotated() {
    var temp_array = new Array();
    var x1, y1, x2, y2;
    for ( var i = 0; i < 4; i++) {
        x1 = current_blocks.data[i].x;
        y1 = current_blocks.data[i].y;
        x1 -= current_blocks.centerX;
        y1 -= current_blocks.centerY;
        x2 = -y1;
        y2 = x1;
        x2 += current_blocks.centerX;
        y2 += current_blocks.centerY;
        temp_array[i * 2] = x2;
        temp_array[i * 2 + 1] = y2;
    }
    return temp_array;
}
function rotatecollide() {
    var arr = getrotated();
    var len = old_blocks.length;
    for ( var i = 0; i < 4; i++) {
        if ((arr[i * 2] < gameContainer.world.bounds.x + 10)
                || (arr[i * 2] > areaWidth))
            return true;
        if (arr[i * 2 + 1] > areaHeight)
            return true;
        for ( var j = 0; j < len; j++) {
            if ((Math.abs(arr[i * 2] - old_blocks[j].x) < block_width)
                    && (Math.abs(arr[i * 2 + 1] - old_blocks[j].y) < block_width)) {
                return true;
            }
        }
    }
    return false;
}
function checkCollideForUpdate(type) {
    if (old_blocks.length == 0) {
        if (type == 'left') {
            for ( var i = 0; i < 4; i++) {
                if (current_blocks.data[i].x - halfWidth == areaZero) {
                    return true;
                }
            }
        } else if (type == 'right') {
            for ( var i = 0; i < 4; i++) {
                if (current_blocks.data[i].x + halfWidth == areaWidth) {
                    return true;
                }
            }
        }
    } else {
        if (type == 'left') {
            for ( var i = 0; i < 4; i++) {
                for ( var j = 0; j < old_blocks.length; j++) {
                    if (current_blocks.data[i].x - halfWidth == areaZero
                            || ((current_blocks.data[i].y == old_blocks[j].y) && (current_blocks.data[i].x - block_width == old_blocks[j].x))) {
                        return true;
                    }
                }
            }
        } else if (type == 'right') {
            for ( var i = 0; i < 4; i++) {
                for ( var j = 0; j < old_blocks.length; j++) {
                    if (current_blocks.data[i].x + halfWidth == areaWidth
                            || ((current_blocks.data[i].y == old_blocks[j].y) && (current_blocks.data[i].x + block_width == old_blocks[j].x))) {
                        return true;
                    }

                }
            }
        }

    }
    return false;
}
function checkCollide() {
    if (old_blocks.length == 0) {
        for ( var i = 0; i < 4; i++) {
            if (current_blocks.data[i].y + block_width >= areaHeight) {
                //music_down.play();
                return true;
            }
        }
    } else {

        for ( var i = 0; i < 4; i++) {
            for ( var j = 0; j < old_blocks.length; j++) {
                
                if (current_blocks.data[i].y + block_width >= areaHeight
                        || ((current_blocks.data[i].y + block_width == old_blocks[j].y) && (current_blocks.data[i].x == old_blocks[j].x))) {
                    //music_down.play();
                    return true;
                }
                
            }
        }
    }
    return false;
}

playGame.update = function () {
    //cursors.left.isDown = false;
    checkLine();
    angleFlag = rotatecollide();
    if (cursors.left.isDown) {
        if (gameContainer.time.now > interval_time && !checkCollideForUpdate('left')) {
            for ( var i = 0; i < 4; i++) {
                current_blocks.data[i].x -= block_width;
            }
            current_blocks.centerX -= block_width;
            interval_time = gameContainer.time.now + 100;
        }
    }
    if (cursors.right.isDown) {
        if (gameContainer.time.now > interval_time && !checkCollideForUpdate('right')) {
            for ( var i = 0; i < 4; i++) {
                current_blocks.data[i].x += block_width;
            }
            current_blocks.centerX += block_width;
            interval_time = gameContainer.time.now + 100;
        }
    }
    if (cursors.down.isDown) {
        if (gameContainer.time.now > interval_time) {
            autoDown();
            interval_time = gameContainer.time.now + 50;
        }
    } 

}
//load
var loadGame = {};
loadGame.preload = function () {
    gameContainer.load.spritesheet('fangkuai', '../images/fangkuai.png',20,20);
    gameContainer.load.image('logo', '../images/logo.png');
    gameContainer.load.image('begin', '../images/begin.png');
    
}
loadGame.create = function(){
    //gameContainer.world.setBounds(0, 0, window.document.body.scrollWidth, window.document.body.scrollHeight);
    var fang;
    for (var i = 0 ; i < 20 ; i++) {
        fang = gameContainer.add.sprite(2 + i* 25, 60, 'fangkuai',Math.floor(Math.random() * 7));
        gameContainer.physics.enable(fang, Phaser.Physics.ARCADE);
        fang.body.bounce.y = Math.random();
        fang.body.gravity.y = 300 + Math.round(Math.random()*100);
        fang.body.collideWorldBounds = true;
    }
    var logo = gameContainer.add.sprite(0, 50, 'logo');
    var begin = gameContainer.add.sprite(120, 350, 'begin');
    begin.inputEnabled = true;
    begin.events.onInputDown.add(beginGame, this);
    
}
function beginGame(){
    gameContainer.state.start("playGame");
    //document.getElementById("game-control").style.display = "block";
    
}
playGame.render = function() {
    //gameContainer.debug.soundInfo(music_complete, 20, 32);
}
var gameContainer = new Phaser.Game(window.document.body.scrollWidth, window.document.body.scrollHeight, Phaser.AUTO,'phaser-example',null,true);
gameContainer.state.add("playGame",playGame);
gameContainer.state.add("loadGame",loadGame);
gameContainer.state.start("loadGame");