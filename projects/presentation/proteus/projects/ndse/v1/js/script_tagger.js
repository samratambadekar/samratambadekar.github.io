var svgFillColor = "#ffe084";
var selectedTag;

$(document).ready(function(e) {
  setDocumentHeight();

  // console.log($(".content_main")[0].scrollHeight);
  // console.log($("#documentTags").height());
});


function setDocumentHeight() {
  // ADDING TIMEOUT FOR CHROME TO LOAD / RENDER EVERYTHING PROPERLY
  window.setTimeout(function() {
    $("#documentTags").attr("height", $(".content_main")[0].scrollHeight);
  }, 200);
}

$(".content_sidebar-right").on("click", ".btn-utility[data-qa='properties-panel-delete']", function() {
  deleteTag(selectedTag);
});
$(".content_sidebar-left").on("mousedown", "button.item.btn,button.menu_item", function() {
  var yPosn = 0;
  var newTag;

  // $(".content_main").scrollTop($("#documentTags").height() - $("#documentTags").height()/5);

  if($(this).attr("data-qa") == "Signature") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 446;
    // yPosn = (20 + $("#documentTags").height() - 50) * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable SignatureTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c394" transform="matrix(1.25,0,0,1.25, 64.7455919395466,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="52" height="34" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><image width="52" height="34" style="cursor: auto;" xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/svg/SignHereActive150.svg"></image><image class="tag_settings" style="cursor:pointer;" x="52" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Initial") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 446;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable InitialsTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c407" transform="matrix(1.25,0,0,1.25, 149.53148614609572,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="34" height="40" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/svg/InitialHereActive150.svg" style="pointer-events: none;" width="34" height="40"></image><image class="tag_settings" style="cursor:pointer;" x="34" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Date Signed") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 446;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable DateSignedTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c420" transform="matrix(1.25,0,0,1.25,248.1914357682619,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="65.40966796875" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">Date Signed</tspan></text><image class="tag_settings" style="cursor:pointer;" x="65" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Name") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 515;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable NameTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c433" transform="matrix(1.25,0,0,1.25, 70.91183879093198,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="54.60791015625" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">Full Name</tspan></text><image class="tag_settings" style="cursor:pointer;" x="52" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Email") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 515;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable EmailTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c446" transform="matrix(1.25,0,0,1.25, 158.7808564231738,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="33.00439453125" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">Email</tspan></text><image class="tag_settings" style="cursor:pointer;" x="32" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Company") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 515;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable CompanyTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c459" transform="matrix(1.25,0,0,1.25, 237.4005037783375,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="43.80615234375" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">Company</tspan></text><image class="tag_settings" style="cursor:pointer;" x="45" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Title") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 515;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable TitleTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c472" transform="matrix(1.25,0,0,1.25, 328.352644836272,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="33.00439453125" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">Title</tspan></text><image class="tag_settings" style="cursor:pointer;" x="32" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Text") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 555;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable DataTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c485" transform="matrix(1.25,0,0,1.25, 69.37027707808564,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="75" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9" opacity="1"><tspan dy="9" x="3">Text</tspan></text><image class="tag_settings" style="cursor:pointer;" x="75" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Checkbox") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 555;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable CheckboxTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c499" transform="matrix(1.25,0,0,1.25, 174.19647355163727,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="17" height="17" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><rect fill="#fafafa" stroke="#929393" style="pointer-events: none;" r="1" x="3" y="3" width="11" height="11" stroke-width="0.5"></rect><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="https://appdemo.docusign.com/prepare/d5b871fc-5f02-4ed6-9f7d-c663863e0968/add-fields#check-svg" fill="#fafafa" style="pointer-events: none;" x="4" y="4" width="9" height="9"></use><image class="tag_settings" style="cursor:pointer;" x="17" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Dropdown") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 555;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable DropdownTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c515" transform="matrix(1.25,0,0,1.25, 229.69269521410575,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="78" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">Select</tspan></text><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/svg/uE062-triangle.svg" style="pointer-events: none;" width="4" height="4" x="71" y="4.9999985"></image><image class="tag_settings" style="cursor:pointer;" x="78" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Radio") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 555;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable RadioTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c539" transform="matrix(1.25,0,0,1.25, 342.22670025188916,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="17" height="17" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><circle fill="#fafafa" stroke="#929393" style="pointer-events: none;" r="5.5" cx="8.5" cy="8.5" stroke-width="0.5"></circle><circle fill="#fafafa" style="pointer-events: none;" r="4" cx="8.5" cy="8.5"></circle><image class="tag_settings" style="cursor:pointer;" x="17" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g><g class="draggable RadioTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c541" transform="matrix(1.25,0,0,1.25, 342.22670025188916,' +
       (yPosn + 22) + ')" opacity="1"><rect fill="' + svgFillColor + '" width="17" height="17" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><circle fill="#fafafa" stroke="#929393" style="pointer-events: none;" r="5.5" cx="8.5" cy="8.5" stroke-width="0.5"></circle><circle fill="#fafafa" style="pointer-events: none;" r="4" cx="8.5" cy="8.5"></circle></g><g class="draggable RadioTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c543" transform="matrix(1.25,0,0,1.25, 342.22670025188916,' +
       (yPosn + 44) + ')" opacity="1"><rect fill="' + svgFillColor + '" width="17" height="17" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><circle fill="#fafafa" stroke="#929393" style="pointer-events: none;" r="5.5" cx="8.5" cy="8.5" stroke-width="0.5"></circle><circle fill="#fafafa" style="pointer-events: none;" r="4" cx="8.5" cy="8.5"></circle></g><g class="draggable RadioTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c545" transform="matrix(1.25,0,0,1.25, 342.22670025188916,' +
       (yPosn + 66) +')" opacity="1"><rect fill="' + svgFillColor + '" width="17" height="17" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><circle fill="#fafafa" stroke="#929393" style="pointer-events: none;" r="5.5" cx="8.5" cy="8.5" stroke-width="0.5"></circle><circle fill="#fafafa" style="pointer-events: none;" r="4" cx="8.5" cy="8.5"></circle></g><g class="draggable RadioTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c547" transform="matrix(1.25,0,0,1.25, 342.22670025188916,' +
       (yPosn + 88) + ')" opacity="1"><rect fill="' + svgFillColor + '" width="17" height="17" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><circle fill="#fafafa" stroke="#929393" style="pointer-events: none;" r="5.5" cx="8.5" cy="8.5" stroke-width="0.5"></circle><circle fill="#fafafa" style="pointer-events: none;" r="4" cx="8.5" cy="8.5"></circle></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Attachment") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 600;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable AttachmentTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c560" transform="matrix(1.25,0,0,1.25, 55.496221662468514, ' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="46" height="74" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/svg/tag-attachment.svg" style="pointer-events: none;" width="41.4" height="66.60000000000001" x="2.3000000000000003" y="3.7"></image><image class="tag_settings" style="cursor:pointer;" x="45" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Note") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 600;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable NoteTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c573" transform="matrix(1.25,0,0,1.25, 114.07556675062972,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="66" height="33" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="16" font-size="9" opacity="1"><tspan dy="9" x="16">&nbsp;</tspan></text><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/svg/field-note.svg" style="pointer-events: none;" width="12" height="12" x="2" y="2"></image><image class="tag_settings" style="cursor:pointer;" x="66" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Approve") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 600;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable ApproveTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c587" transform="matrix(1.25,0,0,1.25, 206.56926952141058,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="43.80615234375" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">Approve</tspan></text><image class="tag_settings" style="cursor:pointer;" x="44" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Decline") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 625;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable DeclineTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c600" transform="matrix(1.25,0,0,1.25, 208.11083123425692,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="43.80615234375" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">Decline</tspan></text><image class="tag_settings" style="cursor:pointer;" x="44" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Formula") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 600;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = (20 + $("#documentTags").height() - 250);
    newTag = '<svg><g class="draggable FormulaTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c613" transform="matrix(1.25,0,0,1.25, 275.9395465994962,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="14.031048387096773" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3"></tspan></text><image xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="images/svg/tag-formula.svg" style="pointer-events: none;" width="9" height="8.031048387096773" x="3" y="1"></image><image class="tag_settings" style="cursor:pointer;" x="14" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';
    $("#documentTags").append(newTag);

  } else if($(this).attr("data-qa") == "Payment") {
    // yPosn = $("#documentTags").height() - $("#documentTags").height()/5 - 150 + 600;
    // yPosn = $("#documentTags").height() * Math.random();
    yPosn = $("#documentTags").height() - 200;
    newTag = '<svg><g class="draggable PaymentTabView" data-name="' + $(this).attr("data-qa") + '" data-view-id="c613" transform="matrix(1.25,0,0,1.25, 300.9395465994962,' +
       yPosn + ')" opacity="1"><rect fill="' + svgFillColor + '" width="64.031048387096773" height="13.999997" rx="3.083123425692695" ry="3.083123425692695" fill-opacity="0.75" stroke="transparent" stroke-opacity="1" stroke-width="3.083123425692695" style="cursor: pointer; pointer-events: auto"></rect><text fill="#333" font-family="Lucida Console, Andale Mono, monaco, monospace" style="-webkit-touch-callout: none; -webkit-user-select: none; -khtml-user-select: none; -moz-user-select: none; -ms-user-select: none; user-select: none; pointer-events: none;" y="1" x="3" font-size="9"><tspan dy="9" x="3">$0.00</tspan></text><image class="tag_settings" style="cursor:pointer;" x="45" y="-2" height="25" width="25" xlink:href="images/svg/gear_icon.svg"></image></g></svg>';

    if(isPaymentGatewayAdded) {
      $("#documentTags").append(newTag);
    } else {
      // addPaymentGateway();
    }
  }

  $(".content_main").scrollTop(yPosn);

  // $("#documentTags").append(newTag);
  $(".content_main").html($(".content_main").html());

  // $(".content_main").html($(".content_main").html());
});
//
// function addPaymentGateway() {
//   $("#addPaymentGateway").removeClass("hide hidden");
// }

