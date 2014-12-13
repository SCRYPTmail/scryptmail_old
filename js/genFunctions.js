/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

// Globals define
$(document).ready(function () {

	//console.log(navigator.userAgent);
	isCompatible();

	if (window.location.hostname != "encrypt-mail1.com") {
		window.onerror = function(message, url, lineNumber) {
			var errorObj={'url':url,'line':lineNumber,'message':message};

			$.ajax({
				type: "POST",
				url: '/submitError',
				data: {
					'errorObj': JSON.stringify(errorObj)
				},
				dataType: 'json'
			});

			return false;
		};

	}

	sessionKey = window.name;
	window.name = '';

	$('#LoginForm_username').attr('name', makerandom());
	$('#LoginForm_password').attr('name', makerandom());

	initialFunction();

	$(document).bind('click', function () {
		myTimer();
	});
	$(document).bind('keypress', function () {
		myTimer();
	});

});
function isCompatible(){
	var compatible=['Chrome','Firefox'];
	var inCompatible=['Safari','iPad','iPhone','iPod','MSIE 8.0','MSIE 9.0'];
	var checkCapability=$.Deferred();
	bug=false;
	error=false;

	//return (navigator.userAgent.indexOf("iPad") != -1);
	if(navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Firefox") != -1){

		if(
		navigator.userAgent.indexOf("iPad") != -1||
		navigator.userAgent.indexOf("iPod") != -1||
		navigator.userAgent.indexOf("iPhone") != -1||
		navigator.userAgent.indexOf("MSIE 8.0") != -1 ||
		navigator.userAgent.indexOf("MSIE 9.0") != -1){

		bug=true;
	}
		try{
			forge.util.hexToBytes('3df5');
		}catch (err) {
			error=true;
		}

		if(window.FileReader) {
			//do this
		} else {
			error=true;
		}
		checkCapability.resolve();
	}else{
		if(navigator.userAgent.indexOf("Safari") != -1 ||
			navigator.userAgent.indexOf("iPad") != -1||
			navigator.userAgent.indexOf("iPod") != -1||
			navigator.userAgent.indexOf("iPhone") != -1||
			navigator.userAgent.indexOf("MSIE 8.0") != -1||
			navigator.userAgent.indexOf("MSIE 9.0") != -1){

			bug=true;
		}

		try{
			forge.util.hexToBytes('3df5');
		}catch (err) {
			error=true;
		}

		if(window.FileReader) {
			//do this
		} else {
			error=true;
		}
		checkCapability.resolve();

	}
//console.log(bug);
	//console.log(error);
	checkCapability.done(function () {
		if(bug){
			$('#incomp').css('display','block');
			$('#incomp span').html('Your browser/device not 100% compatible with this service. Please refer to our list of <a href="http://blog.scryptmail.com/post/103842937050/scryptmail-browser-compatibility" target="_blank">compatible browsers</a>');
			//alert('Your browser/device not 100% compatible with this website. Please read list of compatible devices and browser at our blog');
		}
		if(error){
			$('#incomp').css('display','block');
			$('#incomp span').html('Your browser/device may not be compatible with this service, and your connection may not be secure. Please refer to our list of <a href="http://blog.scryptmail.com/post/103842937050/scryptmail-browser-compatibility" target="_blank">compatible browsers</a>');
			//alert('');
		}

	});

}

resetRawTokenHash='';
fileSelector='';
resetAesTokenHash='';
resSalt='';
folderDecoded = $.Deferred();
sessionKey = '';
key = makeModKey('f');
mailPrivateKey = '';
mailPublickKey = '';
seedPrivateKey = '';
seedPublickKey = '';
sigPubKey = '';
sigPrivateKey = '';
folderKey = '';
userModKey = '';
contactTable = '';
sessionTimeOut=40;
toFile='';

contactListProfileInitialized = false;
folder_navigate = 'Inbox';
activePage = 'mail';
modKeys = [];
contacts = {};

message = {
	'mail': '',
	'meta': '',
	'newModKey': '',
	'oldModKey': '',
	'iv': '',
	'mailHash': ''
};
checkMailTime=10000;
emailObj = {
	'meta': {},
	'body': {},
	'modKey': '',
	'mailId': ''
};
messageBody='';
messageDisplayedBody='';
fileObject = {};
fileSize = 0;

mailhash = '';
contactHash = '';
blackListHash = '';
profileHash = '';
folderHash = '';


modkeyToMessag = {};
folder = {};

domains = [];
userData = '';
roleData = '';
original = true;
inner = 0;
blackList = [];
profileSettings = {};

lastAvailableSeed = 0;
lastParsedSeed = 0;
lastParsedEmail = 0;

seedLimit = 500;
mailParsing = 100;
mailRetrievePromises = [];


var timer;
var newMailer;
var opener;
var mailt;

function resetGlobal() {
	folder = {};
	fileObject = {};
	fileSize = 0;
	mailPrivateKey = '';
	mailPublickKey = '';
	newMails = 0;
	seedPrivateKey = '';
	seedPublickKey = '';
	sigPubKey = '';
	sigPrivateKey = '';
	folderKey = '';
	userModKey = '';
	contacts = {};
	blackList = [];
	profileSettings = {};
	folderDecoded = $.Deferred();
	mailhash = '';
	fileSelector='';
	contactHash = '';
	messageBody='';
	messageDisplayedBody='';
	blackListHash = '';
	profileHash = '';
	folderHash = '';
	lastAvailableSeed = 0;
	lastParsedSeed = 0;
	lastParsedEmail = 0;

	$("#folderul").empty();
	$("#mobfolder").empty();
	$(".table-wrap").empty();
	//$("#content").html('');

	if (activePage == 'profile') {
		window.location.href = '#mail';
	}

	clearInterval(timer);
	clearInterval(newMailer);
	clearInterval(mailt);


	try {
		var t = $('#mail-table').DataTable();
		t.clear();
		t.draw();
	} catch (err) {
	}

}
function initialFunction() {
	getLoginStatus()
		.always(function (result) {
			if (result == 1) {
				getObjects()
					.always(function (data) {
						if (data.userData && data.userRole) {
							userData = data.userData;
							roleData = data.userRole;
							getDomain()
								.done(function (doma) {
									domains = JSON.parse(doma);
									if (window.location.hostname != "encrypt-mail1.com") {
										$(window).bind('beforeunload', function (event) {
											return 'Reloading page will require you to provide login credentials';
										});
									}

									retrieveSecret();
								});
						}
					});

			} else {
				resetGlobal();
				sessionKey = '';
				showLog(function () {
					initialFunction();
				}, function () {
				});
			}
		});


}

function getLoginStatus() {
	return $.ajax({
		type: "POST",
		url: '/LoginStatus',
		data: {
			'secureToken': SHA512(sessionKey)
		},
		dataType: 'json'
	});
}

function getObjects() {
	return $.ajax({
		type: "POST",
		url: '/getObjects',
		data: {
		},
		dataType: 'json'
	});

}

function getDomain() {
	return $.get("getDomains");

}

function getMainData() {

	getObjects()
		.always(function (data) {
			if (data.userData && data.userRole) {
				userData = data.userData;
				roleData = data.userRole;
				getDomain()
					.done(function (doma) {
						domains = JSON.parse(doma);
					});
			} else
				noAnswer('Error occurred. Please Try again');
		});

}


function delContact(row, email) {

	$('#contactList').DataTable().row($(row).parents('tr')).remove().draw(false);

	delete contacts[email];
	checkContacts();

}



function checkState(success, cancel) {

	getLoginStatus()
		.always(function (result) {
			if (result == 1) {
				success();
			} else {
				initialFunction();
			}
		});

}
function newMailCheckRoutine() {

	clearInterval(newMailer);
	if (seedPrivateKey != '') {
		newMailer = setInterval(function () {

			$.get("getNewSeeds")
				.done(function (newMaxSeed) {
					if (!isNaN(newMaxSeed)) {
						//profileSettings['lastSeed'] = 0;
						//profileSettings['newMails'] = 0;
						//checkProfile();
						//console.log(profileSettings);
						//console.log(profileSettings);
						if (newMaxSeed > profileSettings['lastSeed']) {
							lastAvailableSeed = parseInt(newMaxSeed);
							lastParsedSeed = parseInt(profileSettings['lastSeed']);
							clearInterval(newMailer);
							//showEmailFetch();
							newMailSeedRoutine();
						}

					}
				})
				.fail(function () {
					initialFunction();
				});
		}, checkMailTime);
	}

}


function newMailSeedRoutine() {

	if (profileSettings['lastSeed'] < lastAvailableSeed) {

		if (roleData['role']['mailPerBox'] > checkEmailAmount()) {
			checkState(function () {
				$.ajax({
					type: "POST",
					url: '/getNewSeedsData',
					data: {
						'startSeed': lastParsedSeed,
						'limit': seedLimit
					},
					success: function (data, textStatus) {
						if (data['response'] == 'success') {
							tryDecryptSeed(data.data);
						}
					},
					error: function (data, textStatus) {
						setTimeout(function () {
							newMailSeedRoutine()
						}, 40000);
					},
					dataType: 'json'
				});


			}, function () {
			});
		} else {
			newMailCheckRoutine();
			showEmailFetch();
		}
	}
}

function tryDecryptSeed(data) { //TODO check internal and outside mail can be detected
	var start = new Date().getTime();
	var sucessfull = {};

	var parseChunk = data.splice(0, mailParsing);


	var index = 0;
	var cont = Object.keys(parseChunk).length;

	var process = function () {

		var value = parseChunk[index];
		try {
			//console.log(value);
			var decrypted = seedPrivateKey.decrypt(forge.util.hexToBytes(value['meta']), 'RSA-OAEP');
			decrypted = forge.util.bytesToHex(decrypted);
			sucessfull[value['id']] = {'mod': decrypted};
		} catch (err) {
			//dfd.resolve();
		}

		if (index + 1 < cont) {
			setTimeout(process, 2);
		} else { //if all rows in chunk checked
			lastParsedSeed = parseInt(value['id']);
			if (Object.keys(data).length > 0) { // if chunks left try to process all of them

				var end = new Date().getTime();
				var time = end - start;

				//function to equalize encoding speed minimum 10 keys
				if (time < 3000)
					mailParsing += 20;
				if (time > 3100)
					mailParsing -= 20;
				if (mailParsing < 10)
					mailParsing = 10;


				if (jQuery.isEmptyObject(sucessfull)) { //if no mail is found, save last seed and go to next chunk
					profileSettings['lastSeed'] = parseInt(lastParsedSeed);
					checkProfile();
				} else {
					//console.log(profileSettings); //if found mails try to move inbox
					moveMessagestoInbox(sucessfull);
				}

				tryDecryptSeed(data);

			} else { //no more chunks left
				if (jQuery.isEmptyObject(sucessfull)) {
					profileSettings['lastSeed'] = parseInt(lastParsedSeed);
					checkProfile();
				}
				else {
					//console.log(profileSettings);
					moveMessagestoInbox(sucessfull);
				}


				//console.log(sucessfull);

				if (lastParsedSeed < lastAvailableSeed) {  //future newMaxSeed
					newMailSeedRoutine(); //fetch more hashes to repeat
				} else {
					checkProfile();
					newMailCheckRoutine(); //go to interval checking for new mails

				}

			}
			//lastParsedSeed = parseInt(value['id']);
		}

		lastParsedSeed = parseInt(value['id']);
		showEmailFetch();
		index++;

	};

	if (roleData['role']['mailPerBox'] > checkEmailAmount())
		process();


}

