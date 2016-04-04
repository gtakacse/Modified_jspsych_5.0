/* jspsych-text_wrap1.js
 * Edit Takacs
 * based on the work of Josh de Leeuw
 *
 * This plugin displays video, pictures and plays audio when picuters are clicked.
 * Response is not important, only the trial list.
 *
 * documentation: docs.jspsych.org
 *
 *
 */

jsPsych.plugins.text_wrap1 = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    trial.cont_key = trial.cont_key || [];
	trial.audio = trial.audio || "";
	trial.condition = trial.condition ||"";
	trial.video = trial.video || "";
	trial.img = trial.img || "";
	trial.bubble = trial.bubble || "";
	trial.hun = trial.hun || false;


    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set the HTML of the display target to replaced_text.
    display_element.html(trial.text);
	
	if (trial.hun==true){
		display_element.append('<audio id="sound" src="../Audio/Hun/Dori/' + trial.audio +'" hidden="true">');
	}
	else{
		display_element.append('<audio id="sound" src="../Audio/Eng/Shevaun/' + trial.audio +'" hidden="true">');
	}
	display_element.append('<img id="girl" src="../' + trial.img + '">');
	display_element.append('<img id="bubble" src="../' + trial.bubble + '">')
	

	$(document).ready(function(){
		$('#girl').click(function(){
			var aud = document.getElementById("sound");
			aud.play();
			var dur = document.getElementById("sound").duration;
			$('#bubble').show(10).delay(dur*1000).hide(10);
			//document.getElementById("bubble").style.visibility = "visible";
			//$('#wrap').append('<embed id="embed_player" src="Audio/Eng/' + trial.audio1 +'" autostart="true" hidden="true"></embed>');
			//document.getElementById("bubble").style.visibility = "visible";				
		});
	
	
	});
		
    var after_response = function(info) {

      display_element.html(''); // clear the display

      var trialdata = {
        "rt": info.rt,
        "key_press": info.key,
		"stim": JSON.stringify(trial.video),
		  "sentence": JSON.stringify(trial.audio),
		  "condition": JSON.stringify(trial.condition),
		  "date": JSON.stringify(Date())
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

  return plugin; })();