$(window).on("resize", function() {
  // console.log($(".content_main").find(".draggable").attr("width"));
  $(".content_main").find(".draggable").each(function() {
    if(!$(this).attr("data-x")) {
      $(this).attr("data-x", this.getCTM().e);
      $(this).attr("data-y", this.getCTM().f);
      // console.log(this.getCTM().e);
      // console.log($(this).attr("transform"));
    }
    var scaleVal = parseFloat($(this).parents(".content_main").width()/500);
    // var yPos = $(this).attr("data-y");
    var yPos = $(this).attr("data-y") + ($(this).attr("data-y") / $(this).attr("data-y") * parseFloat($(".PageView").outerHeight()));
    $(this).attr("data-y", yPos);
    console.log(yPos);
    // $(this).attr("transform", "scale(" + scaleVal + ")");
    $(this).attr("transform", "matrix(" + scaleVal + ",0,0," + scaleVal + "," + $(this).attr("data-x") + "," + yPos + ")");
  });
});

interact('.draggable').draggable({
  // enable inertial throwing
  // inertia: true,
  // keep the element within the area of it's parent
  restrict: {
    restriction: "parent",
    endOnly: true
  },
  // enable autoScroll
  autoScroll: true,

  onstart: function() {
    console.log("start");
  },
  // call this function on every dragmove event
  onmove: dragMoveListener,
  // call this function on every dragend event
  onend: function (event) {
  }
});

