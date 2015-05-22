/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
$(document).ready(function () {

	$(".show-next").click(function () {
		$this = $(this);
		$this.hide();
		$this.parent().parent().parent().parent().parent().next().removeClass("hidden");
	});

	var selectDialogueLink = $('<a href="">Select files</a>');
	fileSelector = $("#ddd");

	composeMailRecptCheck();

	$("#agrpins").validate();

	if(Object.keys(profileSettings['aliasEmails']).length>0){
		$('#displayFrom').css('display','block');
		if(profileSettings['name']!=''){
			var froms=profileSettings['name']+' <'+profileSettings['email']+'>';
		}else{
			var froms=profileSettings['email'];
		}
		$('#fromSender').append($("<option></option>")
			.attr("value",froms)
			.text(froms));
		$.each(profileSettings['aliasEmails'], function (index, value) {

			if(value['name']!=''){
				var froms=value['name']+' <'+value['email']+'>';
			}else{
				var froms=value['email'];
			}

			$('#fromSender').append($("<option></option>")
				.attr("value",froms)
				.text(froms));

		});


	}
});

function attachFile() {
	fileSelector.click();
	return false;
}

function getFile(evt) {
	//console.log(evt);
	if (Object.keys(fileObject).length <= 4 && (fileSize + evt[0].files[0]['size'] <= 16000000)) {
		file = evt[0].files[0];

		var reader = new FileReader();

		reader.onload = function (e) {

			var binary_string = '';
			bytes = new Uint8Array(reader.result);
			for (var i = 0; i < bytes.byteLength; i++) {
				binary_string += String.fromCharCode(bytes[i]);
			}
//console.log(view);

			fileObject[to64(file['name'])] = {};
			fileObject[to64(file['name'])]['data'] = window.btoa(binary_string);
			fileObject[to64(file['name'])]['name'] = to64(file['name']);
			fileObject[to64(file['name'])]['size'] = to64(file['size']);
			fileObject[to64(file['name'])]['type'] = to64(file['type']);
			fileSize += file['size'];

			//console.log(fileObject);
			var list = Object.keys(fileObject);

			if (list.length > 0) {
				list = from64(list);
				//$.each(list, function( index, value ) {
				//	list[index]=forge.util.decode64(value);
				//});
			}

			$('#atachFiles').select2('val', list);


		}

		reader.readAsArrayBuffer(file);


	} else
		noAnswer('Maximum of 5 files allowed, 15 Mb total');
	$('#ddd').val("");
}

