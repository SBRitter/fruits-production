var initIntroductionView = function(sendData) {
	var view = {};
	view.name = 'intro';
	view.template = $('#intro-templ').html();
	var rendered = Mustache.render(view.template);
	$('#main').html(rendered);
	$('#start-exp-btn').on('click', function() {
		exp.getNextView();
	});
	return view;
};

var initInstructionsView = function() {
	var view = {};
	view.name = 'instructions';
	view.template = $('#instructions-templ').html();
	var rendered = Mustache.render(view.template);
	$('#main').html(rendered);
	$('#continue-btn').on('click', function() {
		exp.getNextView();
	});
	return view;
};

var populateTrialLayout = function(trialList, trialNumber) {
	imageUrl = "url('img/fruits/" + trialList[trialNumber][1].toLowerCase() + "_" + trialList[trialNumber][2].toLowerCase() + ".png')"
	$("#target-content").css("background-image", imageUrl);
	imageUrl = "url('img/fruits/" + trialList[trialNumber][3].toLowerCase() + "_" + trialList[trialNumber][4].toLowerCase() + ".png')"
	$("#competitor-content").css("background-image", imageUrl);
	imageUrl = "url('img/fruits/" + trialList[trialNumber][5].toLowerCase() + "_" + trialList[trialNumber][6].toLowerCase() + ".png')"
	$("#distractor1-content").css("background-image", imageUrl);
	imageUrl = "url('img/fruits/" + trialList[trialNumber][7].toLowerCase() + "_" + trialList[trialNumber][8].toLowerCase() + ".png')"
	$("#distractor2-content").css("background-image", imageUrl);
}

var adjustLayoutPositions = function() {
	positions = getRandomPositionList();
	$("#target").removeClass().addClass(positions[0]).addClass("drop-area");
	$("#competitor").removeClass().addClass(positions[1]).addClass("drop-area");
	$("#distractor1").removeClass().addClass(positions[2]).addClass("drop-area");
	$("#distractor2").removeClass().addClass(positions[3]).addClass("drop-area");
}

var initBeginExpView = function() {
	var view = {};
	view.name = 'beginExp';
	view.template = $('#begin-exp-templ').html();
	var rendered = Mustache.render(view.template);
	$('#main').html(rendered);
	$('#continue-btn').on('click', function() {
		exp.getNextView();
	});
	$(document).unbind();
	return view;
};

var initWarmUpView = function(itemsList) {
	var view = {};
	view.name = "warm-up";
	view.template = $('#warmup-templ').html();
	var rendered = Mustache.render(view.template);
	$('#main').html(rendered);
	var current = 0;
	$(".warm-up-btn").on('click', function(){
		$(".button").css("text-align", "center");
		if (itemsList[current] != null) {
			$('#warmup-img').html("<img src='img/fruits/" + itemsList[current][0].toLowerCase() + "_" +  itemsList[current][1] + ".png' height=400px>" +
				"<p class='warmup-phrase'><b>die " +  inflectNominative(itemsList[current][1], itemsList[current][0]) + " " + umlaut(itemsList[current][0]) + "</b></p>");
			$('#warmup-info').html('');
			current = current + 1;
		} else { 
			exp.getNextView();
			$(document).unbind();
		}
	});
	return view;
};