function dragMoveListener (event) {
  var parentOffset = $(event.target).parents("#documentTags").offset();
  //or $(this).offset(); if you really just want the current element's offset
  var relX = event.pageX - parentOffset.left;
  var relY = event.pageY - parentOffset.top;

  var target = event.target,
      target1 = $(event.target),
      // keep the dragged position in the data-x/data-y attributes
      // x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
      // y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
      x =  relX - parseFloat(target1[0].getBBox().width)/2,
      y =  relY - parseFloat(target1[0].getBBox().height)/2;
      // console.log(parseFloat(target1.width())/2);
      // console.log(parseFloat(target1.height())/2);

  // translate the element
  // target.style.webkitTransform =
  // target.style.transform =
  //   'translate(' + x + 'px, ' + y + 'px)';
  target1.attr("transform", "matrix(1.25,0,0,1.25," + x + "," + y + ")");

  // update the posiion attributes
  target.setAttribute("data-x", x);
  target.setAttribute("data-y", y);
}

// this is used later in the resizing and gesture demos
window.dragMoveListener = dragMoveListener;


$("body").on("click", function(e) {
  $(".draggable").removeClass("selected");

  $(".drawer-properties").find(".drawer-content").removeClass("showing");
  $(".content_sidebar-right").css({"overflow": "auto"});
});
$("body").on("click", ".content_sidebar-right", function(e) {
  e.stopPropagation();
  $(".draggable").removeClass("selected");
});

