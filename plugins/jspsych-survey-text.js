/**
 * jspsych-survey-text
 * a jspsych plugin for free response survey questions
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */


jsPsych.plugins['survey-text'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    trial.preamble = typeof trial.preamble == 'undefined' ? "" : trial.preamble;
    if (typeof trial.rows == 'undefined') {
      trial.rows = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.rows.push(1);
      }
    }
    if (typeof trial.columns == 'undefined') {
      trial.columns = [];
      for (var i = 0; i < trial.questions.length; i++) {
        trial.columns.push(40);
      }
    }
	trial.hide = typeof trial.hide === 'undefined' ? false : trial.hide;
	trial.video = typeof trial.video === 'undefined' ? "": trial.video;
	
    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // show preamble text
    display_element.append($('<div>', {
      "id": 'jspsych-survey-text-preamble',
      "class": 'jspsych-survey-text-preamble'
    }));

    $('#jspsych-survey-text-preamble').html(trial.preamble);
	
	if (trial.hide==true){
		display_element.append('<div id="Qbtn"></div>');
	    
		for (var i = 0; i < trial.questions.length; i++) {
	      // create div
	      $('#Qbtn').append($('<div>', {
	        "id": 'jspsych-survey-text-' + i,
	        "class": 'jspsych-survey-text-question'
	      }));

	      // add question text
	      $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i] + '</p>');

	      // add text box
	      $("#jspsych-survey-text-" + i).append('<textarea id = "Q_box" name="#jspsych-survey-text-response-' + i + '" cols="' + trial.columns[i] + '" rows="' + trial.rows[i] + '"></textarea>');
	    }
		
	    $('#Qbtn').append($('<button>', {
	      'id': 'jspsych-survey-text-next',
	      'class': 'jspsych-btn jspsych-survey-text'
	    }));
	}
	else {
	    // add questions
	    for (var i = 0; i < trial.questions.length; i++) {
	      // create div
	      display_element.append($('<div>', {
	        "id": 'jspsych-survey-text-' + i,
	        "class": 'jspsych-survey-text-question'
	      }));

	      // add question text
	      $("#jspsych-survey-text-" + i).append('<p class="jspsych-survey-text">' + trial.questions[i] + '</p>');

	      // add text box
	      $("#jspsych-survey-text-" + i).append('<textarea id = "Q_box" name="#jspsych-survey-text-response-' + i + '" cols="' + trial.columns[i] + '" rows="' + trial.rows[i] + '"></textarea>');
	    }
    	// add submit button
 	   	display_element.append($('<button>', {
 			'id': 'jspsych-survey-text-next',
			'class': 'jspsych-btn jspsych-survey-text'
	   	}));
	}
    $("#jspsych-survey-text-next").html('Submit Answer');
    $("#jspsych-survey-text-next").click(function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
      $("div.jspsych-survey-text-question").each(function(index) {
        var id = "Q" + index;
        var val = $(this).children('textarea').val();
        var obje = {};
        obje[id] = val;
        $.extend(question_data, obje);
      });

      // save data
      var trialdata = {
        "rt": response_time,
		  "stim": JSON.stringify(trial.video),
        "responses": JSON.stringify(question_data),
		"subject": JSON.stringify(question_data["Q1"])
      };

      display_element.html('');

      // next trial
      jsPsych.finishTrial(trialdata);
    });

    var startTime = (new Date()).getTime();
	
	$(document).ready( function() {
		$('#Qbtn').delay(9000).show(20);
	});
  };

  return plugin;
})();
