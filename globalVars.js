
var buildPhase = true;
var startTimeStamp = 0;
var endTimeStamp = 0;
var currentQuestion = 0;
var currentQuestionJSON = null;
var participantScore = 0;
var duration = 90;
var numberOfQuestions = 12;
// var attempts = [100, 5, 5, 5, 5, 5, 5, 5, 7, 7, 7, 9, 9];
// var scores = [0, 5, 5, 8, 8, 8, 10, 10, 15, 15, 15, 20, 20];
// var solved   = [true, false, false, false, false, false, 
// 				false, false, false, false, false, false, false];
// var attempted = [true, false, false, false, false, false, 
// 				false, false, false, false, false, false, false];

var submissionHistory = [[]];
var questionNumberDiv, questionDetailsDiv;
var answerTextField, submitButton;
var ngui = require('nw.gui');
var nwin = ngui.Window.get();

function setVariables()
{
	var questionLinksHTML = "<hr style='width: 100%;'>";
	for(let i=1;i<=numberOfQuestions;i++)
	{
		questionLinksHTML += "<div id='qn" + i + "' class='questionLink' onclick='displayQuestion("+i+")'>";
		questionLinksHTML += "<div id='qn" + i + "T' class='questionNumber'>Question " + i + "</div>";
		questionLinksHTML += "<div id='qn" + i + "S' class='questionStatus'>" + questions[i]['attempts'] + "</div>";
		questionLinksHTML += "</div>" + (i == numberOfQuestions ? "<hr style='width: 100%;'>" : "<hr>");
		submissionHistory.push([]);
	}
	document.getElementById("sideBarID").innerHTML = questionLinksHTML;

	questionNumberDiv = document.getElementById("appHeaderID");
	questionDetailsDiv = document.getElementById("questionDescriptionID");
	answerTextField = document.getElementById("answerText");
	submitButton = document.getElementById("submitButton");

	startTimeStamp = new Date().getTime();
	endTimeStamp = startTimeStamp + duration * 60000;
	$('#countDown').countdown(endTimeStamp)
		.on('update.countdown', function(event) 
		{
			var format = '%H:%M:%S';
			$(this).html(event.strftime(format));
		})
		.on('finish.countdown', function(event) 
		{
			$(this).text("00:00:00");
		});
	nwin.show();
	nwin.maximize();

}

function displayQuestion(n)
{
	currentQuestion = n;
	questionNumberDiv.innerHTML = "Question " + currentQuestion;
	currentQuestionJSON = questions[currentQuestion];
	questionDetailsDiv.innerHTML = currentQuestionJSON['questionStatement'];
	answerTextField.value = "";
}

function openNav()
{ 
	document.getElementById("myScore").innerHTML = participantScore;
	document.getElementById("mySidenav").style.width = "23%"; 
	document.getElementById("mySidenav").style.transition = "0.5s";
}

function closeNav()
{ 
	document.getElementById("mySidenav").style.width = "0"; 
	document.getElementById("mySidenav").style.transition = "0.3s";
}

function submit()
{
	// alert(submissionHistory);
	if(buildPhase)
		submitX();
}

function submitX() 
{
	if(currentQuestionJSON['solved'])
		return;

	currentQuestionJSON['attempted'] = true;

	var typedAnswer = answerTextField.value;
	var cur = document.getElementById("qn"+currentQuestion+"S");

	if(typedAnswer.length <= 0)
		return;

	if(submissionHistory[currentQuestion].indexOf(typedAnswer) >= 0)
	{
		 if(!confirm("You have already submitted this answer for this question. Are you sure you want to submit again?"))
		 		return;
	}

	submissionHistory[currentQuestion].push(typedAnswer);

	if("aeiou".indexOf(typedAnswer) >= 0) 
	{
		cur.style.border = "2px solid #37B76C";
		cur.style.color = "#37B76C";
		cur.innerHTML = '&#10003;'
		currentQuestionJSON['solved'] = true;
		participantScore += currentQuestionJSON['score'];
		document.getElementById("sDinner2").innerHTML = participantScore;
	}
	else if(currentQuestionJSON['attempts'] > 0)
	{
		currentQuestionJSON['attempts']--;
		cur.style.border = "2px solid #FF3F2F";
		cur.style.color = "#FF3F2F";
		cur.innerHTML = currentQuestionJSON['attempts'];
		if(currentQuestionJSON['attempts'] == 0)
			currentQuestionJSON['solved'] = true;
	}

}
