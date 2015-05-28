/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 2:30 PM
 */
$(document).ready(function () {

	activePage = 'profile';
	currentTab();
	$('#newFname').attr('name', makerandom());

	if(profileSettings['oneStep']=="true" || profileSettings['oneStep']===true){
		$('#dis2step').css('display','none');
		$('#showSec').css('display','none');
		$('#showPass').css('display','none');
		$('#showOneStep').css('display','block');

	}else{
		$('#enb2step').css('display','none');
	}
	if ((parseInt(roleData['role']['id'])!=1 && parseInt(roleData['role']['id'])!=6) || Object.keys(profileSettings['customDomains']).length>0) {
		$('#custDomPanel').css('display','block');
	}

	contactListProfileInitialized = false;
	safeBoxProfileInitialized = false;
	blackListProfileInitialized = false;
	disposableListProfileInitialized = false;
	aliasListProfileInitialized = false;
	domainListProfileInitialized = false;
	tagListProfileInitialized=false;

	if(receiveAjaxFolder['readyState']!==undefined && receiveAjaxFolder['readyState']!=4){
		mailBox={};
		receiveAjaxFolder.abort();
	}
});

function narrowSelections(mailKey) {

	if (mailKey == 0) {

		$('#UpdateKeys_mode_0').attr('disabled', 'disabled');
		$('#label512').css('color', '#bbb');
		$('#label512').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_1').attr('disabled', 'disabled');
		$('#label1024').css('color', '#bbb');
		$('#label1024').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_3').attr('disabled', 'disabled');
		$('#labelcustom').css('color', '#bbb');
		$('#labelcustom').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_2').attr('disabled', 'disabled');
		$('#label2048').css('color', '#bbb')
		$('#label2048').attr('title', 'Please upgrade membership to unlock.');

	}

	if (mailKey == 1024) {

		$('#UpdateKeys_mode_0').attr('checked', 'checked');

		$('#UpdateKeys_mode_1').attr('disabled', 'disabled');
		$('#label1024').css('color', '#bbb');
		$('#label1024').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_3').attr('disabled', 'disabled');
		$('#labelcustom').css('color', '#bbb');
		$('#labelcustom').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_2').attr('disabled', 'disabled');
		$('#label2048').css('color', '#bbb')
		$('#label2048').attr('title', 'Please upgrade membership to unlock.');

	}

	if (mailKey == 2048) {

		$('#UpdateKeys_mode_1').attr('checked', 'checked');

		$('#UpdateKeys_mode_3').attr('disabled', 'disabled');
		$('#labelcustom').css('color', '#bbb');
		$('#labelcustom').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_2').attr('disabled', 'disabled');
		$('#label2048').css('color', '#bbb')
		$('#label2048').attr('title', 'Please upgrade membership to unlock.');

	}

	if (mailKey >= 4096) {

		$('#UpdateKeys_mode_2').attr('checked', 'checked');

		$('#UpdateKeys_mode_3').attr('disabled', 'disabled');
		$('#labelcustom').css('color', '#bbb');
		$('#labelcustom').attr('title', 'Please upgrade membership to unlock.');

	}
	if (roleData['role']['importKeys'] == "1") {
		$('#UpdateKeys_seedPrK').removeProp('disabled');
		$('#UpdateKeys_mailPrK').removeProp('disabled');
		$('#UpdateKeys_seedPubK').removeProp('disabled');
		$('#UpdateKeys_mailPubK').removeProp('disabled');
	}
}

function changeTimeout(tim) {

	if (!isNaN(tim.val())) {
		profileSettings['sessionExpiration'] = parseInt(tim.val());
		sessionTimeOut = parseInt(tim.val());
		checkProfile();
		Answer('Saved');

		//cleartInterval(sessionTimeOut);
		//myTimer();
	}
	//console.log(tim.val());
}

function changeMessagesPerPage(tim) {
	if (!isNaN(tim.val())) {
		profileSettings['mailPerPage'] = parseInt(tim.val());
		checkProfile();
		Answer('Saved');
	}
}

function saveProfileName() {
	profileSettings['name'] = stripHTML($('#newFname').val());
	checkProfile();
	populateProfile();
}
function initBaseSettings()
{

	$("[rel=popover-hover]").popover({
		trigger : "hover",
		html: true

	});
	$("[rel=popover]").popover({
		html : true
	});
}

function gotoUpdateKeys() {

	$("[rel=popover-hover]").popover({
		trigger : "hover",
		html: true

	});

	checkState(function () {
		var user = validateUserObject();
		var role = validateUserRole();
		var seedKey = role['role']['seedMaxKeyLength'];
		var mailKey = role['role']['mailMaxKeyLength'];

		$('#UpdateKeys_seedPrK').attr('name', makerandom());
		$('#UpdateKeys_mailPrK').attr('name', makerandom());
		$('#UpdateKeys_seedPubK').attr('name', makerandom());
		$('#UpdateKeys_mailPubK').attr('name', makerandom());
		//calcPerformance();
		//console.log('gggg');
		narrowSelections(mailKey);
	}, function () {

	});
}

function retrieveKeys() {
	if(profileSettings['version']==1){
	provideSecret(function (secret) {
		if (userObj = validateUserObject()) {
			var user = dbToProfile(userObj['userObj'], secret,userObj['saltS']);
			var user1 = JSON.parse(user, true);


			$('#UpdateKeys_mailPrK').val(from64(user1['keys'][SHA512(profileSettings['email'])]['privateKey']));
			$('#UpdateKeys_mailPubK').val(from64(user1['keys'][SHA512(profileSettings['email'])]['publicKey']));

			validateMailKeys();
		}
	}, function () {

	});
	}else{
		noAnswer('Please update account.');
	}

}

function validateMailKeys() {
	var pki = forge.pki;

	if ($('#UpdateKeys_mailPrK').val() != '' && $('#UpdateKeys_mailPubK').val() != '') {
		try {
			var mprivateKey = pki.privateKeyFromPem($('#UpdateKeys_mailPrK').val());
			var mpublicKey = pki.publicKeyFromPem($('#UpdateKeys_mailPubK').val());

			var mencrypted = mpublicKey.encrypt('test', 'RSA-OAEP');
			var mdecrypted = mprivateKey.decrypt(mencrypted, 'RSA-OAEP');

			if (mdecrypted == "test") {
				$('#UpdateKeys_mailPrK').parent().removeClass('state-error');
				$('#UpdateKeys_mailPubK').parent().removeClass('state-error');
				$('#UpdateKeys_mailPrK').parent().addClass('state-success');
				$('#UpdateKeys_mailPubK').parent().addClass('state-success');
			} else {
				$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
				$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
				$('#UpdateKeys_mailPrK').parent().addClass('state-error');
				$('#UpdateKeys_mailPubK').parent().addClass('state-error');
			}
		}
		catch (err) {
			$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
			$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
			$('#UpdateKeys_mailPrK').parent().addClass('state-error');
			$('#UpdateKeys_mailPubK').parent().addClass('state-error');
		}

	} else {
		$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
		$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
		$('#UpdateKeys_mailPrK').parent().removeClass('state-error');
		$('#UpdateKeys_mailPubK').parent().removeClass('state-error');
	}

}

function generateKeys() {

	$('#profileGenerateKeys').prop('disabled', true);
	$('#profileGenerateKeys').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating keys..");


	var selected = 0;
	var rsa = forge.pki.rsa;
	var pki = forge.pki;
	var seedStrength = 0;
	var mailStrength = 0;

	if ($('#UpdateKeys_mode_0').is(':checked')) {
		//seedStrength = 512;
		mailStrength = 1024;
		selected = 1;

	}
	if ($('#UpdateKeys_mode_1').is(':checked')) {
		//seedStrength = 1024;
		mailStrength = 2048;
		selected = 1;
	}
	if ($('#UpdateKeys_mode_2').is(':checked')) {
		//seedStrength = 2048;
		mailStrength = 4096;
		selected = 1;
	}

	if (selected == 0) {
		noAnswer('Please select Key Strength');
	} else {


			generatePairs(mailStrength,function(mailpair){
				$('#UpdateKeys_mailPrK').val(pki.privateKeyToPem(mailpair.keys.privateKey));
				$('#UpdateKeys_mailPubK').val(pki.publicKeyToPem(mailpair.keys.publicKey));
				$('#profileGenerateKeys').prop('disabled', false);
				$('#profileGenerateKeys').html("<i class='fa fa-cog fa-lg'></i>&nbsp;Generate Keys");

				validateMailKeys();
			});
	}

}

