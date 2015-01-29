/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
function initialResetPassword(){

	$.validator.addMethod("verifyEmail", function (value, element) {
		var isSuccess = false;
		$.ajax({
			type: "POST",
			url: "/checkEmailExist",
			data: {'CreateUser[email]': SHA512singl($('#resetPass_email').val().toLowerCase()), 'ajax': 'smart-form-register'},
			dataType: "json",
			async: false,
			success: function (msg) {
				isSuccess = msg === false ? true : false
			}
		});
		return isSuccess;

	}, "Email Not Found");

	$.validator.addMethod("verifySecret", function (value, element) {
		var isSuccess = false;
		var secret=$("#resetPass_secret").val();

		var salt = forge.util.hexToBytes(resSalt);
		var derivedKey = makeDerived(secret, salt);

		var Test = forge.util.bytesToHex(derivedKey);

		var keyA = forge.util.hexToBytes(Test.substr(64, 128));
		var f = fromAesToken(keyA, toFile);

		$.ajax({
			type: "POST",
			url: "/verifyRawToken",
			data: {
				'mailHash': SHA512singl($('#resetPass_email').val().toLowerCase()),
				'tokenHash':SHA512singl(f)
			},
			dataType: "json",
			async: false,
			success: function (msg) {
				if(msg === true)
					resetRawTokenHash=SHA512singl(f);
				isSuccess = msg === true ? true : false
			}
		});
		return isSuccess;

	}, "Secret phrase is not correct");

	resetPassValidator = $("#resetPass-form").validate();

	$("#resetPass_email").rules("add", {
		email: true,
		required: true,
		minlength: 3,
		maxlength: 200
		//	verifyEmail: true
	});

	$("#showToken").rules("add", {
		required: true
	});


	$("#resetPass_password").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80

	});

	$("#resetPass_passwordRepeat").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#resetPass_password',
		messages: {
			required: 'Please enter your password one more time',
			equalTo: 'Please enter the same password as above.'
		}
	});

	$("#resetPass_secret").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		verifySecret: true

	});


}

function verifyToken(){ //for reset password

	var respvalidator = $( "#resetPass-form" ).validate();
	respvalidator.element( "#resetPass_email" );

	if(respvalidator.element( "#resetPass_email" )){
		file = $('#tokenField')[0].files[0];
		var reader = new FileReader();
		reader.onload = function (e) {
			toFile=reader.result;
			$.ajax({
				type: "POST",
				url: '/verifyToken',
				data: {
					'mailHash': SHA512singl($('#resetPass_email').val().toLowerCase()),
					'tokenHash':SHA512singl(toFile)
				},
				success: function (data, textStatus) {
					if (data.response===true) {
						resSalt=data.salt;
						resetAesTokenHash=SHA512singl(toFile);
						$('#showToken').val(toFile.substring(1, 20)+'...');
						$("#showToken").valid();
						$('#resetPass_secret').val('');
						$('#resetPass_passwordRepeat').val('');
						$('#resetPass_password').val('');
						$('#tokenField').val('');
						if(data.oneStep){
							oneStep=true;
							//$("#resetPass_secret").rules( "remove", "required verifySecret" );
							$("#resPass").remove();
							$('#resetPass-form small').html('<small>Please follow the order<br><i class="fa fa-warning txt-color-red"></i> Resetting your secret phrase will render all your previous messages and contacts unavailable. Proceed with caution.</small>');
						}else{
							oneStep=false;
						}

					}else if (data.response ===false) {
						respvalidator.showErrors({
							"pema": "Email is not assigned to this token"
						});
						$('#tokenField').val('');
						$('#resetPass_secret').val('');
						$('#resetPass_passwordRepeat').val('');
						$('#resetPass_password').val('');
						$('#showToken').val('');
					}else{
						$('#tokenField').val('');
						noAnswer('Error. Please try again.')
					}
//aaaaaa@scryptmail.com
				},
				dataType: 'json'
			});

		}
		reader.readAsText(file);
	}else{
		$('#resetPass_secret').val('');
		$('#resetPass_passwordRepeat').val('');
		$('#resetPass_password').val('');
		$('#tokenField').val('');
		$('#showToken').val('');
	}


}