function iniEmailBody(pin) {
	$('#sendMaildiv').css('display','block');
	$('#mailIcons').css('display','none');
	//$('.inbox-message no-padding').css('height','100%');

	var tableHeight = $(window).height() - 324;
	if (tableHeight < 320) {
		$('.table-wrap').css('height', 320 + 'px');
	} else {
		$('.table-wrap').css('height', tableHeight + 'px');
	}
	//$('.table-wrap').css('margin-right','-8px');

	//$('.inbox-message').css('min-height', $('.table-wrap').css('height')).css('height', '-=220px');
	//$('.inbox-message').css('max-height', '600px');

	if (ismobile) {
		$('#emailbody').summernote({
			minHeight: parseInt($('.table-wrap').css('height'), 10),
			airPopover: [
				['color', ['color']],
				['font', ['bold', 'underline', 'clear']],
				['para', ['ul', 'paragraph']],
				['table', ['table']]
			],
			toolbar: [
				//[groupname, [button list]]

				['style', ['bold', 'italic']],
				['fontsize', ['fontsize']],
				['color', ['color']]
			]
		});
	} else {

		$('#emailbody').summernote({
			minHeight: parseInt($('.table-wrap').css('height'), 10),
			airPopover: [
				['color', ['color']],
				['font', ['bold', 'underline']],
				['para', ['ul', 'paragraph']],
				['table', ['table']]
			],
			toolbar: [
				//[groupname, [button list]]

				['style', ['bold', 'italic', 'underline', 'clear']],
				['fontsize', ['fontsize']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['height', ['height']],
				['insert', ['link']] // no insert buttons
			]

		});
	}
	$('.note-editable').css('min-height', parseInt($('.inbox-message').css('height'), 10));
	$('.note-editable').focus();
	//$('.note-editor').css('height',parseInt($('.inbox-message').css('height'), 10));
	//$('#emailbody').css('min-height',parseInt($('#email-compose-form').css('height'), 10));


	generatePin(pin);
	finishRendering();
}

function generatePin(pin) {
	if (pin) {
		$('#pincheck').attr('checked', 'checked');
		$('#email-compose-form').toggleClass('col col-sm-10 col-xs-12');
		$('#email-pin-form').toggle();
	}

}

function emailParser(emails,callback) {
var dom=[];
	$.each(emails, function (index, value) {
		parseEmail(value, function (result) {
			var email = result['email'];
			var mailD = email.split('@');
			dom.push(SHA512(mailD[1]));
		});
	});

	getLocalDomains(dom,function(localDomains){
	var emailObj = [];
	emailObj['indomain'] = {};
	emailObj['outdomain'] = {};

	var ind = {}, out = {}, indomain = [], outdomain = [];
	var mail;

	$.each(emails, function (index, value) {
		parseEmail(value, function (result) {
			var name = result['name'];
			var email = result['email'];

			var mailD = email.split('@');
				if (jQuery.inArray(mailD[1], localDomains) != -1) {
					//console.log(mail);
					ind.mail = email;
					//ind.seedK = '';
					ind.mailK = '';
					indomain.push(ind);
					ind = {};
				} else {
					out.mail = email;
					outdomain.push(out);
					out = {};
				}


		});
	});

	emailObj['indomain'] = indomain;
	emailObj['outdomain'] = outdomain;
	//console.log(emailObj);
		callback(emailObj);
	});
}

function sendMail() {

	if ($('#pincheck').prop("checked")) {
		var numItems = $('.agred-pin').length;
		if(numItems>0){
			var chkpins = $("#agrpins").validate();

			$(".agred-pin").rules("add", {
				required: true,
				minlength: 3,
				maxlength: 64
			});
			chkpins.form();
			var chkpins=chkpins.numberOfInvalids();
		}else{
			//$('#pincheck').prop("checked",false)
			var chkpins=0;
		}


	}else{
		var chkpins=0;
	}


	if (chkpins == 0) {
		$('.sendMailButton').html('<i class="fa fa-refresh fa-spin"></i>&nbsp; Sending...');
		$('.sendMailButton').prop('disabled', true);
		var canceled = false;
		checkState(function () {

			var emails = recipientHandler('getList', '');

			if (emails == "") {
				noAnswer('Please check recipient(s) address(es) and try again.');
				$('.sendMailButton').html('Send');
				$('.sendMailButton').prop('disabled', false);

				$('#toRcpt').select2('open');


			} else {

				recipientHandler('getPinsFromCards', '');
				var dfd = $.Deferred();
				var dfd1 = $.Deferred();

				emailParser(emails,function(emailparsed){

					if (emailparsed['indomain'].length > 0) {
						var locmails = [];
						$.each(emailparsed['indomain'], function (index, value) {
							locmails[index] = SHA512(value.mail);

						});
						retrievePublicKeys(function (dataBack) {

							emailparsed['indomain'] = indomainLoop(emailparsed, locmails, dataBack);
							dfd.resolve();
						}, function () {

						}, locmails);
					} else {
						dfd.resolve();
					}

					if (emailparsed['outdomain'].length > 0) {

						$.each(emailparsed['outdomain'], function (index, value) {
							//emailparsed['outdomain'][index].pin = $('#emailPin b').text();
							dfd1.resolve();
						});

					} else {
						dfd1.resolve();
					}

					dfd.done(function () {
						dfd1.done(function () {
							encryptMessageToRecipient(emailparsed);
						});
					});

				});


			}


		}, function () {

		});

	} else {
		noAnswer('Please provide PIN for all emails.');
	}

}

//message created when recipient not found
function createFrom(){
	var fromSender='';

	if($("#fromSender").is(":visible")){
		fromSender=	$( "#fromSender" ).val();
	}else{
		if(profileSettings['name']!=''){
			fromSender=profileSettings['name']+'<'+profileSettings['email']+'>';
		}else{
			fromSender=profileSettings['email'];
		}
	}

	return fromSender;
}



//save message in sent folder
function encryptMessageForSent(badRcpt, senderMod, key,callback) {
	var d = new Date();
	var dfd = $.Deferred();

	var publicKey=false;
	var encryptionKey=key;

	var recipient=to64(recipientHandler('getList', ''));

	var sender=to64(createFrom());
	var subject=to64(stripHTML($('#subj').val()).substring(0, 150));
	var bodyMeta=to64(stripHTML($('#emailbody').code()).substring(0, 100));
	var sentMeta=Math.round(d.getTime() / 1000);
	var opened=false;
	var metaPin='';
	if ($('#pincheck').prop("checked")) {
		recipientHandler('getListForPin', '',function(metaP){
			metaPin = JSON.stringify(metaP);
			dfd.resolve();
		});
	} else {
		metaPin='';
		dfd.resolve();
	}

	if (Object.keys(badRcpt).length > 0) {
		var metaStatus= 'warning';
	} else {
		var metaStatus= 'normal';
	}

	var metaType='sent';
	var modKey=(emailObj['meta']['modKey']===undefined)?makeModKey(UserSalt):emailObj['meta']['modKey'];
	var bodyText=to64(stripHTML($('#emailbody').code()));
	var bodyHTML=to64(filterXSS($('#emailbody').code()));
	var fromExtra = '';
	var bdRcpt=badRcpt;
	var sndrMod=senderMod;

	var files=fileObject;
	dfd.done(function () {
		createMessage(publicKey,recipient,files,sender,subject,bodyMeta,sentMeta,opened,metaPin,modKey,bodyText,bodyHTML,metaType,metaStatus,encryptionKey,bdRcpt,sndrMod,fromExtra,function(messaged){
			messaged['mailHash'] = message['mailHash'];
			messaged['modKey']=modKey;
			callback(messaged);
		});
	});

}


function indoCryptFail(value, key,callback) {
	var d = new Date();
	var publicKey=false;
	var encryptionKey=key;

	var recipient=to64(profileSettings['email']);
	var sender=to64('daemon@' + profileSettings['email'].split('@')[1]);
	var subject=to64('Failed to deliver message to ' + recipientHandler('getTextEmail',value['mail']) + '!');
	var bodyMeta=to64(stripHTML('Server was unable to deliver your message because recipient does not exist in our database. <br><br>Message Text:<br> ' + stripHTML($('#emailbody').code())).substring(0, 100));

	var metaType='received';
	var metaStatus='warning';

	var sentMeta=Math.round(d.getTime() / 1000);
	var opened=false;
	var metaPin='';
	var modKey=makeModKey(UserSalt);
	var bodyText=to64('Server was unable to deliver your message because recipient does not exist in our database. <br><br>Message Text:<br> ' + stripHTML($('#emailbody').code()));
	var bodyHTML=to64( 'Server was unable to deliver your message because recipient does not exist in our database. <br><br>Message Text:<br> ' + filterXSS($('#emailbody').code()));
	var bdRcpt='';
	var sndrMod='';
	var fromExtra = '';
	var files={};

	createMessage(publicKey,recipient,files,sender,subject,bodyMeta,sentMeta,opened,metaPin,modKey,bodyText,bodyHTML,metaType,metaStatus,encryptionKey,bdRcpt,sndrMod,fromExtra,function(messaged){
		messaged['modKey']=modKey;
		callback(messaged);
	});

}

//encrypt message in same domain
function indoCrypt(value,callback) {

	var d = new Date();
	var pki = forge.pki;

	var publicKey=pki.publicKeyFromPem(from64(value['mailK']));
	var encryptionKey=forge.random.getBytesSync(32);

	var recipient=to64(recipientHandler('getTextEmail',value['mail']));
	var sender=to64(createFrom());
	var subject=to64(stripHTML($('#subj').val()).substring(0, 150));
	var bodyMeta=to64(stripHTML($('#emailbody').code()).substring(0, 100));
	var sentMeta=Math.round(d.getTime() / 1000);
	var opened=false;
	var metaPin='';
	var metaStatus='';
	var metaType='received';
	var modKey=makeModKey(UserSalt);
	var bodyText=to64(stripHTML($('#emailbody').code()));
	var bodyHTML=to64(filterXSS($('#emailbody').code()));
	var bdRcpt='';
	var sndrMod='';
	var fromExtra = '';
	var files=fileObject;

	createMessage(publicKey,recipient,files,sender,subject,bodyMeta,sentMeta,opened,metaPin,modKey,bodyText,bodyHTML,metaType,metaStatus,encryptionKey,bdRcpt,sndrMod,fromExtra,function(messaged){
		var dat = {'messaged': messaged, 'modKey': modKey};
		callback(dat);
	});

}

//encrypt email with pin to outside users
function encryptWithPin(value,pin,callback) {
	var d = new Date();
	var pki = forge.pki;

	var publicKey=false;
	var encryptionKey=forge.pkcs5.pbkdf2(SHA512(pin), '', 256, 32);

	var recipient=to64(recipientHandler('getTextEmail',value['mail']));
	var sender=to64(createFrom());
	var subject=to64(stripHTML($('#subj').val()).substring(0, 150));
	var bodyMeta=to64(stripHTML($('#emailbody').code()).substring(0, 100));
	var sentMeta=Math.round(d.getTime() / 1000);
	var opened=true;
	var metaPin='';
	var metaStatus='';
	var metaType='';
	var modKey=makeModKey(UserSalt);

	var bodyText=to64(stripHTML($('#emailbody').code()));
	var bodyHTML=to64(filterXSS($('#emailbody').code()));
	var bdRcpt='';
	var sndrMod='';
	var fromExtra = '';
	var files=fileObject;

	createMessage(publicKey,recipient,files,sender,subject,bodyMeta,sentMeta,opened,metaPin,modKey,bodyText,bodyHTML,metaType,metaStatus,encryptionKey,bdRcpt,sndrMod,fromExtra,function(messaged){
		messaged['from']=createFrom();
		messaged['pinHash'] = SHA512(pin);
		messaged['to'] = recipientHandler('getTextEmail',value['mail']);

		var dat = {'messaged': messaged, 'modKey': modKey};
		callback(dat);
	});
	//----------------

}

//send clear text message to outside
function encryptWithoutPin(value,callback) {
	var d = new Date();
	var publicKey=false;

	var recipient=to64(recipientHandler('getTextEmail',value['mail']));
	var sender=to64(createFrom());
	var subject=to64(stripHTML($('#subj').val()).substring(0, 150));
	var bodyMeta=to64(stripHTML($('#emailbody').code()).substring(0, 100));
	var sentMeta=Math.round(d.getTime() / 1000);
	var opened=true;
	var metaPin=Math.floor(Math.random() * 90000) + 10000;

	var encryptionKey=forge.pkcs5.pbkdf2(metaPin.toString(), forge.random.getBytesSync(128), 256, 32);

	var metaStatus='';
	var metaType='received';
	var modKey=makeModKey(UserSalt);
	var bodyText=to64(stripHTML($('#emailbody').code()));
	var bodyHTML=to64(filterXSS($('#emailbody').code()));
	var bdRcpt='';
	var fromExtra = '';
	var sndrMod='';

	var files=fileObject;

	createMessage(publicKey,recipient,files,sender,subject,bodyMeta,sentMeta,opened,metaPin,modKey,bodyText,bodyHTML,metaType,metaStatus,encryptionKey,bdRcpt,sndrMod,fromExtra,function(messaged){
		messaged['key'] = forge.util.bytesToHex(encryptionKey);
		callback(messaged);
	});
}


function encryptMessageToRecipient(emailparsed) {

	var senderMod = [];
	var badRcpt = [];
	var pki = forge.pki;
	var promises = [];


	$.each(emailparsed['indomain'], function (index, value) { // indomain submission
		var dfd = $.Deferred();

		if (value['mailK'] != '' && value['mailK'] != null) { //if have pub keys

			indoCrypt(value,function(sendMessage){
			SendMailMail(sendMessage,pki.publicKeyFromPem(from64(value['mailK'])),0,function(mailId,seedId,seedModKey){
				//console.log(mailId);
				//console.log(seedId);

				if (!isNaN(seedId)) {
					//console.log(result);
					var elem = {'mailId': mailId, 'seedId': seedId, 'rcpt': recipientHandler('getTextEmail',value['mail']),'email':value['mail'], 'mailModKey': sendMessage['modKey'], 'seedModKey': seedModKey};
					//console.log(elem);
					senderMod.push(elem);
					dfd.resolve();

				} else {
					var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Failed to send.','reason':result};
					badRcpt.push(rcp);
					dfd.resolve();
				}

			});
			});
		}
		if (value['mailK'] == "" || value['mailK'] == null) {
			var key = forge.random.getBytesSync(32);

			indoCryptFail(value, key,function(sendMessage){

				var mailId = SendMailFail(sendMessage).always(function (result) {
					if (!isNaN(result['messageId']) || isValidHex(result['messageId'])) {
						folder['Inbox'][result['messageId']] = {'p': forge.util.bytesToHex(key), 'opened': false};
						checkFolders();
						var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'answer': 'Recipient not found.','reason':{'answer':'recipient not found'}};
						badRcpt.push(rcp);
						dfd.resolve();
					} else {
						var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Failed to send.','reason':result};
						badRcpt.push(rcp);
						dfd.resolve();
					}

				});
			});

		}

		promises.push(dfd);
	});
	$.each(emailparsed['outdomain'], function (index, value) { // outdomain submission

		var dfd1 = $.Deferred();

		if ($('#pincheck').prop("checked")) {

			var pin=recipient[value['mail']]['pin'];
			encryptWithPin(value,pin,function(sendMessage){

				SendMailOut(sendMessage).always(function (result) {

					//console.log(result);
					if (!isNaN(result['messageId'])) {
						//console.log(result);
						var elem = {'mailId': result['messageId'], 'rcpt': recipientHandler('getTextEmail',value['mail']),'email':value['mail'], 'mailModKey': sendMessage['modKey']};
						senderMod.push(elem);
						dfd1.resolve();

					} else {
						var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Failed to send.','reason':result};
						badRcpt.push(rcp);
						noAnswer('Failed to send to one of recipients');
						dfd1.resolve();

					}

				});
			});



		} else {

			encryptWithoutPin(value,function(sendMessage){

				SendMailOutNoPin(sendMessage).always(function (result) {
					if (!isNaN(result['messageId'])) {
						var elem = {'mailId': result['messageId'], 'rcpt': recipientHandler('getTextEmail',value['mail']),'email':value['mail'], 'mailModKey': sendMessage['ModKey']};
						senderMod.push(elem);
						dfd1.resolve();
					} else {
						var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Failed to send.','reason':result};
						badRcpt.push(rcp);
						noAnswer('Failed to send to one of recipients');
						dfd1.resolve();

					}
				});
			});

		}
		promises.push(dfd1);
	});

	$.when.apply(undefined, promises).then(function () {
		var rec = $('#toRcpt').select2("val");

		if (rec.length == Object.keys(badRcpt).length) {
			if(badRcpt[0]['reason']['answer']!=undefined && badRcpt[0]['reason']['answer']!="Limit is reached"){
				noAnswer('Please check recipient(s) address(es) and try again.');
			}
			$('.sendMailButton').html('Send');
			$('.sendMailButton').prop('disabled', false);

		} else if (Object.keys(badRcpt).length > 0) {
			var key = forge.random.getBytesSync(32);

			encryptMessageForSent(badRcpt, senderMod, key,function(sendMessage){
				var mailId = SaveMailInSent(sendMessage).always(function (result) {
					if (!isNaN(result['messageId']) || isValidHex(result['messageId'])) {

						folder['Sent'][result['messageId']] = {'p': forge.util.bytesToHex(key), 'opened': false};

						delete folder['Draft'][result['messageId']];

						checkFolders();
						omgAnswer('<span style="">Email sent but with some errors. See message in "Sent" folder for details.</span>');
						$('.sendMailButton').html('Send');
						$('.sendMailButton').prop('disabled', false);
					} else {
						noAnswer('<span style="">Email sent with error. Unable to move message to Sent folder. Please report a bug.</span>');
						$('.sendMailButton').html('Send');
						$('.sendMailButton').prop('disabled', false);
					}
				});
				getDataFromFolder('Inbox');
			});

		} else if (Object.keys(badRcpt).length == 0 && rec.length == senderMod.length) {
			var key = forge.random.getBytesSync(32);

			encryptMessageForSent(badRcpt, senderMod, key,function(sendMessage){
				var mailId = SaveMailInSent(sendMessage).always(function (result) {


					if (!isNaN(result['messageId']) || isValidHex(result['messageId'])) {

						folder['Sent'][result['messageId']] = {'p': forge.util.bytesToHex(key), 'opened': true};
						delete folder['Draft'][message['mailHash']];

						if (Object.keys(senderMod).length > 0) {
							$.each(senderMod, function (index, value) {
								var temail = value['email']
								var name = recipient[value['email']]['name'];
								contacts[temail] = {'name': name, 'pin': recipient[temail]['pin']};
							});

						}

						checkContacts();
						checkFolders();

						Answer('Email sent');
						$('.sendMailButton').html('Send');
						$('.sendMailButton').prop('disabled', false);
						readMailclean();
						getDataFromFolder('Inbox');

					} else {
						if (Object.keys(senderMod).length > 0) {
							$.each(senderMod, function (index, value) {
								var temail = value['email']
								var name = recipient[value['email']]['name']
								contacts[temail] = {'name': name, 'pin': recipient[temail]['pin']};
							});
						}

						checkContacts();

						noAnswer('<span style="">Email sent with error. Unable to move message to Sent folder. Please report a bug.</span>');
						$('.sendMailButton').html('Send');
						$('.sendMailButton').prop('disabled', false);
						getDataFromFolder('Inbox');

					}

				});
			});

		}

	});

	clearInterval(mailt);

}