function saveKeys() {
	if(profileSettings['version']==1){

	if ($('#UpdateKeys_seedPubK').val() != '' && $('#UpdateKeys_mailPubK').val() != '') {


		checkState(function () {
			provideSecret(function (secret) {
				if (validatePublics()) {

					var userObj = userData;

					var pki = forge.pki;
					var dfd = $.Deferred();

					var user =  dbToProfile(userObj['userObj'], secret,userObj['saltS']);
					user = JSON.parse(user);

					var mailp = pki.publicKeyFromPem($('#UpdateKeys_mailPubK').val());
					var mailpr = pki.privateKeyFromPem($('#UpdateKeys_mailPrK').val());

					var testString=forge.util.bytesToHex(mailp.encrypt('test string', 'RSA-OAEP'));
					var testStringLength=testString.length*4;


					var emailHash=SHA512(profileSettings['email']);
					user['keys'][emailHash]['privateKey']=to64(pki.privateKeyToPem(mailpr));
					user['keys'][emailHash]['publicKey']=to64(pki.publicKeyToPem(mailp));
					user['keys'][emailHash]['keyLength']=testStringLength;
					user['keys'][emailHash]['receiveHash']=SHA512(pki.publicKeyToPem(mailp)).substring(0,10);



					var userObj = profileToDb(user,secret,userData['saltS']);

					$.ajax({
						type: "POST",
						url: '/updateKeys',
						data:  {
							'UserObject':userObj,
							'modKey':userModKey,
							'mailKey':user['keys'][emailHash]['publicKey']
						},
						success: function (data, textStatus) {
							if (data === true) {
								receivingKeys[SHA512(pki.publicKeyToPem(mailp)).substring(0,10)]={'privateKey':mailpr,'length':testStringLength/4};
								//console.log(SHA512(pki.publicKeyToPem(mailPublicKey)).substring(0,10));
								delete receivingKeys[SHA512(pki.publicKeyToPem(mailPublicKey)).substring(0,10)];

								mailPrivateKey = mailpr;
								mailPublicKey = mailp;

								//console.log(to64(pki.publicKeyToPem(mailPublicKey)));
								Answer('Successfully Saved!');
								$('#UpdateKeys_mailPubK').val('');
								$('#UpdateKeys_mailPrK').val('');

								userData['userObj']=userObj;

							} else if (data.email == 'Keys are not saved. Please try another key or report a bug.') {
								noAnswer('Error. Please try again.');
							} else {
								noAnswer('Error. Please try again.');

							}

						},
						error: function (data, textStatus) {
							noAnswer('Error occurred. Try again');
						},
						dataType: 'json'
					});


				} else
					noAnswer('Key size larger than allowed by plan.  Please upgrade your plan or choose lesser key strength.');

			}, function () {
			});
		}, function () {
		});
	} else {
		noAnswer('Provide New Keys before saving.');
	}
	}else{
		noAnswer('Please update account.');
	}
}

function validatePublics() {
	var check = true;
	var user = validateUserObject();
	var role = validateUserRole();

	var pki = forge.pki;

	var mailKey = role['role']['mailMaxKeyLength'];

	var pKey=pki.publicKeyFromPem($('#UpdateKeys_mailPubK').val());

	var testString=forge.util.bytesToHex(pKey.encrypt('test string', 'RSA-OAEP'));
	var testStringLength=testString.length*4;


	if (mailKey < testStringLength ) {
		check = false;
	}

	return check;
}

function initSavePass() {

	$('#passwordOld').attr('name', makerandom());
	$('#passwordNew').attr('name', makerandom());
	$('#passwordNewRep').attr('name', makerandom());

	validator = $("#smart-form-changepass").validate();

	$("#passwordOld").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#passwordNew").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#passwordNewRep").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#passwordNew',
		messages: {
			required: 'Please enter your password one more time',
			equalTo: 'Please enter the same password as above'
		}
	});
}

function savePassword() {
	if(profileSettings['version']==1){
	validator.form();

	if (validator.numberOfInvalids() == 0) {

		//var oldPas = SHA512($('#passwordOld').val());
		//var newPas = SHA512($('#passwordNew').val());

		checkState(function () {
			$.ajax({
				type: "POST",
				url: '/changePass',
				data: {
					'oldPass': SHA512($('#passwordOld').val()),
					'newPass': SHA512($('#passwordNew').val())
				},
				success: function (data, textStatus) {
					if (data['result'] == 'success') {
						Answer('Saved');
						$("#smart-form-changepass")[0].reset();
					} else{
						noAnswer('Failed to save. Check password');
					}
				},
				error: function (data, textStatus) {
					noAnswer('Error. Please try again.')
				},
				dataType: 'json'
			});
		}, function () {
		});
	}
	}else{
		noAnswer('Please update account.');
	}
}

function initOneStepSaveSecret()
{
	$('#OneStepNewSec').attr('name', makerandom());
	$('#OneStepRepeatSec').attr('name', makerandom());


	validatorOneStepSecret = $("#OneStep-smart-form-secret").validate();

	$("#OneStepNewSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#OneStepRepeatSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#OneStepNewSec',
		messages: {
			required: 'Please enter your Password one more time',
			equalTo: 'Please enter the same Password as above'
		}
	});

	$("[rel=popover]").popover({
		trigger : "hover",
		html: true

	});
}

function saveSecAndPass(oldPass,newPass,oldSec,newSec,oneStep,callback)
{

	getObjects()
		.always(function (data) {
			if (data.userData && data.userRole) {

				var tempPro = JSON.parse(dbToProfile(data['userData']['userObj'], oldSec,data['userData']['saltS']));


				var userObj = profileToDb(tempPro,newSec, data.userData['saltS']);

				var secretnew = newSec;
				var salt = forge.util.hexToBytes(data.userData['saltS']);
				var derivedKey = makeDerived(secretnew, salt);
				var Test = forge.util.bytesToHex(derivedKey);
				var Part2 = Test.substr(64, 128);
				var keyA = forge.util.hexToBytes(Part2);
				var token = forge.random.getBytesSync(256);
				var tokenHash = SHA512(token);

				var tokenAes = toAesToken(keyA, token);
				var tokenAesHash = SHA512(tokenAes);


				$.ajax({
					type: "POST",
					url: '/saveSecretOneStep',
					data:  {
						'UserObject':userObj,
						'modKey':tempPro['modKey'],
						'tokenHash':tokenHash,
						'tokenAesHash':tokenAesHash,
						'oldPassword':SHA512(makeDerivedFancy(oldPass, 'scrypTmail')),
						'newPassword':newPass,
						'oneStep':oneStep
					},
					success: function (data, textStatus) {
						if (data.email != 'good') {
							noAnswer('Error. Please try again.');
						} else {
							userData['userObj']=userObj;
							callback();
						}

					},
					error: function (data, textStatus) {
						noAnswer('Error. Please try again.');
					},
					dataType: 'json'
				});

				/*

				//----------------------------------------------------




				var presend={};
				presend['OldModKey']=tempPro['modKey'];
				presend['userObj']=NewObj.toString();
				presend['NewModKey']=SHA512(NuserObj['userObj']['modKey']);
				presend['mailHash']=SHA512(profileSettings['email']);
				presend['tokenHash']=tokenHash;
				presend['tokenAesHash']=tokenAesHash;

				presend['oldPassword']=SHA512(makeDerivedFancy(oldPass, 'scrypTmail'));
				presend['newPassword']=newPass;
				presend['oneStep']=oneStep;

				var userObj = profileToDb(user,secret,userData['saltS']);


*/
			} else
				noAnswer('Error. Please try again.');
		});

}

