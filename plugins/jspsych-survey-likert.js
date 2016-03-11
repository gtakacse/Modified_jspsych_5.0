/**
 * jspsych-survey-likert
 * a jspsych plugin for measuring items on a likert scale
 *
 * Josh de Leeuw
 *
 * documentation: docs.jspsych.org
 *
 */

jsPsych.plugins['survey-likert'] = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    // default parameters for the trial
    trial.preamble = typeof trial.preamble === 'undefined' ? "" : trial.preamble;
	trial.stim = typeof trial.stim === 'undefined' ? "" : trial.stim;
	trial.condition = typeof trial.condition === 'undefined' ? "" : trial.condition;
	trial.video = typeof trial.video === 'undefined' ? "" : trial.video;
	trial.comment = typeof trial.comment === 'undefined' ? false: trial.comment;
	trial.submit = typeof trial.submit === 'undefined' ? "Submit Answer" : trial.submit;
	trial.com_text = typeof trial.com_text === 'undefined' ? "If you would like to leave a comment, you can put it in the box below:": trial.com_text;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // show preamble text
    display_element.append($('<div>', {
      "id": 'jspsych-survey-likert-preamble',
      "class": 'jspsych-survey-likert-preamble'
    }));

    $('#jspsych-survey-likert-preamble').html(trial.preamble);
	
	display_element.append($('<div>', {
		"id": 'sentence_stim',
		"class": 'sentence_stim'
	}));
	$('#sentence_stim').html(trial.stim);

    display_element.append('<form id="jspsych-survey-likert-form">');
    // add likert scale questions
    for (var i = 0; i < trial.questions.length; i++) {
      form_element = $('#jspsych-survey-likert-form');
      // add question
      form_element.append('<label class="jspsych-survey-likert-statement">' + trial.questions[i] + '</label>');
      // add options
      var width = 100 / trial.labels[i].length;
      options_string = '<ul class="jspsych-survey-likert-opts" data-radio-group="Q' + i + '">';
      for (var j = 0; j < trial.labels[i].length; j++) {
        options_string += '<li style="width:' + width + '%"><input type="radio" name="Q' + i + '" value="' + j + '"><label class="jspsych-survey-likert-opt-label">' + trial.labels[i][j] + '</label></li>';
      }
      options_string += '</ul>';
      form_element.append(options_string);
    }
	
	//comment
	if (trial.comment == true){
		display_element.append('<p class="comment">' + trial.com_text + '</p>');
		display_element.append('<textarea id="comment-text" cols="50" rows="4"></textarea>');
	}

    // add submit button
    display_element.append($('<button>', {
      'id': 'jspsych-survey-likert-next',
      'class': 'jspsych-survey-likert jspsych-btn'
    }));
    $("#jspsych-survey-likert-next").html(trial.submit);
    $("#jspsych-survey-likert-next").click(function() {
      // measure response time
      var endTime = (new Date()).getTime();
      var response_time = endTime - startTime;

      // create object to hold responses
      var question_data = {};
	  var comment_data = {};
      $("#jspsych-survey-likert-form .jspsych-survey-likert-opts").each(function(index) {
        var id = $(this).data('radio-group');
        var response = $('input[name="' + id + '"]:checked').val();
        if (typeof response == 'undefined') {
          response = -1;
        }
        var obje = {};
        obje[id] = response;
        $.extend(question_data, obje);
		//comment object
		if (trial.comment == true){
			var comm = document.getElementById('comment-text').value;
			var c_obje = {};
			c_obje[id] = comm;
			$.extend(comment_data, c_obje);
		}
		
      });

      // save data
      var trial_data = {
		  "rt": response_time,
		  "video": JSON.stringify(trial.video),
		  "stim": JSON.stringify(trial.stim),
		  "condition": JSON.stringify(trial.condition),
          "responses": JSON.stringify(question_data),
		  "comment": JSON.stringify(comment_data)
      };

      display_element.html('');

      // next trial
      jsPsych.finishTrial(trial_data);
    });

    var startTime = (new Date()).getTime();
  };

  return plugin;
})();
