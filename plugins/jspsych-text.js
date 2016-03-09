/* jspsych-text.js
 * Josh de Leeuw
 *
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
 * documentation: docs.jspsych.org
 *
 *
 */

jsPsych.plugins.text = (function() {

  var plugin = {};

  plugin.trial = function(display_element, trial) {

    trial.cont_key = trial.cont_key || [];
	//trial.wrap = trial.wrap || "";
	//trial.audio1 = trial.audio1 || "";
	//trial.audio2 = trial.audio2 || "";
	trial.video = typeof trial.video === 'undefined' ? "" : trial.video;

    // if any trial variables are functions
    // this evaluates the function and replaces
    // it with the output of the function
    trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

    // set the HTML of the display target to replaced_text.
    display_element.html(trial.text);
	/*
	if (trial.wrap == 1) {
		$(document).ready(function(){
			$('#audio').click(function(){
				var aud = document.getElementById("sound");
				aud.play();
				var dur = document.getElementById("sound").duration;
				$('#bubble').show(10).delay(dur*1000).hide(10);
				//document.getElementById("bubble").style.visibility = "visible";
				//$('#wrap').append('<embed id="embed_player" src="Audio/Eng/' + trial.audio1 +'" autostart="true" hidden="true"></embed>');
				//document.getElementById("bubble").style.visibility = "visible";				
			});
			
			
		});
	}
	if (trial.wrap == 2) {
		$(document).ready(function(){
			$('#audio1').click(function(){
				$('#wrap').append('<embed id="embed_player" src="Audio/Eng/' + trial.audio1 + '" autostart="true" hidden="true"></embed>');
			});
			$('#audio2').click(function(){
				$('#wrap').append('<embed id="embed_player" src="Audio/Eng/' + trial.audio2 + '" autostart="true" hidden="true"></embed>');
			});
		});
	}
*/
    var after_response = function(info) {

      display_element.html(''); // clear the display
	  
	  if (trial.video == ""){
	      var trialdata = {
	        "rt": info.rt,
	        "key_press": info.key,
			"stim": JSON.stringify(trial.text)
	      }
	  }
	  
	  else {
	      var trialdata = {
	        "rt": info.rt,
	        "key_press": info.key,
			"stim": JSON.stringify(trial.video)
		  }
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
