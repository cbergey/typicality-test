var my_node_id;
var trial = 0;
var adj = ""
var noun = ""

var get_info = function() {
  // Get info for node
  
  dallinger.getReceivedInfos(my_node_id)
    .done(function (resp) {
      var stims = resp.infos[0].contents;
      console.log(resp.infos)
      console.log(stims)
      stims = stims.replace(/[\.-\/#!$%\^&\*;:{}=\-_`~()@\+\?><\[\]\+]/g, '')
      var words = stims.split(",")
      adj = words[trial*3]
      noun = words[trial*3 + 1]
      adj.trim()
      $("#story").html("How typical is it for a <b>" + noun + "</b> to be <b>" + adj + "</b>?");
      $("#stimulus").show();
      $("#response-form").hide();
      $("#submit-response").show();
    })
    .fail(function (rejection) {
      console.log(rejection);
      $('body').html(rejection.html);
    });
};

var create_agent = function() {
  $('#finish-reading').prop('disabled', true);
  dallinger.createAgent()
    .done(function (resp) {
      $('#finish-reading').prop('disabled', false);
      my_node_id = resp.node.id;
      get_info();
    })
    .fail(function (rejection) {
      // A 403 is our signal that it's time to go to the questionnaire
      if (rejection.status === 403) {
        dallinger.allowExit();
        dallinger.goToPage('questionnaire');
      } else {
        dallinger.error(rejection);
      }
    });
};

submit_response = function(choice) {

  dallinger.createInfo(my_node_id, {
    contents: choice,
    property1: adj,
    property2: noun,
    info_type: 'Info'
  }).done(function (resp) {
    trial = trial + 1;
    if (trial == 0 || trial == 10) {
      create_agent();
    } else {
      get_info();
    }
  });
};

$(document).ready(function() {

  $("#submit-response").click(function() {
    $("#submit-response").addClass('disabled');
    $("#submit-response").html('Sending...');


    dallinger.createInfo(my_node_id, {
      contents: response,
      property3: response,
      info_type: 'Info'
    }).done(function (resp) {
      if (trial == 0 || trial == 10) {
        create_agent();
      } else {
        get_info();
      }
    });
  });

});