function SaveMailInSent(messaged) {
	return $.ajax({
		type: "POST",
		url: '/saveMailInSent',
		data: {
			'message': messaged
		},
		success: function (data, textStatus) {
			return data;
		},
		error: function (data, textStatus) {
		},
		dataType: 'json'
	});

}

function SendMailMail(messaged,mailPubKey,count,callback) {
	var pki = forge.pki;
	if(count<2){
		messaged['messaged']['messageId']=forge.util.bytesToHex(forge.random.getBytesSync(64));
		//var prePub = messaged['modKey'];

		var seedMeta={
			'mailId':messaged['messaged']['messageId'],
			'mailModKey':messaged['modKey'],
			'seedModKey':forge.util.bytesToHex(forge.random.getBytesSync(16))

		};
		var metaKey = forge.random.getBytesSync(32);
		var seedMetaAes=toAes(metaKey, JSON.stringify(seedMeta));
		var seedPassword=addPaddingToString(forge.util.bytesToHex(mailPubKey.encrypt(metaKey, 'RSA-OAEP')));

		var seedData={
			'seedMeta':seedMetaAes,
			'seedPassword':seedPassword
		};
		messaged['messaged']['seedMeta']=seedMetaAes;
		messaged['messaged']['seedPassword']=seedPassword;
		messaged['messaged']['seedModKey']=SHA512(seedMeta['seedModKey']);
		var rcp=SHA512(pki.publicKeyToPem(mailPubKey));
		messaged['messaged']['seedRcpnt']=rcp.substr(0,10);
		count++;

		//SendMailMail(messaged,mailPubKey,count,callback);

		$.ajax({
			type: "POST",
			url: '/sendLocalMessage',
			data: messaged['messaged'],

			success: function (data, textStatus) {
				if(!isNaN(data['messageId']))
				{
					callback(seedMeta['mailId'],data['messageId'],seedMeta['seedModKey']);
				}else if(data.answer=="Limit is reached"){
					noAnswer('You\'ve reached the maximum of emails per hour of ('+roleData['role']['emailsPerHour']+'). Please try again later.');
				}else if(data['messageId']=="duplicate"){
					SendMailMail(messaged,mailPubKey,count,callback);
				}else{
					callback(data);
				}

			},
			error: function (data, textStatus) {
				callback(data);
			},
			dataType: 'json'
		});

	}else{
		systemMessage('tryAgain');
		$('.sendMailButton').html('Send');
		$('.sendMailButton').prop('disabled', false);
	}

}


