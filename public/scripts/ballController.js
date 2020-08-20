
var ws = new WebSocket("ws://ec2-3-16-1-92.us-east-2.compute.amazonaws.com:8083/websocket");
var lastupdate=Date.now();



function mapfunctions() {
    console.log("Map function called");
    $( "#ball" ).click(function() {
        console.log( "Handler for .click() called." );
    })

}


ws.onopen = function() {
    console.log("web socket opened");
};

ws.onmessage = function (evt) {

    var received_msg = JSON.parse(JSON.parse(evt.data));
    console.log("received message -----");
    console.log(received_msg.updTS);
    console.log("-----------");
    console.log("last update -----");
    console.log(window.lastupdate);
    console.log("-----------");


    if ((received_msg.updTS - window.lastupdate) > 1000 )  {
        console.log(received_msg.updTS - window.lastupdate) ;
        console.log("is greater than 1000");
        window.lastupdate=received_msg.updTS;
        if (received_msg.action == "show") {
            showBall();
        } else if (received_msg.action == "hide") {
            hideBall();
        } else if (received_msg.action == "toss") {
            kickBall();
        } else if (received_msg.action == "stopkick") {
            stopKick();
        } else if (received_msg.action == "color") {
            changeColor(received_msg.color);
        } else {
            console.log("not relevant message");
        }
    }

};

ws.onclose = function() {
    console.log("Lost server connection...");
};



function mousedownfn() {
    kickBall();
}

function hideBall() {
    window.lastupdate=Date.now();
    console.log("Hide ball");
    $("#ballWrapper").hide();
    var dict={};
    dict["updTS"]=lastupdate;
    dict["action"]="hide"
    console.log(dict);
    var jsondat = JSON.stringify(dict);
    console.log(jsondat);
    ws.send(jsondat);

}

function showBall() {
    window.lastupdate=Date.now();
    console.log("Show Ball");
    $("#ballWrapper").show();
    var dict={};
    dict["updTS"]=lastupdate;
    dict["action"]="show"
    console.log(dict);
    var jsondat = JSON.stringify(dict);
    //console.log(jsondat);
    ws.send(jsondat);
}

function tossBall() {
    var first_link = document.getElementsByTagName('div')[1];
    var mousedown = new Event('mousedown');
    for (var i =0; i <=20; i++) {
        first_link.dispatchEvent(mousedown); }
    window.lastupdate=Date.now();
    console.log("Toss ball");
    //
    // $("#ball").trigger("mousedown");
    $("#ballWrapper").css("active",true);
    var dict = {};
    dict["updTS"]=window.lastupdate;
    dict["action"]="toss"
    console.log(dict);
    var jsondat = JSON.stringify(dict);
    //console.log(jsondat);
    ws.send(jsondat);
}

function colorBall() {

    console.log("colorBall function called");
    pickedcolor="yellow"
    $("ball").css("background-color",pickedcolor);
    window.lastupdate=Date.now();
    var dict = {};
    dict["updTS"]=window.lastupdate;
    dict["action"]="color"
    dict["color"]=pickedcolor
    console.log(dict);
    var jsondat = JSON.stringify(dict);
    //console.log(jsondat);
    ws.send(jsondat);

}

function changeColor(pickedcolor) {
    $("ball").css("background-color",pickedcolor);

}

function stopKick() {
    console.log("stop the kick")
    var first_link = document.getElementsByTagName('div')[1];
    setTimeout(first_link.classList.remove("kick"),1000);
    $("#ballWrapper").removeClass("kick");
    // lastupdate=Date.now();
    // var dict = {};
    // dict["updTS"]=lastupdate;
    // dict["action"]="stopkick"
    // console.log(dict);
    // var jsondat = JSON.stringify(dict);
    // //console.log(jsondat);
    // ws.send(jsondat);
}

function kickBall() {
    console.log("Kick ball");

    var first_link = document.getElementsByTagName('div')[1];
    var mousedown = new Event('mousedown');
    var mouseup = new Event('mouseup');
    $("#ballWrapper").addClass("kick");
    first_link.classList.add("kick");
    lastupdate=Date.now();
    setTimeout(function(){ stopKick(); }, 3000);
    var dict = {};
    dict["updTS"]=lastupdate;
    dict["action"]="toss"
    console.log(dict);
    var jsondat = JSON.stringify(dict);
    //console.log(jsondat);
    ws.send(jsondat);


}