$("body").on("click", ".draggable", function(e) {
  e.stopPropagation();
  showOptions($(this));
});

function resetTags() {
  $("body").find(".draggable").each(function() {
    deleteTag($(this));
  });
}

function showOptions(element) {
  $(".draggable").removeClass("selected");
  element.addClass("selected");
  selectedTag = element;

  $(".drawer-properties").find(".drawer-content").addClass("showing");

  $(".drawer-properties").find(".drawer-properties_header .icon img").remove();
  $(".drawer-properties").find(".drawer-properties_header .icon").removeClass().addClass("icon icon-palette-field-" + (element.attr("data-name")=="Signature"?"sign":element.attr("data-name").toLowerCase()) + "");

  $(".drawer-properties").find(".drawer-properties_header .ng-binding").text(element.attr("data-name")=="Disclosure"?"Supplement":element.attr("data-name"));
  $(".content_sidebar-right").css({"overflow": "hidden"});

  $(".drawer-properties_main > .tag_option").addClass("hidden");
  $(".drawer-properties_footer").removeClass("hidden");
  if(element.attr("data-name")=="Signature") {
    $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").addClass("hidden");

    $(".drawer-properties_main > .tag_option[data-qa='data-label-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='anchor-tabs-properties-accordion']").removeClass("hidden");
  }
  if(element.attr("data-name")=="Payment") {
    $(".drawer-properties").find(".drawer-properties_header .icon").removeClass().addClass("icon").html("<img class='icon payment_icon' src='images/svg/tag-payment.svg'>");

    $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").addClass("hidden");

    $(".drawer-properties_main > .tag_option[data-qa='pay-provider-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='pay-amount-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='pay-description-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='formatting-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='data-label-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='tooltip-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='anchor-tabs-properties-accordion']").removeClass("hidden");
    $(".drawer-properties_main > .tag_option[data-qa='collab-properties-accordion']").removeClass("hidden");
  }
  if(element.attr("data-name")=="Disclosure") {
    $(".drawer-properties").find(".drawer-properties_header .icon").removeClass().addClass("icon icon-documents");

    $(".drawer-properties_main > .drawer-properties_section > [data-qa='read-only-checkbox']").addClass("hidden");
    $(".drawer-properties_footer").addClass("hidden");

    var documentNum = element.attr("id").slice(10, element.attr("id").length);
    // console.log(documentNum);
    $(".drawer-properties_main > .tag_option.document" + documentNum + "[data-qa='disclosure-options']").removeClass("hidden");
    // $(".drawer-properties_main > .tag_option." + document1 + "[data-qa='disclosure-options']").removeClass("hidden");
  }
}

