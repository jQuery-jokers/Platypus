var countries = {
  async: true,
  crossDomain: true,
  url: "https://api.joinsherpa.com/v2/countries",
  method: "GET",
  headers: {
    Authorization: "Basic Zk5saHhmUTB1cm94YVhvQ1NuOUY2a0V3clFjQWN6OmtSaWFQTWhxTU5GbzdtMDVDbHY5S3IzVVBaNXNjWWg2TnJCaVZkTjQ="
  }
};
var countriesArr = [];
var currencyCountryURL =
  "https://free.currencyconverterapi.com/api/v6/countries";

// make initial call to Sherpa for country array
  $.ajax(countries).done(function (response) {
  for (var i = 0; i < response.length; i++) {
    var countryList = response[i].country_name;
    countriesArr.push(countryList);
  }
});

// function that ensures any input will always have capital first letter
function capitalizeCountryName(string) {
  var words = string.split(" ");
  for (var i = 0; i < words.length; i++) {
    words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
  }
  return words.join(" ");
}


// when user clicks...
$("#btn").click(function (e) {
  e.preventDefault();
  $("#visa").empty();
  // write to inspiration div
  $("#inspiration").text("Check out these photos!")
  var destination = $("#usercountry")
    .val()
    .trim();
  var settings = {
    async: true,
    crossDomain: true,
    url: "https://api.unsplash.com/search/photos/?client_id=5f85c22574885841bbfba356797e761e3eb053f86b7709753507c26d3549b150&query=" +
      destination +
      "&limit=10",
    method: "GET"
  };
// call to unsplash API for pictures
  $.ajax(settings).done(function (response) {
    var inspirationDiv = $("#inspiration");

    for (var i = 0; i < response.results.length; i++) {
      var url = response.results[i].urls.regular;
      var photo = $("<img id='countryphotos'>").attr("src", url);
      photo.addClass("ui fluid rounded image");
      inspirationDiv.append(photo);

    }
  });

  // calls Sherpa countries object
  $.ajax(countries).done(function (response) {
    var destination = $("#usercountry")
      .val()
      .trim();
    var citizenship = $("#usercitizenship")
      .val()
      .trim();
    destination = capitalizeCountryName(destination);
    citizenship = capitalizeCountryName(citizenship);
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
    // calls Currency Converter
    $.ajax(currencyCountryURL).done(function (response) {
      var userCurrency = response.results[citizenshipID].currencyId;
      var destinationCurrency = response.results[destinationID].currencyId;
      var currencyDiv = $("#currency");
      // inputs currency converter button
      currencyDiv.html(
        "<form class='ui huge form'> <div class='field'><label>What's your budget? </label> <input id='money' type='number' value=0 ``name='budget'> <button class='ui button' id='moneybutton' data-value=''>Convert</button></div></form>"
      );
      var moneyButton = $("#moneybutton");

      // click on convert...
      $(moneyButton).click(function (res) {
        res.preventDefault();
        var userBudget = $("#money").val();
        var currencyConvertURL =
          "https://free.currencyconverterapi.com/api/v6/convert?q=" +
          userCurrency +
          "_" +
          destinationCurrency +
          "&compact=ultra";
        $.ajax(currencyConvertURL).done(function (currencyResponse) {
          var newBudgetP = $("<p>");
          var conversion = Object.values(currencyResponse);
          var newBudget = Math.trunc(conversion * userBudget);
          newBudgetP.html(
            "<br> Your travel budget will be around " +
            newBudget +
            " " +
            destinationCurrency
          );
          currencyDiv.append(newBudgetP);
        });
      });
    });

    var visaRequirements = {
      async: true,
      crossDomain: true,
      url: "https://api.joinsherpa.com/v2/entry-requirements/" +
        citizenshipID +
        "-" +
        destinationID,
      method: "GET",
      headers: {
        Authorization: "Basic Zk5saHhmUTB1cm94YVhvQ1NuOUY2a0V3clFjQWN6OmtSaWFQTWhxTU5GbzdtMDVDbHY5S3IzVVBaNXNjWWg2TnJCaVZkTjQ="
      }
    };

    $.ajax(visaRequirements).done(function (response) {
      console.log(response);
      var newP = $("<p>");

      // Write Visa info to visa div
      var visaDiv = $("#visa");
      
      newP.html(
        response.visa[0].textual.text[0] +
        " " +
        response.visa[0].textual.text[1] +
        " " +
        response.visa[0].textual.text[2]
      );
      visaDiv.append(newP);
      if (response.visa[0].notes) {
        var notesP = $("<p>");
        notesP.html("Additional information: " + response.visa[0].notes);
        visaDiv.append(notesP);
      }

      // Write vaccination info to vax div
      var vaxDiv = $("#vaccination");
      var riskDiseaseList = [];
      var recDiseaseList = [];
      if (response.vaccination === null) {
        vaxDiv.text("No recommended vaccinations right now!");
      } else {
        if (response.vaccination.risk) {
          for (i = 0; i < response.vaccination.risk.length; i++) {
            var riskDisease = response.vaccination.risk[i].type
              .toLowerCase()
              .replace("_", " ");
            var newRiskDisease = riskDisease.replace(/_/g, ' ');
            riskDiseaseList.push(newRiskDisease);
            var riskDiseaseListAsString = riskDiseaseList.join(', ');
            vaxDiv.html(
              "Before traveling, talk to your doctor about vaccinations against " +
              riskDiseaseListAsString +
              "."
            );
          }
        }

        if (response.vaccination.recommended) {
          for (i = 0; i < response.vaccination.recommended.length; i++) {
            var recDisease = response.vaccination.recommended[i].type
              .toLowerCase()
              .replace("_", " ");
            recDiseaseList.push(recDisease);
            newDiseaseP = $("<p>");
            newDiseaseP.html("To be safe, ask about " + recDiseaseList + ".");
            vaxDiv.append(newDiseaseP);
          }
        }

        if (
          (!response.vaccination.recommended && !response.vaccination.risk) ||
          response.vaccination === null
        ) {
          vaxDiv.text("No recommended vaccinations right now!");
        }
      }

      // Write length of stay info to length div
      var lengthDiv = $("#lengthofstay");
      var allowedStay = response.visa[0].allowed_stay;
      if (allowedStay) {
        lengthDiv.text("You can visit for up to " + allowedStay + ".");
      } else {
        lengthDiv.text("This is a special case! See 'additional information' above under 'Visa' or obtain more information on travel length for this country before planning your trip.");
      }

      // Write currency info to Currency div
      var currencyDiv = $("#currency");
      var newCurrencyP = $("<p>");

      if (response.currency === null) {
        newCurrencyP.html("No strict currency declarations!");
        currencyDiv.prepend(newCurrencyP);
      }

      if(response.currency.arrival === response.currency.exit){
      newCurrencyP.html("Declaration thresholds: " + response.currency.arrival);
      } else if (response.currency.arrival !== response.currency.exit && response.currency.exit){
        newCurrencyP.html("Declaration thresholds: " + response.currency.exit);
      } else if (response.currency.arrival === undefined){
        newCurrencyP.html("Exit restrictions: " + response.currency.exit);
      } else if (response.currency.exit === undefined){
        newCurrencyP.html("Arrival information: " + response.currency.exit);
      }
      currencyDiv.prepend(newCurrencyP);
    });
  });

});