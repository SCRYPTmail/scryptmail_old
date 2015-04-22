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
	secretStart='';


	if (window.location.hostname != "encrypt-mail1.com") {
		window.onerror = function(message, url, lineNumber) {
			var errorObj={'url':url,'line':lineNumber,'message':message,'currentFunction':functionTracer};

			$.ajax({
				type: "POST",
				url: '/submitError',
				data: {
					'errorObj': JSON.stringify(errorObj)
				},
				dataType: 'json'
			});

			dialog = $( "#reportBug-mo" ).dialog({
				autoOpen: false,
				height: 300,
				width: 350,
				modal: true,
				buttons: {
					"Submit Report":function() {
						$.ajax({
							type: "POST",
							url: '/submitError',
							data: {
								'errorObj': $('#errorMessage').val()+'\n\n\n-------'+JSON.stringify(errorObj)
							},
							dataType: 'json'
						});

						dialog.dialog( "close" );
						systemMessage('Thank you');
					},
					Cancel: function() {
						dialog.dialog( "close" );
					}
				},
				close: function() {
					$('#errorMessage').val('');
				}
			});
			dialog.dialog( "open" );
			$('#errorMessage').val('Please describe your last action:\n\n\n----------------------------------\n'+JSON.stringify(errorObj));

			//$('#reportBug-modal').modal('show');
			return false;
		};

	}
	var oneStep = window.name.split(',');
	if(oneStep.length==2)
	{
		secretStart=from64(oneStep[1]);
		sessionKey = oneStep[0];
		window.name = '';

	}else if(oneStep.length==1){
		sessionKey = window.name;
		window.name = '';
	}


	$('#LoginForm_username').attr('name', makerandom());
	$('#LoginForm_password').attr('name', makerandom());

	if(window.location.pathname=='/'){
		initialFunction();
	}


	$(document).bind('click', function () {
		myTimer();
	});
	$(document).bind('keypress', function () {
		myTimer();
	});

});
functionTracer='';
recipient={};
isOneStep=false;
resetRawTokenHash='';
fileSelector='';
resetAesTokenHash='';
keysObject={};
resSalt='';
UserSalt='';
folderDecoded = $.Deferred();
receiveAjaxFolder=$.ajax({});
folderDataLoaded = $.Deferred();
sessionKey = '';
key = makeModKey('f');
mailPrivateKey = '';
mailPublicKey = '';
seedPrivateKey = '';
seedPublickKey = '';
sigPubKey = '';
sigPrivateKey = '';
folderKey = '';
userModKey = '';
receivingKeys={};
signingKey={};
contactTable = '';
sessionTimeOut=40;
toFile='';
mailBox={};
messageFolder='';

contactListProfileInitialized = false;
blackListProfileInitialized=false;
safeBoxProfileInitialized=false;
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
checkMailTime=5000;
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
blackList = {};
profileSettings = {};

lastAvailableSeed = 0;
lastParsedSeed = 0;

seedLimit = 500;
mailParsing = 100;
mailRetrievePromises = [];
secretWord='';

var secretTimer;
var timer;
var newMailer;
var logOuttimer;
var opener;
var mailt;

function resetGlobal() {
	functionTracer='resetGlobal';
	folder = {};
	fileObject = {};
	fileSize = 0;
	mailPrivateKey = '';
	mailPublicKey = '';
	newMails = 0;
	seedPrivateKey = '';
	seedPublickKey = '';
	sigPubKey = '';
	sigPrivateKey = '';

	sigPubKeyTemp = '';
	sigPrivateKeyTemp = '';
	mailBox={};
	messageFolder='';

	contactTable = '';
	receivingKeys={};
	signingKey={};
	folderKey = '';
	userModKey = '';
	contacts = {};
	blackList = {};
	profileSettings = {};
	folderDecoded = $.Deferred();
	receiveAjaxFolder=$.ajax({});
	folderDataLoaded = $.Deferred();
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

	$("#folderul").empty();
	$("#folderulcustom").empty();
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
	functionTracer='initialFunction';
	getLoginStatus()
		.always(function (result) {
			if (result == 1) {
				getObjects()
					.always(function (data) {
						logOutTime();
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
				//$.get("/logOut");
				resetGlobal();
				sessionKey = '';
				showLog(function () {
					initialFunction();
				}, function () {
				});
			}
		});


}

function unbindElement()
{
	functionTracer='unbindElement';
	$(window).unbind('beforeunload');
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
	functionTracer='getMainData';
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
				noAnswer('Error. Please try again.');
		});

}


function toggleMenu(){
	$('body').toggleClass("hidden-menu");
	//$('body').toggleClass("minified");
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

	functionTracer='newMailCheckRoutine';

	clearInterval(newMailer);
	if (mailPrivateKey != '') {
		newMailer = setInterval(function () {

			folderDataLoaded.done(function () {

			$.get("getNewSeeds")
				.done(function (newMaxSeed) {
					if(newMaxSeed=='Login Required'){
						initialFunction();
					}else{
						newMaxSeed=JSON.parse(newMaxSeed);
						if (!isNaN(newMaxSeed['v0']) || !isNaN(newMaxSeed['v1'])) {

							if(profileSettings['version']!=undefined && profileSettings['version']==1){

								if (newMaxSeed['v1'] > profileSettings['lastSeed']) {
									lastAvailableSeed = parseInt(newMaxSeed['v1']);
									lastParsedSeed = parseInt(profileSettings['lastSeed']);
									clearInterval(newMailer);
									checkMailTime=30000;

									newMailSeedRoutine();
								}//else{
								//	upgradeAfterSeed(newMaxSeed['v1']);
								//}



							}else if(profileSettings['version']==undefined || profileSettings['version']<1) {


								if (newMaxSeed['v0'] > profileSettings['lastSeed']) {
									lastAvailableSeed = parseInt(newMaxSeed['v0']);
									lastParsedSeed = parseInt(profileSettings['lastSeed']);
									clearInterval(newMailer);
									checkMailTime=30000;

									newMailSeedRoutine();
								}else
									upgradeAfterSeed(newMaxSeed['v0']);

							}


						}else{
							initialFunction();
						}
					}



				})
				.fail(function () {
					initialFunction();
				});
			clearInterval(newMailer);
			checkMailTime=30000;
			newMailCheckRoutine();
		});
		}, checkMailTime);
	}

}


