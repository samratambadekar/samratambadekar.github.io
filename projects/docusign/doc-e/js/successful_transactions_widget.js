var data;

$(document).ready(function() {
  $.getJSON("./data/data.json", function(json) {
    data = json;
  }).done(function() {
    setWidgetValues('y2017');
  });
});

function setWidgetValues(newYear) {
  var months = ["Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "Jan"];
  var selectedYear = newYear;
  var totalTargetAmount = 0, totalResultAmount = 0;

  months.forEach(function(elem) {
    totalTargetAmount += data[selectedYear][elem].target;
    totalResultAmount += data[selectedYear][elem].result;
  });

  var progress_value = Math.floor((totalResultAmount/totalTargetAmount) * 100);
  $(".doc-e-widget .widget_progress .overall_progress_value").text(progress_value + "%");
  $(".doc-e-widget .widget_progress .progress_indicator").css("width", progress_value + "%");
}
