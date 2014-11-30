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
});

function attachFile() {
	fileSelector.click();
	return false;
}

function getFile(evt) {
	//console.log(evt);
	if (Object.keys(fileObject).length <= 4 && (fileSize+evt[0].files[0]['size']<=16000000)) {
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
			fileSize +=file['size'];

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
		noAnswer('Maximum 5 Files allowed, 15 Mb Max');
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

	if(ismobile){
		$('#emailbody').summernote({
			minHeight: parseInt($('.table-wrap').css('height'), 10),
			airPopover: [
				['color', ['color']],
				['font', ['bold', 'underline', 'clear']],
				['para', ['ul', 'paragraph']],
				['table', ['table']],
				['insert', ['link']]
			],
			toolbar: [
				//[groupname, [button list]]

				['style', ['bold', 'italic']],
				['fontsize', ['fontsize']],
				['color', ['color']]
			]
		});
	}else{

		$('#emailbody').summernote({
			minHeight: parseInt($('.table-wrap').css('height'), 10),
			airPopover: [
				['color', ['color']],
				['font', ['bold', 'underline']],
				['para', ['ul', 'paragraph']],
				['table', ['table']],
				['insert', ['link']]
			],
			toolbar: [
				//[groupname, [button list]]

				['style', ['bold', 'italic', 'underline']],
				['fontsize', ['fontsize']],
				['color', ['color']],
				['para', ['ul', 'ol', 'paragraph']],
				['height', ['height']],
				['insert', ['link']]
			]

		});
	}
	$('.note-editable').css('min-height',parseInt($('.inbox-message').css('height'), 10));
	//$('.note-editor').css('height',parseInt($('.inbox-message').css('height'), 10));
	//$('#emailbody').css('min-height',parseInt($('#email-compose-form').css('height'), 10));

	if (pin == '') {
		var cheboxpin = '<div class="well-md well-light smart-form" style="float:left;">		' +
			'<ul class="list-inline" id="mailOptions">		' +
			'<li>			' +
			'<label class="checkbox">				' +
			'<input type="checkbox" name="subscription" id="pincheck" style="display:none;" onclick="generatePin(' + "''" + ');">					' +
			'<i style="margin:5px;"></i><span>&nbsp;Encrypt email sent to outside users like gmail or yahoo.</span>' + (ismobile ? '<br>' : '') + ' <span id="emailPin"></span></label>			' +
			'</li>		' +
			'</ul>		' +
			'</div>';

	} else {
		var cheboxpin = '<div class="well-md well-light smart-form" style="float:left;">		' +
			'<ul class="list-inline" id="mailOptions">		' +
			'<li>			' +
			'<label class="checkbox">				' +
			'<input type="checkbox" name="subscription" id="pincheck" checked="checked" style="display:none;" onclick="generatePin(' + "''" + ');">					' +
			'<i style="margin:5px;"></i><span>&nbsp;Encrypt email sent to outside users like gmail or yahoo.</span>' + (ismobile ? '<br>' : '') + ' <span id="emailPin">PIN: <b style="font-weight:bold;">' + pin + '</b></span></label>			' +
			'</li>		' +
			'</ul>		' +
			'</div>';
		//generatePin(pin);
	}
	$('#composeEmailPin').html(cheboxpin);

	finishRendering();
}



function emailParser(emails) {
	var emailObj = [];
	emailObj['indomain'] = {};
	emailObj['outdomain'] = {};

	var ind = {}, out = {}, indomain = [], outdomain = [];
	var mail;
	var arr = emails.toString().split(',');
	for (i = 0; i < arr.length; i++) {
		//arr[i].toLowerCase();
		mail = arr[i].toLowerCase();
		mailD = mail.split('@');

		//console.log(jQuery.inArray(mailD[1], domains ));
		if (jQuery.inArray(mailD[1], domains) != -1) {
			//console.log(mail);
			ind.mail = mail;
			ind.seedK = '';
			ind.mailK = '';
			indomain.push(ind);
			ind = {};
		} else {
			out.mail = mail;
			out.pin = '';
			outdomain.push(out);
			out = {};
		}
	}
	emailObj['indomain'] = indomain;
	emailObj['outdomain'] = outdomain;
	//console.log(emailObj);
	return emailObj

}

function sendMail() {


	$('#send').html('<i class="fa fa-refresh fa-spin"></i>&nbsp; Sending...');
	$('#send').prop('disabled',true);
	var canceled = false;
	checkState(function () {

		var emails = $('#toRcpt').select2("val");
		var emailpars = emailParser(emails);

		if (emails == "") {
			noAnswer('Please include at least one recipient');
			$('#send').html('Send');
			$('#send').prop('disabled',false);

			$('#toRcpt').select2('open');

		}else {


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


}

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

	emailPreObj['to'] = value['mail'];
	emailPreObj['from'] = profileSettings['email'];
	emailPreObj['subj'] = sanitize($('#subj').val()).substring(0, 150);
	emailPreObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};
	emailPreObj['attachment'] = {};


	emailPreObj['meta']['subject'] = sanitize($('#subj').val()).substring(0, 150);
	emailPreObj['meta']['body'] = sanitize(emailPreObj['body']['text']).substring(0, 100);

	if(Object.keys(fileObject).length>0){
		emailPreObj['meta']['attachment'] = 1;
		messaged['files']=[];
		$.each(fileObject, function (index, value) {
			var fname=SHA512(value['name']+emailPreObj['to']+Math.round(d.getTime() / 1000)+d.getTime());
			emailPreObj['attachment'][index] = {'name':value['name'],'type':value['type'],'filename':to64(fname),'size':value['size'],'base64':true};

			var el={'fname':fname,'data':toAesBinary(key, value['data'])};
			messaged['files'].push(el);
		});

	}else{
		emailPreObj['meta']['attachment'] = '';
	}

	emailPreObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
	emailPreObj['meta']['opened'] = false;
	emailPreObj['meta']['pin'] = '';
	emailPreObj['meta']['modKey'] = makeModKey(userObj['saltS']);
	emailPreObj['meta']['type'] = 'received';
	emailPreObj['meta']['to'] = emailPreObj['to'];
	emailPreObj['modKey'] = emailPreObj['meta']['modKey'];


	emailPreObj['to'] = to64(value['mail']);
	emailPreObj['from'] = to64(profileSettings['email']);
	emailPreObj['subj'] = to64(emailPreObj['subj']);
	emailPreObj['body']['text'] = to64(emailPreObj['body']['text']);
	emailPreObj['body']['html'] = to64(emailPreObj['body']['html']);

	emailPreObj['meta']['subject'] = to64(emailPreObj['meta']['subject']);
	emailPreObj['meta']['body'] = to64(emailPreObj['meta']['body']);

	emailPreObj['meta']['to'] = to64(value['mail']);
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
	emailPreObj['subj'] = 'Failed to deliver message to ' + value['mail'] + '!: Subject: ' + sanitize($('#subj').val()).substring(0, 50);

	emailPreObj['body'] = {'text': 'Server was unable to deliver your message, because recipient not exist in our database. <br> ' + stripHTML($('#emailbody').code()), 'html': 'Server was unable to deliver your message, because recipient not exist in our database. <br> ' + filterXSS($('#emailbody').code())};

	emailPreObj['attachment'] = {};
	emailPreObj['meta']['subject'] = emailPreObj['subj'];
	emailPreObj['meta']['body'] = sanitize(emailPreObj['body']['text']).substring(0, 100);
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

function encryptWithPin(value) {

	var d = new Date();
	var pki = forge.pki;

	//var salt = forge.random.getBytesSync(128);
	var key = forge.pkcs5.pbkdf2(SHA512(value['pin']), '', 256, 32);

//	console.log('key');
//	console.log(key);
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

	emailPreObj['to'] = value['mail'];
	emailPreObj['from'] = profileSettings['email'];
	emailPreObj['subj'] = sanitize($('#subj').val()).substring(0, 150);
	emailPreObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};

	emailPreObj['attachment'] = {};
	emailPreObj['meta']['subject'] = sanitize($('#subj').val()).substring(0, 150);
	emailPreObj['meta']['body'] = sanitize(emailPreObj['body']['text']).substring(0, 50);

	if(Object.keys(fileObject).length>0){
		emailPreObj['meta']['attachment'] = 1;
		messaged['files']=[];
		$.each(fileObject, function (index, value) {
			var fname=SHA512(value['name']+emailPreObj['to']+Math.round(d.getTime() / 1000)+d.getTime());
			emailPreObj['attachment'][index] = {'name':value['name'],'type':value['type'],'filename':to64(fname),'size':value['size'],'base64':true};
			var el={'fname':fname,'data':toAesBinary(key, value['data'])};
			messaged['files'].push(el);
		});

	}else{
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
	messaged['to'] = value['mail'];

	messaged['ModKey'] = SHA512(emailPreObj['modKey']);

	//console.log(emailPreObj);

	return messaged;

}

function encryptWithoutPin(value) {

	var d = new Date();
	//var pki = forge.pki;

	var pin=Math.floor(Math.random() * 90000) + 10000;
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

	emailPreObj['to'] = value['mail'];
	emailPreObj['from'] = profileSettings['email'];
	emailPreObj['subj'] = sanitize($('#subj').val()).substring(0, 150);
	emailPreObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};
	emailPreObj['attachment'] = {};
	emailPreObj['meta']['subject'] = sanitize($('#subj').val()).substring(0, 150)
	emailPreObj['meta']['body'] = sanitize(emailPreObj['body']['text']).substring(0, 100);

	if(Object.keys(fileObject).length>0){
		emailPreObj['meta']['attachment'] = 1;
		messaged['files']=[];
		$.each(fileObject, function (index, value) {
			var fname=SHA512(value['name']+emailPreObj['to']+Math.round(d.getTime() / 1000)+d.getTime());
			emailPreObj['attachment'][index] = {'name':value['name'],'type':value['type'],'filename':to64(fname),'size':value['size'],'base64':true};

			var el={'fname':fname,'data':toAesBinary(key, value['data'])};
			messaged['files'].push(el);
		});

	}else{
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

	emailPreObj['to'] = $('#toRcpt').select2("val");
	emailPreObj['from'] = profileSettings['email'];
	emailPreObj['subj'] = sanitize($('#subj').val()).substring(0, 150);
	emailPreObj['body'] = {'text': stripHTML($('#emailbody').code()), 'html': filterXSS($('#emailbody').code())};
	emailPreObj['attachment'] = {};

	emailPreObj['meta']['subject'] = emailPreObj['subj'];
	emailPreObj['meta']['body'] = sanitize(emailPreObj['body']['text']).substring(0, 100);

	if(Object.keys(fileObject).length>0){
		emailPreObj['meta']['attachment'] = 1;
		messaged['files']=[];
		$.each(fileObject, function (index, value) {
			var fname=SHA512(value['name']+emailPreObj['to']+Math.round(d.getTime() / 1000)+d.getTime());
			emailPreObj['attachment'][index] = {'name':value['name'],'type':value['type'],'filename':to64(fname),'size':value['size'],'base64':true};

			var el={'fname':fname,'data':toAesBinary(key, value['data'])};
			messaged['files'].push(el);
		});

	}else{
		emailPreObj['meta']['attachment'] = '';
	}

	emailPreObj['meta']['timeSent'] = Math.round(d.getTime() / 1000);
	emailPreObj['meta']['opened'] = false;
	emailPreObj['meta']['type'] = 'sent';
	emailPreObj['meta']['pin'] = $('#emailPin b').text();


	if (Object.keys(badRcpt).length > 0) {
		emailPreObj['meta']['status'] = 'warning';
	} else {
		emailPreObj['meta']['status'] = 'normal';
	}

	emailPreObj['badRcpt'] = badRcpt;
	emailPreObj['senderMod'] = senderMod;

	emailPreObj['meta']['modKey'] = makeModKey(userObj['saltS']);
	emailPreObj['meta']['to'] = $('#toRcpt').select2("val");

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

			var mailId = SendMailMail(sendMessage['messaged']).always(function (result) {
				if (!isNaN(result['messageId'])) {
					//console.log(result);
					var seedPubKey = pki.publicKeyFromPem(from64(value['seedK']));
					var prePub = sendMessage['modKey'];
					var cryptedPub = {'messageId': result['messageId'], 'modKeyMail': sendMessage['modKey'], 'modKeySeed': SHA512(prePub), 'meta': forge.util.bytesToHex(seedPubKey.encrypt(forge.util.hexToBytes(prePub), 'RSA-OAEP'))};
					//console.log(seedPubKey.encrypt(JSON.stringify(prePub)));
					//console.log(cryptedPub);
					var seedId = SendMailSeed(cryptedPub).always(function (resultSeed) {
						if (!isNaN(resultSeed['messageId'])) {
							var elem = {'mailId': result['messageId'], 'seedId': result['messageId'], 'rcpt': value['mail'], 'mailModKey': sendMessage['modKey'], 'seedModKey': prePub};
							senderMod.push(elem);
							dfd.resolve();
						} else {
							var rcp = {'mail': value['mail'], 'message': 'Failed to send'};
							badRcpt.push(rcp);
							dfd.resolve();
						}
					});
				} else {
					var rcp = {'mail': value['mail'], 'message': 'Failed to send'};
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

					folder['Inbox'][result['messageId']] = {'p': forge.util.bytesToHex(key),'opened':false};

					checkFolders();
					var rcp = {'mail': value['mail'], 'message': 'Recipient not found'};
					badRcpt.push(rcp);
					dfd.resolve();
				} else {
					var rcp = {'mail': value['mail'], 'message': 'Failed to send'};
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

		if (value['pin'] != '') {
			var sendMessage = encryptWithPin(value);

			var mailId = SendMailOut(sendMessage).always(function (result) {
				if (!isNaN(result['messageId'])) {
					var elem = {'mailId': result['messageId'], 'rcpt': value['mail'], 'mailModKey': sendMessage['ModKey']};
					senderMod.push(elem);
					dfd1.resolve();
				} else {
					var rcp = {'mail': value['mail'], 'message': 'Failed to send'};
					badRcpt.push(rcp);
					dfd1.resolve();
				}
			});

		}
		if (value['pin'] == '') {

			var sendMessage = encryptWithoutPin(value);

			var mailId = SendMailOutNoPin(sendMessage).always(function (result) {
				if (!isNaN(result['messageId'])) {
					var elem = {'mailId': result['messageId'], 'rcpt': value['mail'], 'mailModKey': sendMessage['ModKey']};
					senderMod.push(elem);
					dfd1.resolve();
				} else {
					var rcp = {'mail': value['mail'], 'message': 'Failed to send'};
					badRcpt.push(rcp);
					dfd1.resolve();
				}
			});

		}
		//console.log(value);
		promises.push(dfd1);
	});

	$.when.apply(undefined, promises).then(function () {

		var rec = $('#toRcpt').select2("val");

		if (rec.length == Object.keys(badRcpt).length) {
			noAnswer('Please check recepient address and try again');
			$('#send').html('Send');
			$('#send').prop('disabled',false);

		} else if (Object.keys(badRcpt).length > 0) {
			var key = forge.random.getBytesSync(32);

			var sendMessage = encryptMessageForSent(badRcpt, senderMod, key);

			var mailId = SaveMailInSent(sendMessage).always(function (result) {
				if (!isNaN(result['messageId'])) {

					folder['Sent'][result['messageId']] = {'p': forge.util.bytesToHex(key),'opened':false};
					//console.log(result['messageId']);
					//console.log(message['mailHash']);

					delete folder['Draft'][result['messageId']];

					checkFolders();
					omgAnswer('<span style="">Email sent, but with some errors. See message in "Sent" folder for details</span>');
				} else {
					noAnswer('<span style="">Email Sent with error. Unable to move message to Sent folder. Please report a bug</span>');
					$('#send').html('Send');
					$('#send').prop('disabled',false);
				}
			});
			getDataFromFolder('Inbox');
		} else if (Object.keys(badRcpt).length == 0 && rec.length == senderMod.length) {
			var key = forge.random.getBytesSync(32);

			var sendMessage = encryptMessageForSent(badRcpt, senderMod, key);

			var mailId = SaveMailInSent(sendMessage).always(function (result) {
				if (!isNaN(result['messageId'])) {

					folder['Sent'][result['messageId']] = {'p': forge.util.bytesToHex(key),'opened':true};
					delete folder['Draft'][message['mailHash']];

					if (Object.keys(senderMod).length > 0) {
						//console.log(typeof(contacts));
						$.each(senderMod, function (index, value) {
							if (contacts.hasOwnProperty(value['rcpt']) === false) {

								var res= value['rcpt'].split("<");
								//console.log(value['rcpt']);
								//console.log(res);

								if(res.length>1){
									var name=$.trim(res[0]);
									var em=$.trim(res[1].substring(0, res[1].lastIndexOf('>')));
									contacts[em]={'name':name};
								}else{
									contacts[$.trim(value['rcpt'])]={'name':''};
								}

								//console.log(contacts);
							}
						});
					}

					checkContacts();
					checkFolders();

					Answer('Email successfully send');
					getDataFromFolder('Inbox');
				} else {
					if (Object.keys(senderMod).length > 0) {
						$.each(senderMod, function (index, value) {
							if (contacts.hasOwnProperty(value['rcpt']) === false) {
								var res= value['rcpt'].split("<");
								//console.log(value['rcpt']);
								//console.log(res);
								if(res.length>1){
									var name=$.trim(res[0]);
									var em=$.trim(res[1].substring(0, res[1].lastIndexOf('>')));
									contacts[em]={'name':name};
								}else{
									contacts[$.trim(value['rcpt'])]={'name':''};
								}
							}
						});
					}

					checkContacts();

					noAnswer('<span style="">Email Sent with error. Unable to move message to Sent folder. Please report a bug</span>');
					$('#send').html('Send');
					$('#send').prop('disabled',false);
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

function SendMailSeed(messaged) {
	return $.ajax({
		type: "POST",
		url: '/sendLocalMessageSeed',
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

function SendMailMail(messaged) {

	return $.ajax({
		type: "POST",
		url: '/sendLocalMessage',
		data: {
			'message': messaged
		},
		success: function (data, textStatus) {
			//console.log(data);
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
				$('#send').html('Send');
				$('#send').prop('disabled',false);
				noAnswer('Error occurred. Please try again.');
			}

		},
		error: function (data, textStatus) {
			$('#send').html('Send');
			$('#send').prop('disabled',false);
			noAnswer('Error occurred. Please try again.');
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
		formatSelectionTooBig: 'Max 5 files allowed',
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
		placeholder: "Press enter to separate emails",
		tokenSeparators: [";", " "],
		minimumInputLength: 2,
		maximumInputLength: 250,
		maximumSelectionSize: roleData['role']['recepientPerMail'],
		formatSelectionTooBig: 'Your plan is limited by ' + roleData['role']['recepientPerMail'] + ' recepient per mail. Please upgrade plan to rise limit',
		formatSelection: emailSelection
	});

	$('#toRcpt').on("select2-selecting", function (e) {

		var t = e.val.toLowerCase();

		if (t.indexOf('<') != -1) {
			e.val = $.trim(t.substring(t.indexOf('<') + 1, t.lastIndexOf('>'))).replace(/\"/g, "").replace(/\'/g, "");
			if (!IsEmail(e.val)) {
				e.preventDefault();
			}
		} else {
			if (!IsEmail(e.val)) {
				e.preventDefault();
			}
		}

	});

}