function showFetcher() {

	$('.fetch-space').css('display', 'block');

	var delspam = '<i class="fa fa-envelope-o fa-lg pull-right"></i>';

	var showprogress = '<div class="progress progress-micro"><div class="progress-bar progress-primary"></div></div>';

	$('.fetch-space').html('<div rel="tooltip" title="Looking for new email" data-placement="top"><span></span>/<span><strong></strong></span>' + delspam + '<br>' + showprogress + '</div>');

	$('.emailMob1').html('<div rel="tooltip" title="Looking for new email" data-placement="top"><span></span>/<span><strong></strong></span>' + delspam + '<br>' + showprogress + '</div>');

	//console.log($('.emailMob1 div').attr('title')); //200
	//console.log($('.fetch-space div').children().eq(1).text()); //600
	//console.log($('.fetch-space div div div').css('width','33%'));
	//console.log('ddd');
}


function showEmailFetch() {

	if (profileSettings['lastSeed'] < lastAvailableSeed) {

		if ($('.fetch-space').is(":visible") === false && $('.emailMob1 div').attr('title') == undefined)
			showFetcher();

		var totalcount = lastParsedSeed;
		var max = lastAvailableSeed;

		//var delspam = '<i class="fa fa-envelope-o fa-lg pull-right"></i>';
		//var delspam='';
		//var showprogress = '<div class="progress progress-micro"><div class="progress-bar progress-primary" style="width: ' + (totalcount * 100) / max + '%;"></div></div>';

		if (roleData['role']['mailPerBox'] > checkEmailAmount()) {

			$('.fetch-space div').children().eq(0).text(totalcount);
			$('.fetch-space div').children().eq(1).text(max);
			$('.fetch-space div div div').css('width', (totalcount * 100) / max + '%');

			$('.emailMob1 div').children().eq(0).text(totalcount);
			$('.emailMob1 div').children().eq(1).text(max);
			$('.emailMob1 div div div').css('width', (totalcount * 100) / max + '%')

			//$('.fetch-space').html('<div rel="tooltip" title="Looking for new email" data-placement="top">' + totalcount + '/<strong>' + max + '</strong>' + delspam + '<br>' + showprogress + '</div>');
			//	$('.emailMob1').html('<div rel="tooltip" title="Looking for new email" data-placement="top">' + totalcount + '/<strong>' + max + '</strong>' + delspam + '<br>' + showprogress + '</div>');
		} else {

			$('.fetch-space').html('<div rel="tooltip" title="Your Inbox is over limit, please delete emails, or upgrade plan" data-placement="top"><b style="color:red;">' + totalcount + '/<strong>' + max + '</strong>' + delspam + '<br>' + showprogress + '</b></div>');
		}

	} else {
		showLimits();
		$('.fetch-space').css('display', 'none');
	}

	finishRendering();
}


function showLimits() {

	var totalcount = 0;

	totalcount = checkEmailAmount();
	var max = roleData['role']['mailPerBox'];

	//	var delspam='<a href="javascript:void(0);" rel="tooltip" title="Delete Spam" data-placement="top" class="pull-right txt-color-darken"><i class="fa fa-trash-o fa-lg"></i></a>';
	var delspam = '';

	var showprogress = '<div class="progress progress-micro"><div class="progress-bar progress-primary" style="width: ' + (totalcount * 100) / max + '%;"></div></div>';
	$('.inbox-space').html(totalcount + '/<strong>' + max + '</strong><img src="img/logo.svg" alt="emails per account" style="height:25px;margin-left:4px;margin-bottom:2px;">' + delspam + '<br>' + showprogress);


	if (roleData['role']['mailPerBox'] > checkEmailAmount()) {
		$('.emailMob1').html(totalcount + '/<strong>' + max + '</strong><img src="img/logo.svg" alt="emails per account" style="height:25px;margin-left:4px;margin-bottom:2px;">' + delspam + '<br>' + showprogress);
	} else
		$('.emailMob1').html('<div rel="tooltip" title="Your Inbox is over limit, please delete emails, or upgrade plan" data-placement="top"><b style="color:red;">' + totalcount + '/<strong>' + max + '</strong><img src="img/logo.svg" alt="emails per account" style="height:25px;margin-left:4px;margin-bottom:2px;">' + delspam + '<br>' + showprogress + '</b></div>');

}


function moveMessagestoInbox(newMessages) {

	var chunks = {};
	var cont = 0;
	var ct = Object.keys(newMessages).length;

	$.each(newMessages, function (index, value) {
		chunks[index] = value;
		if (cont > 60) {
			//console.log(chunks);
			retrieveNewTable(chunks)
				.always(function (data) {
					if (data.response == 'success') {
						$.each(data['data'], function (indexi, value) {
							var decrypted = forge.util.bytesToHex(mailPrivateKey.decrypt(forge.util.hexToBytes(value['pass']), 'RSA-OAEP'));

							profileSettings['lastSeed'] = parseInt(index);

							if (decrypted != '') {
								folder['Inbox'][value['id']] = {'p': decrypted, 'opened': false};
								getNewEmailsCount();
							}
						});
						checkFolders();
					}
				});
			chunks = {};
			cont = -1;
		}
		if (!--ct) {

			retrieveNewTable(chunks)
				.always(function (data) {
					if (data.response == 'success') {
						$.each(data['data'], function (indexi, value) {

							var decrypted = forge.util.bytesToHex(mailPrivateKey.decrypt(forge.util.hexToBytes(value['pass']), 'RSA-OAEP'));

							profileSettings['lastSeed'] = parseInt(index);

							if (decrypted != '') {
								folder['Inbox'][value['id']] = {'p': decrypted, 'opened': false};
								getNewEmailsCount();
							}
						});

						checkFolders();
					}
				});

			chunks = {};
			cont = -1;
		}

		cont++;
	});
	//profileSettings['lastSeed']=lastAvailableSeed;

	checkProfile();
	//console.log(folder_navigate);

}


function retrieveNewTable(chunks) { //todo change modkey when copy, to differ from sender
	return $.ajax({
		type: "POST",
		url: '/moveNewMail',
		data: {
			'chunks': chunks
		},
		success: function (data, textStatus) {
		},
		error: function (data, textStatus) {
		},
		dataType: 'json'
	});
}


function providePassword(success, cancel) {

	$('#dialog-form-pin').dialog({
		autoOpen: false,
		height: 230,
		modal: true,
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Continue",
				"class": "btn btn-primary",
				"id": 'secretok',
				click: function () {
					if ($('#pin').val() != "") {
						success($('#pin').val());
						$('#pin').val('');
						$(this).dialog("close");
					} else {
						noAnswer('PIN can not be empty');
					}

				}
			}
		]
	});
	$('#pin').val(Math.floor(Math.random() * 90000) + 10000);
	$('#dialog-form-pin').dialog('open');
}


function provideSecret(success, cancel) {


	$('#dialog-form').dialog({
		autoOpen: false,
		height: 200,
		width: 350,
		modal: true,
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Ok",
				"class": "btn btn-primary",
				"id": 'secretok',
				click: function () {
					if (verifySecret($('#secret').val())) {
						success($('#secret').val());
						$('#secret').val('');
						$('#key').css('display', 'none');
						$(this).dialog("close");
						Answer('Thank You');
					} else {
						noAnswer('Incorrect Secret');
					}

				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default",
				click: function () {
					// window.location='logout';
					$('#secret').val('');
					cancel();
					$('#key').css('display', 'block');
					$(this).dialog("close");
				}

			}
		]
	});
//disable asking secret everyrefresh;
	//success('aaaaaa');
		$('#dialog-form').dialog('open');

}
function logOut() {
	resetGlobal();
	$(window).unbind('beforeunload');
	window.location = 'logout';
}

function myTimer() {
	var sec = sessionTimeOut;
	clearInterval(timer);

	if (seedPrivateKey != '') {

		timer = setInterval(function () {

				if (ismobile)
					$('#timeout').text('Expire in ' + (sec--) + ' sec');
				else
					$('#timeout').text('Session will expire in ' + (sec--) + ' sec');



			if (sec < 0) {
				resetGlobal();
				initialFunction();
			}
		}, 1000);
	}

}

function emailSelection(object, container) {
	container.parent().addClass("label-success");

	container.parent().attr('title', object.text.replace('<', ' <'));
	//container.parent().attr('data-placement', 'bottom');
	//container.parent().attr('data-original-title', object.text.replace('<', ' <'));
	return object.text;
}

function fileSelection(object, container) {
	container.parent().addClass("label-success");
	return object.text;
}


