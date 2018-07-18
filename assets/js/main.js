// Initialize Firebase
var config = {
    apiKey: "AIzaSyD0t-bfMCMLiGdxFLH4I8OmUo2fPRqcfLY",
    authDomain: "train-station-96898.firebaseapp.com",
    databaseURL: "https://train-station-96898.firebaseio.com",
    projectId: "train-station-96898",
    storageBucket: "train-station-96898.appspot.com",
    messagingSenderId: "301137556358"
};
firebase.initializeApp(config);

// Variables to reference the database.
var database = firebase.database();

// Initial Values
var tName = "";
var tDestination = "";
var firstTime = "";
var tFrequency = "";
var minAway = "";
var nextT = "";

console.log(moment().format("LL"));

// Capture Button Click
$("#add-train").on("click", function (event) {
    event.preventDefault();

    // Grabbed values from text-boxes
    tName = $("#name-input").val().trim();
    tDestination = $("#destination-input").val().trim();
    firstTime = $("#firstTime-input").val().trim();
    tFrequency = $("#frequency-input").val().trim();
    
    // firstTime Time (pushed back 1 year to make sure it comes before current time)
    var firstTimeConv = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConv);
    
    // Current Time
    var currentTime = moment();    
    console.log("CURRENT TIME: " + moment(currentTime).format("hh:mm"));
    
    // Difference between the times
    var differT = moment().diff(moment(firstTimeConv), "minutes");
    console.log("DIFFERENCE IN TIME: " + differT);

    // Time apart (remainder)
    var tRemainder = differT % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    minAway = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + minAway);

    // Next Train
    nextT = moment().add(minAway, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextT).format("hh:mm"));        


    // Code for "Pushing values in the database"
    database.ref().push({
        tName: tName,
        tDestination: tDestination,
        firstTime: firstTime,
        tFrequency: tFrequency,
        nextT: nextT,
        minAway: minAway
    });

    var tBody = $("tbody");
    var tRow = $("<tr>");

    var nameTd = $("<td>").text(tName);
    nameTd.addClass("name-display");
    var destinationTd = $("<td>").text(tDestination);
    destinationTd.addClass("destination-display");
    var firstTimeTd = $("<td>").text(firstTime);
    firstTimeTd.addClass("firstTime-display");
    var frequencyTd = $("<td>").text(tFrequency);
    frequencyTd.addClass("frequency-display");
    var nextTd = $("<td>").text(nextT);
    nextTd.addClass("next-display");
    var minAwayTd = $("<td>").text(minAway);
    minAwayTd.addClass("minAway-display");

    tRow.append(nameTd, destinationTd, firstTimeTd, frequencyTd, nextTd, minAwayTd);
    tBody.append(tRow);

});

// Firebase watcher + initial loader HINT: .on("value")
database.ref().on("value", function (snapshot) {

    // Log everything that's coming out of snapshot
    console.log(snapshot.val());
    console.log(snapshot.val().tName);
    console.log(snapshot.val().tDestination);
    console.log(snapshot.val().firstTime);
    console.log(snapshot.val().tFrequency);
    console.log(snapshot.val().next);
    console.log(snapshot.val().minAway);


    // Change the HTML to reflect
    $(".name-display").text(snapshot.val().tName);
    $(".destination-display").text(snapshot.val().tDestination);
    $(".firstTime-display").text(snapshot.val().firstTime);
    $(".frequency-display").text(snapshot.val().tFrequency);
    $(".next-display").text(snapshot.val().nextT);
    $(".minAway-display").text(snapshot.val().minAway);

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});