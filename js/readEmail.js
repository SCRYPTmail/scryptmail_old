/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:52 PM
 */

function renderMessage(body, meta, datas) {

	$('#pag').css('display','none');
	activePage = 'readEmail';
	body['body']['text'] = from64(body['body']['text']);
	body['body']['html'] = from64(body['body']['html']);
	body['to'] = from64(body['to']);
	body['from'] = from64(body['from']);


	body['subj'] = from64(body['subj']);

	if(folder_navigate in folder['Custom']){
		var ifOpen=folder['Custom'][folder_navigate][datas['messageHash']]['opened'];
	}else{
		var ifOpen=folder[folder_navigate][datas['messageHash']]['opened'];
	}

	if (!ifOpen) {

		opener = setTimeout(function () {
			if(folder_navigate in folder['Custom']){
				folder['Custom'][folder_navigate][datas['messageHash']]['opened'] = true;
			}else{
				folder[folder_navigate][datas['messageHash']]['opened'] = true;
			}

			checkFolders();
			getNewEmailsCount();
			//console.log('fff');

		}, 2000);
	}

	//var d = new Date();


	if (meta['attachment'] != "") {

		$('<div class="inbox-download"></div>').insertAfter(".inbox-message");

		//$('.inbox-message').insertAfter('<div class="inbox-download"></div>');

		if (Object.keys(body['attachment']).length > 0) {

			$('.inbox-download').html('<ul class="inbox-download-list"></ul>');

			$.each(body['attachment'], function (fname, fdata) {

				var size = from64(fdata['size']);
				var fname=escapeTags(from64(fdata['name']));
				size = (size > 1000000) ? Math.round(size / 10000) / 100 + ' Mb' : Math.round(size / 10) / 100 + ' Kb';
				$(".inbox-download-list").append('<li><div class="well well-sm"><span id="' + from64(fdata['filename']) + '"><i class="fa fa-file"></i></span><br><strong>' + fname + '</strong><br>' + size + '<br><a href="javascript:void(0);" onclick="readFile(\''+ fdata['name'] + '\')"> Download</a></div></li>');

			});
		}
	}

	saniziteEmailAttachment(body,meta);


	if (meta['type'] == 'sent') {
		$('#spamMail').remove();
		$('#replyMail').remove();
		$('#defMailOption').children().eq(0).html('<i class="fa fa-mail-forward"></i> Forward');
		$('#defMailOption').children().eq(0).attr('onclick', 'forwardMail()');

	}
	if(folder_navigate=='Spam' || folder_navigate=='Trash'){
		$('#trashList').html('<i class="fa fa-trash-o"></i>&nbsp; Delete')
	}

	emailObj['meta'] = meta;
	emailObj['body'] = body;
	emailObj['mailId'] = datas['messageHash'];
	emailObj['datas'] = datas['vectorA'];
//	console.log(emailObj);
}