function SendMailOutNoPin(messaged) {
	return $.ajax({
		type: "POST",
		url: '/sendOutMessageNoPin',
		data: {
			'message': messaged
		},
		success: function (data, textStatus) {
			if(data.answer=="Limit is reached"){
				noAnswer('You\'ve reached the maximum of emails per hour of ('+roleData['role']['emailsPerHour']+'). Please try again later.');
			}
			return data;
		},
		error: function (data, textStatus) {
		},
		dataType: 'json'
	});

}


function SendMailOut(messaged,count,callback) {

	messaged['messaged']['messageId']=forge.util.bytesToHex(forge.random.getBytesSync(64));

	return $.ajax({
		type: "POST",
		url: '/sendOutMessagePin',
		data: messaged['messaged'],
		success: function (data, textStatus) {
			if(data.answer=="Limit is reached"){
				noAnswer('You\'ve reached the maximum of emails per hour of ('+roleData['role']['emailsPerHour']+'). Please try again later.');
			}
			return data;
		},
		error: function (data, textStatus) {
		},
		dataType: 'json'
	});

}

function SendMailFail(messaged) {
	return $.ajax({
		type: "POST",
		url: '/sendLocalMessageFail',
		data: {
			'message': messaged
		},
		success: function (data, textStatus) {
			return data;
		},
		error: function (data, textStatus) {
		},
		dataType: 'json'
	});

}