function resetOneStepPass(count)
{

	if(count<=2){

			$('#resetPassButton').prop("disabled",true);
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
					$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Mail keys..");
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
						$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Sign keys..");
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
						$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating User Object..");
						dfdsig.resolve();
					}
				};
				setTimeout(step);

			});

			dfdsig.done(function () {

				var email = $('#resetPass_email').val().toLowerCase();

				var salt = forge.random.getBytesSync(256);
				var secret = $('#resetPass_password').val();

				//console.log("-"+$('#CreateUser_password').val()+"-");
				//console.log("-"+secret+"-");


				var derivedKey = makeDerived(secret, salt);
				var derivedPass = makeDerivedFancy(secret, 'scrypTmail');

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
				prof_setting['oneStep'] = true;
				prof_setting['disposableEmails'] = {};

				$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Encrypting User Object..");

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
				MainObj['password'] = SHA512singl(derivedPass);

				///console.log(MainObj['password']);


				MainObj = JSON.stringify(MainObj);


				// console.log('UserObj ' +MainObj );

				$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving user..");

				//console.log(MainObj);

				$.ajax({
					type: "POST",
					url: '/resetPassOneStep',
					data: {
						'CreateUser': MainObj
					},
					success: function (data, textStatus) {
						if (data.email == 'success') {
							$('#resetPassButton').text('New Password is set.');
							$('#resetPassButton i').remove();
							//$('#resetPassButton').prop("disabled",false);
							$('#yModal').modal("show");

						}else if(data.email == 'error'){
							count++;
							resetForgotSecret(count);

						}else{
							noAnswer('Error. Please try again.');
							$('#resetPassButton').prop("disabled",false);
							$('#resetPassButton i').remove();
							$('#resetPassButton').text('Reset Secret');
						}


					},
					error: function (data, textStatus) {
						noAnswer('Error. Please try again.');
					},
					dataType: 'json'
				});


			});


	}else{
		noAnswer('Error. Please try again.');
		$('#resetPassButton').prop("disabled",false);
		$('#resetPassButton i').remove();
		$('#resetPassButton').text('Reset Password');
	}

}


function resetForgotPass(){

	var respvalidator = $( "#resetPass-form" ).validate();
	respvalidator.form();

	if(respvalidator.numberOfInvalids()==0){
		$('#resetPassButton').prop("disabled",true);
		$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving Password");

		if(oneStep){
			resetOneStepPass(0);

		}else{
			$.ajax({
				type: "POST",
				url: '/resetPass',
				data: {
					'mailHash': SHA512singl($("#resetPass_email").val().toLowerCase()),
					'tokenHash':resetRawTokenHash,
					'tokenAesHash':resetAesTokenHash,
					'newPass':SHA512singl($('#resetPass_password').val())
				},
				success: function (data, textStatus) {
					if (data.result=='success') {
						Answer('New password saved');
						//$('#resetPassButton').prop("disabled",false);
						$('#resetPassButton').html("Saved");
						respvalidator.resetForm();
					}else if (data.result =='fail') {
						$('#resetPassButton').prop("disabled",false);
						$('#resetPassButton').html("Reset Password");
						noAnswer('Error. Please try again.');
					}else{
						$('#tokenField').val('');
						noAnswer('Connection problem. Please try again.');
					}
//aaaaaa@scryptmail.com
				},
				error: function (data, textStatus) {
					$('#resetPassButton').prop("disabled",false);
					$('#resetPassButton').html("Reset Password");
					noAnswer('Error. Please try again.');
				},
				dataType: 'json'
			});
		}

	}
}

