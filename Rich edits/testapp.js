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
        var currencyCountryURL = "https://free.currencyconverterapi.com/api/v6/countries";

        $.ajax(currencyCountryURL).done(function (response) {
            var userCurrency = response.results[citizenshipID].currencyId;
            var destinationCurrency = response.results[destinationID].currencyId;
            console.log("User Currency", userCurrency);
            console.log("Destination Currency", destinationCurrency);

            var currencyDiv = $("#currency");
            currencyDiv.html("What's your budget? <br>  <input id='money' type='text'> <button class='button' id='moneybutton' data-value=''>Convert</button>");
            var moneyButton = $("#moneybutton");
            $(moneyButton).click(function() {
                var userBudget = $("#money").val();
                console.log(userBudget);
                var currencyConvertURL = "https://free.currencyconverterapi.com/api/v6/convert?q=" + userCurrency + "_" + destinationCurrency +","+ destinationCurrency + "_" + userCurrency + "&compact=ultra";
                console.log(currencyConvertURL);
                $.ajax(currencyConvertURL).done(function(currencyResponse){

                    console.log(currencyResponse);
                })
            });

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
            console.log(response.currency);
            console.log(response.passport);
            console.log(response.vaccination);
            console.log(response.visa);
            console.log(response.visa[0].allowed_stay);


            console.log(response.visa[0].textual.text);
            // console.log(response.visa[0].textual.text[1]);
            // console.log(response.visa[0].textual.text[2]);


            //Write Visa info to visa div
            var visaDiv = $("#visa");
            // visaDiv.text(response.visa[0].type)
            visaDiv.html("-- " + response.visa[0].textual.text[0] + "<br> -- " + response.visa[0].textual.text[1] + "<br>-- " +
                response.visa[0].textual.text[2])


            //Write vaccination info to vax div
            var vaxDiv = $("#vaccination");
            // console.log(response.includes(response.vaccination.recommended));
            var diseaseList = [];
            for (i = 0; i < response.vaccination.risk.length; i++) {
                var disease = response.vaccination.risk[i].type.toLowerCase().replace("_", " ");
                diseaseList.push(disease);
            }

            if (diseaseList !== undefined) {
                vaxDiv.html("Before traveling, talk to your doctor about vaccinations against " + diseaseList + ".");
            } else if (!diseaseList) {
                vaxDiv.text("No recommended vaccinations!");
            } else {
                vaxDiv.text("No recommended vaccinations!");
            }


            //Write length of stay info to length div
            var lengthDiv = $("#lengthofstay");
            var allowedStay = response.visa[0].allowed_stay;
            var notesStay = response.visa[0].notes[0];
            if (allowedStay === true) {
                console.log("allowed stay is here")
            } else if (notesStay === true) {
                console.log("notes are here")
            }
            lengthDiv.text(allowedStay, notesStay);


        })







        currencyDiv.html("When you arrive and leave: " + response.currency.arrival + "<br> What's your budget?")
    })



})


});