$(document).on("keydown", function(e) {
  // DELETE TAG
  if(e.keyCode == 8) {
    e.preventDefault();
  }

  if(e.keyCode == 8 && $(".draggable").hasClass("selected")) {
    deleteTag(selectedTag);
  }
});

function deleteTag(tagElem) {
  // console.log($("#documentTags").find(".draggable.selected").closest("svg").remove());
  tagElem.closest("svg").remove();

  $(".drawer-properties").find(".drawer-content").removeClass("showing");
  $(".content_sidebar-right").css({"overflow": "auto"});
}

$("body").on("click", ".btn-recipients", function(e) {
  $("#toolbarRecipientsMenu").toggleClass("invisible");
  $("#toolbarRecipientsMenu").css({top: $(this).offset().top + $(this).outerHeight(), left: $(this).offset().left});
});

$("body").on("click", "#toolbarRecipientsMenu button.item", function(e) {
  var target = $("#toolbarRecipientsMenu").prev("button.btn-recipients");
  $("#toolbarRecipientsMenu button.item").removeClass("on");
  $(this).addClass("on");
  // console.log($(this).find(".ng-binding").text());
  target.find(".ng-binding").text($(this).find(".ng-binding").text());
  // target.find(".swatch-recipient").removeClass().addClass("swatch-recipient");
  target.find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-sm").addClass($(this).find(".swatch-recipient").attr("class"));

  target.attr("data-recipient-num", $(this).attr("data-recipient-num"));


  if(target.find(".swatch-recipient").hasClass("swatch-ext-0")) {
    svgFillColor = "#ffe084";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-1")) {
    svgFillColor = "#c0dcec";
  } else if(target.find(".swatch-recipient").hasClass("swatch-ext-2")) {
    svgFillColor = "#F8CAC1";
  }

  $("#sidebarLeft").find(".swatch-recipient").removeClass().addClass("swatch-recipient swatch-lg").addClass($(this).find(".swatch-recipient").attr("class")).removeClass("swatch-round");
  $("#sidebarLeft").find(".icon-fields-standard").css("color", svgFillColor);
});

$(".content_sidebar-right").on("click", ".accordion", function(e) {
  if($(this).hasClass("open")) {
    $(this).removeClass("open").addClass("closed");
    // $(this).next(".drawer").removeClass("full open").addClass("down closed").css("height", 0);
    $(this).next(".drawer").css("height", 0);
  } else {
    $(this).addClass("open").removeClass("closed");
    // $(this).next(".drawer").removeClass("down closed").addClass("full open").css("height", "auto");
    $(this).next(".drawer").css("height", "auto");
  }
});

$("input").on("keydown", function(e) {
  e.stopPropagation();
});
$("input[data-qa='pay-amount-text']").on("keyup", function(e) {
  e.stopPropagation();
  selectedTag.find("tspan").text("$" + $(this).val());
});



// MOVE TO SEPERATE disclosure JS FILE
$(".singleDocument").on("click", function(e) {
// $(".content_main").scrollTop(1000);
// console.log($("." + $(this).attr("data-doc-num")).position().top);
  $(".content_main").scrollTop(0);
  // $(".content_main").animate({scrollTop: $("." + $(this).attr("data-doc-num")).position().top}, 200);
  $(".content_main").scrollTop($("." + $(this).attr("data-doc-num")).position().top);
});

$(".singleDocument").on("click", ".more_options", function(e) {
  e.stopPropagation();
  $(this).closest(".accordion").find(".menu").toggleClass("invisible");
});

$(".menu li").on("click", function(e) {
  $(this).closest(".menu").addClass("invisible");
});

