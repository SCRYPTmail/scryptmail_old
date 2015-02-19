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
				noAnswer('Error. Please refresh the page.');
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
function indoCrypt(value,from,callback) {

	var d = new Date();
	var pki = forge.pki;

	var publicKey=pki.publicKeyFromPem(from64(value['mailK']));
	var encryptionKey=forge.random.getBytesSync(32);

	var recipient=to64(value['display']);
	var sender=to64(from);
	var subject=to64(stripHTML($('#subj').val()).substring(0, 150));
	var bodyMeta=to64(stripHTML($('#emailbody').code()).substring(0, 100));
	var sentMeta=Math.round(d.getTime() / 1000);
	var opened=false;
	var metaPin='';
	var metaStatus='';
	var metaType='received';
	var modKey=makeModKey(forge.random.getBytesSync(256));
	var bodyText=to64(stripHTML($('#emailbody').code()));
	var bodyHTML=to64(filterXSS($('#emailbody').code()));
	var bdRcpt='';
	var fromExtra = to64(' via SCRYPTmail');

	var sndrMod='';
	var files=fileObject;

	createMessage(publicKey,recipient,files,sender,subject,bodyMeta,sentMeta,opened,metaPin,modKey,bodyText,bodyHTML,metaType,metaStatus,encryptionKey,bdRcpt,sndrMod,fromExtra,function(messaged){
		var dat = {'messaged': messaged, 'modKey': modKey};
		callback(dat);
	});

}



function encryptMessageToRecipient(emailparsed,to) {

	var senderMod = [];
	var badRcpt = [];
	var pki = forge.pki;
	var promises = [];

	//console.log(emailparsed);

	$.each(emailparsed['indomain'], function (index, value) { // indomain submission
		var dfd = $.Deferred();

		if (value['mailK'] != '' && value['mailK'] != null) {//if have pub keys

				indoCrypt(value,to,function(sendMessage){
					SendMailMail(sendMessage,pki.publicKeyFromPem(from64(value['mailK'])),0,function(mailId,seedId,seedModKey){

						if (!isNaN(seedId)) {
							dfd.resolve();

						} else {
								systemMessage('tryAgain');
								var rcp = {'mail': value['mail'], 'message': 'Failed to send.'};
								badRcpt.push(rcp);
								dfd.resolve();

						}

					});
				});



		}else{
			noAnswer('Recipient not found.');
		}
		promises.push(dfd);
	});


	$.when.apply(undefined, promises).then(function () {

		if (Object.keys(badRcpt).length == 0) {
			systemMessage('Sent');
			setTimeout(function() {
				window.location='/login';
			}, 2000);

		}

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
			url: '/sendLocalMessageUnreg',
			data: messaged['messaged'],

			success: function (data, textStatus) {
				if(!isNaN(data['messageId']))
				{
					callback(seedMeta['mailId'],data['messageId'],seedMeta['seedModKey']);
				}else if(data.answer=="Limit is reached"){
					noAnswer('You\'ve reached the maximum of emails per hour. Please register to send more emails');
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
		noAnswer('Error. Please try again later.');
		$('.sendMailButton').html('Send');
		$('.sendMailButton').prop('disabled', false);
	}

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