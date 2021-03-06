// Web Clock
setInterval(function () {
    $(".display-clock").html(moment().format('dddd, MMMM D YYYY, h:mm:ss A'))
}, 1000);

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCVJwhVu1Id6T-1rl7HVRiTPPBj7TjzqYI",
    authDomain: "better-train-station.firebaseapp.com",
    databaseURL: "https://better-train-station.firebaseio.com",
    projectId: "better-train-station",
    storageBucket: "better-train-station.appspot.com",
    messagingSenderId: "368518174599"
};

firebase.initializeApp(config);

// Variables to reference the database.
var database = firebase.database();
var tName = "";
var tDestination = "";
var tTime = "";
var tFrequency = "";
var nextT;
var tMoment = moment();

console.log(moment().format("LL"));

// capture button click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // grab values from text-boxes
    tName = $("#name-input").val().trim();
    tDestination = $("#destination-input").val().trim();
    tTime = moment($("#tTime-input").val().trim(), "HH:mm").format("X");
    tFrequency = $("#frequency-input").val().trim();

    tMoment = moment().format('X');
    // code to push values into the database
    database.ref().child('train').push({
        tName: tName,
        tDestination: tDestination,
        tTime: tTime,
        tFrequency: tFrequency,
        currentT: tMoment,
    });
});

// function to update train time's minutes away by triggering a change in firebase children
function updateTime() {
    database.ref().child('train').once('value', function (snapshot) {
        snapshot.forEach(function (childSnapshot) {
            tMoment = moment().format('X');
            database.ref('trains/' + childSnapshot.key).update({
                currentT: tMoment,
            })
        })
    });
};

setInterval(updateTime, 30000);

// reference firebase when page loads and add train to firebase
database.ref().child('train').on('value', function (snapshot) {
    $('tbody').empty();

    // do math and find out the minutes until the next train
    snapshot.forEach(function (childSnapshot) {
        console.log(childSnapshot.val());
        var tTrain = childSnapshot.val();
        var tTimeConv = moment.unix(tTrain.tTime);
        var tDiff = moment().diff(moment(tTimeConv, 'HH:mm'), 'minutes');
        var tRemainder = tDiff % parseInt(tTrain.tFrequency);
        var minAway = parseInt(tTrain.tFrequency) - tRemainder;

        if (tDiff >= 0) {
            nextT = null;
            nextT = moment().add(minAway, 'minutes').format('hh:mm A');

        } else {
            nextT = null;
            nextT = tTimeConv.format('hh:mm A');
            minAway = Math.abs(tDiff - 1);
        }

        var tClass = childSnapshot.key;
        // create a table row and table data elements then append them to the table body
        $('tbody').append(
            "<tr class=" + tClass + ">" +
            "<td>" + tTrain.tName + "</td>" +
            "<td>" + tTrain.tDestination + "</td>" +
            "<td>" + tTrain.tFrequency + "</td>" +
            "<td>" + nextT + "</td>" +
            "<td>" + minAway + "</td>");
    });

}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});
