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

		match1 = styleend.exec(html);
		end=match1.index+7;

		if(start>end){
			end=htmlen;
		}
		htmlResult=html.substring(0, start);
		parseString=html.substring(start,end);

		html=html.slice(0, start) + html.slice(end);

	}
return html;
}

function showPin(email){
	//window.prompt("Copy to clipboard: Ctrl+C, Enter", recipient[email]['pin']);

	$('#dialog_simple >p').html('<b>' + recipient[email]['name'] + '</b><input type="text" class="col col-xs-12" id="pinfor" readonly onClick="this.setSelectionRange(0, this.value.length)">');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 300,
		resizable: false,
		modal: true,
		title: "PIN for:",
		buttons: [
			{
				html: "OK",
				"class": "btn btn-default",
				click: function () {
						$(dialog_simple).dialog("close");
				}
			}
		]
	});
	$('#pinfor').val(recipient[email]['pin']);


	$('#dialog_simple').dialog('open');

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

	if(meta['type']=='sent'){
		$.each(body['to'], function( index, value ) {
			if (value.indexOf('<') != -1) {
				var toEmail=getEmailsFromString(value);
				rcphead = rcphead + '<strong>' + escapeTags(value.substring(0, value.indexOf('<'))) + '</strong> &lt;'+toEmail+"&gt;; "
			} else {
				rcphead = rcphead + escapeTags(value) + "; ";
			}
		});

	}else{
		var value = body['to'];

		if (value.indexOf('<') != -1) {
			var toEmail=getEmailsFromString(value);
				rcphead = rcphead + '<strong>Me </strong>' + ' &lt;' + toEmail +"&gt;; ";
		} else {
				rcphead = rcphead + '<strong>Me </strong>  &lt;'+escapeTags(value) + "&gt;; ";

		}
	}

	rcphead = rcphead.substring(0, rcphead.length - 2);

	rcphead = rcphead + '<br>on: <i>' + new Date(meta['timeSent'] * 1000).toLocaleTimeString() + ', ' + new Date(meta['timeSent'] * 1000).toLocaleDateString() + '</i>';

	if(meta['pin']!=undefined){
		if(meta['pin'].length>5){
			var display='';
			var pinObj=JSON.parse(meta['pin']);
			$.each(pinObj, function (index, value) {
				var nm=value['name']!=''?from64(value['name'])+' &lt;'+index+'&gt;':index;
				display += '<button class="btn btn-info btn-xs" onclick="showPin(\''+SHA256(index)+'\')">'+nm+'</button> ';

				recipient[SHA256(index)]={'name':nm,'pin':from64(value['pin'])};
			});
			rcphead += '<br>PIN for: <b>'+display;
		}else if(meta['pin']!=''){
			rcphead += '<br>PIN: <b>' + meta['pin'] + '</b>';
		}
	}


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

			setTimeout(function(){
				var target = $('#virtualization').contents()[0];
				target.open();
				target.write('<!doctype html><html><head></head><body></body></html>');
				target.close();

				var bdhtml=body['body']['html'];
				bdhtml=sanitizeCss(bdhtml);
				messageDisplayedBody=bdhtml;


				messageDisplayedBody=filterXSS(bdhtml,{
					whiteList:{
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
					},   // empty, means filter out all tags
					stripIgnoreTag:     true,      // filter out all HTML not in the whilelist
					stripIgnoreTagBody: ['script'] // the script tag is a special case, we need
					// to filter out its content
				});

				$('#virtualization').contents().find("html").html(messageDisplayedBody);


				$("#virtualization").height($("#virtualization").contents().find("html").height());

			}, 0);

		}else{
			messageDisplayedBody='<style>.showMessage{white-space: pre-line;}</style><div class="showMessage">'+stripHTML(body['body']['text'])+'</div>';
			$('#emailbody').html(messageDisplayedBody);
		}

}

function renderImages()
{
	$('#rendIm').css('display','none');
	if(messageBody['html']!=''){

		$('#emailbody').html('<iframe id="virtualization" scrolling="no" frameborder="0" width="100%" height="100%">');

		setTimeout(function(){
		var target = $('#virtualization').contents()[0];
		target.open();
		target.write('<!doctype html><html><head></head><body></body></html>');
		target.close();

		var bdhtml=messageBody['html'];

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

			setTimeout(function(){
				$("#virtualization").height($("#virtualization").contents().find("html").height()+40);
			},500);

		}, 0);

	}else{
		messageDisplayedBody='<style>.showMessage{white-space: pre-line;}</style><div class="showMessage">'+stripHTML(messageBody['text'])+'</div>';
		$('#emailbody').html(messageDisplayedBody);
	}


}

