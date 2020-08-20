
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
    console.log("received message obj -----");
    console.log(received_msg.updTS);
    console.log("-----------");
    console.log("last update -----");
    console.log(window.lastupdate);
    console.log("-----------");


    if ((received_msg.updTS - window.lastupdate) > 1000 )  {
        console.log(received_msg.updTS - window.lastupdate) ;
        console.log("is greater than 1000");
        window.lastupdate=received_msg.updTS;
        if (received_msg.action == "showObj") {
            showObj();
        } else if (received_msg.action == "hideObj") {
            hideObj();
        } else if (received_msg.action == "rotateObj") {
            rotateObj();
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

function hideObj() {
    window.lastupdate=Date.now();
    console.log("Hide Container");
    $("#objContainer").hide();
    var dict={};
    dict["updTS"]=lastupdate;
    dict["action"]="hideObj"
    console.log(dict);
    var jsondat = JSON.stringify(dict);
    console.log(jsondat);
    ws.send(jsondat);

}

function showObj() {
    window.lastupdate=Date.now();
    console.log("Show Obj");
    $("#objContainer").show();
    var dict={};
    dict["updTS"]=lastupdate;
    dict["action"]="showObj"
    console.log(dict);
    var jsondat = JSON.stringify(dict);
    //console.log(jsondat);
    ws.send(jsondat);
}

function rotateObj() {
    window.lastupdate=Date.now();
    console.log("rotate Obj");
    //
    // $("#ball").trigger("mousedown");
   // $("#ballWrapper").css("active",true);
    var dict = {};
    dict["updTS"]=window.lastupdate;
    dict["action"]="rotateObj"
    console.log(dict);
    var jsondat = JSON.stringify(dict);
    //console.log(jsondat);
    ws.send(jsondat);
}



