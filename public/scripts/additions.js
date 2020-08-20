/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */

var gchart;
var ws = new WebSocket("ws://playnlearn.io:8083/websocket");
var lastupdate=Date.now();


ws.onopen = function() {
        console.log("web socket opened");
    };

function loadjquery() {
    console.log("jquery loaded");
    $("#ball").on('click', function () {
        console.log('ball click worked');
        kickBall();
    });
    $("#showbtn").on('click', function () {
        console.log('show worked');
        showBall();
    });
    $("#hidebtn").on('click', function () {
        console.log('hide worked');
        hideBall();
    });
    $("#tossbtn").on('click', function () {
        console.log('toss worked');
        kickBall();
    });

    $("#colorbtn").on('click', function () {
        console.log('toss worked');
        colorBall();
    });
    $(".dropbtn").on('click', function () {
        console.log('dropdown click worked');
        clickDropdown();
    });
    $("#chartselector").on('click', function () {
        console.log('chartselector click worked');
        toggleChart();
    });
    $("#ballselector").on('click', function () {
        console.log('ballselector click worked');
        showBall();
    });
    //toggleBall();
    console.log("hiding ball in jquery load")
    hideBall();

}

    ws.onmessage = function (evt) {

        var received_msg = evt.data;
        console.log("received" + received_msg );
        console.log(received_msg,window.lastupdate)
        if (parseInt(received_msg ) >= window.lastupdate ) {
                console.log("Refreshing");
                window.chart.dataSource.load();
        }
        //console.log("updated chart " + received_msg );
       // lastupdate=received_msg;
    };

ws.onclose = function() {
        alert("Lost server connection...");
    };




function clickDropdown() {
    document.getElementById("myDropdown").classList.toggle("show");
}

function toggleBall() {
    showBall();
    $("#chartdiv").hide();
    hideObj();
}

function toggleObject() {
    hideBall();
    showObj();
    $("#chartdiv").hide();
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}






function toggleChart() {

    hideBall();
    $("#chartdiv").show();
    $.ajax({url:"http://playnlearn.io:8081/resetchartdata"});


// Themes begin
    am4core.useTheme(am4themes_animated);
// Themes end




    window.chart = am4core.create("chartdiv", am4charts.PieChart3D);
    window.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    window.chart.dataSource.url="http://playnlearn.io:8081/chartdata"

    //chart.legend = new am4charts.Legend();


    var series = window.chart.series.push(new am4charts.PieSeries3D());
    series.dataFields.value = "value";
    series.labels.template.disabled = true;


    series.ticks.template.disabled = true;
    series.slices.template.tooltipText = "";
    series.slices.template.stroke = am4core.color("#000000");
    series.slices.template.fillOpacity=1;
    series.slices.template.strokeWidth=2;
    series.slices.template.configField="config";
    series.slices.template.contextMenuDisabled=false;
    //chart.dataSource.reloadFrequency=100;
    series.configField="config"
    series.slices.configField="config"

     series.slices.template.events.on("hit", function(ev) {
          $.ajax({url:"http://playnlearn.io:8081/markred?id="+ev.target.dataItem.dataContext.id});
        //  $.ajax({url:"http://localhost:8080/setproperty?id="+ev.target.dataItem.dataContext.id+"&key=isActive&isBool=1&value=" + !ev.target.isActive  });
          window.lastupdate=Date.now();
          window.ws.send(window.lastupdate);
          window.chart.dataSource.load();
         }, this);




    series.slices.template.events.on("swipe", function(ev) {
        console.log("doublehit on ", ev.target);
        $.ajax({url:"http://playnlearn.io:8081/addslice?id="+ev.target.dataItem.dataContext.id});
        //chart.dataSource.url="http://localhost:8080/chartdata";
        window.lastupdate=Date.now();
        window.ws.send(window.lastupdate);

        window.chart.dataSource.load();


      }, this);

    series.slices.template.events.on("rightclick", function(ev) {
        console.log("rightclick on ", ev.target);
    }, this);


    series.slices.template.events.on("hold", function(ev) {
        console.log("hold on ", ev.target);
    }, this);

   // series.dataFields.category = "slicename";
}