var initTrialView = function(trialList, viewName) {
	var view = {};
	view.name = viewName;
	view.template = $('#trial-templ').html();
	var rendered = Mustache.render(view.template);
	$('#main').html(rendered);
	var current = 0;
	var competitorSequence = true;
	var targetSequence = false;

	// init first trial
	$("#sentence").hide();
	$("#curtain").show();
	$("#start-point").show();
	populateTrialLayout(trialList, current);
	adjustLayoutPositions();
	var competitorAdjective = trialList[current][4];
	var competitorNoun = trialList[current][3];
	competitorAdjective = inflectDative(competitorAdjective, competitorNoun);
	competitorNoun = umlaut(competitorNoun);
	targetSequence = true;
	competitorSequence = false;
	setTimeout(function() {
		$("#curtain").fadeOut('fast');
		$("#start-point").fadeOut('fast');
		competitorSentence(competitorAdjective + " " + competitorNoun);
	}, 3000)

  // now, views are changed after dropping
	$("#cube").draggable();
	$(".drop-area").droppable({
		drop: function( event, ui ) {
			if (trialList[current] != null) {
				if (competitorSequence && $(this).is("#target")) {
					$("#curtain").fadeIn('fast');
					$("#start-point").fadeIn('fast');
					$("#sentence").fadeOut('fast');
					targetSequence = true;
					setTimeout(function() {
						$("#cube").css("top", "30%");
						$("#cube").css("left", "47%");
						populateTrialLayout(trialList, current);
						adjustLayoutPositions();
						var competitorAdjective = trialList[current][4];
						var competitorNoun = trialList[current][3];
						competitorAdjective = inflectDative(competitorAdjective, competitorNoun);
						competitorNoun = umlaut(competitorNoun);
						competitorSentence(competitorAdjective + " " + competitorNoun);
						competitorSequence = false;
						$("#curtain").fadeOut('fast');
						$("#start-point").fadeOut('fast');
					}, 3000);
				} else if (targetSequence && $(this).is("#competitor")) {
					var targetAdjective = trialList[current][2];
					var targetNoun = trialList[current][1];
					targetAdjective = inflectDative(targetAdjective, targetNoun);
					targetNoun = umlaut(targetNoun);
					targetSentence(targetAdjective + " " + targetNoun);
					targetSequence = false;
					competitorSequence = true;
					current = current + 1;
				}
			} else {
				exp.getNextView();
			}
		}
	});
	return view;
}

var inflectDative = function(adjective, noun) {
	adjective = umlaut(adjective);
	if (adjective != "orange" && adjective != "lila") {
		adjective = adjective + "en";
	} else if (adjective == "orange") {
		adjective = adjective + "nen";
	}
	return adjective;
}

var inflectNominative = function(adjective, noun) {
	adjective = umlaut(adjective);
	if (adjective != "orange" && adjective != "lila") {
		adjective = adjective + "e";
	} else if (adjective == "orange") {
		adjective = adjective + "ne";
	}
	if (noun.charAt(noun.length-1) == "n" && adjective != "lila") {
		adjective = adjective + "n";
	}
	return adjective;
}

var umlaut = function(word) {
	word = word.replace("ue", "ü");
	word = word.replace("oe", "ö");
	word = word.replace("ae", "ä");
	return word;
}

var competitorSentence = function(competitor) {
	$("#arrow-target").removeClass("arrow");
	setTimeout(function() {
		$("#arrow-competitor").addClass("arrow");
	}, 1000);
	setTimeout(function() {
		$("#sentence").html("<br>Du sollst den Würfel auf <b>" + findDeterminer(competitor.split(" ")[1]) + " " + competitor + "</b> ablegen.")
		$("#sentence").fadeIn(250);
	}, 1500);
}

var targetSentence = function(target) {
	$("#arrow-competitor").removeClass("arrow");
	$("#sentence").hide();
	setTimeout(function() {
		$("#arrow-target").addClass("arrow");
	}, 1000);
	setTimeout(function() {
		$("#sentence").html("<br>Und jetzt sollst du den Würfel auf <b>" + findDeterminer(target.split(" ")[1]) + " " + target + "</b> ablegen.")
		$("#sentence").fadeIn(250);
	}, 1500);
}

var findDeterminer = function(noun) {
	determiner = "der";

	if (noun == "Bohnen" || noun == "Trauben" || noun == "Socken" || noun == "Kartoffeln" || noun == "Erbsen") {
		determiner = "den";

	}
	return determiner;
}

var initEndView = function() {
	var view = {};
	view.name = 'endView';
	view.template = $('#end-templ').html();
	var rendered = Mustache.render(view.template);
	$('#main').html(rendered);
	$('#continue-btn').on('click', function() {
		exp.getNextView();
	});
	return view;
};

var getRandomPositionList = function() {
	positionList = ["lower-left", "upper-left", "lower-right", "upper-right"]
	counter = positionList.length - 1
	while (counter > -1){
		random_number = Math.floor(Math.random() * 3);
		temp = positionList[counter]
		positionList[counter] = positionList[random_number];
		positionList[random_number] = temp;
		counter = counter - 1;
	}
	return positionList;
};
