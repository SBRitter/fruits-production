var extremes = [];
var trialList = [];

$(document).ready(function(){
	exp.init();

	$.ajax({
		url: "http://0.0.0.0:8080/extremes",
		contentType: "text/plain",
		success: function(response) {
			var lines = response.split("\n");
			for (line_number in lines) {
				if (lines[line_number] != "") {
					extremes.push(lines[line_number].split(";"));
				}
			}
		}
	});

	$.ajax({
		url: "http://0.0.0.0:8080/trials",
		contentType: "text/plain",
		success: function(response) {
			var lines = response.split("\n");
			for (line_number in lines) {
				if (lines[line_number] != "" & line_number > 0) {
					trialList.push(lines[line_number].split(";"));
				}
			}
		}
	});
});

var exp = {};

var trialListTraining = trialList;
var trialListExp = trialList;

/*trialListTraining = [
	["AF", "Paprika", "blau", "Paprika", "gruen", "Tomate", "gelb", "Banane", "rot"],
	["NF", "Birne", "blau", "Tomate", "blau", "Moehre", "orange", "Sonnenbrille", "gruen"],
	["ANF", "Sonnenbrille", "gelb", "Zucchini", "rot", "Waescheklammer", "braun", "Aprikose", "blau"]
];*/

/*trialListExp = [
	["NF", "Birne", "blau", "Tomate", "blau", "Moehre", "orange", "Sonnenbrille", "gruen"],
	["AF", "Paprika", "blau", "Paprika", "gruen", "Tomate", "gelb", "Banane", "rot"],
	["ANF", "Sonnenbrille", "gelb", "Zucchini", "rot", "Waescheklammer", "braun", "Aprikose", "blau"]
];*/

/* view handler */
exp.getNextView = function() {
	if (this.view.name === 'intro') {
		this.view = initWarmUpView(extremes);
	} else if (this.view.name === 'warm-up') {
		this.view = initInstructionsView();
	} else if (this.view.name === 'instructions') {
		this.view = initTrialView(trialListTraining, 'practice');
	} else if ((this.view.name === 'practice')){
		this.view = initBeginExpView(trialListExp);
	} else if (this.view.name === 'beginExp') {
		this.view = initTrialView(trialListExp, 'exp');
	} else {
		this.view = initEndView();
	}
};

exp.init = function() {
	this.view = initIntroductionView();
};
