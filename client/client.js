//Establishing a connection with the server on port 5500y
const socket = io();

const player = document.querySelectorAll(".Box-element");
const cont = document.getElementById('container');
let hostValue = document.getElementById('hg');
let joinValue = document.getElementById('jg')
let user = document.getElementById('username');
var chk = document.getElementsByClassName('chkID')
var Winner = document.querySelector('.Winner');
var time = document.querySelector('.timer');
var p1 = document.querySelector('.p1Score');
var p2 = document.querySelector('.p2Score');
var turn = document.querySelector('.turn');
let PlayerTurn = true;
let RoomValue, timer, t, IdCpy, parse, reloadtime;

var InitY = 80, InitX = 344, contained = 0;  //854

//Tile combination of tic tac toe
let TileCombos = [
    [0,1,2], 
    [3,4,5], 
    [6,7,8], 
    [0,3,6],
    [1,4,7], 
    [2,5,8], 
    [0,4,8], 
    [2,4,6],
];

//Front page
function create_btn(){
    RoomValue = hostValue.value
    socket.emit('join', RoomValue, user.value);
    createPlayer(InitX, InitY, user.value);
    enter();
}
function join_btn(){
    RoomValue = joinValue.value
    socket.emit('join', RoomValue, user.value);
    createPlayer(InitX, InitY, user.value);
    enter();
}



socket.on('player', player =>{
    for(let keys in player){
        if(keys !== socket.id){
            createPlayer(768, 80, player[keys]);
        }
    }
})

//To make the tile unable to click if it's already clicked
function boxChecker(i){
        if(cont.contains(player[i]) || cont.contains(player[i])){
                player[i].style.pointerEvents = "none";
                contained++
        }
        if(contained === 9){
            Winner.innerText = 'DRAW';
            $(".PLAYER").css("opacity", 0);
            $(".Box-element").css( "pointer-events", "none" );
        }
}

//Content checker
    chk[0].innerHTML = '<div class = player1></div>'
        chk[1].innerHTML = '<div class = player2></div>'


socket.on('turn', (bool, place) =>{
    boxChecker(place);
    PlayerTurn = bool;
    switch(PlayerTurn){
        case true:
            player[place].innerHTML = '<div class = player2></div>';
        break;
        case false:
            player[place].innerHTML = '<div class = player1></div>';
        break;
    }
    turn.innerText = " ";
})

//Main function
$(".container div").click(function(){
    let index = $(this).index();
        if(PlayerTurn === true) {
            PlayerTurn = false
            socket.emit('turnPlayer', PlayerTurn, RoomValue, index);
    }
        else if(PlayerTurn === false){
            PlayerTurn = true
            socket.emit('turnPlayer', PlayerTurn, RoomValue, index);
    }
    
});   

//Function to know who is the winner
function Checker(){
var i = -1;
var WinnerChecker = setInterval(() =>{
var p1 = 0, p2 = 0;
    i = i<TileCombos.length ? ++i : 0
        for(let j = 0; j<3; j++){
            if(player[TileCombos[i][j]].innerHTML == chk[0].innerHTML){
                    p1 += 1;
            }
            if(player[TileCombos[i][j]].innerHTML == chk[1].innerHTML){
                    p2 += 1;
            }
        }
    if(p1 == 3){
        Winner.innerText = 'PLAYER 1 WON'; 
        $(".Box-element").css( "pointer-events", "none" );
        clearInterval(WinnerChecker);
        Scoring();

    }
    if(p2 == 3){
        Winner.innerText = 'PLAYER 2 WON'
        $(".Box-element").css( "pointer-events", "none" );
        clearInterval(WinnerChecker);
        Scoring();
    }    
})
}
    Checker();

socket.on('Unable', Id => {
    IdCpy = Id;
    if(Id === socket.id){
        $(".Box-element").css("pointer-events", "none" );
    }else{
        $(".Box-element").css("pointer-events", "all" );
    }
})

function Scoring(){
    if(Winner.innerText.includes('1')){
            p1.innerText = parseInt(p1.innerText) + 1;
            EndGame();
        }
    if(Winner.innerText.includes('2')){
            p2.innerText = parseInt(p2.innerText) + 1;
            EndGame();
        }
}


function EndGame(){
    if(p1.innerText.includes('3')){
        Winner.innerText = "Player 1 is the Winner";
        $(".PLAYER").css("opacity", 0);
        }
    else if(p2.innerText.includes('3')){
        Winner.innerText = "Player 2 is the Winner";
        $(".PLAYER").css("opacity", 0);
    }
    else{
        setTimeout(reload, 2000);
    }
}

function reload(){
    for(let k=0; k<9; k++){
        player[k].innerHTML = null;
        player[k].style.pointerEvents = "all"
    }
    Winner.innerText = null;
    contained = 0;
    turn.innerText = PlayerTurn;
    Checker();
}

function createPlayer(x, y, userID){
    var div = document.createElement('div');
        div.classList.add('PLAYER');
        div.style.top = y + 'px';
        div.style.left = x + 'px';
        div.innerText = userID.toUpperCase();
        document.body.appendChild(div);
}

function enter(){
    $(".Box-element").css("pointer-events", "all" );
    $("#container").css("opacity", 1);
    $(".playB").css("opacity", 0);
    $(".Reset").css("opacity", 1);
    $(".btn_create").css("opacity", 0).css("pointer-events", "none" );
    $(".btn_join").css("opacity", 0).css("pointer-events", "none" );
    $("#hg").css("opacity", 0).css("pointer-events", "none" );
    $("#jg").css("opacity", 0).css("pointer-events", "none" );
    $("#username").css("opacity", 0).css("pointer-events", "none" );
    $(".create").css("opacity", 0);
    $(".join").css("opacity", 0);
    $(".ScoringCon").css("opacity", 1);
    $(".p1Score").css("opacity", 1);
    $(".p2Score").css("opacity", 1);
    $(".span").css("opacity", 1);
    $(".turn").css("opacity", 1);
    $(".direction").css("opacity", 0);
    turn.innerText = PlayerTurn;
}