function indomainLoop(emailparsed, locmails, dataBack) {

	$.each(locmails, function (index, value) {
		if (dataBack[value]) {
			//emailparsed['indomain'][index]['seedK'] = dataBack[value]['seedKey'];
			emailparsed['indomain'][index]['mailK'] = dataBack[value]['mailKey'];
		}//else{
		//	indomainNotice(emailparsed['indomain'][index]['mail'],emailparsed,locmails,dataBack,index);
		//	//return false;
		//}

	});
	return emailparsed['indomain'];
	//console.log(emailparsed);
}


function composeMailRecptCheck() {
//	console.log(contacts);

	if (typeof(contacts) === 'string') {
		contacts = {};
	}
	//console.log(Object.keys(folder));

	$("#atachFiles").select2({
		tags: [],
		placeholder: "5 files max, <=15Mb",
		tokenSeparators: [""],
		maximumSelectionSize: 5,
		formatSelectionTooBig: 'Max of 5 files allowed.',
		formatSelection: fileSelection

	});

	$("#atachFiles").on("select2-selecting", function (e) {
		e.preventDefault();
	});

	$("#atachFiles").on("select2-removed", function (e) {

		//console.log(from64(fileObject[to64(e.val)]['size']));
		fileSize -= from64(fileObject[to64(e.val)]['size']);

		delete fileObject[to64(e.val)];
		//$('#atachFiles').select2('val', Object.keys(fileObject));
		//e.preventDefault();
		//alert(e.val); // Got Remove Value
	});
	var con = [];

	if (Object.keys(contacts).length > 0) {
		$.each(contacts, function (index, value) {

			if (value['name'] != "")
				var el = value['name'] + '<' + index + '>';
			else
				var el = index;
			con.push(el);
		});
	}

	//console.log(Object.keys(contacts));


	$("#toRcpt").select2({
		tags: con,
		placeholder: "All recipients will receive blind carbon copy.",
		tokenSeparators: [";"],
		minimumInputLength: 2,
		maximumInputLength: 250,
		maximumSelectionSize: roleData['role']['recepientPerMail'],
		formatSelectionTooBig: 'Your plan is limited to ' + roleData['role']['recepientPerMail'] + ' recipients per email. Please upgrade plan to raise limit.',
		formatSelection: emailSelection
	});

	$('#toRcpt').on('select2-removed', function (event) {

		var t = event.val.toLowerCase();

		parseEmail(event.val, function (result) {
			var email = result['email'];

			recipientHandler('delete', email);
		});

	});

	$('#toRcpt').on("select2-selecting", function (e) {

		parseEmail(e.val, function (result) {
			if (!IsEmail(result['email'])) {
				e.preventDefault();
			} else {
				recipientHandler('add',e.val);
			}

		});
	});

}

