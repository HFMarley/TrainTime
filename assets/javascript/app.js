// Initialize Firebase
var config = {
    apiKey: "AIzaSyA7R43_sIgLwWrlTmpa74pfQzUlWjo9YWY",
    authDomain: "traintime-3ba30.firebaseapp.com",
    databaseURL: "https://traintime-3ba30.firebaseio.com",
    projectId: "traintime-3ba30",
    storageBucket: "traintime-3ba30.appspot.com",
    messagingSenderId: "859965800506"
};
firebase.initializeApp(config);

var database = firebase.database();

//Button for adding trains
$("#add-train-btn").on("click", function (event) {
    event.preventDefault();

    //grab user input
    var trainName = $("#train-name-input").val().trim();
    var destination = $("#destination-input").val().trim();
    var firstTrain = $("#first-train-input").val().trim();
    var frequency = $("#frequency-input").val().trim();

    //creates local "temporary" object for holding train information
    var newTrain = {
        name: trainName,
        destination: destination,
        firstTrain: firstTrain,
        frequency: frequency,
    };

    //Uploads train data to the database
    database.ref().push(newTrain);

    // Logs everything to console
    console.log(newTrain.name);
    console.log(newTrain.destination);
    console.log(newTrain.firstTrain);
    console.log(newTrain.frequency);

    alert("train info successfully added");

    //clears all of the text-boxes
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-train-input").val("");
    $("#frequency-input").val("");


});

//Create firebase event for adding train information to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function (childSnapshot, prevChildKey) {

    console.log(childSnapshot.val());

    //store everything into a variable. 
    var tName = childSnapshot.val().name;
    var tDestination = childSnapshot.val().destination;
    var tFrequency = childSnapshot.val().frequency;
    var tFirstTrain = childSnapshot.val().firstTrain;


    var timeArrival = tFirstTrain.split(":");
    var trainTime = moment().hours(timeArrival[0]).minutes(timeArrival[1]);
    var maxMoment = moment.max(moment(), trainTime);
    var tMinutes;
    var tArrival;

    //if the first train is later than the current time, sent arrival to the first train time
    if (maxMoment === trainTime) {
        tArrival = trainTime.format("hh:mm A");
        tMinutes = trainTime.diff(moment(), "minutes");
    } else {

        //Calculate the minutes untill arrival 
        //To calculate the minutes till arrival, tak the current time in unix and subtract the firstTrain time and find the modulus between the difference and the frequency.
        var differenceTimes = moment().diff(trainTime, "minutes");
        var tRemainder = differenceTimes % tFrequency;
        tMinutes = tFrequency - tRemainder;
        //To calculate the arrival time, add the minutes to the current time
        tArrival = moment().add(tMinutes, "m").format("hh:mm A")
    }

    console.log("tMinutes:", tMinutes);
    console.log("tArrival:", tArrival);

    $("#train-table > tbody").append("<tr><td>" + tName + "</td><td>" + tDestination + "</td><td>" + tFrequency + "</td><td>" + tArrival + "</td><td>" + tMinutes + "</td></tr>");



    //create the new row
    // var newRow = $("<tr>").append(
    //     $("<td>").text(tName),
    //     $("<td>").text(tDestination),
    //     $("<td>").text(tFirstTrain),
    //     $("<td>").text(tFrequency),
    // );

    // $("#train-table > tbody").append(newRow);
});