function CreateTwoStep()
{
	if(profileSettings['version']==1){
	$('#twoStep-dialog').dialog({
		autoOpen: false,
		height: 340,
		width: 300,
		title:'Enable 2-step Auth',
		modal: true,
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Enable",
				"class": "btn btn-primary pull-right",
				"id": 'loginok',
				click: function () {
					validatorTwoStepCreate.form();
					if (validatorTwoStepCreate.numberOfInvalids() == 0) {

						checkState(function () {
							$('#twoStep-dialog').dialog('close');
							provideSecret(function (secret) {

								var newPass=SHA512($('#TwStepNewPass').val());
								saveSecAndPass(secret,newPass,secret,$('#TwStepNewSec').val(),false,function(){

									profileSettings['oneStep']=false;
									checkProfile();
									//toFile = tokenAes;
									//downloadToken();
									Answer('Saved!');
									window.location.href = '#mail';
									$("#twoStep-dialog")[0].reset();

								});

							}, function () {
							});
						}, function () {
						});



					}
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default pull-left",
				"id": 'loginclose',
				click: function () {
					$('#twoStep-dialog').dialog('close');
				}
			}
		],
		close: function () {
		}
	});

	$('#twoStep-dialog').dialog('open');


	$('#TwStepNewPass').attr('name', makerandom());
	$('#TwStepNewPassRepeat').attr('name', makerandom());

	$('#TwStepNewSec').attr('name', makerandom());
	$('#TwStepNewSecRep').attr('name', makerandom());


	validatorTwoStepCreate = $("#twoStep-dialog").validate();

	$("#TwStepNewPass").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#TwStepNewPassRepeat").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#TwStepNewPassRepeat").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#TwStepNewPass',
		messages: {
			required: 'Please enter your Password one more time',
			equalTo: 'Please enter the same Password as above'
		}
	});

	$("#TwStepNewSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#TwStepNewSecRep").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#TwStepNewSecRep").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#TwStepNewSec',
		messages: {
			required: 'Please enter your Secret Phrase one more time',
			equalTo: 'Please enter the Secret Phrase as above'
		}
	});

	}else{
		noAnswer('Please update account.');
	}
}

function CreateOneStep()
{
	if(profileSettings['version']==1){
	$('#twoStep-dialog').dialog({
		autoOpen: false,
		height: 240,
		width: 300,
		modal: true,
		title:'Disable 2-step Auth',
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Disable",
				"class": "btn btn-primary pull-right",
				"id": 'loginok',
				click: function () {
					validatorOneStepCreate.form();
					if (validatorOneStepCreate.numberOfInvalids() == 0) {

						checkState(function () {
							$('#twoStep-dialog').dialog('close');
							provideSecret(function (secret) {

								var newPass=SHA512(makeDerivedFancy($('#TwStepNewPass').val(), 'scrypTmail'));

								//saveSecAndPass(oldPass,newPass,oldSec,newSec,oneStep,callback)

								saveSecAndPass(secret,newPass,secret,$('#TwStepNewPass').val(),true,function(){

									profileSettings['oneStep']=true;
									checkProfile();
									//toFile = tokenAes;
									//downloadToken();
									Answer('Saved!');
									window.location.href = '/#mail';
									$("#twoStep-dialog")[0].reset();

								});


							}, function () {
							});
						}, function () {
						});



					}
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default pull-left",
				"id": 'loginclose',
				click: function () {
					$('#twoStep-dialog').dialog('close');
				}
			}
		],
		close: function () {
		}
	});


	$('#twoStep-dialog').dialog('open');

	$('#nSec').css('display','none');
	$('#nSecR').css('display','none');

	$('#TwStepNewPass').attr('name', makerandom());
	$('#TwStepNewPassRepeat').attr('name', makerandom());


	validatorOneStepCreate = $("#twoStep-dialog").validate();

	$("#TwStepNewPass").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#TwStepNewPassRepeat").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#TwStepNewPassRepeat").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#TwStepNewPass',
		messages: {
			required: 'Please enter your Password one more time',
			equalTo: 'Please enter the same Password as above'
		}
	});

	}else{
		noAnswer('Please update account.');
	}
}
function saveOneStepSecret()
{
	if(profileSettings['version']==1){

	validatorOneStepSecret.form();

	if (validatorOneStepSecret.numberOfInvalids() == 0) {

		checkState(function () {
			provideSecret(function (secret) {
				//console.log(secret);

				var newPass=SHA512(makeDerivedFancy($('#OneStepNewSec').val(), 'scrypTmail'));

				saveSecAndPass(secret,newPass,secret,$('#OneStepNewSec').val(),true,function(){

					$('#OneStep-smart-form-secret')[0].reset();

					//toFile = tokenAes;
					//downloadToken();
					/*
					getObjects()
						.always(function (data) {
							logOutTime();
							if (data.userData && data.userRole) {
								userData = data.userData;
								roleData = data.userRole;
							}
						});
					*/
					Answer('Saved!');
					//dfd.resolve();

				});

			}, function () {
			});
		}, function () {
		});




	}
	}else{
		noAnswer('Please update account.');
	}

	//console.log($('#OneStepNewSec').val());
}


function initSaveSecret() {
	$('#newSec').attr('name', makerandom());
	$('#repeatSec').attr('name', makerandom());


	validatorSecret = $("#smart-form-secret").validate();

	$("#newSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#repeatSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#newSec',
		messages: {
			required: 'Please enter your Secret Phrase one more time',
			equalTo: 'Please enter the same Secret Phrase as above'
		}
	});

	$("[rel=popover]").popover({
		trigger : "hover",
		html: true

	});
}

