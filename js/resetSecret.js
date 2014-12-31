/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
function initialResetSecret()
{
	$.validator.addMethod("verifyPassword", function (value, element) {
		var isSuccess = false;

		$.ajax({
			type: "POST",
			url: "/verifyPassword",
			data: {
				'mailHash': SHA512singl($('#resetSecret_email').val().toLowerCase()),
				'tokenHash':resetAesTokenHash,
				'pass':SHA512singl($("#resetSecret_password").val())
			},
			dataType: "json",
			async: false,
			success: function (msg) {
				//if(msg === true)
				isSuccess = msg === true ? true : false
			}
		});
		return isSuccess;

	}, "password is not correct");


	resetPassValidator = $("#resetSecret-form").validate();

	$("#resetSecret_email").rules("add", {
		email: true,
		required: true,
		minlength: 3,
		maxlength: 200
		//	verifyEmail: true
	});

	$("#showToken").rules("add", {
		required: true
	});


	$("#resetSecret_secret").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80

	});

	$("#resetSecret_secretRep").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#resetSecret_secret',
		messages: {
			required: 'Please enter your secret one more time',
			equalTo: 'Please enter the same secret as above'
		}
	});

	$("#resetSecret_password").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		verifyPassword: true

	});
}


function verifySecretToken(){ //for reset secret phrase

	var respvalidator = $( "#resetSecret-form" ).validate();
	respvalidator.element( "#resetSecret_email" );

	if(respvalidator.element( "#resetSecret_email" )){
		file = $('#tokenField')[0].files[0];
		var reader = new FileReader();
		reader.onload = function (e) {
			toFile=reader.result;
			$.ajax({
				type: "POST",
				url: '/verifyToken',
				data: {
					'mailHash': SHA512singl($('#resetSecret_email').val().toLowerCase()),
					'tokenHash':SHA512singl(toFile)
				},
				success: function (data, textStatus) {
					if (data.response===true) {
						resetAesTokenHash=SHA512singl(toFile);
						$('#showToken').val(toFile.substring(0, 20)+'...');
						$("#showToken").valid();
						$('#resetSecret_password').val('');
						$('#resetSecret_secretRep').val('');
						$('#resetSecret_secret').val('');
						$('#tokenField').val('');

					}else if (data.response ===false) {
						respvalidator.showErrors({
							"pema": "Email is not assigned to this token"
						});
						$('#tokenField').val('');
						$('#resetSecret_password').val('');
						$('#resetSecret_secretRep').val('');
						$('#resetSecret_secret').val('');
						$('#showToken').val('');
					}else{
						$('#tokenField').val('');
						noAnswer('Connection problem. Please try again.')
					}
//aaaaaa@scryptmail.com
				},
				dataType: 'json'
			});

		}
		reader.readAsText(file);
	}else{
		$('#resetSecret_password').val('');
		$('#resetSecret_secret').val('');
		$('#resetSecret_secretRep').val('');
		$('#tokenField').val('');
		$('#showToken').val('');
	}

}
function resetForgotSecret(count)
{

	count = typeof count !== 'undefined' ? count : 0;
	if(count<=2){

		var respvalidator = $( "#resetSecret-form" ).validate();
		respvalidator.form();

		if(respvalidator.numberOfInvalids()==0){
			$('#resetSecButton').prop("disabled",true);
			var rsa = forge.pki.rsa;
			var pki = forge.pki;

			var dfdseed = new $.Deferred();
			var dfdmail = new $.Deferred();
			var dfdsig = new $.Deferred();

			var seedpair = rsa.createKeyPairGenerationState(512,0x10001);

			var step = function() {
				// run for 100 ms
				if(!rsa.stepKeyPairGenerationState(seedpair, 100)) {
					setTimeout(step, 1);
				}
				else {
					$('#resetSecButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Mail keys..");
					dfdseed.resolve();
				}
			};
			setTimeout(step);

			var mailpair ='';

			dfdseed.done(function () {

				mailpair = rsa.createKeyPairGenerationState(1024, 0x10001);

				var step = function() {
					// run for 100 msvar t=0;
					if(!rsa.stepKeyPairGenerationState(mailpair, 100)) {
						setTimeout(step, 1);
					}
					else {
						$('#resetSecButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Sign keys..");
						dfdmail.resolve();
					}
				};
				setTimeout(step);
			});
			var sigpair='';
			dfdmail.done(function () {

				sigpair = rsa.createKeyPairGenerationState(1024,0x10001);

				var step = function() {
					// run for 100 ms
					if(!rsa.stepKeyPairGenerationState(sigpair, 100)) {
						setTimeout(step, 1);
					}
					else {
						$('#resetSecButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating User Object..");
						dfdsig.resolve();
					}
				};
				setTimeout(step);

			});

			dfdsig.done(function () {

				var email = $('#resetSecret_email').val().toLowerCase();

				var salt = forge.random.getBytesSync(256);
				var secret = $('#resetSecret_secret').val();

				//console.log("-"+$('#CreateUser_password').val()+"-");
				//console.log("-"+secret+"-");


				var derivedKey = makeDerived(secret, salt);

				var Test = forge.util.bytesToHex(derivedKey);

				var Part1 = Test.substr(0, 64);
				var Part2 = Test.substr(64, 128);

				var keyT = CryptoJS.enc.Hex.parse(Part1);
				var keyA = forge.util.hexToBytes(Part2);

				var folderKey = forge.random.getBytesSync(32);

				var userObj = {};
				userObj['SeedPublic'] = to64(pki.publicKeyToPem(seedpair.keys.publicKey)); //seedPb
				userObj['SeedPrivate'] = to64(pki.privateKeyToPem(seedpair.keys.privateKey)); //seedPr
				userObj['MailPublic'] = to64(pki.publicKeyToPem(mailpair.keys.publicKey)); //mailPb
				userObj['MailPrivate'] = to64(pki.privateKeyToPem(mailpair.keys.privateKey)); //mailPr

				userObj['SignaturePublic'] = to64(pki.publicKeyToPem(sigpair.keys.publicKey));
				userObj['SignaturePrivate'] = to64(pki.privateKeyToPem(sigpair.keys.privateKey));

				userObj['folderKey'] = to64(forge.util.bytesToHex(folderKey));

				userObj['modKey'] = forge.util.bytesToHex(forge.pkcs5.pbkdf2(makerandom(), salt, 216, 32));

				usOb = JSON.stringify(userObj);

				usObAesCipher = toAes(keyA, makerandom() + usOb + makerandom());

				var usObFish = toFish(keyT, usObAesCipher);

				// console.log('UserObj ' + usObFish);

				var folderObj = {};

				folderObj['Inbox'] = {};
				folderObj['Sent'] = {};
				folderObj['Draft'] = {};
				folderObj['Spam'] = {};
				folderObj['Trash'] = {};
				folderObj['Custom'] = {};

				flOb = JSON.stringify(folderObj);

				var flObAesCipher = toAes(folderKey, makerandom() + flOb + makerandom());

				var contactObj = {}
				var blackListObj = [];
				var prof_setting = {};
				prof_setting['email'] = email;
				prof_setting['name'] = '';
				prof_setting['lastSeed'] = 0;

				$('#resetSecButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Encrypting User Object..");

				var prof = toAes(folderKey, makerandom() + JSON.stringify(to64(prof_setting)) + makerandom());
				var contact = toAes(folderKey, makerandom() + JSON.stringify(contactObj) + makerandom());
				var blackList = toAes(folderKey, makerandom() + JSON.stringify(blackListObj) + makerandom());

				var MainObj = {};

				var token = forge.random.getBytesSync(256);
				var tokenHash=SHA512singl(token);
				var tokenAes=toAesToken(keyA, token);
				var tokenAesHash=SHA512singl(tokenAes);
				toFile=tokenAes;

				//console.log(tokenHash);
				//var tokenBase=to64binary(token);
				//console.log(tokenBase);

				//var tokenFromBase=window.atob(tokenBase);
				//console.log(tokenFromBase);
				//var tokenFromBaseHash=SHA512singl(tokenFromBase);
				//console.log(tokenFromBaseHash);

				MainObj['salt'] = forge.util.bytesToHex(salt);
				MainObj['tokenHash'] = tokenHash;
				MainObj['tokenAesHash'] = tokenAesHash;
				MainObj['UserObject'] = usObFish.toString();
				MainObj['FolderObject'] = flObAesCipher.toString();
				MainObj['ModKey'] = SHA512singl(userObj['modKey']);
				MainObj['contacts'] = contact.toString();
				MainObj['blackList'] = blackList.toString();
				MainObj['seedKey'] = userObj['SeedPublic'];
				MainObj['mailKey'] = userObj['MailPublic'];
				MainObj['sigKey'] = userObj['SignaturePublic'];
				MainObj['seedKHash']=SHA512singl(pki.publicKeyToPem(seedpair.keys.publicKey));
				MainObj['mailKHash']=SHA512singl(pki.publicKeyToPem(mailpair.keys.publicKey));
				MainObj['sigKHash']=SHA512singl(pki.publicKeyToPem(sigpair.keys.publicKey));

				MainObj['prof'] = prof;
				MainObj['mailHash'] = SHA512singl(email);
				MainObj['oldAesTokenHash'] =resetAesTokenHash;
				MainObj['password'] = SHA512singl($('#resetSecret_password').val());

				///console.log(MainObj['password']);


				MainObj = JSON.stringify(MainObj);


				// console.log('UserObj ' +MainObj );

				$('#resetSecButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving user..");

				//console.log(MainObj);

				$.ajax({
					type: "POST",
					url: '/resetUserObject',
					data: {
						'CreateUser': MainObj
					},
					success: function (data, textStatus) {
						if (data.email == 'success') {
							$('#resetSecButton').text('User Created');
							$('#resetSecButton i').remove();
							$('#resetSecButton').prop("disabled",false);
							$('#yModal').modal("show");

						}else if(data.email == 'error'){
							count++;
							resetForgotSecret(count);

						}else{
							noAnswer('Error occurred. Please try again.');
							$('#resetSecButton').prop("disabled",false);
							$('#resetSecButton i').remove();
							$('#resetSecButton').text('Reset Secret');
						}


					},
					error: function (data, textStatus) {
					noAnswer('Error occurred. Please try again');
				},
					dataType: 'json'
				});


			});
		}

	}else{
		noAnswer('Error occurred. Please try again.');
		$('#resetSecButton').prop("disabled",false);
		$('#resetSecButton i').remove();
		$('#resetSecButton').text('Reset Secret');
	}
}
