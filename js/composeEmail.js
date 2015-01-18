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
				['insert', ['link']], // no insert buttons
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

function emailParser(emails) {
	var emailObj = [];
	emailObj['indomain'] = {};
	emailObj['outdomain'] = {};

	var ind = {}, out = {}, indomain = [], outdomain = [];
	var mail;

	$.each(emails, function (index, value) {
		parseEmail(value, function (result) {
			var name = result['name'];
			var email = result['email'];

			mailD = email.split('@');

			if (jQuery.inArray(mailD[1], domains) != -1) {
				//console.log(mail);
				ind.mail = email;
				ind.seedK = '';
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
	return emailObj
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
			$('#pincheck').prop("checked",false)
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

				var emailparsed = emailParser(emails);

				var dfd = $.Deferred();
				var dfd1 = $.Deferred();

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
						emailparsed['outdomain'][index].pin = $('#emailPin b').text();
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

			}


		}, function () {

		});

	} else {
		noAnswer('Please provide PIN for all emails.');
	}

}

//encrypt message in same domain
function indoCrypt(value) {
	var d = new Date();
	var pki = forge.pki;

	var key = forge.random.getBytesSync(32);
	var mailPubKey = pki.publicKeyFromPem(from64(value['mailK']));

	var emailPreObj = {
		'to': '',
		'from': '',
		'subj': '',
		'meta': {},
		'body': {},
		'attachment': {},
		'modKey': '',
		'mailId': ''
	};
	messaged = {};

	emailPreObj['to'] = recipientHandler('getTextEmail',value['mail']);
	emailPreObj['from'] = profileSettings['email'];
	emailPreObj['subj'] = stripHTML($('#subj').val()).substring(0, 150);
	emailPreObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};
	emailPreObj['attachment'] = {};


	emailPreObj['meta']['subject'] = stripHTML($('#subj').val()).substring(0, 150);
	emailPreObj['meta']['body'] = stripHTML(emailPreObj['body']['text']).substring(0, 100);

	if (Object.keys(fileObject).length > 0) {
		emailPreObj['meta']['attachment'] = 1;
		messaged['files'] = [];
		$.each(fileObject, function (index, value) {
			var fname = SHA512(value['name'] + emailPreObj['to'] + Math.round(d.getTime() / 1000) + d.getTime());
			emailPreObj['attachment'][index] = {'name': value['name'], 'type': value['type'], 'filename': to64(fname), 'size': value['size'], 'base64': true};

			var el = {'fname': fname, 'data': toAesBinary(key, value['data'])};
			messaged['files'].push(el);
		});

	} else {
		emailPreObj['meta']['attachment'] = '';
	}

	emailPreObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
	emailPreObj['meta']['opened'] = false;
	emailPreObj['meta']['pin'] = '';
	emailPreObj['meta']['modKey'] = makeModKey(userObj['saltS']);
	emailPreObj['meta']['type'] = 'received';
	emailPreObj['meta']['to'] = emailPreObj['to'];
	emailPreObj['modKey'] = emailPreObj['meta']['modKey'];


	emailPreObj['to'] = to64(recipientHandler('getTextEmail',value['mail']));
	emailPreObj['from'] = to64(profileSettings['email']);
	emailPreObj['subj'] = to64(emailPreObj['subj']);
	emailPreObj['body']['text'] = to64(emailPreObj['body']['text']);
	emailPreObj['body']['html'] = to64(emailPreObj['body']['html']);

	emailPreObj['meta']['subject'] = to64(emailPreObj['meta']['subject']);
	emailPreObj['meta']['body'] = to64(emailPreObj['meta']['body']);

	emailPreObj['meta']['to'] = to64(recipientHandler('getTextEmail',value['mail']));
	emailPreObj['meta']['from'] = to64(profileSettings['email']);


	var body = JSON.stringify(emailPreObj);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');

	emailPreObj['meta']['signature'] = forge.util.bytesToHex(mailPrivateKey.sign(md));
	var meta = JSON.stringify(emailPreObj['meta']);

	messaged['mail'] = toAes(key, body);
	messaged['meta'] = toAes(key, meta);

	messaged['ModKey'] = SHA512(emailPreObj['modKey']);

	messaged['key'] = forge.util.bytesToHex(mailPubKey.encrypt(key, 'RSA-OAEP'));

	var dat = {'messaged': messaged, 'modKey': emailPreObj['modKey']};
	return dat;

}

