// Initialize Firebase
// var config = {
//     apiKey: "AIzaSyA9jAm-HuuHLf_ZWTrIlm0jtC39FjId2Sk",
//     authDomain: "platypus-app.firebaseapp.com",
//     databaseURL: "https://platypus-app.firebaseio.com",
//     projectId: "platypus-app",
//     storageBucket: "platypus-app.appspot.com",
//     messagingSenderId: "189178348359"
//   };
//   firebase.initializeApp(config);


//Create variable for countries objects
var countries = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.joinsherpa.com/v2/countries",
    "method": "GET",
    "headers": {
        "Authorization": "Basic Zk5saHhmUTB1cm94YVhvQ1NuOUY2a0V3clFjQWN6OmtSaWFQTWhxTU5GbzdtMDVDbHY5S3IzVVBaNXNjWWg2TnJCaVZkTjQ="
    }
};


$("#btn").click(function (e) {
    e.preventDefault();
    $.ajax(countries).done(function (response) {
        console.log(response)
        var destination = $("#usercountry").val().trim();
        var citizenship = $("#usercitizenship").val().trim();
        for (i = 0; i < response.length; i++) {
            if (destination === response[i].country_name) {
                var destinationID = response[i].country_ID;
            }
        }
        for (i = 0; i < response.length; i++) {
            if (citizenship === response[i].country_name) {
                var citizenshipID = response[i].country_ID;
            }
        }
        var visaRequirements = {
            "async": true,
            "crossDomain": true,
            "url": "https://api.joinsherpa.com/v2/entry-requirements/" + citizenshipID + "-" + destinationID,
            "method": "GET",
            "headers": {
               "Authorization": "Basic Zk5saHhmUTB1cm94YVhvQ1NuOUY2a0V3clFjQWN6OmtSaWFQTWhxTU5GbzdtMDVDbHY5S3IzVVBaNXNjWWg2TnJCaVZkTjQ="
            }
          };

          $.ajax(visaRequirements).done(function (response) {
            
            //Console log to display paths
            console.log(response)
            
            //Write Visa info to visa div
            var visaDiv = $("#visa");
            visaDiv.text(response.visa[0].type)

            //Write vaccination info to vax div
            var vaxDiv = $("#vaccination");
            vaxDiv.text(response.vaccination.recommended[0].type)

            //Write length of stay info to length div
            var lengthDiv = $("#lengthofstay");
            lengthDiv.text(response.visa[0].notes[0])

          })
    })
});