function addPinCard(name, email, pin) {

	if (name != '')
		var comaddr = name + ' &lt;' + email + '&gt;';
	else
		var comaddr = email;

	var mailD = email.split('@');
	var dom=[];
	dom.push(SHA512(mailD[1]));

	getLocalDomains(dom,function(localDomains){
		if (jQuery.inArray(mailD[1], localDomains) == -1) {

			var dataContent = '<p class=\'brekwords\'><b>' + name + '</b><br>' + email + '</p>';
			var inpField = '<label class="input"><input class="col col-xs-12 agred-pin" name="pinm" id="pin_' + SHA256(email) + '" type="text" placeholder="Agreed PIN"></label>';

			var card = '<div class="well well-sm" id="' + SHA256(email) + '" rel="popover-hover" data-placement="top" data-original-title="" data-content="' + dataContent + '"><p class="pins">' + comaddr + '</p>' + inpField + '<br></div>';

			$('#email-pin-form').append(card);

			$('#pin_' + SHA256(email)).val(pin);

			$("[rel=popover-hover]").popover({
				trigger: "hover",
				html: true
			});

		}
	});

}

function recipientHandler(action, email,callback) {

	if (action == 'getTextEmail') {
		if(recipient[email]['name']!=''){
			var res=recipient[email]['name']+'<'+email+'>';
		}else{
			var res=email;
		}
		return res;
	}
	if (action == 'add') {

		parseEmail(email, function (result) {
			var mail = result['email'];
			var name = result['name'];

			if (contacts[mail] == undefined) {
				var pin = '';
			} else {
				var pin = contacts[mail]['pin'] != undefined ? contacts[mail]['pin'] : '';
			}

			recipient[mail] = {'name': name, 'pin': pin};
			addPinCard(name, mail, pin);

		});


	}

	if (action == 'delete') {
		$('#' + SHA256(email)).remove();
		delete recipient[email];

	}

	if (action == 'getListForPin') {
		var dom=[];
		$.each(recipient, function (index, value) {
			var mailD = index.split('@');
			dom.push(SHA512(mailD[1]));
		});
		getLocalDomains(dom,function(localDomains){
		var result = {};
		$.each(recipient, function (index, value) {
			var mailD = index.split('@');
				if (jQuery.inArray(mailD[1], localDomains) == -1) {
					result[index] = {'name': value['name'] != '' ? to64(value['name']) : '', 'pin': to64(value['pin'])};

				}


		});
			callback(result);
		});
	}
	if (action == 'getPinsFromCards') {
		$.each(recipient, function (index, value) {
			recipient[index]['pin'] = $('#pin_' + SHA256(index)).val();
		});
	}

	if (action == 'getList') {
		var result = [];
		$.each(recipient, function (index, value) {
			result.push(value['name'] != '' ? value['name'] + '<' + index + '>' : index);
		});
		return result;
	}

	if (action == 'populateList') {

		$.each(email, function (index, value) {

			parseEmail(value, function (result) {
				var email = result['email'];

				if (contacts[email] == undefined) {
					var name = result['name'];
					var pin = '';
				} else {
					if (contacts[email]['name'] == '') {
						var name = result['name'];
					} else {
						var name = contacts[email]['name'];
					}
					var pin = contacts[email]['pin'] != undefined ? contacts[email]['pin'] : '';
				}
				recipient[email] = {'name': name, 'pin': pin};
				addPinCard(name, email, pin);

			});


		});

	}
}