//message created when recipient not found
function indoCryptFail(value, key) {
	var d = new Date();
	var pki = forge.pki;

	var emailPreObj = {
		'to': '',
		'from': '',
		'subj': '',
		'meta': {},
		'body': {},
		'attachment': {},
		'modKey': '',
		'mailId': ''
	};
	messaged = {};

	emailPreObj['to'] = profileSettings['email'];
	emailPreObj['from'] = 'daemon@' + profileSettings['email'].split('@')[1];
	emailPreObj['subj'] = 'Failed to deliver message to ' + recipientHandler('getTextEmail',value['mail']); + '!: Subject: ' + stripHTML($('#subj').val()).substring(0, 50);

	emailPreObj['body'] = {'text': 'Server was unable to deliver your message because recipient does not exist in our database. <br> ' + stripHTML($('#emailbody').code()), 'html': 'Server was unable to deliver your message because recipient does not exist in our database. <br> ' + filterXSS($('#emailbody').code())};

	emailPreObj['attachment'] = {};
	emailPreObj['meta']['subject'] = emailPreObj['subj'];
	emailPreObj['meta']['body'] = stripHTML(emailPreObj['body']['text']).substring(0, 100);
	emailPreObj['meta']['attachment'] = '';
	emailPreObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
	emailPreObj['meta']['opened'] = false;
	emailPreObj['meta']['modKey'] = makeModKey(userObj['saltS']);
	emailPreObj['meta']['to'] = emailPreObj['to'];
	emailPreObj['modKey'] = emailPreObj['meta']['modKey'];
	emailPreObj['meta']['type'] = 'received';
	emailPreObj['meta']['status'] = 'warning';
	emailPreObj['meta']['pin'] = '';


	emailPreObj['to'] = to64(emailPreObj['to']);
	emailPreObj['from'] = to64(emailPreObj['from']);
	emailPreObj['subj'] = to64(emailPreObj['subj']);
	emailPreObj['body']['text'] = to64(emailPreObj['body']['text']);
	emailPreObj['body']['html'] = to64(emailPreObj['body']['html']);

	emailPreObj['meta']['subject'] = to64(emailPreObj['meta']['subject']);
	emailPreObj['meta']['body'] = to64(emailPreObj['meta']['body']);
	emailPreObj['meta']['to'] = to64(emailPreObj['meta']['to']);
	emailPreObj['meta']['from'] = to64(profileSettings['email']);


	var body = JSON.stringify(emailPreObj);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');

	emailPreObj['meta']['signature'] = forge.util.bytesToHex(sigPrivateKey.sign(md));
	var meta = JSON.stringify(emailPreObj['meta']);

	messaged['mail'] = toAes(key, body);
	messaged['meta'] = toAes(key, meta);

	messaged['newModKey'] = SHA512(emailPreObj['modKey']);

	messaged['key'] = forge.util.bytesToHex(sigPubKey.encrypt(key, 'RSA-OAEP'));

	//console.log(emailPreObj);
	//var dat={'messaged':messaged}
	return messaged;

}