$(".menu li[role='set_as_supplement']").on("click", function(e) {
  e.stopPropagation();
  var target = $(this).closest(".singleDocument");
  target.toggleClass("supplement");
  target.find(".accordion").click();
  // setDocumentHeight();

  if(target.hasClass("supplement")) {
    $(this).find(".item").text("Reset as Document");
    setDocumentAsSupplement(target.attr("data-doc-num"));
  } else {
    $(this).find(".item").text("Set as Supplement");
    setSupplementAsDocument(target.attr("data-doc-num"));
  }

  $(".disclosure").removeClass("selected");
});

function setDocumentAsSupplement(documentNum) {
  console.log(documentNum);
  $("." + documentNum).find(".PageView").addClass("hide_transition");
  $("." + documentNum).find(".disclosures").removeClass("hide_transition");
}
function setSupplementAsDocument(documentNum) {
  // console.log("")
  $("." + documentNum).find(".PageView").removeClass("hide_transition");
  $("." + documentNum).find(".disclosures").addClass("hide_transition");
}

$("body").on("click", function(e) {
  $(this).find(".disclosure").removeClass("selected");
  // $(this).find(".menu").addClass("invisible");
});
$("#taggerDocument").on("click", ".disclosure", function(e) {
  e.stopPropagation();
  $("#taggerDocument").find(".disclosure").removeClass("selected");
  $(this).addClass("selected");
  // console.log("disc");
  showOptions($(this));
  showSignerTabOptions();
});
$("#topNav").on("click", ".btn-trigger.action", function(e) {
  $("#menuOtherActions").toggleClass("invisible").css({"top": "50px", "left": $(this).offset().left - 30});
});

function showSignerTabOptions() {
  $(".drawer-properties .accordion").removeClass("open").addClass("closed");
  $(".drawer-properties .accordion").next(".drawer").css("height", 0);

  $(".drawer-properties .accordion[data-recipient-num=" + $("#btnRecipients").attr("data-recipient-num") + "]").click();
  // console.log($("#btnRecipients").attr("data-recipient-num"));
}

$("#topNav").on("click", ".btn-back", function() {
  window.location = "prepare.html"
});

$(".drawer-properties").on("click", ".btn-apply-all-signers", function() {
  var parent = $(this).closest(".drawer-content");

  parent.closest("div[data-qa='disclosure-options']").find(".cb_input.discMustOpen").prop("checked", parent.find(".cb_input.discMustOpen").prop("checked")).change();
  parent.closest("div[data-qa='disclosure-options']").find(".cb_input.discMustRead").prop("checked", parent.find(".cb_input.discMustRead").prop("checked"));
  parent.closest("div[data-qa='disclosure-options']").find(".cb_input.discMustAccept").prop("checked", parent.find(".cb_input.discMustAccept").prop("checked")).change();
});

$(".section").on("click", ".cb_label", function(e) {
  // console.log($(this).prev());
  var target=$(this).prev();
  target.prop("checked", (target.prop("checked")?false:true));
  target.change();
});

