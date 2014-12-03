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

		}, 5000);
	}

	$('.email-open-header').text(stripHTML((body['subj'])));

	var from = body['from'];
	//var d = new Date();

	//console.log(body);
	if (meta['attachment'] != "") {

		$('<div class="inbox-download"></div>').insertAfter(".inbox-message");

		//$('.inbox-message').insertAfter('<div class="inbox-download"></div>');

		if (Object.keys(body['attachment']).length > 0) {

			$('.inbox-download').html('<ul class="inbox-download-list"></ul>');

			$.each(body['attachment'], function (fname, fdata) {

				var size = from64(fdata['size']);
				size = (size > 1000000) ? Math.round(size / 10000) / 100 + ' Mb' : Math.round(size / 10) / 100 + ' Kb';
				$(".inbox-download-list").append('<li><div class="well well-sm"><span id="' + from64(fdata['filename']) + '"><i class="fa fa-file"></i></span><br><strong>' + from64(fdata['name']) + '</strong><br>' + size + '<br><a href="javascript:void(0);" onclick="readFile(' + "'" + fdata['name'] + "'" + ')"> Download</a></div></li>');

			});
		}
	}
	/*

	 <li><div class="well well-sm"><span><i class="fa fa-file"></i></span><br><strong>timelogs.xsl</strong><br>1.3 mb<br><a href="javascript:void(0);"> Download</a></div></li>
	 */
	var rcphead = '';
	if (from.indexOf('<') != -1) {
		rcphead = 'From: <strong>' + escapeTags(from.substring(0, from.indexOf('<'))) + '</strong>' +
			'<span class="hidden-mobile">' + escapeTags(from.substring(from.indexOf('<'), from.lastIndexOf('>') + 1));
	} else {
		rcphead = 'From: <span class="hidden-mobile">' + escapeTags(from);
	}
	rcphead = rcphead + '<br>To: ';


	//$.each(body['to'], function( index, value ) {
	var value = body['to'];
	if (value.indexOf('<') != -1) {
		rcphead = rcphead + '<strong>' + escapeTags(value.substring(0, value.indexOf('<'))) + '</strong> ' + escapeTags(value.substring(value.indexOf('<'), value.lastIndexOf('>') + 1)) + "; ";
	} else {
		rcphead = rcphead + escapeTags(value) + "; ";
	}
	//});


	rcphead = rcphead.substring(0, rcphead.length - 2);

	rcphead = rcphead + '<br>on: <i>' + new Date(meta['timeSent'] * 1000).toLocaleTimeString() + ', ' + new Date(meta['timeSent'] * 1000).toLocaleDateString() + '</i></span>';
	if (meta['pin'] != '')
		rcphead += '<br>PIN: <b>' + meta['pin'] + '</b>';

	if(typeof body['badRcpt'] != 'undefined' && body['badRcpt'].length>0){
		rcphead = rcphead+'<br><i class="fa fa-warning txt-color-yellow"></i>&nbsp;';
		$.each(body['badRcpt'], function (index, value) {
			rcphead = rcphead+escapeTags(value['mail'])+'- '+escapeTags(value['message'])+'; ';
		});

	}
	$('#rcptHeader').html(rcphead);

	function resizeIframeToFitContent(iframe) {
		$('#'+iframe).height = document.frames[iframe.id].document.body.scrollHeight;
	}

	if(folder_navigate!='Spam'){
		if(body['body']['html']!=''){

			$('<iframe id="virtualization" scrolling="no" frameborder="0" width="100%" height="100%" sandbox="allow-same-origin allow-scripts">').appendTo('#emailbody')
				.contents().find('body').append(
					filterXSS(body['body']['html'],{
					onTagAttr: function (tag, name, value, isWhiteAttr) {
						if(name=='src' && (value.indexOf('http:')!=-1 && value.indexOf('https:')==-1)){
							return name+'="https:'+value.substr(5)+'"';
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
			$("#virtualization").height($("#virtualization").contents().find("html").height());

			//resizeIframeToFitContent(virtualization);
			/*
			$('#emailbody').html(filterXSS(body['body']['html'],{
				onTagAttr: function (tag, name, value, isWhiteAttr) {
					if(tag=='img' && name=='src' && (value.indexOf('http:')!=-1 && value.indexOf('https:')==-1)){
						return name+'="https:'+value.substr(5)+'"';

					}
					if(tag=='a' && name=='href')
						return name+'="'+value+'"'+' target="_blank"';
				},
				onTag: function(tag, html, options) {
					if(tag=='img' && html.indexOf('http:')==-1 && html.indexOf('https:')==-1){
						return " ";
					}
				}
			})
			);
*/
			//$('#emailbody').append(body['body']['html']);

			var dfd1 = new $.Deferred();
			var bod='';

		}else{
			$('#emailbody').text(body['body']['text']);
			$('#emailbody').prepend('<style>#emailbody{white-space: pre;}</style>');
		}
	}else{
		if(body['body']['text']!=''){

			$('#emailbody').text(body['body']['text']);
			$('#emailbody').prepend('<style>#emailbody{white-space: pre;}</style>');

		}else{

			$('#emailbody').text(body['body']['html']);
			$('#emailbody').prepend('<style>#emailbody{white-space: pre;}</style>');
		}
	}


	if (meta['type'] == 'sent') {
		$('#spamMail').remove();
		$('#replyMail').remove();
		$('#defMailOption').children().eq(0).html('<i class="fa fa-mail-forward"></i> Forward');
		$('#defMailOption').children().eq(0).attr('onclick', 'forwardMail()');

	}

	emailObj['meta'] = meta;
	emailObj['body'] = body;
	emailObj['mailId'] = datas['messageHash'];
	emailObj['datas'] = datas['vectorA'];
//	console.log(emailObj);
}