//encrypt email with pin to outside users
function encryptWithPin(value) {

	//recipientHandler('getTextEmail',value['mail']);

	var pin = recipient[value['mail']]['pin'];

	var d = new Date();
	var pki = forge.pki;

	//var salt = forge.random.getBytesSync(128);
	var key = forge.pkcs5.pbkdf2(SHA512(pin), '', 256, 32);

	var emailPreObj = {
		'to': '',
		'from': '',
		'subj': '',
		'meta': {},
		'body': {},
		'attachment': {},
		'modKey': '',
		'mailId': ''
	};
	messaged = {};

	emailPreObj['to'] = recipientHandler('getTextEmail',value['mail']);
	emailPreObj['from'] = profileSettings['email'];
	emailPreObj['subj'] = stripHTML($('#subj').val()).substring(0, 150);
	emailPreObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};

	emailPreObj['attachment'] = {};
	emailPreObj['meta']['subject'] = stripHTML($('#subj').val()).substring(0, 150);
	emailPreObj['meta']['body'] = stripHTML(emailPreObj['body']['text']).substring(0, 50);

	if (Object.keys(fileObject).length > 0) {
		emailPreObj['meta']['attachment'] = 1;
		messaged['files'] = [];
		$.each(fileObject, function (index, value) {
			var fname = SHA512(value['name'] + emailPreObj['to'] + Math.round(d.getTime() / 1000) + d.getTime());
			emailPreObj['attachment'][index] = {'name': value['name'], 'type': value['type'], 'filename': to64(fname), 'size': value['size'], 'base64': true};
			var el = {'fname': fname, 'data': toAesBinary(key, value['data'])};
			messaged['files'].push(el);
		});

	} else {
		emailPreObj['meta']['attachment'] = '';
	}

	emailPreObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
	emailPreObj['meta']['opened'] = true;
	emailPreObj['meta']['modKey'] = makeModKey(userObj['saltS']);
	emailPreObj['meta']['to'] = emailPreObj['to'];
	emailPreObj['modKey'] = emailPreObj['meta']['modKey'];


	emailPreObj['to'] = to64(emailPreObj['to']);
	emailPreObj['from'] = to64(emailPreObj['from']);
	emailPreObj['subj'] = to64(emailPreObj['subj']);
	emailPreObj['body']['text'] = to64(emailPreObj['body']['text']);
	emailPreObj['body']['html'] = to64(emailPreObj['body']['html']);


	emailPreObj['meta']['subject'] = to64(emailPreObj['meta']['subject']);
	emailPreObj['meta']['body'] = to64(emailPreObj['meta']['body']);
	emailPreObj['meta']['to'] = to64(emailPreObj['meta']['to']);
	emailPreObj['meta']['from'] = to64(profileSettings['email']);
	var body = JSON.stringify(emailPreObj);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');

	emailPreObj['meta']['signature'] = forge.util.bytesToHex(sigPrivateKey.sign(md));
	var meta = JSON.stringify(emailPreObj['meta']);

	messaged['mail'] = toAes(key, body);
	messaged['meta'] = toAes(key, meta);
	messaged['from'] = profileSettings['email'];
	messaged['to'] = recipientHandler('getTextEmail',value['mail']);
	messaged['pinHash'] = SHA512(pin);
	messaged['ModKey'] = SHA512(emailPreObj['modKey']);

	//console.log(emailPreObj);

	return messaged;

}

//send clear text message to outside
function encryptWithoutPin(value) {

	var d = new Date();
	//var pki = forge.pki;

	var pin = Math.floor(Math.random() * 90000) + 10000;
	var salt = forge.random.getBytesSync(128);
	var key = forge.pkcs5.pbkdf2(pin.toString(), salt, 256, 32);


	var emailPreObj = {
		'to': '',
		'from': '',
		'subj': '',
		'meta': {},
		'body': {},
		'attachment': {},
		'modKey': '',
		'mailId': ''
	};
	messaged = {};

	emailPreObj['to'] = recipientHandler('getTextEmail',value['mail']);;
	emailPreObj['from'] = profileSettings['email'];
	emailPreObj['subj'] = stripHTML($('#subj').val()).substring(0, 150);
	emailPreObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};
	emailPreObj['attachment'] = {};
	emailPreObj['meta']['subject'] = stripHTML($('#subj').val()).substring(0, 150)
	emailPreObj['meta']['body'] = stripHTML(emailPreObj['body']['text']).substring(0, 100);

	if (Object.keys(fileObject).length > 0) {
		emailPreObj['meta']['attachment'] = 1;
		messaged['files'] = [];
		$.each(fileObject, function (index, value) {
			var fname = SHA512(value['name'] + emailPreObj['to'] + Math.round(d.getTime() / 1000) + d.getTime());
			emailPreObj['attachment'][index] = {'name': value['name'], 'type': value['type'], 'filename': to64(fname), 'size': value['size'], 'base64': true};

			var el = {'fname': fname, 'data': toAesBinary(key, value['data'])};
			messaged['files'].push(el);
		});

	} else {
		emailPreObj['meta']['attachment'] = '';
	}

	emailPreObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
	emailPreObj['meta']['opened'] = true;
	emailPreObj['meta']['modKey'] = makeModKey(userObj['saltS']);
	emailPreObj['meta']['to'] = emailPreObj['to'];
	emailPreObj['modKey'] = emailPreObj['meta']['modKey'];

	emailPreObj['to'] = to64(emailPreObj['to']);
	emailPreObj['from'] = to64(emailPreObj['from']);
	emailPreObj['subj'] = to64(emailPreObj['subj']);
	emailPreObj['body']['text'] = to64(emailPreObj['body']['text']);
	emailPreObj['body']['html'] = to64(emailPreObj['body']['html']);

	emailPreObj['meta']['subject'] = to64(emailPreObj['meta']['subject']);
	emailPreObj['meta']['body'] = to64(emailPreObj['meta']['body']);
	emailPreObj['meta']['to'] = to64(emailPreObj['meta']['to']);
	emailPreObj['meta']['from'] = to64(profileSettings['email']);

	var body = JSON.stringify(emailPreObj);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');

	emailPreObj['meta']['signature'] = forge.util.bytesToHex(sigPrivateKey.sign(md));
	var meta = JSON.stringify(emailPreObj['meta']);

	messaged['mail'] = toAes(key, body);
	messaged['meta'] = toAes(key, meta);

	messaged['key'] = forge.util.bytesToHex(key);

	messaged['ModKey'] = SHA512(emailPreObj['modKey']);

	return messaged;

}