function downloadTokenProfile() {

	checkState(function () {
		provideSecret(function (secret) {
			getObjects()
				.always(function (data) {
					if (data.userData && data.userRole) {
						var tempPro = JSON.parse(dbToProfile(data['userData']['userObj'], secret,data['userData']['saltS']));

						var secretnew = secret;
						var salt = forge.util.hexToBytes(data.userData['saltS']);
						var derivedKey = makeDerived(secretnew, salt);
						var Test = forge.util.bytesToHex(derivedKey);
						var Part2 = Test.substr(64, 128);
						var keyA = forge.util.hexToBytes(Part2);
						var token = forge.random.getBytesSync(256);
						var tokenHash = SHA512(token);
						var tokenAes = toAesToken(keyA, token);
						var tokenAesHash = SHA512(tokenAes);


						$.ajax({
							type: "POST",
							url: '/generateNewToken',
							data: {
								'modKey':tempPro['modKey'],
								'tokenHash': tokenHash,
								'tokenAesHash': tokenAesHash
							},
							success: function (data, textStatus) {
								if (data.email != 'good') {
									noAnswer('Error. Please try again.');
								} else {
									toFile = tokenAes;
									downloadToken();
									Answer('Saved!');
								}

							},
							error: function (data, textStatus) {
								noAnswer('Error. Please try again.');
							},
							dataType: 'json'
						});
					} else
						noAnswer('Error. Please try again.');
				});

		}, function () {
		});
	}, function () {
	});

}
function extractModKeys(data,messageKeys,callback)
{
	var modkeyToIndex=[];
	if (data['results'].length > 0 && $.isArray(data['results'])) {
		$.each(data['results'], function (index, value) { //go through all ids

			var f=messageKeys[value['messageHash']]['p'];
			var key = forge.util.hexToBytes(f);
			console.log(value);
			var z = fromAes64(key, value['meta']);
			console.log(z);
			var meta = JSON.parse(z);
			var fg={'id':value['messageHash'],'modKey':meta['modKey']}
			modkeyToIndex.push(fg);

		});
		callback(modkeyToIndex);

	}else{
		callback(modkeyToIndex);
	}
}
function deleteMailsfromDB(selected,callback){
	$.ajax({
		type: "POST",
		url: '/deleteMessage',
		data: {
			'messageIds': JSON.stringify(selected)
		},
		success: function (data, textStatus) {
			if (data.results == 'success') {
				callback();
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
function deleteCustomDomains(callback)
{
	$.ajax({
		type: "POST",
		url: '/deleteMyAccount',
		data: {
			'usermodKey': userModKey
		},
		success: function (data, textStatus) {
			if (data.results == 'success') {
				callback(data);
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
function deleteAccountDb(callback)
{
	$.ajax({
		type: "POST",
		url: '/deleteMyAccount',
		data: {
			'usermodKey': userModKey
		},
		success: function (data, textStatus) {
			if (data.results == 'success') {
				callback(data);
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
function deleteAllEmails(callback)
{
	$('#deletingOk').html("<i class='fa fa-refresh fa-spin'></i> Deleting Emails")
	var messagesId = Object.keys(folder['Inbox']);
	messagesId.push.apply(messagesId,Object.keys(folder['Draft']));
	messagesId.push.apply(messagesId,Object.keys(folder['Trash']));
	messagesId.push.apply(messagesId,Object.keys(folder['Sent']));

	var messageKeys={};

	jQuery.extend(messageKeys, folder['Inbox']);
	jQuery.extend(messageKeys, folder['Draft']);
	jQuery.extend(messageKeys, folder['Trash']);
	jQuery.extend(messageKeys, folder['Sent']);


	$.each(folder['Custom'], function (index, value) {
		messagesId.push.apply(messagesId,customMessageIds(folder['Custom'][index]));
		jQuery.extend(messageKeys, folder['Custom'][index]);
	});


		$.ajax({
			type: "POST",
			url: '/RetrieveFoldersMeta',
			data: {
				'messageIds': JSON.stringify(messagesId)
			},
			success: function (data, textStatus) {
				if (data.results !== undefined) {
					extractModKeys(data,messageKeys,function(res){
							deleteMailsfromDB(res,function(){
								callback();
							});
					});
					//renderMessages(data);
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
function deleteAccount()
{
	//deleteAllEmails();

	$('#dialog_simple >p').html('Your account, contacts, and messages will be deleted. Do you want to continue?');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 340,
		resizable: false,
		modal: true,
		title: "Delete Account",
		buttons: [
			{
				html: "<i class='fa fa-trash-o'></i>&nbsp; Delete",
				"class": "btn btn-danger",
				"id":"deletingOk",
				click: function () {

					checkState(function () {
						provideSecret(function (secret) {
							deleteAllEmails(function(){
								//deleteCustomDomains(function(){
									deleteAccountDb(function(data){
										if (data.results == 'success') {
											Answer('Deleted. Good Bye..');
											setTimeout(function () {
												$(window).unbind('beforeunload');
												window.location='/logout';
											}, 5000);
										}
									});
							//	});
							});
							$('#dialog_simple').dialog('close');
						}, function () {
						});

					}, function () {
					});

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

function saveSecret() {
	if(profileSettings['version']==1){
	validatorSecret.form();

	if (validatorSecret.numberOfInvalids() == 0) {

		checkState(function () {
			provideSecret(function (secret) {
				getObjects()
					.always(function (data) {
						if (data.userData && data.userRole) {

							var tempPro = JSON.parse(dbToProfile(data['userData']['userObj'], secret,data['userData']['saltS']));
							var userObj = profileToDb(tempPro,$('#newSec').val(), data.userData['saltS']);


							var secretnew = $('#newSec').val();
							var salt = forge.util.hexToBytes(data.userData['saltS']);
							var derivedKey = makeDerived(secretnew, salt);
							var Test = forge.util.bytesToHex(derivedKey);
							var Part2 = Test.substr(64, 128);

							var keyA = forge.util.hexToBytes(Part2);

							var token = forge.random.getBytesSync(256);
							var tokenHash = SHA512(token);

							var tokenAes = toAesToken(keyA, token);
							var tokenAesHash = SHA512(tokenAes);


							$.ajax({
								type: "POST",
								url: '/saveSecret',
								data: {
									'UserObject':userObj,
									'modKey':tempPro['modKey'],
									'tokenHash':tokenHash,
									'tokenAesHash':tokenAesHash
								},
								success: function (data, textStatus) {
									if (data.email != 'good') {
										noAnswer('Error. Please try again.');
									} else {
										userModKey = NuserObj['userObj']['modKey'];
										$('#smart-form-secret')[0].reset();

										toFile = tokenAes;
										//downloadToken();
										getObjects()
											.always(function (data) {
												logOutTime();
												if (data.userData && data.userRole) {
													userData = data.userData;
													roleData = data.userRole;
												}
											});
										Answer('Saved!');
										//dfd.resolve();
									}

								},
								error: function (data, textStatus) {
									noAnswer('Error. Please try again.');
								},
								dataType: 'json'
							});

						} else
							noAnswer('Error. Please try again.');
					});

			}, function () {
			});
		}, function () {
		});
	}
	}else{
		noAnswer('Please update account.');
	}
}

function delSafeFile(row, id) {

	checkState(function () {
		$.ajax({
			type: "POST",
			url: '/deleteFileFromSafe',
			data: {
				'modKey': userModKey,
				'fileId': id
			},
			success: function (data, textStatus) {
				if (data['result'] == 'success') {
					$('#safeList').DataTable().row($(row).parents('tr')).remove().draw(false);
				}
			},
			error: function (data, textStatus) {

			},
			dataType: 'json'
		});


	}, function () {
	});


}

function initSafeBox() {
	if (!safeBoxProfileInitialized) {
		var dfd = $.Deferred();
		var dataSet = [];
		var fileList = {};

		checkState(function () {
			$.ajax({
				type: "POST",
				url: '/getSafeBoxList',
				data: {
					'modKey': userModKey
				},
				success: function (data, textStatus) {
					if (data['response'] == 'success') {
						fileList = data['data'];
						dfd.resolve();
						//tryDecryptSeed(data.data);
					}
				},
				error: function (data, textStatus) {

				},
				dataType: 'json'
			});


		}, function () {
		});

		dfd.done(function () {
			//console.log(fileList);
			if (Object.keys(fileList).length > 0) {
				//console.log(fileList);
				$.each(fileList, function (index, value) {
					var el = [from64(value['name']), value['modified'], value['created'], '<a class="delete" href="javascript:void(0);" onclick="delSafeFile($(this),\'' + value['index'] + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
					dataSet.push(el);
				});

			} else
				dataSet = [];

			contactTable = $('#safeList').dataTable({
				"sDom": "R<'dt-toolbar'" +
					"r>t" +
					"<'dt-toolbar-footer'" +
					"<'col-sm-6 col-xs-2'i>" +
					"<'#safepaginator'p>" +
					">",
				"columnDefs": [
					{ "sClass": 'col col-xs-6', "targets": 0},
					{ "sClass": 'col col-xs-2', "targets": 1 },
					{ "sClass": 'col col-xs-2', "targets": 2 },
					{ "sClass": 'col col-xs-1 text-align-center', "targets": 3},
					{ 'bSortable': false, 'aTargets': [ 3 ] },
					{ "orderDataType": "data-sort", "targets": 0 }
				],
				"order": [
					[ 0, "asc" ]
				],
				"iDisplayLength": 10,
				"data": dataSet,
				columns: [
					{ "title": "name" },
					{ "title": "modified" },
					{ "title": "created"},
					{ "title": "delete"}

				],
				"language": {
					"emptyTable": "No Files"
				}

			});

			safeBoxProfileInitialized = true;
			$('#safeIcons').css('float', 'left');


		});


	}

}

function delFromTagList(row, tag)
{
	$('#tagListTable').DataTable().row($(row).parents('tr')).remove().draw(false);
	delete profileSettings['tags'][tag];
	checkProfile();
}

function delFromBlackList(row, email) {
	$('#blackListTable').DataTable().row($(row).parents('tr')).remove().draw(false);
	delete blackList[email];
	checkBlackList();
}
function initBlackList() {
	if (!blackListProfileInitialized) {

		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(blackList).length > 0) {
			$.each(blackList, function (index, value) {
				var el = [value['email'], '<a class="delete" href="javascript:void(0);" onclick="delFromBlackList($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#blackListTable').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#contactSearch'f>" +
				"<'#contactIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-10', "targets": 0},
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 1},
				{ 'bSortable': false, 'aTargets': [ 1 ] },
				{ "orderDataType": "data-sort", "targets": 0 }
			],
			"order": [
				[ 0, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "email"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "Empty"
			}

		});

		blackListProfileInitialized = true;

	}

}


function initTagList() {
	if (!tagListProfileInitialized) {

		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(profileSettings['tags']).length > 0) {
			$.each(profileSettings['tags'], function (index, value) {
				var el = [from64(value['name']), '<a class="delete" href="javascript:void(0);" onclick="delFromTagList($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#tagListTable').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#contactSearch'f>" +
				"<''>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-10', "targets": 0},
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 1},
				{ 'bSortable': false, 'aTargets': [ 1 ] },
				{ 'bSearchable': false, 'aTargets': [ 1 ] },
				{ "orderDataType": "data-sort", "targets": 0 }
			],
			"order": [
				[ 0, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "Tag"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "Empty"
			}

		});

		tagListProfileInitialized = true;

	}

}


function initdisposable() {
	//disposableListProfileInitialized
	if (!disposableListProfileInitialized) {
		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(profileSettings['disposableEmails']).length > 0) {

			$.each(profileSettings['disposableEmails'], function (index, value) {
				var el = [value['name'], '<a class="delete" href="javascript:void(0);" onclick="delDisposedEmail($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#disposeList').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#disposeSearch'f>" +
				"<'#disposeIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-10', "targets": 0},
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 1},
				{ 'bSortable': false, 'aTargets': [ 1 ] },
				{ "orderDataType": "data-sort", "targets": 0 }
			],
			"order": [
				[ 0, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "email"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "No Emails"
			}

		});

		disposableListProfileInitialized = true;
		$('#disposeIcons').html('<button class="btn btn-primary" style="width:50px;" type="button" rel="tooltip" data-original-title="Add Disposable Email" data-placement="bottom" onclick="addNewDisposableEmail();"><i class="fa fa-plus"></i></button>');
		$('#disposeIcons').css('float', 'left');

		$("[rel=tooltip]").tooltip();

	}
}
function initCustomDomain(){

	//disposableListProfileInitialized
	if (!domainListProfileInitialized) {
		var dataSet = [];
		contactTable = $('#customDomainList').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#cusDomSearch'f>" +
				"<'#cusDomIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#cusDompaginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-2', "targets": 0},
				{ "sClass": 'col col-xs-2 text-align-center', "targets": [1,2,3,4,5,6,7]},
				{ 'bSortable': false, 'aTargets': [ 1,2,3,4,5,6,7 ] },
				{ "orderDataType": "data-sort", "targets": 0 }
			],
			"order": [
				[ 0, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			"language": {
				"emptyTable": "No Custom Domains"
			}

		});

		domainListProfileInitialized = true;
		$('#cusDomIcons').html('<button class="btn btn-primary" style="width:50px;" type="button" rel="tooltip" data-original-title="Add Custom Domain" data-placement="bottom" onclick="addNewCustDomain();"><i class="fa fa-plus"></i></button>');
		$('#cusDomIcons').css('float', 'left');

		$("[rel=tooltip]").tooltip();

	}

	renderTableCustDomain();

}
function renderTableCustDomain() {
var dataSet=[];

	var suc='<i class="fa fa-check text-success fa-lg"></i>';
	var fail='<i class="fa fa-minus text-danger fa-lg"></i>';
	var dfd = $.Deferred();
	var domains={};
	var chkdom={};
	if (Object.keys(profileSettings['customDomains']).length > 0) {
		$.each(profileSettings['customDomains'], function (index, value) {
			chkdom[value['secret']]=value['domainName']
		});
	}
	$.ajax({
		type: "POST",
		url: '/getCustomRegisteredDomains',
		data: {
			domains:JSON.stringify(chkdom)
		},
		success: function (data, textStatus) {
			if (data['response'] == 'success') {
				domains=data['domains'];
				dfd.resolve();
			}else{
				noAnswer('Error. Please try again.');
			}
		},
		error: function (data, textStatus) {
			noAnswer('Error. Please try again.');
		},
		dataType: 'json'
	});

	dfd.done(function () {

		var t = $('#customDomainList').DataTable();
		t.clear();

		if (Object.keys(profileSettings['customDomains']).length > 0) {

			$.each(profileSettings['customDomains'], function (index, value) {

				var domn='<span rel="popover" data-placement="bottom"	data-original-title="Verification String:"	data-content="<input readonly value=\''+SHA256(value['secret'])+'\'>">'+value['domainName']+'</span>';

				var el =[
					domn,
					domains[index]['spfRec']==1?suc:fail,
					domains[index]['mxRec']==1?suc:fail,
					domains[index]['vrfRec']==1?suc:fail,
					domains[index]['dkimRec']==1?suc:fail,
					domains[index]['availableForAliasReg']==1?suc:fail,
					'<a href="javascript:void(0);" onclick="refreshDNS(this,\''+index+'\')"><i class="fa fa-refresh fa-lg"></i></a>',
					'<a href="javascript:void(0);" onclick="deleteDomain(this,\''+index+'\')"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];

				dataSet.push(el);
			});

		} else
			dataSet = [];

		var addId = t.rows.add(dataSet)
		t.draw();

		initBaseSettings();
	});



}
function deleteDomain(elem,domain)
{
	var dfd = $.Deferred();

	$('#dialog_simple >p').html('<b>' + profileSettings['customDomains'][domain]['domainName'] + '</b><br> will be removed. Continue?');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 340,
		resizable: false,
		modal: true,
		title: "Remove Custom Domain",
		buttons: [
			{
				html: "<i class='fa fa-trash-o'></i>&nbsp; Remove",
				"class": "btn btn-danger",
				click: function () {
					dfd.resolve();

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
	dfd.done(function () {

		$.ajax({
			type: "POST",
			url: '/removeCustomDomain',
			data: {
				'domain': 'http://'+profileSettings['customDomains'][domain]['domainName'],
				'vrfString':profileSettings['customDomains'][domain]['secret']
			},
			success: function (data, textStatus) {
				if (data['result'] == 'success') {
					delete profileSettings['customDomains'][domain];
					checkProfile();
					renderTableCustDomain();
					Answer('Domain Removed');
					$('#dialog_simple').dialog('close');
				}else{
					noAnswer('Error. Please try again.');
				}
			},
			error: function (data, textStatus) {
				noAnswer('Error. Please try again.');
			},
			dataType: 'json'
		});
	});
	$('#dialog_simple').dialog('open');
}
function refreshDNS(elem,domain)
{
	$(elem).children('i').addClass('fa-spin');

	$.ajax({
		type: "POST",
		url: "/CheckMXrecord",
		data: {
			'domain': 'http://'+profileSettings['customDomains'][domain]['domainName'],
			'vrfString':profileSettings['customDomains'][domain]['secret'],
			'overrideCache':1
		},
		dataType: "json",
		async: false,
		success: function (msg) {
			if(msg['domainBelongsToUser']===true){

				if(msg['spfRecordValid']===true){
					$(elem).parents('tr').children("td:eq(1)").children("i").removeClass('fa-minus text-danger');
					$(elem).parents('tr').children("td:eq(1)").children("i").addClass('fa-check text-success');
				}else{
					$(elem).parents('tr').children("td:eq(1)").children("i").addClass('fa-minus text-danger');
					$(elem).parents('tr').children("td:eq(1)").children("i").removeClass('fa-check text-success');
				}

				if(msg['mxRecordValid']===true){
					$(elem).parents('tr').children("td:eq(2)").children("i").removeClass('fa-minus text-danger');
					$(elem).parents('tr').children("td:eq(2)").children("i").addClass('fa-check text-success');
				}else{
					$(elem).parents('tr').children("td:eq(2)").children("i").addClass('fa-minus text-danger');
					$(elem).parents('tr').children("td:eq(2)").children("i").removeClass('fa-check text-success');
				}

				if(msg['domainOwnerValid']===true){
					$(elem).parents('tr').children("td:eq(3)").children("i").removeClass('fa-minus text-danger');
					$(elem).parents('tr').children("td:eq(3)").children("i").addClass('fa-check text-success');
				}else{
					$(elem).parents('tr').children("td:eq(3)").children("i").addClass('fa-minus text-danger');
					$(elem).parents('tr').children("td:eq(3)").children("i").removeClass('fa-check text-success');
				}




				if(msg['avToReg']===true){
					$(elem).parents('tr').children("td:eq(4)").children("i").removeClass('fa-minus text-danger');
					$(elem).parents('tr').children("td:eq(4)").children("i").addClass('fa-check text-success');
				}else{
					$(elem).parents('tr').children("td:eq(4)").children("i").addClass('fa-minus text-danger');
					$(elem).parents('tr').children("td:eq(4)").children("i").removeClass('fa-check text-success');
				}

				$(elem).children('i').removeClass('fa-spin');

			}else{
				$(elem).children('i').removeClass('fa-spin');
				noAnswer('Domain not belongs to user');
			}
			//if(
			//	msg['domainOwnerValid']===true &&
			//	msg['domainOwnerValid']===true &&
			//	msg['domainOwnerValid']===true &&
			//	msg['domainOwnerValid']===true
			//){

			//}
			//isSuccess = msg['result'] == 'successful' ? true : false
		}
	});

}

function addNewCustDomain() {
	$('#dialog-AddCustDom').dialog({
		autoOpen: false,
		width: 350,
		modal: true,
		title:'Register Domain',
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Add",
				"class": "btn btn-primary pull-right",
				"id": 'nCusDomOk',
				click: function () {
					saveNewCustomDomain();
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default pull-left",
				"id": 'nAliasClose',
				click: function () {
					$('#secretSTR').val('');
					$('#newCustomDomain').val('');
					$('#dialog-AddCustDom').dialog('close');
				}
			}
		],
		close: function () {
		}
	});

	if(profileSettings['version']==1){
		if (Object.keys(profileSettings['customDomains']).length < roleData['role']['customDomains']) {
			$('#dialog-AddCustDom').dialog('open');
		} else {
			noAnswer('Limit for registered domains has been reached.');
		}

	}else{
		noAnswer('Please update account.');
	}

	$.validator.addMethod("uniqueCustomDomain", function (value, element) {
		var isSuccess = false;

			$.ajax({
				type: "POST",
				url: "/CheckMXrecord",
				data: {
					'domain': 'http://'+$('#newCustomDomain').val().toLowerCase(),
					'vrfString':SHA256(userData['saltS']+$('#newCustomDomain').val().toLowerCase())
				},
				dataType: "json",
				async: false,
				success: function (msg) {
					isSuccess = msg['result'] == 'successful' ? true : false
				}
			});

		return isSuccess;


	}, "Domain Already Registered");

	validatorCustomClient = $("#dialog-AddCustDom").validate();


	$("#newCustomDomain").rules("add", {
		required: true,
		minlength: 3,
		maxlength: 90,
		uniqueCustomDomain: true
	});

}
function saveNewCustomDomain()
{
	var dfd = $.Deferred();
	var domain=$('#newCustomDomain').val().toLowerCase();
	var vrfString=SHA256(userData['saltS']+$('#newCustomDomain').val().toLowerCase());
	$.ajax({
		type: "POST",
		url: "/CheckMXrecord",
		data: {
			'domain': 'http://'+domain,
			'vrfString':vrfString
		},
		dataType: "json",
		success: function (msg) {
			if(msg['result'] == 'successful' &&msg['domainOwnerValid'] ===true)
			{
					if(msg['mxRecordValid'] ===true)
					{
						if(msg['spfRecordValid'] ===true)
						{
							if(msg['dkimRecordValid'] ===true){
								if(msg['domainRegistered'] ===false){
									dfd.resolve();	
								}else{
								noAnswer('Domain already Registered. Try again.');	
								}
							}else{
								noAnswer('Domain dkimRecordValid Verification Failed. Try again.');	
							}
						}else{
							noAnswer('Domain spfRecordValid Verification Failed. Try again.');
						}	
					}else{
						noAnswer('Domain mxRecord Verification Failed. Try again.');	
					}
					
			}else{
				noAnswer('Domain Owner Verification Failed. Try again.');	
			}
		}
	});
	
	dfd.done(function () {

		$.ajax({
			type: "POST",
			url: "/saveCustomDomain",
			data: {
				'domain': 'http://'+domain,
				'vrfString':vrfString
			},
			dataType: "json",
			success: function (msg) {
				if(msg['result'] == 'successful')
				{
					profileSettings['customDomains'][SHA256(domain)]={'domainName':domain,'secret':vrfString};
					checkProfile();
					$('#secretSTR').val('');
					$('#newCustomDomain').val('');
					Answer('Added');
					$('#dialog-AddCustDom').dialog('close');
					renderTableCustDomain();
				}else if(msg['result']='fail'){
					noAnswer('Unable to add domain. Check your plan.');
				}else{
					noAnswer('Domain Verification Failed. Try again.');
				}
			}
		});





	});

}

function changingDomain() {
	var str=makeVerificationString($('#newCustomDomain').val().toLowerCase());
	$('#secretSTR').val(str['hash']);
}



function initAlias() {

	//disposableListProfileInitialized
	if (!aliasListProfileInitialized) {
		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(profileSettings['aliasEmails']).length > 0) {

			$.each(profileSettings['aliasEmails'], function (index, value) {
				var el = [value['email'], '<a class="delete" href="javascript:void(0);" onclick="delAliasEmail($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#aliasList').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#aliasSearch'f>" +
				"<'#aliasIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-10 disposemail', "targets": 0},
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 1},
				{ 'bSortable': false, 'aTargets': [ 1 ] },
				{ "orderDataType": "data-sort", "targets": 0 }
			],
			"order": [
				[ 0, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "email"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "No Emails"
			}

		});

		aliasListProfileInitialized = true;
		$('#aliasIcons').html('<button class="btn btn-primary" style="width:50px;" type="button" rel="tooltip" data-original-title="Add Email Alias" data-placement="bottom" onclick="addNewAliasEmail();"><i class="fa fa-plus"></i></button>');
		$('#aliasIcons').css('float', 'left');

		$("[rel=tooltip]").tooltip();

	}

	$.ajax({
		type: "POST",
		url: '/getDomainsForAlias',
		success: function (data, textStatus) {
				if (data['response'] == 'success') {
					$("#aliasDomain").empty();

					$.each(data['domains'], function (index, value) {
							$('#aliasDomain').append(
								$('<option></option>').val(value).html('@'+value)
							);

					});
				}else{
					noAnswer('Error. Please try again.');
				}
			},
			error: function (data, textStatus) {
				noAnswer('Error. Please try again.');
		},
		dataType: 'json'
	});


}



function makerandomEmail() {
	var text = "";
	var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 27; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function delDisposedEmail(row, email)
{
	var dfd = $.Deferred();

	$('#dialog_simple >p').html('<b>' + profileSettings['disposableEmails'][email]['name'] + '</b><br> will be deleted. Continue?');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 340,
		resizable: false,
		modal: true,
		title: "Delete Email",
		buttons: [
			{
				html: "<i class='fa fa-trash-o'></i>&nbsp; Delete",
				"class": "btn btn-danger",
				click: function () {
					dfd.resolve();

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
	dfd.done(function () {
		checkState(function () {
			var user1={};
			var dfd1 = $.Deferred();
			if(secretWord!='' && validateUserObject()){
				var user = dbToProfile(userData['userObj'], secretWord,userData['saltS']);
				user1 = JSON.parse(user, true);
				dfd1.resolve();
			}else{
				provideSecret(function (secret) {
					if (userObj = validateUserObject()) {
						var user = dbToProfile(userObj['userObj'], secret,userObj['saltS']);
						secretWord=secret;
						user1 = JSON.parse(user, true);
						secretTime();
						dfd1.resolve();
					}
				}, function () {

				});
			}
			dfd1.done(function () {
				var secret=secretWord;

				//console.log(user1);
				//console.log(email);

				//console.log(user1['keys'][email]);

				var receiveHash=user1['keys'][email]['receiveHash'];

				delete user1['keys'][email];

				var userObj = profileToDb(user1,secret,userData['saltS']);

				$.ajax({
					type: "POST",
					url: '/deleteDisposableEmail',
					data: {
						'email': email,
						'modKey': userModKey,
						'UserObject':userObj
					},
					success: function (data, textStatus) {
						if (data===true) {
							$('#disposeList').DataTable().row($(row).parents('tr')).remove().draw(false);
							delete profileSettings['disposableEmails'][email];
							userData['userObj']=userObj;
							delete receivingKeys[receiveHash];
							checkProfile();
							$('#dialog_simple').dialog('close');
							Answer('Email Removed');

						} else {
							noAnswer('Error. Please try again.');
						}

					},
					error: function (data, textStatus) {
						noAnswer('Error. Please try again.');
					},
					dataType: 'json'
				});

			});

		}, function () {
		});
	});

	$('#dialog_simple').dialog('open');
}

function secretTime() {
	var secs = 15;
	clearInterval(secretTimer);


	secretTimer = setInterval(function () {
			if (secs < 1) {
				secretWord='';
				clearInterval(secretTimer);
			}
			secs--;
		}, 1000);

}

function saveNewDisposableEmail(email) {

	var dfd = $.Deferred();
	$('#disposeIcons > button').html('<i class="fa fa-refresh fa-spin"></i>');
	$('#disposeIcons > button').prop('disabled', true);
	checkState(function () {
		var user1={};
		if(secretWord!='' && validateUserObject()){
				var user = dbToProfile(userData['userObj'], secretWord,userData['saltS']);
				user1 = JSON.parse(user, true);
				dfd.resolve();
		}else{
			provideSecret(function (secret) {
				if (userObj = validateUserObject()) {
					var user = dbToProfile(userObj['userObj'], secret,userObj['saltS']);
					secretWord=secret;
					user1 = JSON.parse(user, true);
					secretTime();
					dfd.resolve();
				}
			}, function () {
				$('#disposeIcons > button').html('<i class="fa fa-plus"></i>');
				$('#disposeIcons > button').prop('disabled', false);
			});
		}

		dfd.done(function () {
			//console.log(user1);
			//console.log(user1['keys'][SHA512(profileSettings['email'])]['keyLength']);
			var secret=secretWord;
			generatePairs(user1['keys'][SHA512(profileSettings['email'])]['keyLength'],function(mailpair){

				//var rsa = forge.pki.rsa;
				var pki = forge.pki;

				user1['keys'][SHA512(email)]={
					'email':email,
					'privateKey':to64(pki.privateKeyToPem(mailpair.keys.privateKey)),
					'publicKey':to64(pki.publicKeyToPem(mailpair.keys.publicKey)),
					'canSend':'0',
					'keyLength':user1['keys'][SHA512(profileSettings['email'])]['keyLength'],
					'receiveHash':SHA512(pki.publicKeyToPem(mailpair.keys.publicKey)).substring(0,10)
				};
				//console.log(user1);
				var userObj = profileToDb(user1,secret,userData['saltS']);

				$.ajax({
					type: "POST",
					url: '/saveDisposableEmail',
					data: {
						'email': SHA512(email),
						'UserObject':userObj,
						'modKey': userModKey,
						'mailKey':to64(pki.publicKeyToPem(mailpair.keys.publicKey))

					},
					success: function (data, textStatus) {
						if (data===true) {
							var t = $('#disposeList').DataTable();
							t.clear();
							profileSettings['disposableEmails'][SHA512(email)] = {'name':email};
							receivingKeys[SHA512(pki.publicKeyToPem(mailpair.keys.publicKey)).substring(0,10)]={'privateKey':mailpair.keys.privateKey,'length':user1['keys'][SHA512(profileSettings['email'])]['keyLength']/4};
						//	console.log(receivingKeys);
							userData['userObj']=userObj;
							checkProfile();
							$('#disposeIcons > button').html('<i class="fa fa-plus"></i>');
							$('#disposeIcons > button').prop('disabled', false);
							var dataSet = [];
							$.each(profileSettings['disposableEmails'], function (index, value) {
								var el = [value['name'], '<a class="delete" href="javascript:void(0);" onclick="delDisposedEmail($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
								dataSet.push(el);
							});
							var addId = t.rows.add(dataSet)
							t.draw();

						} else {
							noAnswer('Error. Please try again.');
						}

					},
					error: function (data, textStatus) {
						noAnswer('Error. Please try again.');
					},
					dataType: 'json'
				});


			});
		});


	}, function () {
	});

}
function initContacts() {
	if (!contactListProfileInitialized) {

		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(contacts).length > 0) {
			$.each(contacts, function (index, value) {
				var el = [value['name'], index,value['pin']==undefined?'':value['pin'], '<a class="edit" href="javascript:void(0);" onclick="editContact($(this),\'' + index + '\');"><i class="fa fa-pencil fa-lg txt-color-green"></i></a>', '<a class="delete" href="javascript:void(0);" onclick="delContact($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#contactList').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#contactSearch'f>" +
				"<'#contactIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-4', "targets": 0},
				{ "sClass": 'col col-xs-4', "targets": 1 },
				{ "sClass": 'col col-xs-2', "targets": 2 },
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 3},
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 4},
				{ 'bSortable': false, 'aTargets': [ 3,4 ] },
				{ "orderDataType": "data-sort", "targets": 1 }
			],
			"order": [
				[ 1, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "name" },
				{ "title": "email"},
				{ "title": "pin"},
				{ "title": "edit"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "No Contacts"
			}

		});

		contactListProfileInitialized = true;
		$('#contactIcons').html('<a class="btn btn-primary" style="width:50px;" href="javascript:void(0);" rel="tooltip" data-original-title="Add Contact" data-placement="bottom" onclick="addNewContact();"><i class="fa fa-plus"></i>&nbsp;&nbsp;<i class="fa fa-user"></i></a>');
		$('#contactIcons').css('float', 'left');

		$("[rel=tooltip]").tooltip();
	}

}

function delContact(row, email) {

	$('#dialog_simple >p').html('<b>' + email + '</b> will be deleted. Continue?');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 300,
		resizable: false,
		modal: true,
		title: "Delete contact",
		buttons: [
			{
				html: "<i class='fa fa-trash-o'></i>&nbsp; Delete",
				"class": "btn btn-danger",
				click: function () {
					delete contacts[email];
					checkContacts(function(){
						$(dialog_simple).dialog("close");
						$('#contactList').DataTable().row($(row).parents('tr')).remove().draw(false);
					});


				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default",
				click: function () {
					$(dialog_simple).dialog("close");
				}
			}
		]
	});

	$('#dialog_simple').dialog('open');

}



function editContact(row, email) {

	$('#dialog-AddContact').dialog({
		autoOpen: false,
		height: 240,
		width: 300,
		modal: true,
		title:'Edit Contact',
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Add",
				"class": "btn btn-primary pull-right",
				"id": 'loginok',
				click: function () {
					validatorNewClient.form();
					if (validatorNewClient.numberOfInvalids() == 0) {

						var name = $('#newClientName').val() != '' ? $('#newClientName').val() : '';
						var email = $('#newClientEmail').val().toLowerCase();
						var pin = $('#newClientPin').val() != '' ? $('#newClientPin').val() : '';
						addContactIntoDb(name,email,pin,function(){
							var t = $('#contactList').DataTable();
							t.clear();
							var dataSet = [];
							if (Object.keys(contacts).length > 0) {
								$.each(contacts, function (index, value) {
									var el = [value['name'], index,value['pin']==undefined?'':value['pin'], '<a class="edit" href="javascript:void(0);" onclick="editContact($(this),\'' + index + '\');"><i class="fa fa-pencil fa-lg txt-color-green"></i></a>', '<a class="delete" href="javascript:void(0);" onclick="delContact($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
									dataSet.push(el);
								});
							}
							var addId = t.rows.add(dataSet)
							t.draw();

							$('#dialog-AddContact').dialog('close');
						});
					}
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default pull-left",
				"id": 'loginclose',
				click: function () {
					$('#dialog-AddContact').dialog('close');
				}
			}
		],
		close: function () {
		}
	});

	$('#newClientName').val(contacts[email]['name']);
	$('#newClientEmail').val(email);
	$('#newClientPin').val(contacts[email]['pin'])

	$('#dialog-AddContact').dialog('open');


	$('#newClientName').attr('name', makerandom());
	$('#newClientEmail').attr('name', makerandom());


	validatorNewClient = $("#dialog-AddContact").validate();

	$("#newClientName").rules("add", {
		minlength: 2,
		maxlength: 60
	});

	$("#newClientEmail").rules("add", {
		required: true,
		email: true,
		minlength: 6,
		maxlength: 200
	});
	$("#newClientPin").rules("add", {
		required: false,
		minlength: 3,
		maxlength: 64
	});


}

function addNewContact() {

	$('#dialog-AddContact').dialog({
		autoOpen: false,
		height: 240,
		width: 300,
		modal: true,
		title:'New Contact',
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Add",
				"class": "btn btn-primary pull-right",
				"id": 'loginok',
				click: function () {
					validatorNewClient.form();
					if (validatorNewClient.numberOfInvalids() == 0) {

						var name = $('#newClientName').val() != '' ? $('#newClientName').val() : '';
						var email = $('#newClientEmail').val().toLowerCase();
						var pin = $('#newClientPin').val() != '' ? $('#newClientPin').val() : '';
						addContactIntoDb(name,email,pin,function(){
							var t = $('#contactList').DataTable();
							t.clear();
							var dataSet = [];
							if (Object.keys(contacts).length > 0) {
								$.each(contacts, function (index, value) {
									var el = [value['name'], index,value['pin']==undefined?'':value['pin'], '<a class="edit" href="javascript:void(0);" onclick="editContact($(this),\'' + index + '\');"><i class="fa fa-pencil fa-lg txt-color-green"></i></a>', '<a class="delete" href="javascript:void(0);" onclick="delContact($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
									dataSet.push(el);
								});
							}
							var addId = t.rows.add(dataSet)
							t.draw();

							$('#dialog-AddContact').dialog('close');
						});

					}
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default pull-left",
				"id": 'loginclose',
				click: function () {
					$('#dialog-AddContact').dialog('close');
				}
			}
		],
		close: function () {
		}
	});


		$('#dialog-AddContact').dialog('open');




	$('#newClientName').attr('name', makerandom());
	$('#newClientEmail').attr('name', makerandom());


	validatorNewClient = $("#dialog-AddContact").validate();

	$("#newClientName").rules("add", {
		minlength: 2,
		maxlength: 60
	});

	$("#newClientEmail").rules("add", {
		required: true,
		email: true,
		minlength: 6,
		maxlength: 200
	});
	$("#newClientPin").rules("add", {
		required: false,
		minlength: 3,
		maxlength: 64
	});


}
function addNewDisposableEmail(count) {
	if(profileSettings['version']==1){

		count = typeof count !== 'undefined' ? count : 0;
		if (count <= 2) {
			if (Object.keys(profileSettings['disposableEmails']).length < roleData['role']['dispAddPerBox']) {
				var email = makerandomEmail() + '@scryptmail.com';
				$.ajax({
					type: "POST",
					url: '/verifyEmail',
					data: {
						'email': SHA512(email)
					},
					success: function (data, textStatus) {
						if (data===true) {
							saveNewDisposableEmail(email);
						} else if (!data) {
							count++;
							addNewDisposableEmail(count);
						}

					},
					error: function (data, textStatus) {
						noAnswer('Error. Please try again.');
					},
					dataType: 'json'
				});

			} else {
				noAnswer('Limit of disposable email addresses has been reached.');
			}
		} else {
			noAnswer('Error. Please try again.');
		}

	}else{
		noAnswer('Please update account.');
	}

}

function addNewAliasEmail() {
	$('#dialog-AddAlias').dialog({
		autoOpen: false,
		height: 300,
		width: 300,
		modal: true,
		title:'New Alias',
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Add",
				"class": "btn btn-primary pull-right",
				"id": 'nAliasOk',
				click: function () {
					validatorAliasClient.form();
					if (validatorAliasClient.numberOfInvalids() == 0) {
						var email =$('#newAliasEmail').val().toLowerCase();
						email=email.split('@')[0]+ '@'+$('#aliasDomain').val();
						saveNewAliasEmail(email);
					}
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default pull-left",
				"id": 'nAliasClose',
				click: function () {
					$('#dialog-AddAlias').dialog('close');
				}
			}
		],
		close: function () {
		}
	});
	if(profileSettings['version']==1){
		if (Object.keys(profileSettings['aliasEmails']).length < roleData['role']['aliasAddPerBox']) {
			$('#dialog-AddAlias').dialog('open');
		} else {
		noAnswer('Limit of email aliases has been reached.');
	}

	}else{
		noAnswer('Please update account.');
	}

	$('#newAliasEmail').attr('name', makerandom());



	$.validator.addMethod("uniqueUserName", function (value, element) {
		var isSuccess = false;
		var email =$('#newAliasEmail').val().toLowerCase();
		email=email.split('@')[0]+ '@'+$('#aliasDomain').val();
		if(IsEmail(email)){
			$.ajax({
				type: "POST",
				url: "/checkEmailExist",
				data: {'CreateUser[email]': SHA512(email), 'ajax': 'smart-form-register'},
				dataType: "json",
				async: false,
				success: function (msg) {
					isSuccess = msg === true ? true : false
				}
			});
		}
		return isSuccess;


	}, "Email is Already Taken / No Specail Characters");

	$.validator.addMethod("uniqueDomain", function (value, element) {
		var isSuccess = false;
		var email =$('#newAliasEmail').val().toLowerCase();
		email=email.split('@')[0]+ '@'+$('#aliasDomain').val();

		if(IsEmail(email)){
			$.ajax({
				type: "POST",
				url: "/checkEmailExist",
				data: {'CreateUser[email]': SHA512(email), 'ajax': 'smart-form-register'},
				dataType: "json",
				async: false,
				success: function (msg) {
					isSuccess = msg === true ? true : false
				}
			});
		}

		return isSuccess;


	}, "Email is Already Taken / No Specail Characters");

	validatorAliasClient = $("#dialog-AddAlias").validate();


	$("#newAliasEmail").rules("add", {
		required: true,
		minlength: 3,
		maxlength: 90,
		uniqueUserName: true
	});

}

function saveNewAliasEmail(email) {
	var dfd = $.Deferred();
	checkState(function () {
		var user1={};
		if(secretWord!='' && validateUserObject()){
			var user = dbToProfile(userData['userObj'], secretWord,userData['saltS']);
			user1 = JSON.parse(user, true);
			dfd.resolve();
		}else{
			provideSecret(function (secret) {
				if (userObj = validateUserObject()) {
					var user = dbToProfile(userObj['userObj'], secret,userObj['saltS']);
					secretWord=secret;
					user1 = JSON.parse(user, true);
					secretTime();
					dfd.resolve();
				}
			}, function () {
			});
		}

		dfd.done(function () {
			$('#nAliasOk').html('<i class="fa fa-refresh fa-spin"></i> Generating Keys..');
			$('#nAliasOk').prop('disabled', true);

			//console.log(user1);
			//console.log(user1['keys'][SHA512(profileSettings['email'])]['keyLength']);
			var secret=secretWord;
			generatePairs(user1['keys'][SHA512(profileSettings['email'])]['keyLength'],function(mailpair){

				//var rsa = forge.pki.rsa;
				var pki = forge.pki;

				user1['keys'][SHA512(email)]={
					'email':email,
					'privateKey':to64(pki.privateKeyToPem(mailpair.keys.privateKey)),
					'publicKey':to64(pki.publicKeyToPem(mailpair.keys.publicKey)),
					'canSend':'2',
					'keyLength':user1['keys'][SHA512(profileSettings['email'])]['keyLength'],
					'receiveHash':SHA512(pki.publicKeyToPem(mailpair.keys.publicKey)).substring(0,10)
				};
				
				//console.log(user1);
				var userObj = profileToDb(user1,secret,userData['saltS']);

				$.ajax({
					type: "POST",
					url: '/saveAliasEmail',
					data: {
						'email': email,
						'UserObject':userObj,
						'modKey': userModKey,
						'mailKey':to64(pki.publicKeyToPem(mailpair.keys.publicKey))

					},
					success: function (data, textStatus) {
						if (data===true) {
							var t = $('#aliasList').DataTable();
							t.clear();
							profileSettings['aliasEmails'][SHA512(email)] = {'email':email,'name':''};
							receivingKeys[SHA512(pki.publicKeyToPem(mailpair.keys.publicKey)).substring(0,10)]={'privateKey':mailpair.keys.privateKey,'length':user1['keys'][SHA512(profileSettings['email'])]['keyLength']/4};
							signingKey[SHA512(email)]={'privateKey':mailpair.keys.privateKey};
							//	console.log(receivingKeys);
							userData['userObj']=userObj;
							checkProfile();
							$('#nAliasOk').html("<i class='fa fa-check'></i>&nbsp; Add");
							$('#nAliasOk').prop('disabled', false);
							var dataSet = [];
							$.each(profileSettings['aliasEmails'], function (index, value) {
								var el = [value['email'], '<a class="delete" href="javascript:void(0);" onclick="delAliasEmail($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
								dataSet.push(el);
							});
							var addId = t.rows.add(dataSet)
							t.draw();
							$('#newAliasEmail').val('');
							$('#dialog-AddAlias').dialog('close');
						} else {
							noAnswer('Error. Please try again.');
						}

					},
					error: function (data, textStatus) {
						noAnswer('Error. Please try again.');
					},
					dataType: 'json'
				});


			});
		});


	}, function () {
	});

}

function delAliasEmail(row, email)
{
	var dfd = $.Deferred();

	$('#dialog_simple >p').html('<b>' + profileSettings['aliasEmails'][email]['email'] + '</b><br> will be deleted. Continue?');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 340,
		resizable: false,
		modal: true,
		title: "Delete Email",
		buttons: [
			{
				html: "<i class='fa fa-trash-o'></i>&nbsp; Delete",
				"class": "btn btn-danger",
				click: function () {
					dfd.resolve();

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
	dfd.done(function () {
		checkState(function () {
			var user1={};
			var dfd1 = $.Deferred();
			if(secretWord!='' && validateUserObject()){
				var user = dbToProfile(userData['userObj'], secretWord,userData['saltS']);
				user1 = JSON.parse(user, true);
				dfd1.resolve();
			}else{
				provideSecret(function (secret) {
					if (userObj = validateUserObject()) {
						var user = dbToProfile(userObj['userObj'], secret,userObj['saltS']);
						secretWord=secret;
						user1 = JSON.parse(user, true);
						secretTime();
						dfd1.resolve();
					}
				}, function () {

				});
			}
			dfd1.done(function () {
				var secret=secretWord;

				//console.log(user1);
				//console.log(email);

				//console.log(user1['keys'][email]);

				var receiveHash=user1['keys'][email]['receiveHash'];

				delete user1['keys'][email];

				var userObj = profileToDb(user1,secret,userData['saltS']);

				$.ajax({
					type: "POST",
					url: '/deleteAliasEmail',
					data: {
						'email': email,
						'modKey': userModKey,
						'UserObject':userObj
					},
					success: function (data, textStatus) {
						if (data===true) {
							$('#aliasList').DataTable().row($(row).parents('tr')).remove().draw(false);
							delete profileSettings['aliasEmails'][email];
							delete signingKey[email];
							userData['userObj']=userObj;
							delete receivingKeys[receiveHash];
							checkProfile();
							$('#dialog_simple').dialog('close');
							Answer('Email Removed');

						} else {
							noAnswer('Error. Please try again.');
						}

					},
					error: function (data, textStatus) {
						noAnswer('Error. Please try again.');
					},
					dataType: 'json'
				});

			});

		}, function () {
		});
	});

	$('#dialog_simple').dialog('open');
}
