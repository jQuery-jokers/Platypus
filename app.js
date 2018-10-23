var countries = {
  async: true,
  crossDomain: true,
  url: "https://api.joinsherpa.com/v2/countries",
  method: "GET",
  headers: {
    Authorization:
      "Basic Zk5saHhmUTB1cm94YVhvQ1NuOUY2a0V3clFjQWN6OmtSaWFQTWhxTU5GbzdtMDVDbHY5S3IzVVBaNXNjWWg2TnJCaVZkTjQ="
  }
};

var countriesArr = [];


$.ajax(countries).done(function (response) {
    for (var i = 0; i < response.length; i++) {
        var countryList = response[i].country_name;
        countriesArr.push(countryList);
    }
    
});

var currencyCountryURL =
  "https://free.currencyconverterapi.com/api/v6/countries";

$("#btn").click(function(e) {
  $("#visa").empty();
  e.preventDefault();
  $.ajax(countries).done(function(response) {
    console.log(response);
    var destination = $("#usercountry")
      .val()
      .trim();
    var citizenship = $("#usercitizenship")
      .val()
      .trim();
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

    $.ajax(currencyCountryURL).done(function(response) {
      var userCurrency = response.results[citizenshipID].currencyId;
      var destinationCurrency = response.results[destinationID].currencyId;
      var currencyDiv = $("#currency");
      currencyDiv.html(
        "<form class='ui huge form'> <div class='field'><label>What's your budget? </label> <input id='money' type='text'> <button class='ui button' id='moneybutton' data-value=''>Convert</button></div></form>"
      );
      var moneyButton = $("#moneybutton");
      $(moneyButton).click(function(res) {
        res.preventDefault();
        var userBudget = $("#money").val();
        var currencyConvertURL =
          "https://free.currencyconverterapi.com/api/v6/convert?q=" +
          userCurrency +
          "_" +
          destinationCurrency +
          "&compact=ultra";
        $.ajax(currencyConvertURL).done(function(currencyResponse) {
          console.log(currencyResponse);
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
      url:
        "https://api.joinsherpa.com/v2/entry-requirements/" +
        citizenshipID +
        "-" +
        destinationID,
      method: "GET",
      headers: {
        Authorization:
          "Basic Zk5saHhmUTB1cm94YVhvQ1NuOUY2a0V3clFjQWN6OmtSaWFQTWhxTU5GbzdtMDVDbHY5S3IzVVBaNXNjWWg2TnJCaVZkTjQ="
      }
    };

    $.ajax(visaRequirements).done(function(response) {
      console.log(response);
      var newP = $("<p>");

      //Write Visa info to visa div
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
      // visaDiv.text(response.visa[0].type)

      //Write vaccination info to vax div
      var vaxDiv = $("#vaccination");
      var riskDiseaseList = [];
      var recDiseaseList = [];

      if (response.vaccination.risk) {
        for (i = 0; i < response.vaccination.risk.length; i++) {
          var riskDisease = response.vaccination.risk[i].type
            .toLowerCase()
            .replace("_", " ");
          riskDiseaseList.push(riskDisease);
        }
      }

      if (response.vaccination.recommended) {
        for (i = 0; i < response.vaccination.recommended.length; i++) {
          var recDisease = response.vaccination.recommended[i].type
            .toLowerCase()
            .replace("_", " ");
          recDiseaseList.push(recDisease);
        }
      }

      if (!response.vaccination.recommended && !response.vaccination.risk) {
        vaxDiv.text("No recommended vaccinations!");
      } else {
        vaxDiv.html(
          "Before traveling, talk to your doctor about vaccinations against " +
            recDiseaseList +
            ", " +
            riskDiseaseList +
            "."
        );
      }

      //Write length of stay info to length div
      var lengthDiv = $("#lengthofstay");
      var allowedStay = response.visa[0].allowed_stay;
      if (allowedStay) {
        lengthDiv.text("You can stay for " + allowedStay);
      }
       lengthDiv.text("No special requirements!");
      

      var currencyDiv = $("#currency");
      var newCurrencyP = $("<p>");
      newCurrencyP.html("Declaration thresholds: " + response.currency.arrival);
      currencyDiv.prepend(newCurrencyP);
    });
  });
});