//save message in sent folder
function encryptMessageForSent(badRcpt, senderMod, key) {
	var d = new Date();
	var pki = forge.pki;

	var emailPreObj = {
		'to': '',
		'from': '',
		'subj': '',
		'meta': {},
		'body': {},
		'attachment': {},
		'modKey': '',
		'badRcpt': {},
		'senderMod': {},
		'mailId': ''
	};
	messaged = {};

	emailPreObj['to'] = recipientHandler('getList', '');

	emailPreObj['from'] = profileSettings['email'];
	emailPreObj['subj'] = stripHTML($('#subj').val()).substring(0, 150);
	emailPreObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};
	emailPreObj['attachment'] = {};

	emailPreObj['meta']['subject'] = emailPreObj['subj'];
	emailPreObj['meta']['body'] = stripHTML(emailPreObj['body']['text']).substring(0, 100);

	if (Object.keys(fileObject).length > 0) {
		emailPreObj['meta']['attachment'] = 1;
		messaged['files'] = [];
		$.each(fileObject, function (index, value) {
			var fname = SHA512(value['name'] + emailPreObj['to'] + Math.round(d.getTime() / 1000) + d.getTime());
			emailPreObj['attachment'][index] = {'name': value['name'], 'type': value['type'], 'filename': to64(fname), 'size': value['size'], 'base64': true};

			var el = {'fname': fname, 'data': toAesBinary(key, value['data'])};
			messaged['files'].push(el);
		});

	} else {
		emailPreObj['meta']['attachment'] = '';
	}

	emailPreObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
	emailPreObj['meta']['opened'] = false;
	emailPreObj['meta']['type'] = 'sent';

	if ($('#pincheck').prop("checked")) {
		emailPreObj['meta']['pin'] = JSON.stringify(recipientHandler('getListForPin', ''));
	} else {
		emailPreObj['meta']['pin'] = '';
	}

	if (Object.keys(badRcpt).length > 0) {
		emailPreObj['meta']['status'] = 'warning';
	} else {
		emailPreObj['meta']['status'] = 'normal';
	}

	emailPreObj['badRcpt'] = badRcpt;
	emailPreObj['senderMod'] = senderMod;

	emailPreObj['meta']['modKey'] = makeModKey(userObj['saltS']);
	emailPreObj['meta']['to'] = recipientHandler('getList', '');

	emailPreObj['modKey'] = emailPreObj['meta']['modKey'];


	emailPreObj['to'] = to64(emailPreObj['to']);
	emailPreObj['from'] = to64(emailPreObj['from']);
	emailPreObj['subj'] = to64(emailPreObj['subj']);
	emailPreObj['body']['text'] = to64(emailPreObj['body']['text']);
	emailPreObj['body']['html'] = to64(emailPreObj['body']['html']);

	emailPreObj['meta']['subject'] = to64(emailPreObj['meta']['subject']);
	emailPreObj['meta']['body'] = to64(emailPreObj['meta']['body']);
	emailPreObj['meta']['to'] = to64(emailPreObj['meta']['to']);
	emailPreObj['meta']['from'] = to64(profileSettings['email']);

	//console.log(emailPreObj);

	var body = JSON.stringify(emailPreObj);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');

	emailPreObj['meta']['signature'] = forge.util.bytesToHex(sigPrivateKey.sign(md));
	var meta = JSON.stringify(emailPreObj['meta']);

	messaged['mail'] = toAes(key, body);
	messaged['meta'] = toAes(key, meta);


	messaged['newModKey'] = SHA512(emailPreObj['modKey']);
	modKeys.push(messaged['newModKey']);

	messaged['mailHash'] = message['mailHash'];


	if (modKeys.length > 1) {
		messaged['oldModKey'] = modKeys[modKeys.length - 2];
	} else {
		messaged['oldModKey'] = 'empty';
	}

	//var dat={'messaged':messaged}
	return messaged;
}