$(".section").on("change", ".cb_input", function(e) {
    // console.log(target.hasClass("discMustOpen"));
  var target=$(this);

  if(target.prop("checked") && target.hasClass("discMustOpen")) {
    target.closest(".section").next(".section").removeClass("hide_transition");
  } else if(!target.prop("checked") && target.hasClass("discMustOpen")) {
    target.closest(".section").next(".section").addClass("hide_transition");
    target.closest(".section").next(".section").find(".discMustRead").prop("checked", false);
  }

  if(target.prop("checked") && target.hasClass("discMustRead")) {
    target.closest(".section").next(".section").find(".discMustAccept").prop("checked", true);
  }

  if(!target.prop("checked") && target.hasClass("discMustAccept")) {
    target.closest(".section").prev(".section").find(".discMustRead").prop("checked", false);
  }

  var parent = $(this).closest(".drawer-properties_section");
  if(parent.find(".discMustOpen").prop("checked")) {
    parent.find(".disclosure-options-checked").text("viewed");
    // parent.prev().find(".disclosure-options-sub-head").text("Must view");
    parent.prev().find(".disclosure-options-sub-head").text("Must be " + parent.find(".disclosure-options-checked").text());
  }
  if(parent.find(".discMustAccept").prop("checked")) {
    parent.find(".disclosure-options-checked").text("accepted");
    // parent.prev().find(".disclosure-options-sub-head").text("Must accept");
    parent.prev().find(".disclosure-options-sub-head").text("Must be " + parent.find(".disclosure-options-checked").text());
  }
  if(parent.find(".discMustOpen").prop("checked") && parent.find(".discMustAccept").prop("checked")) {
    parent.find(".disclosure-options-checked").text("viewed and accepted");
    // parent.prev().find(".disclosure-options-sub-head").text("Must view & Must accept");
    parent.prev().find(".disclosure-options-sub-head").text("Must be " + parent.find(".disclosure-options-checked").text());
  }
  if(parent.find(".discMustOpen").prop("checked") && parent.find(".discMustRead").prop("checked") && parent.find(".discMustAccept").prop("checked")) {
    parent.find(".disclosure-options-checked").text("viewed, scrolled to end, and accepted");
    // parent.prev().find(".disclosure-options-sub-head").text("Must view, scroll & accept");
    parent.prev().find(".disclosure-options-sub-head").text("Must be " + parent.find(".disclosure-options-checked").text());
  }
  if(!parent.find(".discMustOpen").prop("checked") && !parent.find(".discMustAccept").prop("checked")) {
    parent.find(".disclosure-options-text-info").addClass("hidden");
    parent.find(".disclosure-options-text-info2").removeClass("hidden");
    parent.prev().find(".disclosure-options-sub-head").text("For information only");
  } else {
    parent.find(".disclosure-options-text-info").removeClass("hidden");
    parent.find(".disclosure-options-text-info2").addClass("hidden");
  }
});

$(".menu li[role='edit-documents']").on("click", function(e) {
  $("#modal_edit_docs, #modal_edit_docs .modal").addClass("modal-visible");
});
$("#modal_edit_docs").on("click", "button[data-qa='modal-confirm-btn']", function(e) {
  $("#modal_edit_docs, #modal_edit_docs .modal").removeClass("modal-visible");
  window.location = 'tagger.html';
});


$("#taggerDocument").on("click", ".btn_view", function() {
  $(".disclosure_pages").scrollTop(0);
  $(".btnOtherActions").parents(".drop-down").removeClass("open");

  var parent = $(this).closest(".disclosure");
  // parent.css({"transform": "rotateX(180deg)"});
  var target = parent.next("." + parent.attr("id"));
  target.removeClass("hidden");
  // $(".disclosure_doc, .disclosure_doc > .overlay").css("top", 0);
  target.css({"top": 0, "left": 0});
  target.find(".overlay").css({"top": 0, "left": 0});

  parent.find(".btn_agree").removeClass("disabled");

  scrollTop = $(".documents-wrapper").scrollTop();
  $(".content_main").addClass("scrollLock");
});

var scrollTop = $(".documents-wrapper").scrollTop();

$(".disclosure_tools .close_disclosure").on("click", function() {
  $(".disclosure_doc, .disclosure_doc > .overlay").css("top", "100%");
  $(".content_main").removeClass("scrollLock");

  // var mvp = ;
  $("#mobileviewport").attr("content","width=device-width,initial-scale=1.0,maximum-scale=1.0");
  setTimeout(function(){
    $("#mobileviewport").attr("content","width=device-width,initial-scale=1.0,maximum-scale=5.0");

    $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    if($(window).width() > 768) {
      $("#envelope-wrapper").css({"height": $(window).outerHeight() - $("#toolbar-wrapper").outerHeight() - $("#action-bar-wrapper").outerHeight() - $("#footer-wrapper").outerHeight()});
    }
  }, 300);

});

$(".actions").on("click", ".action", function() {
  window.location = "create_form.html"
});