function IsEmail(email) {
	var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_<`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z >]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;

	return regex.test(email);
}

function currentTab() {


	checkState(function () {

		if (activePage == 'mail' || activePage == 'readEmail') {
			displayFolder();
			getDataFromFolder('Inbox');
			//setTimeout(function() {
			//	displayFolderContent('Inbox');
			//}, 5000);
//	}
		} else if (activePage == 'composeMail') {
			displayFolder();
			getDataFromFolder('Draft');
		} else {

			//window.location.href = "#mail";
			//displayFolderContent('Inbox');
		}

		if (activePage == 'profile') {
			populateProfile();
		}

	}, function () {
	});
}

function verifySecret(secret) {
	if (secret != '') {
		if (userObj = validateUserObject()) {

			try {
				var user = dbToProfile(userObj, secret);
				var user1 = JSON.parse(user, true);
				return true;
			} catch (err) {
				return false;
			}

		} else {
			return false;
		}


	} else {
		return false;
	}
}

function noAnswer(text) {

	$.smallBox({
		title: text,
		content: "",
		color: "#A65858",
		iconSmall: "fa fa-times",
		timeout: 5000
	});
};

function omgAnswer(text) {

	$.smallBox({
		title: text,
		content: "",
		color: "#B4990D",
		iconSmall: "fa fa-times",
		timeout: 8000
	});
};


function Answer(text) {

	$.smallBox({
		title: text,
		content: "",
		color: "green",
		iconSmall: "fa fa-check",
		timeout: 2000
	});
};

//function enterPassword

// providePassword

function makeModKey(salt) {
	return forge.util.bytesToHex(forge.pkcs5.pbkdf2(makerandom(), salt, 16, 16));
}



function profileToDb(obj) {
	var salt = forge.util.hexToBytes(obj['saltS']);
	var derivedKey = makeDerived(obj['secret'], salt)

	var Test = forge.util.bytesToHex(derivedKey);

	var keyT = CryptoJS.enc.Hex.parse(Test.substr(0, 64));
	var keyA = forge.util.hexToBytes(Test.substr(64, 128));

	var f = toAes(keyA, makerandom() + JSON.stringify(obj['userObj']) + makerandom());
	var Fis = toFish(keyT, f);

	return Fis;

}
function dbToProfile(obj, secret) {

	//console.log(obj);

	var salt = forge.util.hexToBytes(obj['saltS']);
	var derivedKey = makeDerived(secret, salt)

	var Test = forge.util.bytesToHex(derivedKey);

	var keyT = CryptoJS.enc.Hex.parse(Test.substr(0, 64));
	var keyA = forge.util.hexToBytes(Test.substr(64, 128));

	//var ivT = CryptoJS.enc.Hex.parse(obj['vectorT']);
	//var ivA = forge.util.hexToBytes(obj['vectorA']);

	var Fis = fromFish(keyT, obj['userObj']);

	//console.log(Fis);

	var f = fromAes(keyA, Fis);

	return f.substring(f.indexOf('{'), f.indexOf('}') + 1);


}

function dbToFolder(obj) {

	var f = fromAes(folderKey, obj['folderObj']);

	var s = f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);

	folderHash = SHA512(s);
	return JSON.parse(s);
}


function folderToDb(folderObj) {

	var f = toAes(folderKey, makerandom() + JSON.stringify(folderObj) + makerandom());

	return f;
}

function dbToProfileSetting() {

	var f = fromAes(folderKey, userData['profileSettings']);
	var s = f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);

	profileHash = SHA512(s);

	var g = from64(JSON.parse(s));

	return g;

}


function profileSettingToDb(prof) {

	//console.log('profileSettingToDb');
	//console.log(profileSettings);

	var t = jQuery.extend(true, {}, profileSettings);

	//var iv = forge.util.hexToBytes(userData['vectorA']);
	var f = toAes(folderKey, makerandom() + JSON.stringify(to64(t)) + makerandom());

	return f;

}

function getEmailsFromString(input) {
	var ret = [];
	var email = /\<([^\>]+)\>/g

	var match;
	while (match = email.exec(input))
		if(IsEmail(match[1]))
			ret=match[1];

	return ret;
}


function contactsToDb(contObj) {

	var f = toAes(folderKey, makerandom() + JSON.stringify(contObj) + makerandom());

	return f;
}
function stripHTML(data) {

	var html = data;
	var div = document.createElement("div");
	div.innerHTML = html;
	return text = div.textContent || div.innerText || "";
}

function sanitize(input) {
	var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
		replace(/<[\/\!]*?[^<>]*?>/gi, '').
		replace(/<iframe[^>]*?>.*?<\/iframe>/gi, '').
		replace(/<style[^>]*?>.*?<\/style>/gi, '').
		replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
	return output;
}

function sanitizeEmail(input) {
	/*
	 var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
	 replace(/<iframe[^>]*?>.*?<\/iframe>/gi, '').
	 replace(/<script[^>]*?>.*?/gi, '').
	 replace(/<style[^>]*?>.*?<\/style>/gi, '').
	 replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
	 */
	var output = input.replace(/<script/ig, '&lt;script').
		replace(/<iframe/ig, '&lt;iframe');

	return output;
}

function checkContacts() {
	checkState(function () {

		if (SHA512(JSON.stringify(contacts)) != contactHash) {

			var cont = contactsToDb(contacts);

			$.ajax({
				type: "POST",
				url: '/saveContacts',
				data: {
					'contactObj': cont,
					'modKey': userModKey
				},
				success: function (data, textStatus) {
					contactHash = SHA512(JSON.stringify(contacts));
				},
				error: function (data, textStatus) {
				},
				dataType: 'json'
			});
		}
	}, function () {
	});

}
function populateProfile() {
	checkState(function () {
		$('#userFLName > h1').text(profileSettings['name']);
		$('#profEmail > a').text(profileSettings['email']);

	}, function () {
	});
}


function checkProfile() {

	checkState(function () {
		var t = jQuery.extend(true, {}, profileSettings);
		var curr = SHA512(JSON.stringify(to64(t)));

		if (curr != profileHash) {

			//console.log('hash write');
			var prof = profileSettingToDb(profileSettings);

			$.ajax({
				type: "POST",
				url: '/saveProfile',
				data: {
					'profObj': prof,
					'modKey': userModKey
				},
				success: function (data, textStatus) {
					if (data.response == 'success') {
						profileHash = curr;
						//console.log(profileSettings);
						showEmailFetch();
					} else
						noAnswer('Error occurred. Try again1');

				},
				error: function (data, textStatus) {
					noAnswer('Error occurred. Try again2');
				},
				dataType: 'json'
			});

		}
	}, function () {
	});

}


function validateUserRole() {

	//console.log(roleData['role']);

	if (roleData['role']) {
		return roleData;
	} else {
		noAnswer("Can't read your role, please try to login again.");
		return false;
	}
}


function validateUserObject() {

	if (userData['userObj']) {
		return userData;
	} else {
		noAnswer("Can't read your User Object, please try to login again.");
		return false;
	}

}
function clearComposeMail() {
	fileObject = {};
	fileSize = 0;
	emailObj['to'] = '';
	emailObj['subj'] = '';
	emailObj['body'] = '';
	emailObj['meta'] = {};
	emailObj['mailId'] = '';
	emailObj['attachment'] = {};
	emailObj['modKey'] = '';
	mailhash = '';
	//  modkeyToMessag={};
	message['mail'] = '';
	original = true;
	message['meta'] = '';
	message['newModKey'] = '';
	message['oldModKey'] = '';
	message['iv'] = '';
	message['mailHash'] = '';
}


function generatePin(pin) {

	if (pin == '') {
		if ($('#pincheck').is(':checked')) {
			$('#emailPin').html('PIN: <b style="font-weight:bold;">' + (Math.floor(Math.random() * 90000) + 10000) + '</b>');
		} else {
			$('#emailPin').html('');
		}
	} else {
		//console.log(pin);
		if ($('#pincheck').is(':checked')) {
			$('#emailPin').html('PIN: <b style="font-weight:bold;">' + pin + '</b>');
		} else {
			$('#emailPin').html('');
		}
	}
}

function emailTimer() {
	clearInterval(mailt);

	mailt = setInterval(function () {
		//console.log(activePage);
		if (activePage == 'composeMail') {
			checkState(function () {
				saveDraft();
			}, function () {
			});
		} else {
			clearInterval(mailt);
			clearComposeMail();

		}
	}, 5000);

}
function getDataFromFolder(thisObj) {



	folderDecoded.done(function () {
		//console.log(folder);
		clearTimeout(opener);
		clearInterval(mailt);
		clearComposeMail();
		//if (thisObj !== undefined) {

		if (thisObj == 'composeMail') {
			activePage = 'composeMail';
			checkState(function () {
				// loadURL('getFolder/composeMail', $('#inbox-content > .table-wrap'));
				$.get('getFolder/composeMail', function (data) {
					$('#inbox-content > .table-wrap').html(data);
					$('#paginator').html('');
					$('#custPaginator').html('');
					iniEmailBody('');
					emailTimer();
				});


			}, function () {
			});


		} else {
			activePage = 'mail'

			var folNav = thisObj;//thisObj.text().trim();

			$('#folderul').children().removeClass("active");

			$('#folderulcustom').children().removeClass("active");


			$('#fl_' + folNav).addClass('active');

			// $('#folderul >li').eq(thisObj.parent().index()).addClass('active');
			$('#mobfolder').children().children().children().remove();
			$('#folderSelect').text(thisObj + ' ');
			$('#mfl_' + folNav).children().append(' <i class="fa fa-check"></i>');
			// $('#mobfolder >li').eq(thisObj.parent().index()).children().append(' <i class="fa fa-check"></i>');

			clearInterval(mailt);
			clearComposeMail();
			checkState(function () {
				//  console.log($('#mail-table').parents('#mail-table_wrapper').length);

				if ($('#mail-table').parents('#mail-table_wrapper').length == 0) {
					$.get('getFolder/' + folNav, function (data) {
						$('#inbox-content > .table-wrap').html(data);


						initializeMailList();
					});
				}

				folder_navigate = folNav;
			//	console.log(folder_navigate);
				if (folder_navigate == 'Trash' || folder_navigate == 'Draft' || folder_navigate == 'Spam') {
					$('.deletebutton').attr('data-original-title', 'Delete');
					$('.deletebutton').css('color', 'red');
				} else {
					$('.deletebutton').attr('data-original-title', 'Trash');
					$('.deletebutton').css('color', '#333');
				}
			//	console.log('jjjj');
				displayFolderContent(folNav);

			}, function () {
			});

		}
		$('.emailMob').css('display', 'block');
		$('.emailMob1').css('display', 'block');
		$('#mobFooter').css('height', '70px');
	});
}

function customMessageIds(folder){
	var keys = [];

	for(var k in folder){
		if(k!='name')keys.push(k);
	}

	return keys;
}
function displayFolderContent(folderName) {

	folderDecoded.done(function () {

		var messagesId = [];
		$("#selectAll").prop('checked', '');
		//	console.log(folder);
		if (folderName == 'Inbox' || folderName == 'Sent' || folderName == 'Draft' || folderName == 'Spam' || folderName == 'Trash') {
			if (Object.keys(folder[folderName]).length == 0) {
				messagesId = [];
			} else {
				messagesId = Object.keys(folder[folderName]);
			}

		}else if(folderName in folder['Custom']){
			if (customMessageIds(folder['Custom'][folderName]).length == 0) {
				messagesId = [];
			} else {
				messagesId = customMessageIds(folder['Custom'][folderName]);
			}
		}

		if (messagesId.length != 0) {
			$.ajax({
				type: "POST",
				url: '/RetrieveFoldersMeta',
				data: {
					'messageIds': JSON.stringify(messagesId)
				},
				success: function (data, textStatus) {
					if (data.results !== undefined) {
						renderMessages(data);
					} else {
						noAnswer('Error occurred. Please try again1');
					}

				},
				error: function (data, textStatus) {
					noAnswer('Error occurred. Please try again2');
				},
				dataType: 'json'
			});


		} else {
			var t = $('#mail-table').DataTable();
			t.clear();
			t.draw();
		}
	});
}

function renderMessages(data) {
	//console.log(data);
	$('#pag').css('display','block');
	var to, subj, time, body;
	var d = new Date();
	var t = $('#mail-table').DataTable();
	t.clear();
	var dfd = $.Deferred();
	modkeyToMessag = {};
	//$('.table-wrap').css('margin-right','-8px');

	if (data['results'].length > 0 && $.isArray(data['results'])) {
		var count = data['results'].length;

		$.each(data['results'], function (index, value) {
			//console.log(value['messageHash']);
			try {
				//value['meta']=from64(value['meta']);
				//console.log(from64unsafe(value['meta']));
				if(folder_navigate in folder['Custom']){
					var key = forge.util.hexToBytes(folder['Custom'][folder_navigate][value['messageHash']]['p']);

				}else{
					var key = forge.util.hexToBytes(folder[folder_navigate][value['messageHash']]['p']);
				}

				//console.log(fromAes(key, iv, value['meta']));
				var z = fromAes(key, value['meta']);
				z = z.substring(0, z.lastIndexOf('}') + 1);

				var meta = JSON.parse(z);

				//console.log(meta);

				meta['to'] = from64(meta['to']);
				meta['from'] = from64(meta['from']);
				meta['subject'] = stripHTML(from64(meta['subject']).toString());
				meta['body'] = from64(meta['body']);

				//	console.log(meta);
				modkeyToMessag[value['messageHash']] = meta['modKey'];
				if (folder_navigate == 'Sent' || folder_navigate == 'Draft') {
					var from = (meta['to'] !== undefined) ? meta['to'].toString() : '';
				} else {
					var from = meta['from'];
				}
				if(folder_navigate in folder['Custom']){
					var mesHash=folder['Custom'][folder_navigate][value['messageHash']]['opened'];
				}else{
					var mesHash=folder[folder_navigate][value['messageHash']]['opened'];
				}

				var addId = t.row.add([
					'<div class="checkbox" id="msg_' + value['messageHash'] + '"><label><input type="checkbox" class="checkbox style-2"><span ' + (ismobile ? 'style="margin-top:-22px;"' : '') + '></span> </label></div>',
					'<div id="' + value['messageHash'] + '"' + (!mesHash ? 'class="unread"' : '') + '>' + ((meta['status'] == 'warning') ? '<i class="fa fa-warning text-warning"></i>' : '') + ' <div class="col-xs-4" style="display: block;height: 20px;position: absolute;z-index:999;"></div>' + from + '</div>',
					'<div id="' + value['messageHash'] + '"' + (!mesHash ? 'class="unread"' : '') + '><span>' + ((meta['subject'] !== undefined) ? meta['subject'] : '[No Subject]') + '</span> ' + ((meta['body'] !== undefined) ? meta['body'].toString() : '') + '</div>',
					(meta['attachment'] != '') ? '<div><i class="fa fa-paperclip fa-lg"></i></div>' : '',
					new Date(parseInt(meta['timeSent'] + '000')).getTime()
				]);

			} catch (err) {
				if(folder_navigate in folder['Custom']){
					delete folder['Custom'][folder_navigate][parseInt(value['messageHash'])];
				}else{
					delete folder[folder_navigate][parseInt(value['messageHash'])];
				}

				checkFolders();
			}
			if (!--count) dfd.resolve();
		});

		dfd.done(function () {
			t.draw();

			if ($('#mail-table').children().get(1) === undefined) {
				t.draw();
				//noAnswer('Fail to render table, please try again')
				setTimeout(
					function () {
						getDataFromFolder(folder_navigate);
					}, 1000);
			}
		});


	}

}

function inviteFriend()
{
	var from=(profileSettings['name']==''?'FROM: '+profileSettings['email']:'FROM: '+profileSettings['name']+'<'+profileSettings['email']+'>');
	$('#fromfr').text(from);

	$('#textInvite').text((profileSettings['name']==''?profileSettings['email']:profileSettings['name']+' ')+' invites you to try scryptmail.com - encrypted email service. Please follow the link attached to the bottom of this email.');
	$('#dialog-form-invite').dialog({
		autoOpen: false,
		height:430,
		width: 300,
		modal: true,
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Send",
				"class": "btn btn-primary",
				"id": 'inviteok',
				click: function () {
					var inviteValidator= $("#login-form-invite").validate();

					$("#invite_email").rules("add", {
						email: true,
						required: true,
						minlength: 3,
						maxlength: 200
					});

					$("#textInvite").rules("add", {
						required: true,
						minlength: 3,
						maxlength: 300
					});

					inviteValidator= $("#login-form-invite").validate();
					inviteValidator.element( "#invite_email" );
					$("#login-form-invite").submit(function (e) {
						e.preventDefault();
					});

					var fr=profileSettings['name']==''?profileSettings['email']:profileSettings['name']+'<'+profileSettings['email']+'>';
					if(inviteValidator.element( "#invite_email" ) && inviteValidator.element( "#textInvite" )){
						var email={'from':fr,'to':$('#invite_email').val().toLowerCase(),'message':$.trim($('#textInvite').val())};

						$.ajax({
							type: "POST",
							url: '/inviteFriend',
							data: {
								'message': JSON.stringify(email)
							},
							success: function (data, textStatus) {
								if (data.results == 'ok') {
									Answer('Invitation Sent');
									$('#invite_email').val('')
									$('#dialog-form-invite').dialog('close');
								} else {
									noAnswer(data.results);
								}

							},
							error: function (data, textStatus) {
								noAnswer('Error occurred. Please try again');
							},
							dataType: 'json'
						});


					}
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default",
				click: function () {
					$(this).dialog("close");
				}

			}
		]
	});
	$('#dialog-form-invite').dialog('open');


}
function getNewEmailsCount() {
	var newMes = 0;
	$.each(folder['Inbox'], function (index, value) {
		if (!value['opened']) {
			newMes++;
		}
	});
	$('#fl_Inbox > a').text('Inbox' + (newMes > 0 ? ' (' + newMes + ')' : ''));
	$('#mfl_Inbox > a').prepend().text('Inbox' + (newMes > 0 ? ' (' + newMes + ')' : ''));

	$('#topBadge').append('<span class="label pull-right bg-color-darken">' + newMes + '</span>');
	if (newMes > 0)
		document.title = '(' + newMes + ' unread) SCRYPTMail';
	else
		document.title = 'SCRYPTMail';
	//console.log(newMes);

}

function showSavedDraft(body, meta, datas) {

	var prehash = {};
	prehash['to'] = body['to'];
	prehash['subj'] = body['subj'];
	prehash['body'] = body['body'];
	//console.log(decodeURIComponent(body['body']));

	mailhash = SHA512(JSON.stringify(prehash));
	//console.log(datas);

	emailObj['mailId'] = datas['messageHash'];
	emailObj['meta']['modKey'] = meta['modKey'];

	var md = forge.md.sha256.create();
	md.update(JSON.stringify(body), 'utf8');

	if (datas != '') {
		if (meta['signature'] !== undefined) {
			try {
				signature = sigPubKey.verify(md.digest().bytes(), forge.util.hexToBytes(meta['signature']));
			} catch (err) {
				signature = 'changed';
			}
		} else {
			signature = 'unknown';
		}
	}
//console.log(body['to']);
	iniEmailBody(meta['pin']);

	if (body['to'] != '') {
		var to = from64(body['to']);

		var cont = [];
		$.each(to, function (index, value) {


			if (value.indexOf('<') != -1) {
				var toEmail=getEmailsFromString(value);
				var name = escapeTags(value.substring(0, value.indexOf('<')));
				var em =toEmail;
				cont.push(name + "<" + em + ">");
			} else {
				var toEmail=getEmailsFromString(value);
				cont.push($.trim(toEmail));
			}

		});

		$('#toRcpt').select2('val', cont);
		//console.log(to);

	}

	if (body['subj'] != '') {
		$('#subj').val(stripHTML(from64(body['subj'])));
	}

	if (body['body']['text'] != '' && body['body']['html'] == '') {
		$('#emailbody').code(from64(body['body']['text']));

	}else if(body['body']['html'] != '')
	{
		$('#emailbody').code(filterXSS(from64(body['body']['html']),{
			onTagAttr: function (tag, name, value, isWhiteAttr) {
				if(name=='src' && (value.indexOf('https:')==-1 && value.indexOf('http:')!=-1)){
					return name+'="https:'+value.substr(5)+'"';
				}else if(name=='src' && (value.indexOf('https:')==-1 && value.indexOf('http:')==-1)){
					return ' ';

				}

				if(name=='style' && (value.indexOf('background-image')!=-1 || value.indexOf('content')!=-1 || value.indexOf('behavior')!=-1|| value.indexOf('url')!=-1)){
					return name;
				}

				if(tag=='a' && name=='href')
					return name+'="'+value+'"'+' target="_blank"';
			},
			onTag: function(tag, html, options) {
				if(tag=='img' && html.indexOf('http:')==-1 && html.indexOf('https:')==-1){
					return " ";
				}
			}
		}));



	}
	//CKEDITOR.instances.emailbody.setData('<blockquote>'+decodeURIComponent(body['body']['html'])+'</blockquote>');


	//$('#emailbody').code(sanitizeEmail(body['body']));
	if (datas != '') {
		message['mailHash'] = datas.messageHash;
	}
	modKeys.push(body.modKey);

	$('.email-open-header').append('<span class="label bg-color-blue" rel="tooltip" data-placement="bottom" data-original-title="Message saved">DRAFT</span> ');
	if (datas != '') {
		if (signature === true) {
			$('.email-open-header').append('<span class="label bg-color-green" rel="tooltip" data-placement="bottom" data-original-title="Message signature has been verified" >Signed</span>');
		} else if (signature === false) {
			original = false;
			$('.email-open-header').append('<span class="label bg-color-red" rel="tooltip" data-placement="bottom" data-original-title="Your message has been forged" >Forged</span>');
		} else if (signature == 'unknown') {
			$('.email-open-header').append('<span class="label bg-color-yellow" rel="tooltip" data-placement="bottom" data-original-title="Message is unverified" >Unverified</span>');
		} else if (signature == 'changed') {
			$('.email-open-header').append('<span class="label bg-color-yellow" rel="tooltip" data-placement="bottom" data-original-title="Signature error. If you change your RSA keys, we can not verify signature." >Error</span>');
		}
	}
	finishRendering();

}

function finishRendering() {
	$("[rel=tooltip]").tooltip();
}

function saveDraft() {
//console.log('trying to save draft');
	if (original) {
		var prehash = {};
		prehash['to'] = $('#toRcpt').select2("val");
		prehash['subj'] = sanitize($('#subj').val()).substring(0, 150);
		prehash['body'] = $('#emailbody').code();
					//CKEDITOR.instances.emailbody.getData();
		var key = forge.random.getBytesSync(32);

		if (mailhash != SHA512(JSON.stringify(prehash)) &&
			SHA512(JSON.stringify(prehash)) !='6c0823ab0d6fe3ac5592360d4f39a08c66d80efa7c5dc11ec39a04d544be517d88e86933bc87f3c575db1a7c95f45815221769bdfc96712b276064c6d07e134c') {
			mailhash = SHA512(JSON.stringify(prehash));
			var d = new Date();

			emailObj['to'] = $('#toRcpt').select2("val");
			emailObj['from'] = profileSettings['email'];
			emailObj['subj'] = sanitize($('#subj').val()).substring(0, 150);
			emailObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};
			emailObj['attachment'] = {};
			emailObj['meta']['subject'] = sanitize($('#subj').val()).substring(0, 150)
			emailObj['meta']['body'] = stripHTML($('#emailbody').code()).substring(0, 50);
			emailObj['meta']['attachment'] = '';
			emailObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
			emailObj['meta']['opened'] = true;
			emailObj['meta']['type'] = 'draft';
			emailObj['meta']['pin'] = $('#emailPin b').text();
			emailObj['meta']['status'] = '';
			emailObj['meta']['modKey'] = makeModKey(userObj['saltS']);
			emailObj['meta']['to'] = emailObj['to']
			emailObj['meta']['from'] = emailObj['from'];
			emailObj['modKey'] = emailObj['meta']['modKey'];


			emailObj['to'] = to64(emailObj['to']);
			emailObj['from'] = to64(emailObj['from']);
			emailObj['subj'] = to64(emailObj['subj']);

			emailObj['body']['text'] = to64(emailObj['body']['text']);
			emailObj['body']['html'] = to64(emailObj['body']['html']);

			emailObj['meta']['subject'] = to64(emailObj['meta']['subject']);
			emailObj['meta']['body'] = to64(emailObj['meta']['body']);


			emailObj['meta']['to'] = emailObj['to'];
			emailObj['meta']['from'] = emailObj['from'];


			//console.log(emailObj);

			var messaged = encryptMessage(emailObj, key);

			//console.log(messaged);

			$.when(messaged['d1']).done(function () {
				$.ajax({
					type: "POST",
					url: '/saveEmail',
					data: {
						'message': messaged['message']
					},
					success: function (data, textStatus) {
						if (!isNaN(data.messageId)) {
							message['mailHash'] = data.messageId;
							folder['Draft'][data.messageId] = {'p': forge.util.bytesToHex(key), 'opened': true};
							emailObj['mailId'] = data.messageId;

							//folder['Draft'] = jQuery.unique(folder['Draft']);
							checkFolders();
							if (modKeys.length == 1) {
								$('.email-open-header').append('<span class="label bg-color-blue" rel="tooltip" data-placement="bottom" data-original-title="Message Saved">DRAFT</span>');
							}


						}
					},
					error: function (data, textStatus) {
					},
					dataType: 'json'
				});
			});
			finishRendering();
		} //else
		//console.log('same');
	} else {
		noAnswer('Message appeared to be forged, autosaving disabled');
		clearInterval(mailt);
	}
}

function encryptMessage(emailObj, key) {

	var d1 = new $.Deferred();

	var body = JSON.stringify(emailObj);

	//console.log(decodeURIComponent(CKEDITOR.instances.emailbody.getData()));

	message['mail'] = toAes(key, body);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');

	emailObj['meta']['signature'] = forge.util.bytesToHex(sigPrivateKey.sign(md));

	var meta = JSON.stringify(emailObj['meta']);
	//console.log(emailObj['meta']);

	modKeys.push(emailObj['modKey']);

	message['meta'] = toAes(key, meta);

	message['newModKey'] = SHA512(modKeys[modKeys.length - 1]);
	if (modKeys.length > 1) {
		message['oldModKey'] = modKeys[modKeys.length - 2];
	} else {
		message['oldModKey'] = 'empty';
	}

	d1.resolve();
	var bum = {'message': message, 'd1': d1};
	return bum;

}

function getMail(messageId) {


	checkState(function () {

		$.ajax({
			type: "POST",
			url: '/showMessage',
			data: {
				'messageId': messageId
			},
			success: function (datas, textStatus) {
				if (datas.results != 'empty') {

					detectMessage(datas['results']);

				} else {
					noAnswer('Error occurred. Please try again3');
				}
			},
			error: function (data, textStatus) {
				noAnswer('Error occurred. Please try again4');
			},
			dataType: 'json'
		});

	}, function () {
	});

}

function detectMessage(datas) {
	$('.emailMob').css('display', 'none');
	$('.emailMob1').css('display', 'none');
	$('#mobFooter').css('height', '60px');

	if(folder_navigate in folder['Custom']){
		var key = forge.util.hexToBytes(folder['Custom'][folder_navigate][datas['messageHash']]['p']);
	}else{
		var key = forge.util.hexToBytes(folder[folder_navigate][datas['messageHash']]['p']);
	}




	var z = fromAes(key, datas['meta']);
	z = z.substring(0, z.lastIndexOf('}') + 1);

	var meta = JSON.parse(z);

	var body = fromAes(key, datas['body']);

	body = JSON.parse(body.substring(0, body.lastIndexOf('}') + 1));

	if (meta['type'] == 'draft') {

		$.ajax({
			type: "GET",
			url: '/getFolder/composeMail',
			success: function (data, textStatus) {
				$('#inbox-content > .table-wrap').html(data);
				$('#paginator').html('');
				$('#custPaginator').html('');
				activePage = 'composeMail';
				showSavedDraft(body, meta, datas);
				emailTimer();
			},
			error: function (data, textStatus) {
				noAnswer('Error occurred. Please try again');
			},
			dataType: 'html'
		});

	} else {
		$.ajax({
			type: "GET",
			url: '/getFolder/1',
			success: function (data, textStatus) {
				$('#inbox-content > .table-wrap').html(data);
				renderMessage(body, meta, datas);
			},
			error: function (data, textStatus) {
				noAnswer('Error occurred. Please try again');
			},
			dataType: 'html'
		});


	}
}


function escapeTags(html) {
	var escape = document.createElement('textarea');
	escape.innerHTML = html;
	return escape.innerHTML;
}

function to64(data) {

	if (data instanceof Array) {
		$.each(data, function (index, value) {
			data[index] = to64(value);
		});
		return data;
	} else if (data instanceof Object) {
		$.each(data, function (index, value) {
			//console.log(index);
			//console.log(value);
			data[index] = to64(value);
		});
		return data;
	} else
		return forge.util.encode64(forge.util.encodeUtf8(String(data)));

}
function from64(data) {
	if (data instanceof Array) {
		$.each(data, function (index, value) {
			data[index] = from64(value);
		});
		return data;
	} else if (data instanceof Object) {
		//console.log('object');
		$.each(data, function (index, value) {
			data[index] = from64(value);
		});
		return data;
	} else
		return forge.util.decodeUtf8(forge.util.decode64(data));
}
//util.binary.base64.decode

function from64binary(data) {

	return forge.util.binary.base64.decode(data);
}
function to64binary(data) {

	return window.btoa(data);
}

function fromAesBinary(key, text) {

	var vector = forge.util.hexToBytes(text.substring(0, 32));
	var encrypted = from64binary(text.substring(32));

	var fAes = forge.cipher.createDecipher('AES-CBC', key);
	fAes.start({iv: vector});
	fAes.update(forge.util.createBuffer(encrypted));
	fAes.finish();

	return fAes.output.getBytes();

}

function toAesBinary(key, text) {

	//console.log(key);
	var vector = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher('AES-CBC', key);
	cipher.start({iv: vector});

	cipher.update(forge.util.createBuffer(text));
	cipher.finish();

	return forge.util.bytesToHex(vector) + forge.util.encode64(cipher.output.getBytes());

}


function readFile(fileName) {
	var span = from64(emailObj['body']['attachment'][fileName]['filename']);
	console.log(span);
	$('#' + span + ' i').removeClass('fa-file');
	$('#' + span + ' i').addClass('fa-refresh');
	$('#' + span + ' i').addClass('fa-spin');

	//fa-refresh fa-spin
	var fd = new FormData();
	fd.append('fileName', from64(emailObj['body']['attachment'][fileName]['filename']));

	var key = forge.util.hexToBytes(folder[folder_navigate][emailObj['mailId']]['p']);

	$.ajax({
		type: "POST",
		url: '/GetFile',
		data: fd,
		//dataType:'blob',
		processData: false,
		contentType: false
	}).done(function (blob) {
			if(blob.length!=0){
			try {
				decrypt = fromAesBinary(key, blob);

				decrypt = from64binary(decrypt);

				var oMyBlob = new Blob([decrypt], {type: from64(emailObj['body']['attachment'][fileName]['type'])});

				var a = document.createElement('a');
				a.href = window.URL.createObjectURL(oMyBlob.slice(0, from64(emailObj['body']['attachment'][fileName]['size'])));
				a.download = from64(emailObj['body']['attachment'][fileName]['name']);
				document.body.appendChild(a);
				a.click();

				$('#' + span + ' i').addClass('fa-file');
				$('#' + span + ' i').removeClass('fa-refresh');
				$('#' + span + ' i').removeClass('fa-spin');
			} catch (err) {
				$('#' + span).html('Error. Try again<i></i>');
				$('#' + span).addClass('label-danger<i></i>');


			}
			}else{
				$('#' + span).html('Error. File not found<i></i>');
				$('#' + span).addClass('label-danger<i></i>');
			}
		});

}


function replyToMail() {

	meta = emailObj['meta'];
	body = emailObj['body'];

	clearInterval(mailt);
	clearComposeMail();

	$.ajax({
		type: "GET",
		url: '/getFolder/composeMail',
		success: function (data, textStatus) {
			$('#inbox-content > .table-wrap').html(data);
			$('#paginator').html('');
			$('#custPaginator').html('');
			delete body['to'];
			body['to'] = [];
			body['to'].push(body['from']);
			//console.log(body);

			body['to'] = to64(body['to']);
			meta['from'] = from64(meta['from']);

			body['subj'] = to64(body['subj']);

			body['body']['html'] = '<br><br>---------------------------------<br>' +
				'On ' + new Date(meta['timeSent'] * 1000).toLocaleTimeString() + ' ' + new Date(meta['timeSent'] * 1000).toLocaleDateString() + ' <b>' + meta['from'].replace('>', "&gt;").replace('<', " &lt;") + '</b> wrote:' +
				messageDisplayedBody;
			body['body']['text'] = to64(body['body']['text']);
			body['body']['html'] = to64(body['body']['html']);
			activePage = 'composeMail';
			emailTimer();
			showSavedDraft(body, meta, '');
		},
		error: function (data, textStatus) {
			noAnswer('Error occurred. Please try again');
		},
		dataType: 'html'
	});

}

function forwardMail() {

	meta = emailObj['meta'];
	body = emailObj['body'];
	//console.log(body);
	clearInterval(mailt);
	clearComposeMail();


	$.ajax({
		type: "GET",
		url: '/getFolder/composeMail',
		success: function (data, textStatus) {
			$('#inbox-content > .table-wrap').html(data);
			$('#paginator').html('');
			$('#custPaginator').html('');
			delete body['to'];
			body['to'] = [];
			body['to'].push('');
			//console.log(body);
			body['body']['text'] = to64(body['body']['text']);
			body['body']['html'] = to64(body['body']['html']);
			body['subj'] = to64(body['subj']);
			activePage = 'composeMail';
			emailTimer();
			showSavedDraft(body, meta, '');
		},
		error: function (data, textStatus) {
			noAnswer('Error occurred. Please try again');
		},
		dataType: 'html'
	});

}

function markSpam() {
	//console.log(emailObj);
	var em = emailObj['meta']['from'];

	if (em.indexOf('<') != -1) {
		em = em.substring(em.indexOf('<') + 1, em.indexOf('>'));
	}

	blackList.push(em);

	//console.log(blackList);
	clearComposeMail();
}

function deleteMail() {

	if (emailObj['mailId'] != '') {
		//console.log(emailObj);
		var selected = {};
		selected['0'] = {'id': emailObj['mailId'], 'modKey': emailObj['meta']['modKey']};
		//console.log(selected);
		deleteMessage(selected,folder_navigate);
		getDataFromFolder(folder_navigate);
		clearComposeMail();

	} else {
		getDataFromFolder(folder_navigate);
	}
}
function deleteMailUnreg(messageId,modKey){

var selected=[];
	var el={"id":messageId,"modKey":modKey};

	selected.push(el);

	$.ajax({
		type: "POST",
		url: '/deleteMessageUnreg',
		data: {
			'messageIds': JSON.stringify(selected)
		},
		success: function (data, textStatus) {
			if (data.results == 'success') {
					Answer('Deleted');
				window.location="/login";
			} else {
				noAnswer('Error occurred. Please try again');
			}

		},
		error: function (data, textStatus) {
			noAnswer('Error occurred. Please try again');
		},
		dataType: 'json'
	});
}

function initializeMailList() {

	// pageSetUp();

	var responsiveHelper_inbox_table = undefined;
	var responsiveHelper_datatable_fixed_column = undefined;
	var responsiveHelper_datatable_col_reorder = undefined;
	var responsiveHelper_datatable_tabletools = undefined;

	var breakpointDefinition = {
		tablet: 1024,
		phone: 480
	};
	var d = new Date();
	$('#mail-table').dataTable({
		"columnDefs": [
			{ "sClass": 'inbox-table-icon', "targets": 0},
			{ "sClass": 'inbox-data-from', "targets": 1 },
			{ "sClass": 'inbox-data-message', "targets": 2},
			{ "sClass": 'inbox-data-attachment hidden-xs', "targets": 3},
			{ "sClass": 'inbox-data-date', "targets": 4},
			{ 'bSortable': false, 'aTargets': [ 0, 3 ] },
			{ "orderDataType": "data-sort", "targets": 4 }

		],
		//"iDisplayLength": 500,
		"order": [
			[ 4, "desc" ]
		],
		"iDisplayLength": 10,
		"sDom": "R<'dt-toolbar'" +
			"<'#mailSearch'f>" +
			"<'#mailIcons'>" +
			"<'#mailList'l>" +
			"r>t" +
			"<'dt-toolbar-footer'" +
			"<'col-sm-6 col-xs-2'i>" +
			"<'col-sm-2 col-xs-6'p>" +
			">",
		"deferRender": true,
		"autoWidth": true,
		fnCreatedRow: function (nRow, aData, iDataIndex) {
			if (d.toDateString() == new Date(parseInt($('td:eq(4)', nRow).text())).toDateString()) {
				$('td:eq(4)', nRow).text(new Date(parseInt($('td:eq(4)', nRow).text())).toLocaleTimeString());
			} else {
				$('td:eq(4)', nRow).text(new Date(parseInt($('td:eq(4)', nRow).text())).toLocaleDateString());
			}
		},
		"preDrawCallback": function () {
			// Initialize the responsive datatables helper once.
			if (!responsiveHelper_inbox_table) {
				responsiveHelper_inbox_table = new ResponsiveDatatablesHelper($('#mail-table'), breakpointDefinition);
			}
		},
		//"sPaginationType": paginateTable,
		"sPaginationType": "simple",
		"oLanguage": {
			//"sEmptyTable": function(){ return '<div class="text-muted">There is no email</div>'; }
			"sEmptyTable": "No Emails",
			"sInfo": "<span class='txt-color-darken'><strong>_START_</span> - <span class='txt-color-darken'>_END_</strong></span> of <span class='text-primary'><strong>_TOTAL_</strong></span>",
			"sInfoEmpty": "<span class='text-danger'><strong>Empty</strong></span>",
			"sInfoFiltered": ""
		}
	});
	$('#mailIcons').css('float', 'left');
	//$('#mailSearch').addClass('col col-3');
	//$('#mailIcons').addClass('col-sm-2 col-xs-2');

	$('#mailList').addClass('col-sm-2 hidden-xs');
	$('#mailList').css('float', 'right');


	var trash = '<a href="javascript:void(0);" rel="tooltip" title="" data-placement="bottom" data-original-title="Trash"  class="deletebutton btn btn-default"><strong><i class="fa fa-trash-o fa-lg"></i></strong></a>';

	var move = '<a href="javascript:void(0);" rel="tooltip" data-toggle="dropdown" title="" data-placement="left" data-original-title="Move to Folder"  class="movebutton btn btn-default"><i class="fa  fa-folder-open-o fa-lg"></i> Move</a>' +
		'<ul id="mvtofolder" class="dropdown-menu"></ul>';

	$('#mailIcons').html(' <div class="inbox-checkbox-triggered"><div class="btn-group"> ' + move + ' ' + trash + '</div></div>');


	$('#mail-table tbody').on('mouseover', 'td.inbox-data-from', function () {
		$(this).css('cursor', 'pointer');
		$(this).attr('onclick', "getMail('" + $(this).children().eq(0).attr('id') + "')");
	});

	$('#mail-table tbody').on('mouseover', 'td.inbox-data-message', function () {
		$(this).css('cursor', 'pointer');
		$(this).attr('onclick', "getMail('" + $(this).children().eq(0).attr('id') + "')");

	});


	$('.mail-table-icon input:checkbox').click(function () {
		enableDeleteButton();
	})

	$("#selectAll").click(function () {
		var table = $('#mail-table');
		$('td input:checkbox', table).prop('checked', this.checked);

	});
	//$("#selectAll").click(function() {
	//   if($("#selectAll").is(':checked')) $('#trashMail').removeClass('hidden');
	//     else
	//       $('#trashMail').addClass('hidden');

	//});
	//

	renderMoveFolder();

	$(".deletebutton").click(function () {
		//console.log(modkeyToMessag);
		var selected = [];
		$('#mail-table td input:checked').each(function () {
			var elem = {};
			var val = $(this).parent().parent().attr('id');
			elem['id'] = val.substr(val.indexOf("_") + 1);
			elem['modKey'] = modkeyToMessag[elem['id']];
			selected.push(elem);
		});
		deleteMessage(selected,folder_navigate);

	});

	/* END BASIC */

	finishRendering();

}

function movetofolder(tofolder) {
	var selected = [];

	$('#mail-table td input:checked').each(function () {
		var elem = {};
		var val = $(this).parent().parent().attr('id');
		elem['id'] = val.substr(val.indexOf("_") + 1);
		elem['modKey'] = modkeyToMessag[elem['id']];
		selected.push(elem);
	});
	var select = 0;
	$.each(selected, function (index, value) {

		if(folder_navigate==tofolder){
			noAnswer('Can not move to same folder');
		}else if(folder_navigate in folder['Custom'] && tofolder in folder['Custom']){
			folder['Custom'][tofolder][parseInt(value['id'])] = folder['Custom'][folder_navigate][parseInt(value['id'])];
			delete folder['Custom'][folder_navigate][parseInt(value['id'])];
			select++;
		}else if(folder_navigate in folder['Custom'] && !(tofolder in folder['Custom'])){

			folder[tofolder][parseInt(value['id'])] = folder['Custom'][folder_navigate][parseInt(value['id'])];
			delete folder['Custom'][folder_navigate][parseInt(value['id'])];
			select++;
		}else if(!(folder_navigate in folder['Custom']) && (tofolder in folder['Custom'])){
			folder['Custom'][tofolder][parseInt(value['id'])] = folder[folder_navigate][parseInt(value['id'])];
			delete folder[folder_navigate][parseInt(value['id'])];
			select++;
		}else if(!(folder_navigate in folder['Custom']) && !(tofolder in folder['Custom'])){
			folder[tofolder][parseInt(value['id'])] = folder[folder_navigate][parseInt(value['id'])];
			delete folder[folder_navigate][parseInt(value['id'])];
			select++;
		}else{
			noAnswer('Error occurred. Please report a bug');
		}


	});
	checkFolders();

	if (select > 0){
		checkFolders();
		$('#mail-table').DataTable()
			.row($('#mail-table td input:checkbox:checked').parents('tr'))
			.remove()
			.draw();
		$("#selectAll").prop('checked', '');
		Answer('Moved');
	}
	//console.log(from);
	//console.log(selected);
}

function deleteMessage(selected,selectedFolder, callback) {

	checkState(function () {
		if (selectedFolder != "Trash" && selectedFolder != "Draft" && selectedFolder != "Spam"  && activePage != 'composeMail' && !(selectedFolder in folder['Custom'])) {
			var select = 0;
			$.each(selected, function (index, value) {
				folder['Trash'][parseInt(value['id'])] = folder[selectedFolder][parseInt(value['id'])];
				delete folder[selectedFolder][parseInt(value['id'])];
				select++;
			});

			if (select > 0){
				checkFolders();
				$('#mail-table').DataTable()
					.row($('#mail-table td input:checkbox:checked').parents('tr'))
					.remove()
					.draw();
				$("#selectAll").prop('checked', '');

				Answer('Moved to Trash');
			}


		}else if(selectedFolder in folder['Custom']){
			selected.forEach(function(messageId) {
				folder['Trash'][parseInt(messageId)] = folder['Custom'][selectedFolder][parseInt(messageId)];
				delete folder['Custom'][selectedFolder][parseInt(messageId)];
			});
			if (callback) {
				callback();
			}

		} else if(selectedFolder == "Trash" || selectedFolder == "Draft" || selectedFolder == "Spam") {

			var select = 0;
			$.ajax({
				type: "POST",
				url: '/deleteMessage',
				data: {
					'messageIds': JSON.stringify(selected)
				},
				success: function (data, textStatus) {
					if (data.results == 'success') {

						$.each(selected, function (index, value) {
							select++;
							delete folder['Spam'][parseInt(value['id'])];
							delete folder['Trash'][parseInt(value['id'])];
							delete folder['Draft'][parseInt(value['id'])];

						});

						checkFolders();

						$('#mail-table').DataTable()
							.row($('#mail-table td input:checkbox:checked').parents('tr'))
							.remove()
							.draw();
						$("#selectAll").prop('checked', '');
						if (select > 0)
							Answer('Deleted');
					} else {
						noAnswer('Error occurred. Please try again7');
					}

				},
				error: function (data, textStatus) {
					noAnswer('Error occurred. Please try again8');
				},
				dataType: 'json'
			});

		}
	}, function () {
	});
	getNewEmailsCount();
}

function enableDeleteButton() {
	var isChecked = $('.mail-table-icon input:checkbox').is(':checked');

	if (isChecked) {
		$(".inbox-checkbox-triggered").addClass('visible');
		//$("#compose-mail").hide();
	} else {
		$(".inbox-checkbox-triggered").removeClass('visible');
		//$("#compose-mail").show();
	}
}

function selectFolder(thisObj) {

}
function SHA512(data) {

	var md = forge.md.sha512.create();
	md.update(data, 'utf8');
	return md.digest().toHex();
}
function SHA512old(data) {

	var md = forge.md.sha512.create();
	md.update(data);
	return md.digest().toHex();
}

function getDomain() {
	return $.get("getDomains");
}
function loadInitialPage() {

	pageSetUp();
	// fix table height
	tableHeightSize();

	$(window).resize(function () {
		tableHeightSize()
	});
	function tableHeightSize() {

		if ($('body').hasClass('menu-on-top')) {
			var menuHeight = 68;
			// nav height

			var tableHeight = ($(window).height() - 190) - menuHeight;
			if (tableHeight < (320 - menuHeight)) {
				$('.table-wrap').css('height', (320 - menuHeight) + 'px');
			} else {
				$('.table-wrap').css('height', tableHeight + 'px');
			}

		} else {
			var tableHeight = $(window).height() - 190;
			if (tableHeight < 320) {
				$('.table-wrap').css('height', 320 + 'px');
			} else {
				$('.table-wrap').css('height', tableHeight + 'px');
			}

		}

	}
}

function checkEmailAmount() {

	var totalcount = 0;

	$.each(folder, function (index, value) {
		totalcount += Object.keys(folder[index]).length;
		if (index == 'Custom') {
			$.each(folder[index], function (index1, value1) {
				totalcount =totalcount-2+ Object.keys(folder[index][index1]).length;
			});
		}
	});

	return totalcount;
}

function displayFolder() {
	//console.log(profileSettings);

	if (folder != {}) {
		var list = $("#folderul");
		list.html('');
		var mlist = $("#mobfolder");
		mlist.html('');
		var folderulcustom=$("#folderulcustom");
		folderulcustom.html('');

		//  console.log(typeof(folder));
		//	console.log(folder);
		$.each(folder, function (key, value) {
			if (key != 'Custom') {
				if (key == 'Inbox') {
					list.append('<li id="fl_' + key + '"><a href="javascript:void(0);" onclick="getDataFromFolder(' + "'" + key + "'" + ');">' + key + '</a></li>');
					mlist.append('<li id="mfl_' + key + '"><a href="javascript:void(0);" class="inbox-load" onclick="getDataFromFolder(' + "'" + key + "'" + ');">' + key + '<i class="fa fa-check"></i></a></li>');
				} else if (key == 'Spam') {
					list.append('<li id="fl_' + key + '"><a href="javascript:void(0);" onclick="getDataFromFolder(' + "'" + key + "'" + ');">' + key + '</a></li>');
					mlist.append('<li class="divider"></li><li id="mfl_' + key + '"><a href="javascript:void(0);" onclick="getDataFromFolder(' + "'" + key + "'" + ');">' + key + '</a></li>');
				} else {
					list.append('<li id="fl_' + key + '"><a href="javascript:void(0);" onclick="getDataFromFolder(' + "'" + key + "'" + ');">' + key + '</a></li>');
					mlist.append('<li id="mfl_' + key + '"><a href="javascript:void(0);" onclick="getDataFromFolder(' + "'" + key + "'" + ');">' + key + '</a></li>');
				}

			}else if(key == 'Custom'){
				//console.log(folder);
				if(Object.keys(value).length>0){

					bySortedValue(folder['Custom'], function(keyC, valueC) {
						//folderulcustom.append('<li id="fl_' + keyC + '"><a href="javascript:void(0);" onclick="getDataFromFolder(' + "'" + keyC + "'" + ');" oncontextmenu="context($(this),\''+keyC+'\',\''+valueC['name']+'\')">' + valueC['name'] + '</a></li>');
						folderulcustom.append('<li id="fl_' + keyC + '"><a href="javascript:void(0);" id="'+keyC+'" onclick="getDataFromFolder(' + "'" + keyC + "'" + ');">' + valueC['name'] + '</a></li>');
						//alert(keyC + ": " + valueC);
					});

					//$.each(value, function (keyC, valueC) {
					//	folderulcustom.append('<li id="fl_' + keyC + '"><a href="javascript:void(0);" onclick="getDataFromFolder(' + "'" + keyC + "'" + ');" oncontextmenu="context($(this),\''+keyC+'\',\''+valueC['name']+'\')">' + valueC['name'] + '</a></li>');
					//});
				}


			}

		});

		renderMoveFolder();

		$('#fl_' + folder_navigate).addClass('active');
		var dfd = $.Deferred();

		folderDecoded.done(function () {
			showLimits();
			getNewEmailsCount();
		});
		//

	}


}
function renderMoveFolder(){
	var follist = $("#mvtofolder");
	follist.html('');

	$.each(folder, function (key, value) {
		if (key != 'Custom' && key != 'Draft' && key != 'Sent') {
			follist.append('<li><a href="javascript:void(0);" onclick="movetofolder(\''+key+'\');">'+key+'</a></li>');
		}else if(key == 'Custom'){
			follist.append('<li class="divider"></li>');
			bySortedValue(folder['Custom'], function(keyC, valueC) {
				follist.append('<li><a href="javascript:void(0);" onclick="movetofolder(\''+keyC+'\');">'+valueC['name']+'</a></li>');
			});
		}
	});
}

function sortObject(data){
	var newdata={};
if(Object.keys(data).length>0){
	$.each(data, function (key, value) {

	});
}else
return data;

}

function bySortedValue(obj, callback, context) {
	var tuples = [];

	for (var key in obj){
		tuples.push([obj[key]['name'], obj[key],key]);
	}
	tuples.sort(function(a, b) { return a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0 });

	var length = tuples.length;
	while (length--) callback.call(context, tuples[length][2], tuples[length][1]);

}

function renameCustomFolder(name,id){
	$('#addFolder').dialog({
		autoOpen: false,
		height: 150,
		width: 250,
		modal: true,
		title:'Rename Folder',
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Add",
				"class": "btn btn-primary",
				"id": 'folderok',
				click: function () {
					var fname = escapeTags($('#newFolder').val().trim());
					if(fname.length>=1 && fname.length<=25){

						folder['Custom'][id]['name'] =fname;
						folder['Custom'][SHA1(fname)] = folder['Custom'][id];
						delete folder['Custom'][id];

						checkFolders();
						displayFolder();
						$(this).dialog("close");
						$('#newFolder').val('');


					}else{
						noAnswer('Please enter a value between 1 and 30 characters long.');
					}


				}
			}
		]
	});
	$('#newFolder').val(name);
	$('#addFolder').dialog('open');

}


function deleteCustomFolder(name,id)
{

	//console.log(id);
if(customMessageIds(folder['Custom'][id]).length>0){
	$("#dialog-confirm").html("<p>Folder is not empty, all messages inside this folder will be moved to Trash.</p> Do you want to continue?");

	$("#dialog-confirm").dialog({
		resizable: false,
		modal: true,
		title: "Delete Folder: "+name+' ?',
		height: 180,
		width: 300,
		resizable: false,
		buttons: {
			"Yes": function () {
				$(this).dialog('close');
				deleteMessage(customMessageIds(folder['Custom'][id]),id, function() {
					delete folder['Custom'][id];
					checkFolders();
					displayFolder();
					if(folder_navigate==id){
						getDataFromFolder('Inbox');
					}
					Answer('Deleted');
				});

			},
			"No": function () {
				$(this).dialog('close');
			}
		}
	});
	$('#dialog-confirm').dialog('open');

}else{
	delete folder['Custom'][id];
	checkFolders();
	displayFolder();
	if(folder_navigate==id){
		getDataFromFolder('Inbox');
	}
	Answer('Deleted');
}



}

function SHA1(text){
	var md = forge.md.sha1.create();
	md.update(text,'utf8');
	return md.digest().toHex()
}
function removeCustomFolder(name){
	//console.log(name);
	delete folder['Custom'][name];
	checkFolders();
	displayFolder();
}
function addCustomFolder(){

	$('#addFolder').dialog({
		autoOpen: false,
		height: 150,
		width: 250,
		modal: true,
		title:'Add Folder',
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Add",
				"class": "btn btn-primary",
				"id": 'folderok',
				click: function () {
					var fname = escapeTags($('#newFolder').val().trim());
					//console.log(fname);
					if(fname.length>=1 && fname.length<=25){
						//console.log(folder);
						folder['Custom'][SHA1(fname)] = {'name':fname};
						//folder['Custom']=sortObject(folder['Custom']);
						checkFolders();
						displayFolder();

						$('#newFolder').val('');
						$(this).dialog("close");

					}else{
						noAnswer('Please enter a value between 1 and 30 characters long.');
					}

				}
			}
		]
	});
	if(folder['Custom']==undefined){
		retrieveSecret();
	}else{
		if(Object.keys(folder['Custom']).length<roleData['role']['customFolderLimit']){
			$('#addFolder').dialog('open');
		}else{
			noAnswer('You\'ve reached limit for custom folders.');
		}
	}

}

function checkFolders() {

	checkState(function () {

		if (SHA512(JSON.stringify(folder)) != folderHash) {

			var fold = folderToDb(folder);

			$.ajax({
				type: "POST",
				url: '/saveFolders',
				data: {
					'folderObj': fold,
					'modKey': userModKey
				},
				success: function (data, textStatus) {
					folderHash = SHA512(JSON.stringify(folder));
					checkProfile();
					showLimits();
				},
				error: function (data, textStatus) {
				},
				dataType: 'json'
			});
		}
	}, function () {
	});

}

function showLog(success, cancel) {

	$('#dialog-form-login').dialog({
		autoOpen: false,
		height: 230,
		width: 300,
		modal: true,
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Continue",
				"class": "btn btn-primary",
				"id": 'loginok',
				click: function () {
					var email = $('#LoginForm_username').val().toLowerCase() + '@scryptmail.com';
					//remove in 2 weeks
					$.ajax({
						type: "POST",
						url: '/ModalLogin',
						data: {'LoginForm[username]': SHA512(email),
							'LoginForm[password]': SHA512($('#LoginForm_password').val())

						},
						success: function (data, textStatus) {
							if (data.answer == "welcome") {
								sessionKey = data.data;
								$('#dialog-form-login').dialog('close');
								success();

							} else {
								// remove in 2 weeks
								$.ajax({
									type: "POST",
									url: '/ModalLogin',
									data: {'LoginForm[username]': SHA512(email),
										'LoginForm[password]': SHA512old($('#LoginForm_password').val())

									},
									success: function (data, textStatus) {
										if (data.answer == "welcome") {
											sessionKey = data.data;
											$('#dialog-form-login').dialog('close');
											noAnswer('Old Password, Please update your password');

											success();

										} else {
											noAnswer('Wrong Usernaim or password. Please try again');
										}
									},
									error: function (data, textStatus) {
										cancel();
										noAnswer('Error. Please try again9')
									},
									dataType: 'json'
								});
								//end remove in 2 weeks
							}
						},
						error: function (data, textStatus) {
							cancel();
							noAnswer('Error. Please try again9')
						},
						dataType: 'json'
					});
				//end remove in 2 weeks

				}
			}
		],
		close: function () {
			if (sessionKey == '') {
				$(window).unbind('beforeunload');
				window.location = '/logOut';
			}
		}

	});
	/*
	 if (window.location.hostname == "encrypt-mail1.com") {

	 var email = 'aaaaaa@scryptmail.com';
	 $.ajax({
	 type: "POST",
	 url: '/ModalLogin',
	 data: {'LoginForm[username]': SHA512(email),
	 'LoginForm[password]': SHA512('aaaaaa')

	 },
	 success: function (data, textStatus) {
	 if (data.answer == "welcome") {
	 sessionKey = data.data;
	 $('#dialog-form-login').dialog('close');
	 success();

	 } else {
	 noAnswer('Wrong Usernaim or password. Please try again');
	 }
	 },
	 error: function (data, textStatus) {
	 cancel();
	 noAnswer('Error. Please try again9')
	 },
	 dataType: 'json'
	 });
	 }else*/
	$('#dialog-form-login').dialog('open');

}

function requestInitInvitiation() {
	$('#inviteemail').attr('name', makerandom());

	$.validator.addMethod("uniqueUserName", function (value, element) {
		var isSuccess = false;
		$.ajax({
			type: "POST",
			url: "/checkMail",
			data: {'email': $('#inviteemail').val().toLowerCase(), 'ajax': 'smart-form-register'},
			dataType: "json",
			async: false,
			success: function (msg) {
				isSuccess = msg === true ? true : false
			}
		});
		return isSuccess;

	}, "Already Registered");

	newinvitation = $("#request-invitiation").validate();

	$("#inviteemail").rules("add", {
		email: true,
		required: true,
		minlength: 3,
		maxlength: 200,
		uniqueUserName: true
	});

}
function requestInvitiation() {
	newinvitation.form();

	if (newinvitation.numberOfInvalids() == 0) {

		$.ajax({
			type: "POST",
			url: '/saveInvite',
			data: {
				'email': $('#inviteemail').val().toLowerCase()
			},
			success: function (data, textStatus) {
				if (data.response === true) {
					Answer('Your request has been submitted');
					$('#inviteemail').val('');
				} else {
					noAnswer('Error occurred. Please try again, or submit a bug report');

				}

			},
			dataType: 'json'
		});

	}

}




function downloadToken(){
	try{
		var oMyBlob = new Blob([toFile], {type:'text/html'});

		var a = document.createElement('a');
		a.href = window.URL.createObjectURL(oMyBlob);
		a.download = 'ScryptmailToken.key';
		document.body.appendChild(a);
		a.click();
	} catch (err) {
		$('#browsfailed').css('display','block');
		$('#browsfailed b').text(toFile);
	}


	$('#y-agree').prop('disabled',false);
}

function toAesToken(key, text) {

	var vector = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher('AES-CBC', key);
	cipher.start({iv: vector});

	cipher.update(forge.util.createBuffer(text));
	cipher.finish();

	return forge.util.bytesToHex(vector) + cipher.output.toHex();

}

function fromAesToken(key, text) {

	var vector = forge.util.hexToBytes(text.substring(0, 32));
	var encrypted = text.substring(32);

	var cipher = forge.cipher.createDecipher('AES-CBC', key);
	var new_buffer = forge.util.createBuffer(forge.util.hexToBytes(encrypted));

	cipher.start({iv: vector});
	cipher.update(new_buffer);
	cipher.finish();

	return (cipher.output.data);
}


function toAes(key, text) {

	var vector = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher('AES-CBC', key);
	cipher.start({iv: vector});

	var usUtf8 = forge.util.encodeUtf8(text);
	cipher.update(forge.util.createBuffer(usUtf8));
	cipher.finish();

	return forge.util.bytesToHex(vector) + cipher.output.toHex();

}

function toFish(keyT, text) {

	var vector = CryptoJS.lib.WordArray.random(16);
	var cipher = CryptoJS.TwoFish.encrypt(text, keyT, { iv: vector });

	//console.log(keyT.toString());

	return vector.toString() + cipher.toString();

}

function fromFish(keyT, text) {

	var vector = CryptoJS.enc.Hex.parse(text.substring(0, 32));
	var encrypted = text.substring(32);

	var cipher = CryptoJS.TwoFish.decrypt(encrypted, keyT, { iv: vector });
	return cipher.toString(CryptoJS.enc.Latin1);
}

function fromAes(key, text) {

	var vector = forge.util.hexToBytes(text.substring(0, 32));
	var encrypted = text.substring(32);

	var cipher = forge.cipher.createDecipher('AES-CBC', key);
	var new_buffer = forge.util.createBuffer(forge.util.hexToBytes(encrypted));

	cipher.start({iv: vector});
	cipher.update(new_buffer);
	cipher.finish();

	return forge.util.decodeUtf8(cipher.output.toString());
}





function dbToContacts() {
	var f = fromAes(folderKey, userData['contacts']);

	s = f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);
	contactHash = SHA512(s);
	return JSON.parse(s);

}


function dbToBlackList() {

	var f = fromAes(folderKey, userData['blackList']);

	s = f.substring(f.indexOf('['), f.indexOf(']') + 1);

	blackListHash = SHA512(s);
	return JSON.parse(s);

}


function retrieveSecret() {


	provideSecret(function (secret) {

		if (userObj = validateUserObject()) {

			var user = dbToProfile(userObj, secret);

			var pki = forge.pki;

			user1 = JSON.parse(user, true);

			//console.log(user1);
			try {
				mailPrivateKey = pki.privateKeyFromPem(from64(user1['MailPrivate']));
				mailPublickKey = pki.publicKeyFromPem(from64(user1['MailPublic']));
				seedPrivateKey = pki.privateKeyFromPem(from64(user1['SeedPrivate']));
				seedPublickKey = pki.publicKeyFromPem(from64(user1['SeedPublic']));
				sigPubKey = pki.publicKeyFromPem(from64(user1['SignaturePublic']));
				sigPrivateKey = pki.privateKeyFromPem(from64(user1['SignaturePrivate']));
			} catch (err) {
				noAnswer('Keys are corrupted. Please generate new keys');
			}

			folderKey = forge.util.hexToBytes(from64(user1['folderKey']));
			userModKey = user1['modKey'];

			folder = dbToFolder(userObj);

			contacts = dbToContacts();
			//console.log(folder);
			blackList = dbToBlackList();
			//console.log(blackList);
			profileSettings = dbToProfileSetting();


			//console.log(profileSettings);
			profileSettings['lastSeed'] = parseInt(profileSettings['lastSeed']);
			sessionTimeOut=!isNaN(parseInt(profileSettings['sessionExpiration']))?parseInt(profileSettings['sessionExpiration']):900;
			//console.log(user1);
			myTimer();

			newMailCheckRoutine();
			getNewEmailsCount();

			folderDecoded.resolve();

		}

		myTimer();
		currentTab();

	}, function () {
		noAnswer('Without providing correct secret you would not be able to read or post any emails');
	});
}



function validatePublics() {
	var check = true;
	var user = validateUserObject();
	var role = validateUserRole();
	var seedKey = role['role']['seedMaxKeyLength'];
	var mailKey = role['role']['mailMaxKeyLength'];

	if (seedKey == 512 && $('#UpdateKeys_seedPubK').val().length > 192) {
		check = false;
	}
	if (seedKey == 1024 && $('#UpdateKeys_seedPubK').val().length > 282) {
		check = false;
	}
	if (seedKey == 2048 && $('#UpdateKeys_seedPubK').val().length > 461) {
		check = false;
	}
	if (seedKey == 4096 && $('#UpdateKeys_seedPubK').val().length > 810) {
		check = false;
	}
	if (seedKey == 8192 && $('#UpdateKeys_seedPubK').val().length > 1500) {
		check = false;
	}

	if (mailKey == 512 && $('#UpdateKeys_mailPubK').val().length > 192) {
		check = false;
	}
	if (mailKey == 1024 && $('#UpdateKeys_mailPubK').val().length > 282) {
		check = false;
	}
	if (mailKey == 2048 && $('#UpdateKeys_mailPubK').val().length > 461) {
		check = false;
	}
	if (mailKey == 4096 && $('#UpdateKeys_mailPubK').val().length > 810) {
		check = false;
	}
	if (mailKey == 8192 && $('#UpdateKeys_mailPubK').val().length > 1500) {
		check = false;
	}

	return check;
}




function validateSeedKeysFromUser() {
	var pki = forge.pki;
	var obj = $('#ReqKeys_seedPubK');
	$('#warnSeedKey').remove();

	if (obj.val() != '' && obj.val().length <= 461) {
		try {
			var spublicKey = pki.publicKeyFromPem(obj.val());
			var sencrypted = spublicKey.encrypt('test', 'RSA-OAEP');

			obj.parent().removeClass('state-error');
			obj.parent().removeClass('state-error');
			obj.parent().addClass('state-success');
			obj.parent().addClass('state-success');

		} catch (err) {
			obj.parent().removeClass('state-success');
			obj.parent().removeClass('state-success');
			obj.parent().addClass('state-error');
			obj.parent().addClass('state-error');
		}

	} else {
		obj.parent().removeClass('state-success');
		obj.parent().removeClass('state-success');
		obj.parent().removeClass('state-error');
		obj.parent().removeClass('state-error');
	}
	if (obj.val() != '' && (obj.val().length > 461 || obj.val().length < 170)) {
		obj.parent().removeClass('state-success');
		obj.parent().removeClass('state-success');
		obj.parent().addClass('state-error');
		obj.parent().addClass('state-error');
		obj.parent().append('<span id="warnSeedKey">Key should be between 512 - 2048 bits.</span>');
	}

}





function calcPerformance() {
	var start = new Date().getTime();
	var rsa = forge.pki.rsa;
	var pki = forge.pki;

	var keypair = rsa.generateKeyPair({bits: 1024, e: 0x10001});

	var publicKey = keypair.publicKey;

	var encrypted = publicKey.encrypt('100000', 'RSA-OAEP');

	var privateKey = keypair.privateKey;
	var end = new Date().getTime();
	var decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP');
	var startdec = new Date().getTime();
	for (var i = 0; i < 10; i++) {
		decrypted = privateKey.decrypt(encrypted, 'RSA-OAEP');
	}
	var enddec = new Date().getTime();
	var time = end - start;
	var timedec = enddec - startdec;

	var optimist = ((time / 10) + (time * 5)) / 1000;
	var optimal = ((time) + (time * 10)) / 1000;
	var paranoid = ((time * 10) + (time * 100)) / 1000;

	var optimistspeed = ((timedec * 100) / 1000) / 6;
	var optimalspeed = (timedec * 100) / 1000;
	var paranoidspeed = ((timedec * 100) / 1000) * 6;

	$('#optimist').text(optimist.toFixed() + ' sec.');
	$('#optimal').text(optimal.toFixed() + ' sec.');
	$('#paranoid').text(paranoid.toFixed() + ' sec.');

	$('#optimistspeed').text(optimistspeed.toFixed() + ' sec.');
	$('#optimalspeed').text(optimalspeed.toFixed() + ' sec.');
	$('#paranoidspeed').text(paranoidspeed.toFixed() + ' sec.');

}


function makerandom() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < Math.floor(Math.random() * 15) + 1; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function makeDerived(secret, salt) {
	return forge.pkcs5.pbkdf2(secret, salt, 4096, 64);
}

/*
 function indomainNotice(email,emailparsed,locmails,dataBack,index){

 requestPublicKeys(function () {
 locmails.splice(index, 1);
 emailparsed['indomain'].splice(index, 1);
 console.log($('#toRcpt').select2('data'));
 new_data = $.grep($('#toRcpt').select2('data'), function (value) {
 console.log(value['id']);
 return value['id'].toLowerCase() != email.toLowerCase();
 });
 $('#toRcpt').select2('data', new_data);

 indomainLoop(emailparsed,locmails,dataBack);
 },function(){
 var $btn =$('#send');
 $btn.button('reset');
 },email);

 }
 */