function encryptMessageToRecipient(emailparsed) {

	var senderMod = [];
	var badRcpt = [];
	var pki = forge.pki;
	var promises = [];


	$.each(emailparsed['indomain'], function (index, value) { // indomain submission
		var dfd = $.Deferred();

		if (value['seedK'] != '') { //if have pub keys
			var sendMessage = indoCrypt(value);
			//console.log(sendMessage);

			var seedPubKey = pki.publicKeyFromPem(from64(value['seedK']));
			var prePub = sendMessage['modKey'];
			var cryptedPub = {'modKeySeed': SHA512(prePub), 'seedMeta': forge.util.bytesToHex(seedPubKey.encrypt(forge.util.hexToBytes(prePub), 'RSA-OAEP'))};

			var mailId = SendMailMail(sendMessage['messaged'],cryptedPub).always(function (result) {

				if (!isNaN(result['messageId'])) {
					//console.log(result);
					var elem = {'mailId': result['messageId'], 'seedId': result['messageId'], 'rcpt': recipientHandler('getTextEmail',value['mail']),'email':value['mail'], 'mailModKey': sendMessage['modKey'], 'seedModKey': prePub};
							senderMod.push(elem);
							dfd.resolve();

				} else {
					var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Failed to send.','reason':result};
					badRcpt.push(rcp);
					dfd.resolve();
				}
			});
		}
		if (value['seedK'] == "") {
			var key = forge.random.getBytesSync(32);

			var sendMessage = indoCryptFail(value, key);
			var mailId = SendMailFail(sendMessage).always(function (result) {
				if (!isNaN(result['messageId'])) {

					folder['Inbox'][result['messageId']] = {'p': forge.util.bytesToHex(key), 'opened': false};

					checkFolders();
					var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Recipient not found.'};
					badRcpt.push(rcp);
					dfd.resolve();
				} else {
					var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Failed to send.'};
					badRcpt.push(rcp);
					dfd.resolve();
				}

			});

			//	console.log(sendMessage);
		}

		promises.push(dfd);
	});
	$.each(emailparsed['outdomain'], function (index, value) { // outdomain submission

		var dfd1 = $.Deferred();

		if ($('#pincheck').prop("checked")) {
			var sendMessage = encryptWithPin(value);

			var mailId = SendMailOut(sendMessage).always(function (result) {
				if (!isNaN(result['messageId'])) {
					var elem = {'mailId': result['messageId'], 'rcpt': recipientHandler('getTextEmail',value['mail']),'email':value['mail'], 'mailModKey': sendMessage['ModKey']};
					senderMod.push(elem);
					dfd1.resolve();
				} else {
					var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Failed to send.','reason':result};
					badRcpt.push(rcp);
					dfd1.resolve();
				}
			});

		} else {

			var sendMessage = encryptWithoutPin(value);

			var mailId = SendMailOutNoPin(sendMessage).always(function (result) {
				if (!isNaN(result['messageId'])) {
					var elem = {'mailId': result['messageId'], 'rcpt': recipientHandler('getTextEmail',value['mail']),'email':value['mail'], 'mailModKey': sendMessage['ModKey']};
					senderMod.push(elem);
					dfd1.resolve();
				} else {
					var rcp = {'mail': recipientHandler('getTextEmail',value['mail']), 'message': 'Failed to send.','reason':result};
					badRcpt.push(rcp);
					dfd1.resolve();
				}
			});

		}
		promises.push(dfd1);
	});

	$.when.apply(undefined, promises).then(function () {

		var rec = $('#toRcpt').select2("val");

		if (rec.length == Object.keys(badRcpt).length) {
			if(badRcpt[0]['reason']['answer']!="Limit is reached"){
				noAnswer('Please check recipient(s) address(es) and try again.');
			}
			$('.sendMailButton').html('Send');
			$('.sendMailButton').prop('disabled', false);

		} else if (Object.keys(badRcpt).length > 0) {
			var key = forge.random.getBytesSync(32);

			var sendMessage = encryptMessageForSent(badRcpt, senderMod, key);

			var mailId = SaveMailInSent(sendMessage).always(function (result) {
				if (!isNaN(result['messageId'])) {

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
		} else if (Object.keys(badRcpt).length == 0 && rec.length == senderMod.length) {
			var key = forge.random.getBytesSync(32);

			var sendMessage = encryptMessageForSent(badRcpt, senderMod, key);

			var mailId = SaveMailInSent(sendMessage).always(function (result) {


				if (!isNaN(result['messageId'])) {

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
					$('#sendMaildiv').css('display', 'none');
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

function SendMailOutNoPin(messaged) {
	return $.ajax({
		type: "POST",
		url: '/sendOutMessageNoPin',
		data: {
			'message': messaged
		},
		success: function (data, textStatus) {
			if(data.answer=="Limit is reached"){
				noAnswer('You\'ve reached maximum email per hour of ('+roleData['role']['emailsPerHour']+'). Please try again later.');
			}
			return data;
		},
		error: function (data, textStatus) {
		},
		dataType: 'json'
	});

}


function SendMailOut(messaged) {
	return $.ajax({
		type: "POST",
		url: '/sendOutMessagePin',
		data: {
			'message': messaged
		},
		success: function (data, textStatus) {
			if(data.answer=="Limit is reached"){
				noAnswer('You\'ve reached maximum email per hour of ('+roleData['role']['emailsPerHour']+'). Please try again later.');
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

function SendMailMail(messaged,seedPart) {

	return $.ajax({
		type: "POST",
		url: '/sendLocalMessage',
		data: {
			'message': messaged,
			'seedPart':seedPart
		},
		success: function (data, textStatus) {
			if(data.answer=="Limit is reached"){
				noAnswer('You\'ve reached maximum email per hour of ('+roleData['role']['emailsPerHour']+'). Please try again later.');
			}
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
			emailparsed['indomain'][index]['seedK'] = dataBack[value]['seedKey'];
			emailparsed['indomain'][index]['mailK'] = dataBack[value]['mailKey'];
		}//else{
		//	indomainNotice(emailparsed['indomain'][index]['mail'],emailparsed,locmails,dataBack,index);
		//	//return false;
		//}

	});
	return emailparsed['indomain'];
	//console.log(emailparsed);
}

function retrievePublicKeys(success, cancel, mails, emailparsed) {

	$.ajax({
		type: "POST",
		url: '/retrievePublicKeys',
		data: {'mails': JSON.stringify(mails)
		},
		success: function (data, textStatus) {
			if (typeof data.mail == "undefined") {
				//console.log(data);

				//emailparsed['indomain']=indomainLoop(emailparsed,mails,data);

				success(data);
			} else {
				$('.sendMailButton').html('Send');
				$('.sendMailButton').prop('disabled', false);
				noAnswer('Error. Please try again.');
			}

		},
		error: function (data, textStatus) {
			$('.sendMailButton').html('Send');
			$('.sendMailButton').prop('disabled', false);
			noAnswer('Error. Please try again.');
			cancel();

		},
		dataType: 'json'
	});
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
		tokenSeparators: [";", " "],
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

	if (jQuery.inArray(mailD[1], domains) == -1) {

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
}

function recipientHandler(action, email) {

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

		var result = {};
		$.each(recipient, function (index, value) {
			var mailD = index.split('@');
			if (jQuery.inArray(mailD[1], domains) == -1) {
				result[index] = {'name': value['name'] != '' ? to64(value['name']) : '', 'pin': to64(value['pin'])};
			}
		});
		return result;
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