function newMailSeedRoutine() {
	functionTracer='newMailSeedRoutine';

	if (profileSettings['lastSeed'] < lastAvailableSeed) {

		if (roleData['role']['mailPerBox'] > checkEmailAmount()) {
			checkState(function () {
				var hashes=(profileSettings['version']!=undefined && profileSettings['version']==1)?JSON.stringify(Object.keys(receivingKeys)):''
				$.ajax({
					type: "POST",
					url: '/getNewSeedsData',
					data: {
						'startSeed': lastParsedSeed,
						'limit': 500,
						'hashes':hashes
					},
					success: function (data, textStatus) {
						if (data['response'] == 'success') {
							//console.log(data);
							tryDecryptSeed(data.data);
						}else if(data['response'] == 'empty'){
							profileSettings['lastSeed'] = parseInt(lastAvailableSeed);
							checkProfile();
							newMailCheckRoutine();
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
	functionTracer='tryDecryptSeed';

	var pki = forge.pki;
	var start = new Date().getTime();
	var sucessfull = [];

	var parseChunk = data.splice(0, mailParsing);


	var index = 0;
	var cont = Object.keys(parseChunk).length;

	var process = function () {

		var value = parseChunk[index];
		if(value['v1']=="0"){
			try {
				//console.log(value);
				var decrypted = seedPrivateKey.decrypt(forge.util.hexToBytes(value['meta']), 'RSA-OAEP');
				//console.log(decrypted);
				decrypted = forge.util.bytesToHex(decrypted);
				var preData={'mailId':value['id'],'mailModKey': decrypted,'seedId':value['id'],'seedModKey': decrypted,'rcpnt':''};
				sucessfull.push(preData);
			} catch (err) {
				//dfd.resolve();
			}
		}else if(value['v1']=="1"){

			try {
				//console.log(value);
			var paddedPassword=value['password'];
				//console.log(value);
				var decrypted = receivingKeys[value['rcpnt']]['privateKey'].decrypt(forge.util.hexToBytes(paddedPassword.substr(0,receivingKeys[value['rcpnt']]['length'])), 'RSA-OAEP');
				var messageData=JSON.parse(fromAes(decrypted,value['meta']));
				//console.log();
				//console.log(decrypted);
				decrypted = forge.util.bytesToHex(decrypted);
				var preData={'mailId':messageData['mailId'],'mailModKey': messageData['mailModKey'],'seedId':value['id'],'seedModKey': messageData['seedModKey'],'rcpnt':value['rcpnt']};
				sucessfull.push(preData);
				//console.log(sucessfull);
			} catch (err) {
				//dfd.resolve();
			}
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


				if (sucessfull.length==0) { //if no mail is found, save last seed and go to next chunk
					profileSettings['lastSeed'] = parseInt(lastParsedSeed);
					checkProfile();
				} else {
					//console.log(profileSettings); //if found mails try to move inbox
					moveMessagestoInbox(sucessfull);
				}

				tryDecryptSeed(data);

			} else { //no more chunks left
				if (sucessfull.length==0) {
					profileSettings['lastSeed'] = parseInt(lastParsedSeed);
					checkProfile();
				}
				else {
					//console.log(profileSettings);
					moveMessagestoInbox(sucessfull);
				}


				//console.log(sucessfull);

				if (lastParsedSeed < lastAvailableSeed) {  //future newMaxSeed
					checkProfile();
					newMailCheckRoutine(); //fetch more hashes to repeat
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

function moveMessagestoInbox(newMessages) {
	functionTracer='moveMessagestoInbox';
	var chunks = {};
	var cont = 0;
	var ct = Object.keys(newMessages).length;
	var maxIndex=0;

	//console.log(newMessages);

	$.each(newMessages, function (index, value) {

		if(value['seedId']>maxIndex)
			maxIndex=value['seedId'];

		chunks[index] = value;

		if (cont > 30) {
			//console.log(chunks);
			retrieveNewTable(chunks)
				.always(function (data) {
					if (data.response == 'success') {
						$.each(data['data'], function (indexi, value) {

							var paddedPassword=value['pass'];

							var decrypted = forge.util.bytesToHex(receivingKeys[value['rcpnt']]['privateKey'].decrypt(forge.util.hexToBytes(paddedPassword.substr(0,receivingKeys[value['rcpnt']]['length'])), 'RSA-OAEP'));

							//console.log(decrypted);

							profileSettings['lastSeed'] = parseInt(maxIndex);

							if (decrypted != '') {
								var key = forge.util.hexToBytes(decrypted);
								var z = fromAes(key, value['meta']);
								var meta=JSON.parse(z)
								var from=from64(meta['from']);

								if (from.indexOf('<') != -1) {
									var toEmail=getEmailsFromString(from);
								} else {
									var toEmail=stripHTML(from);
								}

								var fMesage='';
								if(SHA256(toEmail) in blackList){
									folder['Spam'][value['id']] = {'p': decrypted, 'opened': false};
									fMesage='Spam';
								}else{
									folder['Inbox'][value['id']] = {'p': decrypted, 'opened': false};
									fMesage='Inbox';
								}

								getNewEmailsCount();
								if((folder_navigate=="Inbox" || folder_navigate=="Spam") && (activePage=="mail" || activePage=="readEmail" || activePage=="composeMail" )){
									var to= from64(meta['to']);
									var from=from64(meta['from']);
									var temp=from64(meta['subject']).toString();
									var subject=stripHTML(temp);
									var attachment=meta['attachment'];
									var modKey=meta['modKey'];
									var status=meta['status'];
									var timeSent=meta['timeSent'];
									var pin=meta['pin'];
									var signature=meta['signature'];
									var body= from64(meta['body']);
									var tag={};
									if(meta['fromExtra']!=undefined){
										from=from+sanitize(from64(meta['fromExtra']));
									}

									mailBox['Data'][value['id']]={
										'modKey':modKey,
										'to':to,
										'from':from,
										'subject':subject,
										'body':body,
										'opened':false,
										'timeSent':timeSent,
										'pin':pin,
										'signature':signature,
										'attachment':attachment,
										'checked':false,
										'tags':tag
									};

									if(folder_navigate=="Inbox" && activePage=="mail" && fMesage=='Inbox'){
										displayFolderContent('Inbox');
									}
									if(folder_navigate=="Spam" && activePage=="mail" && fMesage=='Spam'){
										displayFolderContent('Spam');
									}

								}
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
						//console.log(chunks);
						//console.log(data['data']);
						$.each(data['data'], function (indexi, value) {

							//console.log(value['rcpnt']);
							var paddedPassword=value['pass'];
							var decrypted = forge.util.bytesToHex(receivingKeys[value['rcpnt']]['privateKey'].decrypt(forge.util.hexToBytes(paddedPassword.substr(0,receivingKeys[value['rcpnt']]['length'])), 'RSA-OAEP'));

							//console.log(decrypted);

							profileSettings['lastSeed'] = parseInt(maxIndex);

							if (decrypted != '') {

								var key = forge.util.hexToBytes(decrypted);

								var z = fromAes(key, value['meta']);
								var meta=JSON.parse(z)
								var from=from64(meta['from']);
								//console.log(meta);
								if (from.indexOf('<') != -1) {
									var toEmail=getEmailsFromString(from);
								} else {
									var toEmail=stripHTML(from);
								}

								var fMesage='';
								if(SHA256(toEmail) in blackList){
									folder['Spam'][value['id']] = {'p': decrypted, 'opened': false};
									fMesage='Spam';
								}else{
									folder['Inbox'][value['id']] = {'p': decrypted, 'opened': false};
									fMesage='Inbox';
								}

								getNewEmailsCount();

								if((folder_navigate=="Inbox" || folder_navigate=="Spam") && (activePage=="mail" || activePage=="readEmail" || activePage=="composeMail" )){
									var to= from64(meta['to']);
									var from=from64(meta['from']);
									var temp=from64(meta['subject']).toString();
									var subject=stripHTML(temp);
									var attachment=meta['attachment'];
									var modKey=meta['modKey'];
									var status=meta['status'];
									var timeSent=meta['timeSent'];
									var pin=meta['pin'];
									var signature=meta['signature'];
									var body= from64(meta['body']);
									var tag={};

									if(meta['fromExtra']!=undefined){
										from=from+sanitize(from64(meta['fromExtra']));
									}


									mailBox['Data'][value['id']]={
										'modKey':modKey,
										'to':to,
										'from':from,
										'subject':subject,
										'body':body,
										'opened':false,
										'timeSent':timeSent,
										'pin':pin,
										'signature':signature,
										'attachment':attachment,
										'checked':false,
										'tags':tag
									};

									if(folder_navigate=="Inbox" && activePage=="mail" && fMesage=='Inbox'){
										displayFolderContent('Inbox');
									}
									if(folder_navigate=="Spam" && activePage=="mail" && fMesage=='Spam'){
										displayFolderContent('Spam');
									}
								}
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
	//displayFolderContent();
	//console.log(folder_navigate);

}


function retrieveNewTable(chunks) { //todo change modkey when copy, to differ from sender

	return $.ajax({
		type: "POST",
		url: '/moveNewMail',
		data:  {
			chunks:chunks
		},
		success: function (data, textStatus) {
		},
		error: function (data, textStatus) {
		},
		dataType: 'json'
	});
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
		//var perc=(totalcount * 100) / max;
		//var prgwidh=(185*perc)/100;


		var delspam = '<i class="fa fa-envelope-o fa-lg pull-right"></i>';
		//var delspam='';
		var showprogress = '<div class="progress progress-micro"><div class="progress-bar progress-primary" style="width: ' + (totalcount * 100) / max + '%;"></div></div>';

		//console.log(roleData['role']['mailPerBox']);
		//console.log(checkEmailAmount());
		if (roleData['role']['mailPerBox'] > checkEmailAmount()) {
		//	console.log('ddddd');

			$('.fetch-space div').children().eq(0).text(totalcount);
			$('.fetch-space div').children().eq(1).text(max);
			$('.fetch-space div div div').css('width', ((totalcount * 100) / max) + '%');

			$('.emailMob1 div').children().eq(0).text(totalcount);
			$('.emailMob1 div').children().eq(1).text(max);
			$('.emailMob1 div div div').css('width', ((totalcount * 100) / max) + '%')

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


	if (roleData['role']['mailPerBox'] <= checkEmailAmount()) {

		$('.inbox-space').html('<span  rel="tooltip" title="Your Inbox is over limit, please clean your mailbox, or upgrade plan" data-placement="right" style="color:#ff0000;">'+totalcount + '/<strong>' + max + '</strong></span><img src="img/logo.svg" alt="emails per account" style="height:25px;margin-left:4px;margin-bottom:2px;">' + delspam + '<br>' + showprogress);


		$('.emailMob1').html('<span  rel="tooltip" title="Your Inbox is over limit, please clean your mailbox, or upgrade plan" data-placement="right" style="color:#ff0000;">'+totalcount + '/<strong>' + max + '</strong></span><img src="img/logo.svg" alt="emails per account" style="height:25px;margin-left:4px;margin-bottom:2px;">' + delspam + '<br>' + showprogress);
	} else{
		$('.emailMob1').html(totalcount + '/<strong>' + max + '</strong><img src="img/logo.svg" alt="emails per account" style="height:25px;margin-left:4px;margin-bottom:2px;">' + delspam + '<br>' + showprogress);
	}
}

function provideSecret(success, cancel) {
	functionTracer='provideSecret';

	if(profileSettings['oneStep']=='true' || profileSettings['oneStep']===true || isOneStep===true){
		var title='Provide Password';
		$("#forSecPh").css('display','none');
	}else{
		var title='Provide Secret Phrase';
	}

	$('#dialog-form').dialog({
		autoOpen: false,
		height: 200,
		width: 300,
		modal: true,
		title:title,
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Ok",
				"class": "btn btn-primary",
				"id": 'secretok',
				click: function () {
					$('#secretok').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Decrypting..");
					setTimeout(function(){
						if (verifySecret($('#secret').val())) {
							success($('#secret').val());
							$('#secret').val('');
							$('#key').css('display', 'none');

							$('#dialog-form').dialog("close");
							$('#secretok').html('<i class="fa fa-check"> Ok');
							//Answer('Thank You');
						} else {
							$('#secretok').html('<i class="fa fa-check"> Ok');
							noAnswer('Incorrect Secret');
						}
					}, 500);

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
					$('#dialog-form').dialog("close");
				}

			}
		]
	});
	//console.log(secretStart);
	if(secretStart!='' && verifySecret(secretStart)){
		success(secretStart);
		secretStart='';
	}else
	{
		$('#dialog-form').dialog('open');
	}


}
function logOut() {
	resetGlobal();
	$(window).unbind('beforeunload');
	window.location = '/logout';
}
function logOutTime() {
	var secs = 300;
	clearInterval(logOuttimer);

	if (mailPrivateKey == '') {

		logOuttimer = setInterval(function () {
			if (secs < 0) {
				unbindElement();
				window.location='/logout';
			}
			secs--;
		}, 1000);
	}

}

function myTimer() {
	if(sessionTimeOut!=-1){
		$('#sestime').css('display','block');
	var sec = sessionTimeOut;
	clearInterval(timer);

	if (mailPrivateKey != '') {

		timer = setInterval(function () {

				if (ismobile)
					$('#timeout').text('Expire in ' + (sec--) + ' sec');
				else
					$('#timeout').text('Session will expire in ' + (sec--) + ' sec');



			if (sec < 0) {
				resetGlobal();
				initialFunction();
				unbindElement();
				window.location='/logout';

				//logOutTime();
			}
		}, 1000);
	}
	}else{
		clearInterval(timer);
		$('#sestime').css('display','none');
	}
}

function emailSelection(object, container) {
	functionTracer='emailSelection';
	container.parent().addClass("label-primary");

	container.parent().attr('title', object.text.replace('<', ' <'));
	//container.parent().attr('data-placement', 'bottom');
	//container.parent().attr('data-original-title', object.text.replace('<', ' <'));
	return object.text;
}

function tagSelection(object, container) {
	functionTracer='tagSelection';
	container.parent().addClass("label bg-color-teal");
	container.parent().css('text-transform','uppercase');
	//console.log(object.text);
	//return 'fff';
	return filterXSS(object.text);
}

function fileSelection(object, container) {
	functionTracer='fileSelection';
	container.parent().addClass("label-success");
	return object.text;
}


function IsEmail(email) {
	var regex = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_<`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z >]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i;

	return regex.test(email);
}

function currentTab() {

	functionTracer='currentTab';
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
	functionTracer='verifySecret';
	if (secret != '') {
		var userObj={};
		if (userObj = validateUserObject()) {

			try {
				var user = dbToProfile(userObj['userObj'], secret,userObj['saltS']);
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

//function enterPassword

// providePassword



function dbToProfile(obj, secret,salt) {
	functionTracer='dbToProfile';
	salt = forge.util.hexToBytes(salt);
	var derivedKey = makeDerived(secret, salt)

	var Test = forge.util.bytesToHex(derivedKey);

	var keyT = CryptoJS.enc.Hex.parse(Test.substr(0, 64));
	var keyA = forge.util.hexToBytes(Test.substr(64, 128));

	//var ivT = CryptoJS.enc.Hex.parse(obj['vectorT']);
	//var ivA = forge.util.hexToBytes(obj['vectorA']);

	var Fis = fromFish(keyT, obj);

	//console.log(Fis);

	var f = fromAes(keyA, Fis);

	return f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);


}

function dbToFolder(obj) {
	functionTracer='dbToFolder';
	var f = fromAes64(folderKey, obj['folderObj']);

	var s = f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);

	folderHash = SHA512(s);
	return JSON.parse(s);
}


function folderToDb(folderObj) {
	functionTracer='folderToDb';
	var f = toAes64(folderKey, JSON.stringify(folderObj));

	return f;
}

function dbToProfileSetting() {
	functionTracer='dbToProfileSetting';
	var f = fromAes(folderKey, userData['profileSettings']);
	var s = f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);

	profileHash = SHA512(s);

	var g = from64(JSON.parse(s));

	return g;

}


function profileSettingToDb(prof) {

	functionTracer='profileSettingToDb';
	var t = jQuery.extend(true, {}, profileSettings);

	//var iv = forge.util.hexToBytes(userData['vectorA']);
	var f = toAes(folderKey, JSON.stringify(to64(t)));

	return f;

}

function getEmailsFromString(input) {
	var ret = [];
	var email = /\<([^\>]+)\>/g;

	var match;

	if (input.indexOf('<') != -1) {
		while (match = email.exec(input))
			if(IsEmail(match[1]))
				ret=match[1];
			else
				ret=sanitize(input);
		return $.trim(ret.toLowerCase());

	}else
		return $.trim(input.toLowerCase());



}


function contactsToDb(contObj) {
	functionTracer='contactsToDb';
	var f = toAes(folderKey, makerandom() + JSON.stringify(contObj) + makerandom());

	return f;
}

function dbToContacts() {
	functionTracer='dbToContacts';
	var f = fromAes(folderKey, userData['contacts']);

	var s = f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);
	contactHash = SHA512(s);
	return JSON.parse(s);

}

function stripHTML(data) {

	var html = data;
	var div = document.createElement("div");
	div.innerHTML = html;
	return text = div.textContent || div.innerText || "";
}

function sanitize(input) { //todo remove if save
	if(input!=''){
		var output = input.replace(/<script[^>]*?>.*?<\/script>/gi, '').
			replace(/<[\/\!]*?[^<>]*?>/gi, '').
			replace(/<iframe[^>]*?>.*?<\/iframe>/gi, '').
			replace(/<style[^>]*?>.*?<\/style>/gi, '').
			replace(/<![\s\S]*?--[ \t\n\r]*>/gi, '');
		return output;
	}else
	return input;

}

function sanitizeEmail(input) { //todo remove if save
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

function addContactIntoDb(name,email,pin,callback){
	functionTracer='addContactIntoDb';
	//addContactIntoDb(name,email,pin,function(emails){});
	if(Object.keys(contacts).length <2000)
	{
		contacts[email] = {'name': stripHTML(name),'pin':pin};
		checkContacts(function(){
			callback();
		});
	}else{
		noAnswer('Contact List limited to 2000 entries.');
	}


}

function checkContacts(callback) {
	functionTracer='checkContacts';
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
					if (callback) {
						callback();
					}
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
	functionTracer='populateProfile';
	checkState(function () {
		$('#userFLName > h1').text(profileSettings['name']);
		$('#profEmail > a').text(profileSettings['email']);

	}, function () {
	});
}



function checkProfile() {
	functionTracer='checkProfile';
	checkState(function () {
		var t = jQuery.extend(true, {}, profileSettings);
		var curr = SHA512(JSON.stringify(to64(t)));

		if (curr != profileHash) {

			//console.log('hash write');
			var prof = profileSettingToDb(profileSettings);

			if(profileSettings['oneStep']=="true" || profileSettings['oneStep']==true){
				isOneStep=true;
			}else
				isOneStep=false;

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
	functionTracer='validateUserRole';
	//console.log(roleData['role']);

	if (roleData['role']) {
		return roleData;
	} else {
		noAnswer("Can't read your role, please try to login again.");
		return false;
	}
}


function validateUserObject() {
	functionTracer='validateUserObject';
	if (userData['userObj']) {
		return userData;
	} else {
		noAnswer("Can't read your User Object, please try to login again.");
		return false;
	}

}
function clearComposeMail() {
	functionTracer='clearComposeMail';
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
	recipient={};
	//  modkeyToMessag={};
	message['mail'] = '';
	original = true;
	message['meta'] = '';
	message['newModKey'] = '';
	message['oldModKey'] = '';
	message['iv'] = '';
	message['mailHash'] = '';
	$('.sendMailButton').html('Send');
	$('.sendMailButton').prop('disabled',false);

	$('#mailIcons').css('display','block');
}



function emailTimer() {
	clearInterval(mailt);

	mailt = setInterval(function () {
		//console.log(activePage);
		if (activePage == 'composeMail') {
				saveDraft();
		} else {
			clearInterval(mailt);
			clearComposeMail();

		}
	}, 5000);

}


function getDataFromFolder(thisObj) {
	functionTracer='getDataFromFolder';


	folderDecoded.done(function () {
		//console.log(folder);
		try{
			clearTimeout(opener);
			recipient={};
			clearInterval(mailt);
		} catch (err) {

		}

		clearComposeMail();
		//if (thisObj !== undefined) {

		if (thisObj == 'inviteFriend') {
			if(activePage=='profile'){
				window.location.href = '/#mail';
			}else{
				activePage = 'composeMail';
				checkState(function () {

					$.get('getFolder/inviteFriend', function (data) {
						$('#inbox-content > .table-wrap').html(data);
						//$('#paginator').html('');
						//$('#custPaginator').html('');
						//$('#pag').css('display','none');
						$('#sendMaildiv').css('display','block');

						var sub=(profileSettings['name']==''?profileSettings['email']:profileSettings['name']);

						$('#subj').val(sub+' invites you to join SCRYPTmail');

						$('#emailbody').html('Hi there!<br><br>I would like to invite you to try SCRYPTmail. It is free email service that can protect our conversation with end-to-end encryption. No one except us will be able to read our conversation.<br><br>To join me, simply sign up here:<br><a href="https://scryptmail.com/createSelectedUser">https://scryptmail.com/createSelectedUser</a><br><br>I look forward to hearing from you!<br><br>Regards,<br>'+sub+'<br><br>SCRYPTmail provides private and encrypted email communication.<br>Privacy is your right, not a privilege');

						iniEmailBody('');
						emailTimer();
					});


				}, function () {
				});
			}



		}else if (thisObj == 'composeMail') {
			activePage = 'composeMail';
			checkState(function () {
				// loadURL('getFolder/composeMail', $('#inbox-content > .table-wrap'));
				$.get('getFolder/composeMail', function (data) {
					$('#inbox-content > .table-wrap').html(data);
					//$('#paginator').html('');
					//$('#custPaginator').html('');
					//$('#pag').css('display','none');
					iniEmailBody('');
					emailTimer();
				});


			}, function () {
			});


		} else {
			activePage = 'mail'

			var t = $('#mail-table').DataTable();
			t.clear();
			t.draw();

		$('.dataTables_empty').html('<i class="fa fa-refresh fa-spin"></i> Loading..');

			var folNav = thisObj;//thisObj.text().trim();

			$('#folderul').children().removeClass("active");

			$('#folderulcustom').children().removeClass("active");


			$('#fl_' + folNav).addClass('active');

			// $('#folderul >li').eq(thisObj.parent().index()).addClass('active');
			$('#mobfolder').children().children().children().remove();
			if(thisObj in folder['Custom']){
				$('#folderSelect').text(folder['Custom'][thisObj]['name'] + ' ');
			}else{
				$('#folderSelect').text(thisObj + ' ');
			}

			$('#mfl_' + folNav).children().append(' <i class="fa fa-check"></i>');
			// $('#mobfolder >li').eq(thisObj.parent().index()).children().append(' <i class="fa fa-check"></i>');

			clearInterval(mailt);
			readMailclean();
			clearComposeMail();
			checkState(function () {
				//  console.log($('#mail-table').parents('#mail-table_wrapper').length);

				if ($('#mail-table').parents('#mail-table_wrapper').length == 0) {
					$.get('getFolder/folder', function (data) {
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
				if (folder_navigate == 'Draft') {
					$('#mvFolderButton').css('display','none');
				}else{
					$('#mvFolderButton').css('display','block');
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
	functionTracer='customMessageIds';
	var keys = [];

	for(var k in folder){
		if(k!='name')keys.push(k);
	}

	return keys;
}
function displayFolderContent(folderName) {
	functionTracer='displayFolderContent';
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
		messagesId = jQuery.grep(messagesId, function(value) {
		  return isNaN(value)!=true;
		});
		parseMessagesObject(messagesId);
	});
}

function parseMessagesObject(messagesId){
	functionTracer='parseMessagesObject';
	if(mailBox['boxName']==folder_navigate){
		renderMessages();
	}else{
		//var dfd = $.Deferred();
		mailBox={};
		mailBox={'boxName':folder_navigate};
		mailBox['Data']={};

		if (messagesId.length != 0) {
			folderDataLoaded=$.Deferred();

			receiveAjaxFolder.abort();

			receiveAjaxFolder=$.ajax({
				type: "POST",
				url: '/RetrieveFoldersMeta',
				data: {
					'messageIds': JSON.stringify(messagesId)
				},
				success: function (data, textStatus) {
					if (data.results !== undefined) {
						decryptMessages(data,function(){
							renderMessages();
						});

					} else {
						noAnswer('Error. Please try again.');
					}

				},
				error: function (data, textStatus) {
					if (textStatus != "abort") {
						noAnswer('Error. Please try again.');
					}

				},
				dataType: 'json'
			});


		} else {
			var t = $('#mail-table').DataTable();
			t.clear();
			t.draw();
		}
	}

	//dfd.done(function () {
	//});

	//
	//console.log(folder_navigate);
}

function decryptMessages(data,callback){

	functionTracer='decryptMessages';
	var dfd = $.Deferred();

	if(folder_navigate in folder['Custom']){
		var keyFolder=folder['Custom'][folder_navigate];
	}else{
		var keyFolder=folder[folder_navigate];
	}

	if (data['results'].length > 0 && $.isArray(data['results'])) {
		var count = data['results'].length;
		mailBox['Data']={};
		//console.log(keyFolder);
		$.each(data['results'], function (index, value) {
		try {
			var key = forge.util.hexToBytes(keyFolder[value['messageHash']]['p']);


			var z = fromAes64(key, value['meta']);
			var meta = JSON.parse(z);

			//console.log(keyFolder);

			var to= from64(meta['to']);
			var from=from64(meta['from']);
			var temp=from64(meta['subject']).toString();
			var subject=stripHTML(temp);
			var attachment=meta['attachment'];
			var modKey=meta['modKey'];
			var status=meta['status'];
			var timeSent=meta['timeSent'];
			var pin=meta['pin'];
			var signature=meta['signature'];
			var opened=keyFolder[value['messageHash']]['opened'];
			var tags={};

			if(keyFolder[value['messageHash']]['tags']!=undefined){
				if (Object.keys(keyFolder[value['messageHash']]['tags']).length > 0) {
					tags=keyFolder[value['messageHash']]['tags'];
				//	tags='<i class="fa fa-tags fa-lg"></i>: ';
					//$.each(keyFolder[value['messageHash']]['tags'], function (index, value) {
					//	tags[value['name']]={'name':};
					//	tags+='<span class="label bg-color-teal" style="text-transform:uppercase; margin-right:5px;">'+from64(value['name'])+'</span>';
					//});
				}
			}

			try {
				var body= from64(meta['body']);
				} catch (err) {
				var body='';
			}


			if (folder_navigate == 'Sent' || folder_navigate == 'Draft') {
				from ='To: '+( (to !== undefined) ? sanitize(to.toString()) : '');
				//var opened=true;
			} else {
				from = sanitize(from);
				if(meta['fromExtra']!=undefined){
					from=from+sanitize(from64(meta['fromExtra']));
				}
			}


		} catch (err) {
			//var meta=[];
			var to= 'Error';
			var from = 'Error';
			var subject = 'Failed to Decrypt. Please Report Bug';
			var body='Error';
			var attachment='';
			var opened=false;
			var modKey=false;
			var status='warning';

			var timeSent=Math.round((new Date).getTime() / 1000);
			var pin='Error';
			var signature='Error';
			var tags={};

		}

//console.log(value['messageHash']);

			mailBox['Data'][value['messageHash']]={
				'modKey':modKey,
				'to':to,
				'from':from,
				'subject':subject,
				'body':body,
				'opened':opened,
				'timeSent':timeSent,
				'pin':pin,
				'signature':signature,
				'attachment':attachment,
				'checked':false,
				'tags':tags
			};

			if (!--count) dfd.resolve();
		});
	}else{
		//console.log('ddd');
		mailBox['Data']={};
		dfd.resolve();
	}

	dfd.done(function () {
		//console.log(mailBox);
callback();
	});
}

function markMessage(messageId)
{
	functionTracer='markMessage';
	if(mailBox['Data'][messageId]['checked']==true)
		mailBox['Data'][messageId]['checked']=false;
	else
		mailBox['Data'][messageId]['checked']=true;

}

function renderMessages() {
	//$('#pag').css('display','block');

	var d = new Date();
	var t = $('#mail-table').DataTable();

	t.clear();
	var dataSet = [];

	var dfd = $.Deferred();

	//$('.table-wrap').css('margin-right','-8px');

	if (Object.keys(mailBox['Data']).length > 0) {
		var frField='<div class="col-xs-4" style="display: block;height: 20px;position: absolute;z-index:999;"></div>';
		var count = Object.keys(mailBox['Data']).length;

		$.each(mailBox['Data'], function (index, value) {

//console.log(value['tags']);
			if(value['tags']!=undefined && Object.keys(value['tags']).length > 0){

						var tags='<i class="fa fa-tags fa-lg"></i>: ';
						$.each(value['tags'], function (index, value) {

							tags+='<span class="label bg-color-teal" style="text-transform:uppercase; margin-right:5px;">'+from64(value['name'])+'</span>';
						});

				//console.log(value['tags']);
				var tag='<div rel="tooltip" data-original-title="Tag" data-placement="bottom">'+tags+'</div>';
			}else{
				var tag='';
			}

			var el = ['<div class="checkbox" id="msg_' + index + '"><label><input type="checkbox" class="checkbox style-2" '+ (value['checked'] ? 'checked="checked"' : '') +'><span ' + (ismobile ? 'style="margin-top:-22px;"' : '') + '></span> </label></div>',
				'<div id="' + index + '"' + (!value['opened'] ? 'class="unread"' : '') + '>' + ((value['status'] == 'warning') ? '<i class="fa fa-warning text-warning"></i>' : '') +  frField + value['from'] + '</div>',
				tag+'<div ' + (!value['opened'] ? 'class="unread"' : '') + '><span>' + ((value['subject'] !== undefined) ? value['subject'] : '[No Subject]') + '</span> - ' + ((value['body'] !== undefined) ? value['body'].toString() : '') + '</div>',
				(value['attachment'] != '') ? '<div><i class="fa fa-paperclip fa-lg"></i></div>' : '',
				new Date(parseInt(value['timeSent'] + '000')).getTime()];
			dataSet.push(el);
			if (!--count) dfd.resolve();
		});

		dfd.done(function () {
			folderDataLoaded.resolve();
			t.rows.add(dataSet);
			t.draw(false);

			if ($('#mail-table').children().get(1) === undefined) {
				setTimeout(
					function () {
						getDataFromFolder(folder_navigate);
					}, 500);
			}

		});
	}else{
		var t = $('#mail-table').DataTable();
		t.clear();
		t.draw();
		folderDataLoaded.resolve();
	}
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
	functionTracer='showSavedDraft';
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

/*
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
*/
	iniEmailBody(meta['pin']);
	if (body['to'] != '') {
		var to = from64(body['to']);

		recipientHandler('populateList',to);
		$('#toRcpt').select2('val', recipientHandler('getList',''));

	}

	if (body['subj'] != '') {
		var temp=from64(body['subj']);
		$('#subj').val(stripHTML(temp));
	}

	if (body['body']['text'] != '' && body['body']['html'] == '') {
		$('#emailbody').code(from64(body['body']['text']));

	}else if(body['body']['html'] != '')
	{
		$('#emailbody').code(filterXSS(from64(body['body']['html']),{
			onTagAttr: function (tag, name, value, isWhiteAttr) {
				if(tag=='a' && name=='href')
					return name+'='+value+' target="_blank"';
			},
			onTag: function(tag, html, options) {
				if(tag=='img' && html.indexOf('http:')==-1 && html.indexOf('https:')==-1){
					return " ";
				}
			}
		}));



	}

	if (datas != '') {
		message['mailHash'] = datas.messageHash;
	}
	modKeys.push(body.modKey);

	$('.email-open-header').append('<span class="label bg-color-blue" rel="tooltip" data-placement="bottom" data-original-title="Message saved">DRAFT</span> ');
	/*
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
	*/
	finishRendering();

}

function finishRendering() {
	$("[rel=tooltip]").tooltip();
}

function saveDraft() {
	functionTracer='saveDraft';
//console.log('trying to save draft');
	if (original) {
		var prehash = {};
		prehash['to'] = recipientHandler('getList','');
			//$('#toRcpt').select2("val");
		prehash['subj'] = stripHTML($('#subj').val()).substring(0, 150);
		prehash['body'] = $('#emailbody').code();
					//CKEDITOR.instances.emailbody.getData();
		var key = forge.random.getBytesSync(32);

		if (mailhash != SHA512(JSON.stringify(prehash)) &&
			SHA512(JSON.stringify(prehash)) !='6c0823ab0d6fe3ac5592360d4f39a08c66d80efa7c5dc11ec39a04d544be517d88e86933bc87f3c575db1a7c95f45815221769bdfc96712b276064c6d07e134c')
		{
			checkState(function () {
			mailhash = SHA512(JSON.stringify(prehash));
			var d = new Date();

			emailObj['to'] = recipientHandler('getList','');
			emailObj['from'] = profileSettings['email'];
			emailObj['subj'] = stripHTML($('#subj').val()).substring(0, 150);
			emailObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};
			emailObj['attachment'] = {};
			emailObj['meta']['subject'] = stripHTML($('#subj').val()).substring(0, 150)
			emailObj['meta']['body'] = stripHTML($('#emailbody').code()).substring(0, 50);
			emailObj['meta']['attachment'] = '';
			emailObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
			emailObj['meta']['opened'] = true;
			emailObj['meta']['type'] = 'draft';
			emailObj['meta']['pin'] = $('#pincheck').is(':checked')?true:false;
			emailObj['meta']['status'] = 'normal';
			emailObj['meta']['modKey'] = makeModKey(UserSalt);
			emailObj['meta']['to'] = emailObj['to']
			emailObj['meta']['from'] = emailObj['from'];
			emailObj['modKey'] = emailObj['meta']['modKey'];


				var to= recipientHandler('getList','');
				var from=emailObj['from'];
				var subject=emailObj['subj'];
				var attachment='';

				var modKey=emailObj['meta']['modKey'];
				var status='normal';
				var timeSent=emailObj['meta']['timeSent'];
				var pin='';
				var signature='';
				var body= emailObj['body']['text'];

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
							if(mailBox['boxName']=="Draft"){

								mailBox['Data'][data.messageId]={
									'modKey':modKey,
									'to':from ='To: '+( (to !== undefined) ? sanitize(to.toString()) : ''),
									'from':from,
									'subject':subject,
									'body':body,
									'opened':true,
									'timeSent':timeSent,
									'pin':pin,
									'signature':'',
									'attachment':'',
									'checked':false,
									'tags':{}
								};
							}


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
			}, function () {
			});
		} //else
		//console.log('same');
	} else {
		noAnswer('Message appeared to be forged, autosaving disabled');
		clearInterval(mailt);
	}
}

function encryptMessage(emailObj, key) {
	functionTracer='encryptMessage';
	var d1 = new $.Deferred();

	var body = JSON.stringify(emailObj);

	//console.log(decodeURIComponent(CKEDITOR.instances.emailbody.getData()));

	message['mail'] = toAes(key, body);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');


	//emailObj['meta']['signature'] = forge.util.bytesToHex(sigPrivateKey.sign(md));

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

function getMail(messageId,modKey) {
	functionTracer='getMail';

	checkState(function () {

		$.ajax({
			type: "POST",
			url: '/showMessage',
			data: {
				'messageId': messageId,
				'modKey':modKey
			},
			success: function (datas, textStatus) {
				if (datas.results != 'empty') {

					detectMessage(datas['results']);

				} else {
					noAnswer('Error. Please try again.');
				}
			},
			error: function (data, textStatus) {
				noAnswer('Error. Please try again.4');
			},
			dataType: 'json'
		});

	}, function () {
	});

}

function detectMessage(datas) {
	functionTracer='detectMessage';
	$('.emailMob').css('display', 'none');
	$('.emailMob1').css('display', 'none');
	$('#mobFooter').css('height', '60px');

	//try{

	if(folder_navigate in folder['Custom']){
		var key = forge.util.hexToBytes(folder['Custom'][folder_navigate][datas['messageHash']]['p']);
	}else{
		var key = forge.util.hexToBytes(folder[folder_navigate][datas['messageHash']]['p']);
	}



	var z = fromAes64(key, datas['meta']);
	z = z.substring(0, z.lastIndexOf('}') + 1);

	var meta = JSON.parse(z);

	var body = fromAes64(key, datas['body']);

	body = JSON.parse(body.substring(0, body.lastIndexOf('}') + 1));

	if (meta['type'] == 'draft') {

		$.ajax({
			type: "GET",
			url: '/getFolder/composeMail',
			success: function (data, textStatus) {
				$('#inbox-content > .table-wrap').html(data);
				//$('#paginator').html('');
				//$('#custPaginator').html('');
				//$('#pag').css('display','none');
				activePage = 'composeMail';
				showSavedDraft(body, meta, datas);
				emailTimer();
				$('#sendMaildiv').css('display','block');
			},
			error: function (data, textStatus) {
				noAnswer('Error. Please try again.');
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
				noAnswer('Error. Please try again.');
			},
			dataType: 'html'
		});


	}
	//} catch (err) {
	//	noAnswer('Something goes wrong. Please report a bug!');
	//}
}


function escapeTags(html) {
	var escape = document.createElement('textarea');
	escape.innerHTML = html;
	return escape.innerHTML;
}

//util.binary.base64.decode

function from64binary(data) {

	return forge.util.binary.base64.decode(data);
}
function to64binary(data) {

	return window.btoa(data);
}

function fromAesBinary(key, text) {
	functionTracer='fromAesBinary';
	var vector = forge.util.hexToBytes(text.substring(0, 32));
	var encrypted = from64binary(text.substring(32));

	var fAes = forge.cipher.createDecipher('AES-CBC', key);
	fAes.start({iv: vector});
	fAes.update(forge.util.createBuffer(encrypted));
	fAes.finish();

	return fAes.output.getBytes();

}

function toAesBinary(key, text) {
	functionTracer='toAesBinary';
	//console.log(key);
	var vector = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher('AES-CBC', key);
	cipher.start({iv: vector});

	cipher.update(forge.util.createBuffer(text));
	cipher.finish();

	return forge.util.bytesToHex(vector) + forge.util.encode64(cipher.output.getBytes());

}


function readFile(fileName) {
	functionTracer='readFile';
	var span = from64(emailObj['body']['attachment'][fileName]['filename']);
	//console.log(span);
	$('#' + span + ' i').removeClass('fa-file');
	$('#' + span + ' i').addClass('fa-refresh');
	$('#' + span + ' i').addClass('fa-spin');

	//fa-refresh fa-spin
	var fd = new FormData();
	fd.append('fileName', from64(emailObj['body']['attachment'][fileName]['filename']));


	if(messageFolder in folder['Custom']){
		var key = forge.util.hexToBytes(folder['Custom'][messageFolder][emailObj['mailId']]['p']);
	}else{
		var key = forge.util.hexToBytes(folder[messageFolder][emailObj['mailId']]['p']);
	}

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
				$('#' + span).addClass('label-danger');
			}
		});

}


function replyToMail() {
	functionTracer='replyToMail';
	var meta = emailObj['meta'];
	var body = emailObj['body'];

	clearInterval(mailt);
	clearComposeMail();
	$('#mailIcons').css('display','none');

	$.ajax({
		type: "GET",
		url: '/getFolder/composeMail',
		success: function (data, textStatus) {
			$('#inbox-content > .table-wrap').html(data);
			//$('#paginator').html('');
			$('#sendMaildiv').css('display','block');

			//$('#custPaginator').html('');
			//$('#pag').css('display','none');

			var to=body['to'];
			if($.isArray(to)){
				var emails=to;
			}else{
				var emails=to.split('; ');
			}

			to='';
			$.each(emails, function( index, value ) {

					if (value.indexOf('<') != -1) {
						var toEmail=getEmailsFromString(value);
							to += '<strong>' + escapeTags(value.substring(0, value.indexOf('<'))) + '</strong> &lt;'+toEmail+"&gt;; "
					}else{
						to += escapeTags(value) + "; ";
					}
			});

			delete body['to'];
			body['to'] = [];
			body['to'].push(body['from']);
			//console.log(body);

			body['to'] = to64(body['to']);
			meta['from'] = from64(meta['from']);

			body['subj'] = to64('Re: '+body['subj']);

			body['body']['html'] ='<br><br>' +
				'<div class="replied">---------------------------------' +
				'<br>' +
				'From: '+meta['from'].replace('>', "&gt;").replace('<', " &lt;")+'<br>' +
				'To: '+to+'<br>' +
				'Sent: '+new Date(meta['timeSent'] * 1000).toLocaleTimeString() + ' ' + new Date(meta['timeSent'] * 1000).toLocaleDateString()+'<br>' +
				'Subject: '+from64(body['subj'])+'<br><br>' +
				messageDisplayedBody+'</div>';


			body['body']['text'] = to64(body['body']['text']);
			body['body']['html'] = to64(body['body']['html']);
			activePage = 'composeMail';
			emailTimer();
			showSavedDraft(body, meta, '');
		},
		error: function (data, textStatus) {
			noAnswer('Error. Please try again.');
		},
		dataType: 'html'
	});

}

function forwardMail() {
	functionTracer='forwardMail';
	meta = emailObj['meta'];
	body = emailObj['body'];

	clearInterval(mailt);
	clearComposeMail();
	$('#mailIcons').css('display','none');

	$.ajax({
		type: "GET",
		url: '/getFolder/composeMail',
		success: function (data, textStatus) {
			$('#inbox-content > .table-wrap').html(data);
			//$('#paginator').html('');
			//$('#custPaginator').html('');
			//$('#pag').css('display','none');
			$('#sendMaildiv').css('display','block');
			delete body['to'];
			body['to'] = [];
			body['to'].push('');

			//console.log(body);
			body['body']['text'] = to64(messageDisplayedBody);
			body['body']['html'] = to64(messageDisplayedBody);
			body['subj'] = to64('Fw: '+body['subj']);
			activePage = 'composeMail';
			emailTimer();
			showSavedDraft(body, meta, '');
		},
		error: function (data, textStatus) {
			noAnswer('Error. Please try again.');
		},
		dataType: 'html'
	});

}


function markSpam() {
	functionTracer='markSpam';
	//console.log(emailObj);
	var em = emailObj['meta']['from'];

	if (em.indexOf('<') != -1) {
		em = em.substring(em.indexOf('<') + 1, em.indexOf('>'));
	}

//	blackList.push(em);

	//console.log(blackList);
	clearComposeMail();
}
function readMailclean(){
	functionTracer='readMailclean';
	$('#sendMaildiv').css('display','none');
	//$('#readMaildiv').css('display','none');
	$('#readEmailOpt').css('display','none');
	$('#boxEmailOption').css('display','inline-block');

	//$('#mailIcons').addClass('col-xs-6');
	//$('#mailIcons').removeClass('col-xs-6');


}


function initializeMailList() {
	functionTracer='initializeMailList';
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
		"iDisplayLength": profileSettings['mailPerPage'],
		"sDom": "R<'dt-toolbar'" +
			"<'#mailSearch'f>" +
			"<'.hidden-xs pull-right'ip>" +
			"r>t" +
			"<'dt-toolbar-footer'" +
			"<'.pull-right'ip>" +
			">",
		"deferRender": true,
		"autoWidth": true,
		fnCreatedRow: function (nRow, aData, iDataIndex) {
			//console.log(nRow);

			var mailId=$('td:eq(1) > div', nRow).attr('id');

			if(mailId!=undefined){
				$('td:eq(1)', nRow).css('cursor','pointer');
				$('td:eq(2)', nRow).css('cursor','pointer');

				if(mailBox['Data'][mailId]['modKey']===false){
					$('td:eq(1)', nRow).attr('onclick', 'deleteFailed("'+mailId+'")');
					$('td:eq(2)', nRow).attr('onclick', 'deleteFailed("'+mailId+'")');
				}else{
					$('td:eq(0) > div > label > span', nRow).attr('onclick', 'markMessage("'+mailId+'")');

					$('td:eq(1)', nRow).attr('onclick', "getMail('"+mailId+"','"+mailBox['Data'][mailId]['modKey']+"')");
					$('td:eq(2)', nRow).attr('onclick', "getMail('"+mailId+"','"+mailBox['Data'][mailId]['modKey']+"')");
				}
			}

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
			"sInfoEmpty": "<span class='text-danger'><strong>Empty</strong></span>",
			"sInfoFiltered": ""
		}
	});
	$('#mailIcons').css('float', 'left');
	//$('#mailIcons').css('position', 'absolute');
	//$('#mailSearch').addClass('col col-3');
	//$('#mailIcons').addClass('col-sm-2 col-xs-2');

	$('.dataTables_empty').html('<i class="fa fa-refresh fa-spin"></i> Loading..');

	$("#selectAll").click(function () {
		var table = $('#mail-table');
		$('td input:checkbox', table).prop('checked', this.checked);

		//console.log($("#selectAll").prop('checked'));

		$('#mail-table tr').each(function (i, row) {
			//markMessage();
			if($('td:eq(1) > div', row).attr('id')!==undefined){

				if($("#selectAll").prop('checked'))
					mailBox['Data'][$('td:eq(1) > div', row).attr('id')]['checked']=true;
				else
					mailBox['Data'][$('td:eq(1) > div', row).attr('id')]['checked']=false;

				//markMessage($('td:eq(1) > div', row).attr('id'));
			}
			//console.log($('td:eq(1) > div', row).attr('id'));
		});
	});

	renderMoveFolder();

	/* END BASIC */

	finishRendering();

}

function deleteEmail()
{
	functionTracer='deleteEmail';
	//console.log('dd');
	var selected = [];
	if(activePage=='mail')
	{
		if (Object.keys(mailBox['Data']).length > 0) {
			$.each(mailBox['Data'], function (index, value) {

				if(value['checked']){
					var elem = {};
					var val = $(this).parent().parent().attr('id');
					elem['id'] = index;
					elem['modKey'] = value['modKey'];
					selected.push(elem);
				}
			});

			deleteMessage(selected,folder_navigate,function(){

					$.each(mailBox['Data'], function (index, value) {

						if(value['checked']){
							delete mailBox['Data'][index];
						}
					});

			});
		}
		//console.log(selected);
	}else if(activePage=='readEmail' || activePage=="composeMail"){

		if (emailObj['mailId'] != '') {
			//console.log(emailObj);
			var selected = {};
			selected['0'] = {'id': emailObj['mailId'], 'modKey': emailObj['meta']['modKey']};
			//console.log(selected);
			deleteMessage(selected,folder_navigate,function(){
				delete mailBox['Data'][emailObj['mailId']];
				readMailclean();
				clearComposeMail();
				getDataFromFolder(folder_navigate);

				setTimeout(function() {
					getNewEmailsCount();
				}, 1000);
			});


		} else {
			getDataFromFolder(folder_navigate);
			setTimeout(function() {
				getNewEmailsCount();
			}, 1000);
		}

	}

}

function deleteFailed(messageId){
	functionTracer='deleteFailed';
	$('#dialog_simple >p').html('We are sorry, but we unable to decrypt this email. Please report a bug if problem persists.');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 340,
		resizable: false,
		html:false,
		modal: true,
		title: "Failed to decrypt",
		buttons: [
			{
				html: "<i class='fa fa-trash-o'></i>&nbsp; Delete",
				"class": "btn btn-danger",
				click: function () {

					if(folder_navigate in folder['Custom']){
						delete folder['Custom'][folder_navigate][messageId];
					}else{
						delete folder[folder_navigate][messageId];
					}
					delete mailBox['Data'][messageId];

					checkFolders();
					$('#dialog_simple').dialog('close');
					getDataFromFolder(folder_navigate);
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default",
				click: function () {
					$('#dialog_simple').dialog('close');
				}
			}
		]
	});

	$('#dialog_simple').dialog('open');

}

function getEmailSender(messagesId,callback){
	functionTracer='getEmailSender';
	var dfd = $.Deferred();
	var metas='';
	var emails={};

	$.ajax({
		type: "POST",
		//url: '/retrieveFoldersMeta',
		url: '/retrieveFoldersData',
		data: {
			'messageIds': JSON.stringify(messagesId)
		},
		success: function (data, textStatus) {
			if (data.results !== undefined) {
				metas=data;
				dfd.resolve();
			} else {
				noAnswer('Error. Please try again.');
			}

		},
		error: function (data, textStatus) {
			noAnswer('Error. Please try again.');
		},
		dataType: 'json'
	});

	dfd.done(function () {
		//console.log(metas['results']);
		if(metas['results'].length>0){
			$.each(metas['results'], function (index, value) {

				//try {

					if(folder_navigate in folder['Custom']){
						var key = forge.util.hexToBytes(folder['Custom'][folder_navigate][value['messageHash']]['p']);
					}else{
						var key = forge.util.hexToBytes(folder[folder_navigate][value['messageHash']]['p']);
					}

					var z = fromAes(key, value['body']);
					var body = JSON.parse(z);
					var fr=from64(body['from']);
					if (fr.indexOf('<') != -1) {
						var toEmail=getEmailsFromString(fr);
						var em =toEmail.toLowerCase();
					} else
						var em =fr.toLowerCase();

					emails[SHA256(em)]={'id':value['messageHash'],'email':em};


				//} catch (err) {

				//}



			});
				callback(emails);
			//return emails;

		}else{
			$('.dataTables_empty').html('No Emails');
		}

	});
}

function checkBlackList() {
	functionTracer='checkBlackList';
	delete blackList[SHA256(profileSettings['email'].toLowerCase())];

	checkState(function () {

		var curr =SHA512(JSON.stringify(blackList));
		if (curr != blackListHash) {
			var prof =BlackListToDb();

			$.ajax({
				type: "POST",
				url: '/saveBlackList',
				data: {
					'blackObj': prof,
					'modKey': userModKey
				},
				success: function (data, textStatus) {
					if (data.response == 'success') {
						blackListHash = curr;
					} else
						noAnswer('Error occurred. Try again');

				},
				error: function (data, textStatus) {
					noAnswer('Error occurred. Try again');
				},
				dataType: 'json'
			});

		}

	}, function () {
	});

}
function markAsRead()
{
	functionTracer='markAsRead';

	if(activePage=="mail"){

		var dfd = $.Deferred();
		var selected = [];

		//mailBox['Data'][parseInt(mailId)]
		if (Object.keys(mailBox['Data']).length > 0) {
			var count = Object.keys(mailBox['Data']).length;

			$.each(mailBox['Data'], function (index, value) {

				if(value['checked']){
					mailBox['Data'][index]['opened']=true;

					if(folder_navigate in folder['Custom']){
						folder['Custom'][folder_navigate][index]['opened']=true;
					}else if(folder_navigate in folder){
						folder[folder_navigate][index]['opened']=true;
					}
				}

				if (!--count) dfd.resolve();
			});

			dfd.done(function () {
				checkFolders();
				setTimeout(function() {
					getNewEmailsCount();
				}, 1000);
				getDataFromFolder(folder_navigate);
			});
		}

	}

}

function markAsUnread()
{
	functionTracer='markAsUnread';
	if(activePage=="mail"){

		var dfd = $.Deferred();
		var selected = [];

		//mailBox['Data'][parseInt(mailId)]
		if (Object.keys(mailBox['Data']).length > 0) {
			var count = Object.keys(mailBox['Data']).length;

			$.each(mailBox['Data'], function (index, value) {

				if(value['checked']){
					mailBox['Data'][index]['opened']=false;

					if(folder_navigate in folder['Custom']){
						folder['Custom'][folder_navigate][index]['opened']=false;
					}else if(folder_navigate in folder){
						folder[folder_navigate][index]['opened']=false;
					}
				}

				if (!--count) dfd.resolve();
			});

		dfd.done(function () {
			checkFolders();
			setTimeout(function() {
				getNewEmailsCount();
			}, 1000);
			getDataFromFolder(folder_navigate);

		});
		}


	}
}
	function movetofolder(tofolder) {
		functionTracer='movetofolder';
		messageFolder=tofolder;

 if(activePage=='readEmail'){

		if (emailObj['mailId'] != '') {
			var dfd = $.Deferred();

			var mailId=emailObj['mailId'];
		//	console.log(emailObj['mailId']);
		//	console.log(tofolder);

			if(tofolder=="Spam"){
				messagesIds=[];
					var el=mailId;
					messagesIds.push(el);

				getEmailSender(messagesIds,function(emails){
					//console.log(emails);
					$.each(emails, function (index, value) {
						blackList[index]={'email':value['email']};

					});
					dfd.resolve();
					checkBlackList();
				});

			}else{
				dfd.resolve();
			}

			dfd.done(function () {
			if(folder_navigate==messageFolder){
				noAnswer('Can not move to same folder');

			}else if(folder_navigate in folder['Custom'] && tofolder in folder['Custom']){
				folder['Custom'][tofolder][parseInt(mailId)] = folder['Custom'][folder_navigate][parseInt(mailId)];
				delete folder['Custom'][folder_navigate][parseInt(mailId)];
				systemMessage('messageMoved');
				folder_navigate=messageFolder;
				mailBox['boxName']='';

			}else if(folder_navigate in folder['Custom'] && !(tofolder in folder['Custom'])){

				folder[tofolder][parseInt(mailId)] = folder['Custom'][folder_navigate][parseInt(mailId)];
				delete folder['Custom'][folder_navigate][parseInt(mailId)];

				if(tofolder=="Spam"){
					systemMessage('MarkedAsSpam');
				}else{
					systemMessage('messageMoved');
				}
				folder_navigate=messageFolder;
				mailBox['boxName']='';

			}else if(!(folder_navigate in folder['Custom']) && (tofolder in folder['Custom'])){
				folder['Custom'][tofolder][parseInt(mailId)] = folder[folder_navigate][parseInt(mailId)];
				delete folder[folder_navigate][parseInt(mailId)];

				systemMessage('messageMoved');
				folder_navigate=messageFolder;
				mailBox['boxName']='';

			}else if(!(folder_navigate in folder['Custom']) && !(tofolder in folder['Custom'])){
				folder[tofolder][parseInt(mailId)] = folder[folder_navigate][parseInt(mailId)];
				delete folder[folder_navigate][parseInt(mailId)];

				if(tofolder=="Spam"){
					systemMessage('MarkedAsSpam');
				}else{
					systemMessage('messageMoved');
				}
				folder_navigate=messageFolder;
				mailBox['boxName']='';
			}else{
				noAnswer('Error occurred. Please report a bug');
			}

			delete mailBox['Data'][parseInt(mailId)];

			checkFolders();
			setTimeout(function() {
				getNewEmailsCount();
			}, 1000);
			});
		}


	}else if(activePage=="mail"){

	 var dfd = $.Deferred();

	 var selected = [];

	 if (Object.keys(mailBox['Data']).length > 0) {
		 var count = Object.keys(mailBox['Data']).length;

		 $.each(mailBox['Data'], function (index, value) {

			 if(value['checked']){
				 var elem = {};
				 elem['id'] = index;
				 elem['modKey'] = value['modKey'];
				 selected.push(elem);
			 }
		 });
	 }

	 var select = 0;

	 if(selected.length>0){
		// console.log(selected);
		 if(tofolder=="Spam"){
			 messagesIds=[];
			 $.each(selected, function (index, value) {
				 var el=value['id'];
				 messagesIds.push(el);
			 });

			 getEmailSender(messagesIds,function(emails){
				 //console.log(emails);
				 $.each(emails, function (index, value) {

					 blackList[index]={'email':value['email']};

				 });

				 //console.log(emails); //get emails id for abstract use in filter
				 checkBlackList();
				 dfd.resolve();
			 });

		 }else{
			 dfd.resolve();
		 }

		 dfd.done(function () {
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

				 delete mailBox['Data'][parseInt(value['id'])];

			 });

			 if (select > 0)
			 {
				 checkFolders();
				 setTimeout(function() {
					 getNewEmailsCount();
				 }, 1000);
				 getDataFromFolder(folder_navigate);

				 if(tofolder=="Spam"){
					 systemMessage('MarkedAsSpam');
				 }else{
					 systemMessage('messageMoved');
				 }
			 }

		 });



	 }else{
		 noAnswer('Select at least one message');
	 }

 }

	//console.log(from);
	//console.log(selected);
	/*

	*/
}

function deleteMessage(selected,selectedFolder, callback) {

	functionTracer='deleteMessage';
	//console.log(selected);
	checkState(function () {
		if (selectedFolder != "Trash" && selectedFolder != "Draft" && selectedFolder != "Spam"  && activePage != 'composeMail' && !(selectedFolder in folder['Custom'])) {
			var select = 0;
			$.each(selected, function (index, value) {
				folder['Trash'][parseInt(value['id'])] = folder[selectedFolder][parseInt(value['id'])];
				delete folder[selectedFolder][parseInt(value['id'])];
				select++;
			});

			if (select > 0){
				checkFolders(function(){
					$('#mail-table').DataTable()
						.row($('#mail-table td input:checkbox:checked').parents('tr'))
						.remove()
						.draw();
					$("#selectAll").prop('checked', '');
					Answer('Moved to Trash');
					if (callback) {
						callback();
					}
				});

			}


		}else if(selectedFolder in folder['Custom']){
			var select = 0;
			$.each(selected, function (index, value) {
				folder['Trash'][parseInt(value['id'])] = folder['Custom'][selectedFolder][parseInt(value['id'])];
				delete folder['Custom'][selectedFolder][parseInt(value['id'])];
				select++;

			});
			checkFolders(function(){
				$('#mail-table').DataTable()
					.row($('#mail-table td input:checkbox:checked').parents('tr'))
					.remove()
					.draw();
				$("#selectAll").prop('checked', '');

				if (select > 0)
					Answer('Moved to Trash');
				setTimeout(function() {
					getNewEmailsCount();
				}, 1000);

				if (callback) {
					callback();
				}
			});


		} else if((selectedFolder == "Trash" || selectedFolder == "Draft" || selectedFolder == "Spam") || activePage == 'composeMail') {

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

						checkFolders(function(){
							$('#mail-table').DataTable()
								.row($('#mail-table td input:checkbox:checked').parents('tr'))
								.remove()
								.draw();
							$("#selectAll").prop('checked', '');
							if (select > 0)
								Answer('Deleted');

							if (callback) {
								callback();
							}
						});



					} else {
						noAnswer('Error. Please try again.');
					}

				},
				error: function (data, textStatus) {
					noAnswer('Error. Please try again.');
				},
				dataType: 'json'
			});

		}
	}, function () {
	});
	setTimeout(function() {
		getNewEmailsCount();
	}, 1000);
}

function enableDeleteButton() {
	/*
	var isChecked = $('.mail-table-icon input:checkbox').is(':checked');

	if (isChecked) {
		$(".inbox-checkbox-triggered").addClass('visible');
		//$("#compose-mail").hide();
	} else {
		$(".inbox-checkbox-triggered").removeClass('visible');
		//$("#compose-mail").show();
	}
	*/
}

function selectFolder(thisObj) {

}
function SHA512(data) {
	var md = forge.md.sha512.create();
	md.update(data, 'utf8');
	return md.digest().toHex();
}

function SHA256(data) {
	var md = forge.md.sha256.create();
	md.update(data, 'utf8');
	return md.digest().toHex();
}

function SHA512old(data) {
	functionTracer='SHA512old';
	var md = forge.md.sha512.create();
	md.update(data);
	return md.digest().toHex();
}

function getDomain() {
	return $.get("getDomains");
}
function loadInitialPage() {
	functionTracer='loadInitialPage';
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

			var tableHeight = ($(window).height() - 220) - menuHeight;
			if (tableHeight < (320 - menuHeight)) {
				$('.table-wrap').css('height', (320 - menuHeight) + 'px');
			} else {
				$('.table-wrap').css('height', tableHeight + 'px');
			}

		} else {
			var tableHeight = $(window).height() - 190;

			if($('#mobFooter').is(":hidden")){
				$('.table-wrap').css('margin-bottom',  20 + 'px');
			}else{
				$('.table-wrap').css('margin-bottom',  $('#mobFooter').height()+30 + 'px');
			}

			if (tableHeight <= 320) {
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
	functionTracer='displayFolder';
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
					mlist.append('<li class="divider"></li>');
					mlist.append('<li><a href="javascript:void(0);" onclick="addCustomFolder()" class="txt-color-darken">Add New Folder</a></li>');
					mlist.append('<li class="divider"></li>');
					bySortedValue(folder['Custom'], function(keyC, valueC) {
						folderulcustom.append('<li id="fl_' + keyC + '"><a href="javascript:void(0);" id="'+keyC+'" onclick="getDataFromFolder(' + "'" + keyC + "'" + ');">' + valueC['name'] + '</a></li>');
						//alert(keyC + ": " + valueC);
						mlist.append('<li id="mfl_' + keyC + '"><a href="javascript:void(0);" onclick="getDataFromFolder(' + "'" + keyC + "'" + ');">' + valueC['name'] + '</a></li>');
					});

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
	functionTracer='renderMoveFolder';
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
	functionTracer='sortObject';
	var newdata={};
if(Object.keys(data).length>0){
	$.each(data, function (key, value) {

	});
}else
return data;

}

function bySortedValue(obj, callback, context) {
	functionTracer='bySortedValue';
	var tuples = [];

	for (var key in obj){
		tuples.push([obj[key]['name'], obj[key],key]);
	}
	tuples.sort(function(a, b) { return a[0] < b[0] ? 1 : a[0] > b[0] ? -1 : 0 });

	var length = tuples.length;
	while (length--) callback.call(context, tuples[length][2], tuples[length][1]);

}

function renameCustomFolder(name,id){
	functionTracer='renameCustomFolder';
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
					if(fname.length>=1 && fname.length<=30){
						if(id!=SHA1(fname)){
							
						folder['Custom'][id]['name'] =fname;
						folder['Custom'][SHA1(fname)] = folder['Custom'][id];
						delete folder['Custom'][id];
						
						checkFolders();
						displayFolder();
						if(folder_navigate==SHA1(fname)){
						getDataFromFolder(SHA1(fname));	
						}
						
						
						}
						
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
	functionTracer='deleteCustomFolder';

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
	functionTracer='removeCustomFolder';
	//console.log(name);
	delete folder['Custom'][name];
	checkFolders();
	displayFolder();
}
function addCustomFolder(){
	functionTracer='addCustomFolder';

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

function checkFolders(callback) {
	functionTracer='checkFolders';
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
					if(data.response=="success"){
						folderHash = SHA512(JSON.stringify(folder));
						checkProfile();
						showLimits();
						if (callback) {
							callback();
						}
					}else{
						systemMessage('tryAgain');
					}

				},
				error: function (data, textStatus) {
					systemMessage('tryAgain');
				},
				dataType: 'json'
			});
		}
	}, function () {
	});

}

function showLog(success, cancel) {
	functionTracer='showLog';
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
					//console.log($('#LoginForm_password').val());
					$.ajax({
						type: "POST",
						url: '/ModalLogin',
						data: {'LoginForm[username]': SHA512(email),
							'LoginForm[password]': SHA512($('#LoginForm_password').val()),
							'LoginForm[newPassword]': SHA512(makeDerivedFancy($('#LoginForm_password').val(), 'scrypTmail'))

						},
						success: function (data, textStatus) {
							if (data.answer == "welcome") {

								if(data.oneStep===true){
										secretStart=$('#LoginForm_password').val();
										sessionKey = data.data;
										$('#dialog-form-login').dialog('close');
										success();


								}else{
									sessionKey = data.data;
									$('#dialog-form-login').dialog('close');
									success();
								}

							}else if(data.answer == "Limit is reached"){
								noAnswer('You\'ve reached the maximum of login attempts. Please try again in few minutes.');
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

function fromFish(keyT, text) {
	functionTracer='fromFish';
	var vector = CryptoJS.enc.Hex.parse(text.substring(0, 32));
	var encrypted = text.substring(32);

	var cipher = CryptoJS.TwoFish.decrypt(encrypted, keyT, { iv: vector });
	return cipher.toString(CryptoJS.enc.Latin1);
}


function dbToBlackList() {
	functionTracer='dbToBlackList';
	var f = fromAes(folderKey, userData['blackList']);

	if(f.indexOf('[')!=-1){
		var s='{}';
	}else{
		var s = f.substring(f.indexOf('{'), f.lastIndexOf('}') + 1);
	}
	blackListHash = SHA512(s);
	return JSON.parse(s);

}

function BlackListToDb() {
	functionTracer='BlackListToDb';
	var f = toAes(folderKey, JSON.stringify(blackList));

	return f;
}

function upgradeAfterSeed(newMaxSeed){
	functionTracer='upgradeAfterSeed';
	var divObj = $('#dialog_update');

	$('#dialog_update >p').html('Do not refresh your browser. We are updating your account. It may take few minutes..');

	divObj.dialog({
		autoOpen: false,
		width: 340,
		resizable: false,
		html:false,
		modal: true,
		title: "Account Update..",
		buttons: [
			{
				html: "<i class='fa fa-refresh fa-spin'></i>&nbsp;Updating",
				"class": "btn btn-normal",
				"id":'checkUpdate',
				click: function () {
					$(window).unbind('beforeunload');
					window.location = '/logout';
					divObj.dialog('close');
				}
			}
		]
	});


		if(profileSettings['lastSeed']>=newMaxSeed){

			if(profileSettings['version']==undefined || parseInt(profileSettings['version'])<1){
				$('#checkUpdate').prop('disabled',true);
				//divObj.dialog('open');
				provideSecret(function (secret) {
					alert('Do not refresh your browser. We are updating your account. It may take few minutes.. It will log you out when completed. Click OK when ready! ');
					clearInterval(newMailer);
					var user = dbToProfile(userData['userObj'], secret,userData['saltS']);
					var user1 = JSON.parse(user, true);


					var promises = [];

					//prof_setting['version'] = 1;
					//userobject converting
					var pki = forge.pki;
					var prKey = pki.privateKeyFromPem(from64(user1['MailPrivate']));
					var pubKey = pki.publicKeyFromPem(from64(user1['MailPublic']));
					var testString=forge.util.bytesToHex(pubKey.encrypt('test string', 'RSA-OAEP'));
					var testStringLength=testString.length*4;
					//console.log(testStringLength);

					var userObj = {};
					var userAddres = [];
					userObj['folderKey']=user1['folderKey'];
					userObj['modKey']=user1['modKey'];
					userObj['keys']={};

					userObj['keys'][SHA512(profileSettings['email'])]={
						'email':profileSettings['email'],
						'privateKey':user1['MailPrivate'],
						'publicKey':user1['MailPublic'],
						'canSend':'1',
						'keyLength':testStringLength,
						'receiveHash':SHA512(pki.publicKeyToPem(pubKey)).substring(0,10)
					};
					userAddres.push({
						'emailHash':SHA512(profileSettings['email']),
						'mailKey':user1['MailPublic']
					});

					if(typeof profileSettings['disposableEmails'] == 'undefined'){
						profileSettings['disposableEmails']={};
					}

					if(Object.keys(profileSettings['disposableEmails']).length>0){
						$.each(profileSettings['disposableEmails'], function (index, value) {
							var dfd = $.Deferred();
							generatePairs(testStringLength,function(keyPar){
								userObj['keys'][SHA512(value['name'])]={
									'email':value['name'],
									'privateKey':to64(pki.privateKeyToPem(keyPar.keys.privateKey)),
									'publicKey':to64(pki.publicKeyToPem(keyPar.keys.publicKey)),
									'canSend':'0',
									'keyLength':testStringLength,
									'receiveHash':SHA512(pki.publicKeyToPem(keyPar.keys.publicKey)).substring(0,10)
								};
								userAddres.push({
									'emailHash':SHA512(value['name']),
									'mailKey':to64(pki.publicKeyToPem(keyPar.keys.publicKey))
								});
								dfd.resolve();
							});
							promises.push(dfd);
						});
					}
					$.when.apply(undefined, promises).then(function () {

						var Updare1Obj={};
						//Updare1Obj['userObj']=userObj;
						//Updare1Obj['userAddress']=userAddres;

						Updare1Obj['userObj'] = profileToDb(userObj,secret,userData['saltS']);

						Updare1Obj['modKey']=user1['modKey'];


						$.ajax({
							type: "POST",
							url: '/updateAccount',
							data: {
								'userObj':Updare1Obj['userObj'],
								'userAddress':userAddres,
								'modKey':user1['modKey']
							},
							success: function (data, textStatus) {
								if(data.result=='success'){
									profileSettings['version'] = 1;
									checkProfile();
									//$('#dialog_update >p').html('Your account has been updated. Please click OK to re-login.');
									//$('#checkUpdate i').remove();
									//$('#checkUpdate').text('OK');
									//$('#checkUpdate').prop('disabled',false);
									setTimeout(function(){
										$(window).unbind('beforeunload');
										window.location = '/logout';
									},3000)
								}

							},
							error: function (data, textStatus) {
								//noAnswer('Error. Please try again.');
								systemMessage('tryAgain');
							},
							dataType: 'json'
						});

					});

				},function () {
				})

			}

		}

}



function retrieveSecret() {
	functionTracer='retrieveSecret';

	provideSecret(function (secret) {

		var userObj={};
		if (userObj = validateUserObject()) {

			var user = dbToProfile(userObj['userObj'], secret,userObj['saltS']);
			var pki = forge.pki;
			var user1 = JSON.parse(user, true);
			folderKey = forge.util.hexToBytes(from64(user1['folderKey']));
			userModKey = user1['modKey'];
			profileSettings = dbToProfileSetting();

			if(profileSettings['oneStep']=="true"){
				isOneStep=true;
			}else
				isOneStep=false;

			//upgradeAccount(user1,userObj['saltS'],secret,function(){

				//console.log('user');
				//console.log(user1);

				if(profileSettings['version']!=undefined && parseInt(profileSettings['version'])==1){

					profileSettings['version'] = 1;

					if(Object.keys(user1['keys']).length>0){

						//console.log(user1);
					$.each(user1['keys'], function (index, value) {

						receivingKeys[value['receiveHash']]={'privateKey':pki.privateKeyFromPem(from64(value['privateKey'])),'length':value['keyLength']/4};
						if(value['canSend']==1 || value['canSend']==2 ){
						signingKey[SHA512(value['email'])]={'privateKey':pki.privateKeyFromPem(from64(value['privateKey']))};
						}
						if(value['canSend']==1){
							try {
								mailPrivateKey = pki.privateKeyFromPem(from64(value['privateKey']));
								mailPublicKey = pki.publicKeyFromPem(from64(value['publicKey']));


							} catch (err) {
								noAnswer('Keys are corrupted. Please generate new keys');
							}

						}

					});


						//console.log(receivingKeys);
				}

				}else if(profileSettings['version']==undefined || parseInt(profileSettings['version'])<1){
					profileSettings['version'] = 0;
					try {

						mailPrivateKey = pki.privateKeyFromPem(from64(user1['MailPrivate']));
						mailPublicKey = pki.publicKeyFromPem(from64(user1['MailPublic']));

						var testString=forge.util.bytesToHex(mailPublicKey.encrypt('test string', 'RSA-OAEP'));
						var testStringLength=testString.length



						//var hashs=SHA512(pki.publicKeyToPem(mailPublicKey));
						receivingKeys[""]={'privateKey':mailPrivateKey,'length':testStringLength};

						seedPrivateKey = pki.privateKeyFromPem(from64(user1['SeedPrivate']));
						seedPublickKey = pki.publicKeyFromPem(from64(user1['SeedPublic']));
						sigPubKey = pki.publicKeyFromPem(from64(user1['SignaturePublic']));
						sigPrivateKey = pki.privateKeyFromPem(from64(user1['SignaturePrivate']));

					} catch (err) {

						seedPrivateKey = '';
						seedPublickKey ='';
						sigPubKey = '';
						sigPrivateKey = '';

						noAnswer('Keys are corrupted. Please generate new keys');

					}

				}


				folder = dbToFolder(userObj);

				contacts = dbToContacts();
				//console.log(folder);
				blackList = dbToBlackList();
				//console.log(blackList);



				//console.log(profileSettings);

				setupProfile();

				//console.log(user1);
				var test=forge.util.bytesToHex(mailPublicKey.encrypt('ggg', 'RSA-OAEP'));
				UserSalt=userObj['saltS'];

				myTimer();
				clearInterval(logOuttimer);

				newMailCheckRoutine();
				getNewEmailsCount();

				folderDecoded.resolve();
				currentTab();

			//});

		}

		//myTimer();
		//

	}, function () {
		noAnswer('Without providing correct secret you would not be able to read or post any emails');
	});
}

function setupProfile(){
	functionTracer='setupProfile';
	profileSettings['lastSeed'] = parseInt(profileSettings['lastSeed']);

	sessionTimeOut=!isNaN(parseInt(profileSettings['sessionExpiration']))?parseInt(profileSettings['sessionExpiration']):-1;

	if(profileSettings['disposableEmails'] == undefined){
		profileSettings['disposableEmails']={};
	}


	if(typeof profileSettings['aliasEmails'] === 'undefined'){
		profileSettings['aliasEmails']={};
	}

	if(profileSettings['aliasEmails'] == undefined){
		profileSettings['aliasEmails']={};
	}


	profileSettings['mailPerPage']=parseInt(profileSettings['mailPerPage']);
	profileSettings['mailPerPage']=!isNaN(parseInt(profileSettings['mailPerPage']))?parseInt(profileSettings['mailPerPage']):10;

	if(profileSettings['fontType']==undefined){
		profileSettings['fontType']="4";
	}else{
		changeSystemFont(parseInt(profileSettings['fontType']));
	}

	if(profileSettings['fontSize']==undefined){
		profileSettings['fontSize']="13";
	}else{
			changeFontSize(profileSettings['fontSize']);
	}

	if(profileSettings['tags']==undefined){
		profileSettings['tags']={};
	}
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
