/* jspsych-text_wrap2.js
 * Edit Takacs
 * based on Josh de Leeuw's code
 *
 * Plugin for the Child Version of Experiment 3 of the Goal and Place Experiment
 * This plugin displays video, images, and playes audio when images are clicked.
 * Saves the trial list, but responses are not important.
 *
 * documentation: docs.jspsych.org
 *
 *
 */

jsPsych.plugins.text_wrap2 = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    trial.cont_key = trial.cont_key || [];
	trial.audio1 = trial.audio1 || "";
	trial.audio2 = trial.audio2 || "";
	trial.condition = trial.condition ||"";
	trial.video = trial.video || "";
	trial.img1 = trial.img1 || "";
	trial.img2 = trial.img2 || "";
	trial.bubble_l = trial.bubble_l || "";
	trial.bubble_r = trial.bubble_r || "";
	trial.hun = trial.hun || false;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set the HTML of the display target to replaced_text.
    display_element.html(trial.text);
	if (trial.hun == true){
		display_element.append('<audio id=sent1 src="../Audio/Hun/Dori/' +trial.audio1 +'" hidden="true">');
		display_element.append('<audio id=sent2 src="../Audio/Hun/Edit/' +trial.audio2 +'" hidden="ture">');
	}
	else {
		display_element.append('<audio id=sent1 src="../Audio/Eng/Shevaun/' +trial.audio1 +'" hidden="true">');
		display_element.append('<audio id=sent2 src="../Audio/Eng/Celia/' +trial.audio2 +'" hidden="ture">');
	}
	
	display_element.append('<img id="girl1" class="img_1" src="../' + trial.img1 + '">');
	display_element.append('<img id="girl2" class="img_2" src="../' + trial.img2 + '">');
	display_element.append('<img id="bubble_left" src="../' + trial.bubble_l + '">');
	display_element.append('<img id="bubble_right" src="../' + trial.bubble_r + '">');
	
	
	$(document).ready(function(){
		$('#girl1').click(function(){
			var aud1 = document.getElementById("sent1");
			aud1.play();
			var dur = document.getElementById("sent1").duration;
			$('#bubble_left').show(10).delay(dur*1000).hide(10);
		});
		$('#girl2').click(function(){
			var aud2 = document.getElementById("sent2");
			aud2.play();
			var dur = document.getElementById("sent2").duration;
			$('#bubble_right').show(10).delay(dur*1000).hide(10);
		});
	});


    var after_response = function(info) {

      display_element.html(''); // clear the display

      var trialdata = {
        "rt": info.rt,
        "key_press": info.key,
		"stim": JSON.stringify(trial.video),
		  "sentence1": JSON.stringify(trial.audio1),
		  "sentence2": JSON.stringify(trial.audio2),
		  "condition": JSON.stringify(trial.condition),
		  "date": JSON.stringify(Date()),
      }

      jsPsych.finishTrial(trialdata);

    };

    var mouse_listener = function(e) {

      var rt = (new Date()).getTime() - start_time;

      display_element.unbind('click', mouse_listener);

      after_response({
        key: 'mouse',
        rt: rt,
		stim: JSON.stringify(trial.text)
      });

    };

    // check if key is 'mouse'
    if (trial.cont_key == 'mouse') {
      display_element.click(mouse_listener);
      var start_time = (new Date()).getTime();
    } else {
      jsPsych.pluginAPI.getKeyboardResponse({
        callback_function: after_response,
        valid_responses: trial.cont_key,
        rt_method: 'date',
        persist: false,
        allow_held_key: false
      });
    }

  };

  return plugin;
})();
