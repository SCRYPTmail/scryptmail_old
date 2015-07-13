/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:52 PM
 */

function renderMessage(body, meta, datas) {
	functionTracer='renderMessage';
	messageFolder=folder_navigate;
	enableEmailControl();
	var signBody=JSON.stringify(body);

	if(roleData['role']['tagsPerMail']>=1){

		$('#emTags').css('display','block');

		var con = [];

		if (Object.keys(profileSettings['tags']).length > 0) {
			$.each(profileSettings['tags'], function (index, value) {
				functionTracer='renderMessage 9';
					var el = from64(value['name']);
				con.push(el);
			});
		}

		$("#tags").select2({
			tags: con,
			placeholder: "Custom tags.",
			tokenSeparators: [";"],
			minimumInputLength: 2,
			maximumInputLength: 40,
			maximumSelectionSize: roleData['role']['tagsPerMail'],
			formatSelectionTooBig: 'Your plan is limited to ' + roleData['role']['emailTags']+' tags', // + ' recipients per email. Please upgrade plan to raise limit.',
			formatSelection: tagSelection
		});

		$('#tags').on("select2-selecting", function (e) {
			functionTracer='renderMessage 20';
			var tag=filterXSS(e.val);

			if (Object.keys(profileSettings['tags']).length < roleData['role']['tagsPerProfile']) {
				functionTracer='renderMessage 1';
				profileSettings['tags'][to64(tag)]={'name':to64(tag)};
				con.push(tag);
			}
			checkProfile();

			if (emailObj['mailId'] != '') {

				if(messageFolder in folder['Custom']){
					if(folder['Custom'][messageFolder][datas['messageHash']]['tags']==undefined){
						folder['Custom'][messageFolder][datas['messageHash']]['tags']={};
					}
					functionTracer='renderMessage 2';
					folder['Custom'][messageFolder][datas['messageHash']]['tags'][to64(tag)]={'name':to64(tag)};
				}else{

					if(folder[messageFolder][datas['messageHash']]['tags']==undefined){
						folder[messageFolder][datas['messageHash']]['tags']={};
						mailBox['Data'][datas['messageHash']]['tags']={};
					}
					functionTracer='renderMessage 3';
					folder[messageFolder][datas['messageHash']]['tags'][to64(tag)]={'name':to64(tag)};
				}

				if(mailBox['boxName']!=''){
				if(mailBox['Data'][datas['messageHash']]==undefined){
					mailBox['Data'][datas['messageHash']]['tags']={};
					functionTracer='renderMessage 4';
					mailBox['Data'][datas['messageHash']]['tags'][to64(tag)]={'name':to64(tag)};
				}else{
					functionTracer='renderMessage 5';
					mailBox['Data'][datas['messageHash']]['tags'][to64(tag)]={'name':to64(tag)};
				}
				}
				checkFolders();
			}

		});

		$('#tags').on('select2-removed', function (event) {

			functionTracer='renderMessage 21';
			var tag=filterXSS(event.val);

			if (emailObj['mailId'] != '') {

				if(messageFolder in folder['Custom']){
					functionTracer='renderMessage 6';
					delete folder['Custom'][messageFolder][datas['messageHash']]['tags'][[to64(tag)]];
				}else{
					functionTracer='renderMessage 7';
					delete folder[messageFolder][datas['messageHash']]['tags'][[to64(tag)]];
				}
				if(mailBox['Data'][datas['messageHash']]!=undefined){
					functionTracer='renderMessage 8';
				delete mailBox['Data'][datas['messageHash']]['tags'][to64(tag)];
				}
				checkFolders();
			}

		});

		if(messageFolder in folder['Custom']){
			var tags= folder['Custom'][messageFolder][datas['messageHash']]['tags'];
		}else{
			var tags= folder[messageFolder][datas['messageHash']]['tags'];
		}

		if(tags!=undefined){
			var tg=[];
			$.each(tags, function (index, value) {
				functionTracer='renderMessage 10';
				var t=from64(value['name']);
				tg.push(t);
			});
			$('#tags').select2('val',tg);
		}

		//return result;



	}


	$('#pag').css('display','none');
	if(body['rawHeader']!=undefined){
		functionTracer='renderMessage 11';
		body['rawHeader']=from64(body['rawHeader']);
		$('#rawHead').css('display','block');
	}else
	{
		$('#rawHead').css('display','none');
	}
	activePage = 'readEmail';
	functionTracer='renderMessage 12';
	try {
		body['body']['text'] = from64(body['body']['text']);
	}catch (err) {
		body['body']['text'] ='error';
	}
	
	functionTracer='renderMessage 13';
		try {
	body['body']['html'] = from64(body['body']['html']);
		}catch (err) {
		body['body']['html'] ='error';
		}
	functionTracer='renderMessage 14';
	body['to'] = from64(body['to']);
	functionTracer='renderMessage 15';
	body['from'] = from64(body['from']);

	functionTracer='renderMessage 16';
	body['subj'] = from64(body['subj']);


	if(messageFolder in folder['Custom']){
		var ifOpen=folder['Custom'][messageFolder][datas['messageHash']]['opened'];
	}else{
		var ifOpen=folder[messageFolder][datas['messageHash']]['opened'];
	}

	if (!ifOpen) {

		opener = setTimeout(function () {
			if(messageFolder in folder['Custom']){
				folder['Custom'][messageFolder][datas['messageHash']]['opened'] = true;
			}else{
				folder[messageFolder][datas['messageHash']]['opened'] = true;
			}

			mailBox['Data'][datas['messageHash']]['opened']=true;

			checkFolders();
			getNewEmailsCount();
			//console.log('fff');

		}, 2000);
	}

	//var d = new Date();


	if (meta['attachment'] != "") {

		$('<div class="alert alert-warning text-left" style="margin-top:10px;">Please exercise caution when downloading files. We strongly recommend to scan them with antivirus after download.</div><div class="inbox-download"></div>').insertAfter(".inbox-message");

		//$('.inbox-message').insertAfter('<div class="inbox-download"></div>');

		if (Object.keys(body['attachment']).length > 0) {

			$('.inbox-download').html('<ul class="inbox-download-list"></ul>');

			$.each(body['attachment'], function (fname, fdata) {

				functionTracer='renderMessage 17';
				var size = from64(fdata['size']);

				functionTracer='renderMessage 18';
				var fname=escapeTags(from64(fdata['name']));
				size = (size > 1000000) ? Math.round(size / 10000) / 100 + ' Mb' : Math.round(size / 10) / 100 + ' Kb';
				functionTracer='renderMessage 19';
				$(".inbox-download-list").append('<li><div class="well well-sm"><span id="' + from64(fdata['filename']) + '"><i class="fa fa-file"></i></span><br><strong>' + fname + '</strong><br>' + size + '<br><a href="javascript:void(0);" onclick="readFile(\''+ fdata['name'] + '\')"> Download</a></div></li>');

			});
		}
	}

	saniziteEmailAttachment(body,meta,signBody);


	if (meta['type'] == 'sent') {
		$('#spamMail').remove();
		$('#replyMail').remove();
		$('#defMailOption').children().eq(0).html('<i class="fa fa-mail-forward"></i> Forward');
		$('#defMailOption').children().eq(0).attr('onclick', 'forwardMail()');

	}
	if(messageFolder=='Spam' || messageFolder=='Trash'){
		$('#trashList').html('<i class="fa fa-trash-o"></i>&nbsp; Delete')
	}

	emailObj['meta'] = meta;
	emailObj['body'] = body;
	emailObj['mailId'] = datas['messageHash'];
	emailObj['datas'] = datas['vectorA'];
//	console.log(emailObj);
}

