/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 12/7/14
 * Time: 10:35 PM
 */

function readEmail() {
	var error = false;

	if ($('#emailHashtag').val() == '') {
		$('#hserror').html("Provide email hash");
		$('#hserror').parent().parent().addClass('state-error');
		error = true;
	} else {
		$('#hserror').html("");
	}

	if ($('#emailHashpass').val() == "") {
		$('#pserror').html("Provide PIN");
		$('#pserror').parent().parent().addClass('state-error');
		error = true;
	}

	if (error == 0) {
		$.ajax({
			type: "POST",
			url: '/retrieveEmail',
			data: {
				'ajax': 'retrieve-mail',
				'emailHash': $('#emailHashtag').val(),
				'pinHash':SHA512($('#emailHashpass').val())

			},
			success: function (data, textStatus) {

				if (data.emailHash != undefined) {
					$('#hserror').html(data.emailHash);
					$('#hserror').parent().parent().addClass('state-error');
				}
				if (data.success) {
					//console.log($('#emailHashpass').val());

					var key = forge.pkcs5.pbkdf2(SHA512($('#emailHashpass').val()), '', 256, 32);
					pin = key;

					try {
						var meta = fromAes(key, data['email']['meta']);
						var body = fromAes(key, data['email']['body']);
						//z = z.substring(0, z.lastIndexOf('}') + 1);

						var meta = JSON.parse(meta);
						var body = JSON.parse(body);
						var mesId=data['messageId'];


						$.ajax({
							type: "GET",
							url: '/html/BlankMailUnreg.html',
							success: function (data, textStatus) {
								$('#main > .container').html(data);
								$('#delmail').attr('onclick',"deleteMailUnreg('"+mesId+"','"+meta['modKey']+"');");
								renderMessageUnreg(body, meta);
							},
							error: function (data, textStatus) {
								noAnswer('Error occurred. Please try again');
							},
							dataType: 'html'
						});

						//onclick="deleteMailUnreg();" id="delmail"
						//console.log(meta);
						//console.log(body);

					} catch (err) {
						$('#pserror').html("PIN is invalid");
						$('#pserror').parent().parent().addClass('state-error');
					}
				}

			},
			dataType: 'json'
		});
	}
}

function replyUnreg(from,subj,to){
	$.get('/composeMailUnreg', function (data) {
		$('#content').html(data);
		iniEmailBody(from,subj,to);
	});
}

function renderMessageUnreg(body, meta) {

	body['body']['text'] = from64(body['body']['text']);
	body['body']['html'] = from64(body['body']['html']);
	body['to'] = from64(body['to']);
	body['from'] = from64(body['from']);
	body['subj'] = from64(body['subj']);

	$('#defMailOption').click(function(){
		replyUnreg(body['from'], body['subj'],body['to']);
	});
	$('.replyunsec').attr('href', 'mailto:' + body['from']);

	if (meta['attachment'] != "") {
		if (Object.keys(body['attachment']).length > 0) {
			file = body['attachment'];
			$('.inbox-download').html('<ul class="inbox-download-list"></ul>');

			$.each(body['attachment'], function (fname, fdata) {

				var size = from64(fdata['size']);
				var fname=escapeTags(from64(fdata['name']));
				size = (size > 1000000) ? Math.round(size / 10000) / 100 + ' Mb' : Math.round(size / 10) / 100 + ' Kb';
				$(".inbox-download-list").append('<li><div class="well well-sm"><span id="' + from64(fdata['filename']) + '"><i class="fa fa-file"></i></span><br><strong>' + fname + '</strong><br>' + size + '<br><a href="javascript:void(0);" onclick="readFileUnreg(\'' + fdata['name'] + '\')"> Download</a></div></li>');

			});
		}
	}
	saniziteEmailAttachment(body,meta);


}


function readFileUnreg(fileName) {

	var span = from64(file[fileName]['filename']);

	$('#' + span + ' i').removeClass('fa-file');
	$('#' + span + ' i').addClass('fa-refresh');
	$('#' + span + ' i').addClass('fa-spin');

	//fa-refresh fa-spin
	var fd = new FormData();
	fd.append('fileName', span);

	var key = pin;

	$.ajax({
		type: "POST",
		url: '/getFile',
		data: {
			'startSeed': lastParsedSeed,
			'limit': seedLimit
		},
		success: function (data, textStatus) {
				$.ajax({
					type: "POST",
					url: '/getFile',
					data: fd,
					//dataType:'blob',
					processData: false,
					contentType: false
				}).done(function (blob) {
						if(blob.length!=0){

							try {
								decrypt = fromAesBinary(key, blob);

								decrypt = from64binary(decrypt);

								var oMyBlob = new Blob([decrypt], {type: from64(file[fileName]['type'])});

								var a = document.createElement('a');
								a.href = window.URL.createObjectURL(oMyBlob.slice(0, from64(file[fileName]['size'])));
								a.download = from64(file[fileName]['name']);
								document.body.appendChild(a);
								a.click();

								$('#' + span + ' i').addClass('fa-file');
								$('#' + span + ' i').removeClass('fa-refresh');
								$('#' + span + ' i').removeClass('fa-spin');
							} catch (err) {
								$('#' + span).html('Error. Try again<i></i>');
								$('#' + span).addClass('label-danger<i></i>');


							}
						}else{
							$('#' + span).html('Error. File not found<i></i>');
							$('#' + span).addClass('label-danger<i></i>');
						}

					});

		},
		error: function (data, textStatus) {
			noAnswer('Error. Please refresh the page.');
		},
		dataType: 'json'
	});


}
