var countries = {
    "async": true,
    "crossDomain": true,
    "url": "https://api.joinsherpa.com/v2/countries",
    "method": "GET",
    "headers": {
        "Authorization": "Basic Zk5saHhmUTB1cm94YVhvQ1NuOUY2a0V3clFjQWN6OmtSaWFQTWhxTU5GbzdtMDVDbHY5S3IzVVBaNXNjWWg2TnJCaVZkTjQ="
    }
};


// var requirements = "visa-requirements/" + citizenshipID + "-" + destinationID;
// var queryURL = "https://api.joinsherpa.com/v2/" + requirements


// function buildQueryURL (){
//     var queryURL = "https://api.joinsherpa.com/v2/";
//     var citizenshipID = "" ;       
// }
// user enters home country/citizenship
// user enters country they want to go to
// user clicks search
// convert country name to country code
// input country codes into API call

$(".btn").click(function (e) {
    e.preventDefault();
    $.ajax(countries).done(function (response) {
        console.log(response)
        var destination = $("#destination-box").val().trim();
        var citizenship = $("#citizenship-box").val().trim();
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
            "url": "https://api.joinsherpa.com/v2/visa-requirements/" + citizenshipID + "-" + destinationID,
            "method": "GET",
            "headers": {
               "Authorization": "Basic Zk5saHhmUTB1cm94YVhvQ1NuOUY2a0V3clFjQWN6OmtSaWFQTWhxTU5GbzdtMDVDbHY5S3IzVVBaNXNjWWg2TnJCaVZkTjQ="
            }
          };

        $.ajax(visaRequirements).done(function (response) {
            console.log(response);
        })



    })
});




// make our call to the API



// sherpaInfo.forEach(element => {
//     var newDiv = $("<div>");
//     newDiv.text("This will display information on " + element);
//     $(".country-list-here").append(newDiv);