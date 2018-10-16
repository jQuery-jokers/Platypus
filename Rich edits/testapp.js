var sherpaInfo = ["visa", "vaccine", "length of stay"]


$(".btn").click(function (e) { 
    e.preventDefault();
    sherpaInfo.forEach(element => {
        var newDiv = $("<div>");
        newDiv.text("This will display information on " + element);
        $(".country-list-here").append(newDiv);

    });
});



