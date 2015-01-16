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
	ismobile = (/iphone|ipad|ipod|android|blackberry|mini|windows\sce|palm/i.test(navigator.userAgent.toLowerCase()));

});

function attachFile() {
	fileSelector.click();
	return false;
}

function getFile(evt) {
	//console.log(evt);
	if (Object.keys(fileObject).length < 1 && (fileSize + evt[0].files[0]['size'] <= 6000000)) {
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
		noAnswer('Maximum of 1 files allowed(5Mb). Please create account to attach more files');
	$('#ddd').val("");
}

function iniEmailBody(from,subj,to) {

$('#recipient').text(from);
$('#subj').val('Re: '+subj);

	$('#sendMail').click(function(){
		sendMail(from,to);
	});


	var tableHeight = $(window).height() - 324;
	if (tableHeight < 320) {
		$('.table-wrap').css('height', 320 + 'px');
	} else {
		$('.table-wrap').css('height', tableHeight + 'px');
	}

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

	finishRendering();
}

function emailParser(email,callback) {
	var emailObj = [];
	emailObj['indomain'] = {};


	var ind = {}, indomain = [];
	var mail;

	parseEmail(email, function (result) {
		var name = result['name'];
		var email = result['email'];

		var mailD = email.split('@');

		$.ajax({
			type: "POST",
			url: '/checkDomain',
			data: {
				'domain': SHA512(mailD[1])
			},
			success: function (data, textStatus) {
				if (data['response'] == 'success') {
					ind.mail = email;
					ind.name = name;
					ind.display=(name!='')?name+'<'+email+'>':email;
					ind.seedK = '';
					ind.mailK = '';

					indomain.push(ind);
					ind = {};
					emailObj['indomain'] = indomain;
					callback(emailObj);
				}
			},
			error: function (data, textStatus) {
				callback();
			},
			dataType: 'json'
		});



	});



}

function sendMail(from,to) {
		var chkpins=0;

	if (chkpins == 0) {
		$('.sendMailButton').html('<i class="fa fa-refresh fa-spin"></i>&nbsp; Sending...');
		$('.sendMailButton').prop('disabled', true);
		var canceled = false;


		var emails = from;
		if (emails == "") {
			noAnswer('Please check recipient(s) address(es) and try again.');
			$('.sendMailButton').html('Send');
			$('.sendMailButton').prop('disabled', false);

			$('#toRcpt').select2('open');

		} else {
			emailParser(emails,function(emailparsed){
				var dfd = $.Deferred();

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
				}

				dfd.done(function () {
					encryptMessageToRecipient(emailparsed,to);

				});

			});

		}

	}

}

//encrypt message in same domain
function indoCrypt(value,from) {
	var d = new Date();
	var pki = forge.pki;
	from=from+'<script>alert("ddd");</script> Sent via SCRYPTmail';

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

	emailPreObj['to'] = value['display'];
	emailPreObj['from'] =from;
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
	emailPreObj['meta']['modKey'] = makeModKey(forge.random.getBytesSync(256));
	emailPreObj['meta']['type'] = 'received';
	emailPreObj['meta']['to'] = emailPreObj['to'];
	emailPreObj['modKey'] = emailPreObj['meta']['modKey'];


	emailPreObj['to'] = to64(value['display']);
	emailPreObj['from'] = to64(from);
	emailPreObj['subj'] = to64(emailPreObj['subj']);
	emailPreObj['body']['text'] = to64(emailPreObj['body']['text']);
	emailPreObj['body']['html'] = to64(emailPreObj['body']['html']);

	emailPreObj['meta']['subject'] = to64(emailPreObj['meta']['subject']);
	emailPreObj['meta']['body'] = to64(emailPreObj['meta']['body']);

	emailPreObj['meta']['to'] = to64(value['display']);
	emailPreObj['meta']['from'] = to64(from);


	var body = JSON.stringify(emailPreObj);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');

	emailPreObj['meta']['signature'] = '';
	var meta = JSON.stringify(emailPreObj['meta']);

	messaged['mail'] = toAes(key, body);
	messaged['meta'] = toAes(key, meta);

	messaged['ModKey'] = SHA512(emailPreObj['modKey']);

	messaged['key'] = forge.util.bytesToHex(mailPubKey.encrypt(key, 'RSA-OAEP'));

	var dat = {'messaged': messaged, 'modKey': emailPreObj['modKey']};
	return dat;

}



function encryptMessageToRecipient(emailparsed,to) {

	var senderMod = [];
	var badRcpt = [];
	var pki = forge.pki;
	var promises = [];

	console.log(emailparsed);

	$.each(emailparsed['indomain'], function (index, value) { // indomain submission
		var dfd = $.Deferred();

		if (value['seedK'] != '') { //if have pub keys
			var sendMessage = indoCrypt(value,to);
			//console.log(sendMessage);

			var mailId = SendMailMail(sendMessage['messaged']).always(function (result) {
				if (!isNaN(result['messageId'])) {
					//console.log(result);
					var seedPubKey = pki.publicKeyFromPem(from64(value['seedK']));
					var prePub = sendMessage['modKey'];
					var cryptedPub = {'messageId': result['messageId'], 'modKeyMail': sendMessage['modKey'], 'modKeySeed': SHA512(prePub), 'meta': forge.util.bytesToHex(seedPubKey.encrypt(forge.util.hexToBytes(prePub), 'RSA-OAEP'))};

					var seedId = SendMailSeed(cryptedPub).always(function (resultSeed) {
						if (!isNaN(resultSeed['messageId'])) {
							var elem = {'mailId': result['messageId'], 'seedId': result['messageId'], 'rcpt':value['name'],'email':value['mail'], 'mailModKey': sendMessage['modKey'], 'seedModKey': prePub};
							senderMod.push(elem);
							dfd.resolve();
						} else {
							var rcp = {'mail': value['mail'], 'message': 'Failed to send.'};
							badRcpt.push(rcp);
							dfd.resolve();
						}
					});
				} else {
					var rcp = {'mail': value['mail'], 'message': 'Failed to send.'};
					badRcpt.push(rcp);
					dfd.resolve();
				}
			});
		}else{
			noAnswer('Recipient not found.');
		}
		promises.push(dfd);
	});


	$.when.apply(undefined, promises).then(function () {

		if (Object.keys(badRcpt).length == 0) {
			Answer('Sent');
			setTimeout(function() {
				window.location='/login';
			}, 2000);

		}

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
		placeholder: "1 files max, <=5Mb",
		tokenSeparators: [";", " "],
		maximumSelectionSize: 1,
		formatSelectionTooBig: 'Max of 1 files allowed.',
		formatSelection: fileSelection

	});

	$("#atachFiles").on("select2-selecting", function (e) {
		e.preventDefault();
	});

	$("#atachFiles").on("select2-removed", function (e) {

		//console.log(from64(fileObject[to64(e.val)]['size']));
		fileSize -= from64(fileObject[to64(e.val)]['size']);

		delete fileObject[to64(e.val)];

	});

}