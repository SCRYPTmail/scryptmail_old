/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 12/9/14
 * Time: 11:39 PM
 */

function sanitizeCss(html)
{
var start=0;
var htmlen=html.length;
var end=0;
var	htmlResult='';
var parseString='';

var style = /<style/gi;
var styleend = /\/style>/gi;

var urlstart = /http/gi;

	while((match = style.exec(html)) != null) {
		start=match.index;
		while((match1 = styleend.exec(html)) != null) {
			end=match1.index+7;
		}
		if(start>end){
			end=htmlen;
		}
		htmlResult=html.substring(0, start);
		parseString=html.substring(start,end);

		html=html.slice(0, start) + html.slice(end);

	}
return html;
}
function saniziteEmailAttachment(body,meta)
{
	var from = body['from'];

	$('.email-open-header').text(stripHTML((body['subj'])));

	var rcphead = '';
	if (from.indexOf('<') != -1) {

		var fromEmail=getEmailsFromString(from);
		rcphead = 'From: <strong>' + escapeTags(from.substring(0, from.indexOf('<'))) + '</strong>' +'&lt;'+ fromEmail+'&gt;';
	} else {
		rcphead = 'From: ' + escapeTags(from);
	}
	rcphead = rcphead + '<br>To: ';

	//$.each(body['to'], function( index, value ) {
	var value = body['to'];
	if (value.indexOf('<') != -1) {
		var toEmail=getEmailsFromString(value);

		rcphead = rcphead + '<strong>' + escapeTags(value.substring(0, value.indexOf('<'))) + '</strong> &lt;' + toEmail +"&gt;; ";
	} else {
		rcphead = rcphead + escapeTags(value) + "; ";
	}

	rcphead = rcphead.substring(0, rcphead.length - 2);

	rcphead = rcphead + '<br>on: <i>' + new Date(meta['timeSent'] * 1000).toLocaleTimeString() + ', ' + new Date(meta['timeSent'] * 1000).toLocaleDateString() + '</i>';
	if (meta['pin'] != '' && meta['pin']!=undefined)
		rcphead += '<br>PIN: <b>' + meta['pin'] + '</b>';

	if(typeof body['badRcpt'] != 'undefined' && body['badRcpt'].length>0){
		rcphead = rcphead+'<br><i class="fa fa-warning txt-color-yellow"></i>&nbsp;';
		$.each(body['badRcpt'], function (index, value) {
			rcphead = rcphead+escapeTags(value['mail'])+'- '+escapeTags(value['message'])+'; ';
		});

	}
	$('#rcptHeader').html(rcphead);

	messageBody=body['body'];

		if(body['body']['html']!=''){

			$('#emailbody').html('<iframe id="virtualization" scrolling="no" frameborder="0" width="100%" height="100%">');

			var target = $('#virtualization').contents()[0];
			target.open();
			target.write('<!doctype html><html><head></head><body></body></html>');
			target.close();

			var bdhtml=body['body']['html'];

			bdhtml=sanitizeCss(bdhtml);

			messageDisplayedBody=filterXSS(bdhtml,{
				whiteList:          {
					a:      ['target', 'href', 'title','class'],
					abbr:   ['title'],
					address: [],
					article: ['class'],
					aside:  [],
					b:      [],
					bdi:    ['dir'],
					bdo:    ['dir'],
					big:    [],
					blockquote: ['cite'],
					br:     [],
					body:     ['class'],
					caption: [],
					center: [],
					cite:   [],
					code:   [],
					col:    ['align', 'valign', 'span', 'width'],
					colgroup: ['align', 'valign', 'span', 'width'],
					dd:     [],
					del:    ['datetime'],
					details: ['open'],
					div:    ['class','style'],
					dl:     [],
					dt:     [],
					em:     [],
					font:   ['color', 'size', 'face'],
					footer: ['class'],
					h1:     ['class'],
					h2:     ['class'],
					h3:     ['class'],
					h4:     ['class'],
					h5:     ['class'],
					h6:     ['class'],
					header: ['class'],
					hr:     [],
					i:      [],
					img:    ['alt', 'title', 'width', 'height','class'],
					ins:    ['datetime'],
					li:     ['class'],
					mark:   [],
					nav:    [],
					ol:     [],
					p:      ['class'],
					pre:    [],
					s:      [],
					section:[],
					small:  [],
					span:   ['class'],
					sub:    [],
					sup:    [],
					strong: [],
					table:  ['width', 'border', 'align', 'valign'],
					tbody:  ['align', 'valign'],
					td:     ['width', 'colspan', 'align', 'valign'],
					tfoot:  ['align', 'valign'],
					th:     ['width', 'colspan', 'align', 'valign'],
					thead:  ['align', 'valign'],
					tr:     ['rowspan', 'align', 'valign'],
					tt:     [],
					u:      [],
					ul:     []
				},
				onTagAttr: function (tag, name, value, isWhiteAttr) {
					if(tag=='a' && name=='href')
						return name+'='+value+' target="_blank"';
					if(name=='style' && value.indexOf('http')!=-1)
						return tag;
					//console.log(value);
					//return name+'='+value+'target="_blank"';
				},   // empty, means filter out all tags
				stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
				stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
				// to filter out its content
			});
			$('#virtualization').contents().find("html").html(messageDisplayedBody);


			$("#virtualization").height($("#virtualization").contents().find("html").height());


		}else{
			messageDisplayedBody='<style>.showMessage{white-space: pre-line;}</style><div class="showMessage">'+body['body']['text']+'</div>';
			$('#emailbody').html(messageDisplayedBody);
		}

}

function renderImages()
{
	$('#rendIm').css('display','none');
	if(messageBody['html']!=''){

		$('#emailbody').html('<iframe id="virtualization" scrolling="no" frameborder="0" width="100%" height="100%">');

		var target = $('#virtualization').contents()[0];
		target.open();
		target.write('<!doctype html><html><head></head><body></body></html>');
		target.close();

		var bdhtml=messageBody['html'];

		//var bdhtml1=bdhtml.replace("@import", "&#64;import").replace("@font-face", "&#64;font-face");
		//console.log(bdhtml1);
		messageDisplayedBody=filterXSS(bdhtml,{
			onTagAttr: function (tag, name, value, isWhiteAttr) {
				if(tag=='a' && name=='href')
					return name+'='+value+' target="_blank"';
			},
			onTag: function(tag, html, options) {
				if(tag=='img' && html.indexOf('http:')==-1 && html.indexOf('https:')==-1){
					return " ";
				}
			}
		});
		$('#virtualization').contents().find("html").html(messageDisplayedBody);


		$("#virtualization").height($("#virtualization").contents().find("html").height());


	}else{
		messageDisplayedBody='<style>.showMessage{white-space: pre-line;}</style><div class="showMessage">'+messageBody['text']+'</div>';
		$('#emailbody').text(messageDisplayedBody);
		$('#emailbody').html(messageDisplayedBody);
	}


}

