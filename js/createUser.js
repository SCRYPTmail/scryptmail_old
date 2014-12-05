/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 2:11 PM
 */

$(document).ready(function () {
	initCreateUser();
});

function initCreateUser() {

	$('#CreateUser_email').attr('name', makerandom());
	$('#CreateUser_passwordrepeat').attr('name', makerandom());
	$('#CreateUser_secretword').attr('name', makerandom());
	$('#CreateUser_secretwordRep').attr('name', makerandom());


	$.validator.addMethod("uniqueUserName", function (value, element) {
		var isSuccess = false;
		$.ajax({
			type: "POST",
			url: "",
			data: {'CreateUser[email]': SHA512($('#CreateUser_email').val().toLowerCase() + '@scryptmail.com'), 'ajax': 'smart-form-register'},
			dataType: "json",
			async: false,
			success: function (msg) {
				isSuccess = msg === true ? true : false
			}
		});
		return isSuccess;

	}, "Email is Already Taken");

	newUserValidator = $("#createUser-form").validate();

	$("#CreateUser_email").rules("add", {
		premail: true,
		required: true,
		minlength: 3,
		maxlength: 200,
		uniqueUserName: true
	});

	$("#CreateUser_password").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80

	});

	$("#CreateUser_passwordrepeat").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#CreateUser_password',
		messages: {
			required: 'Please enter your password one more time',
			equalTo: 'Please enter the same password as above'
		}
	});

	$("#CreateUser_secretword").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80

	});

	$("#CreateUser_secretwordRep").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#CreateUser_secretword',
		messages: {
			required: 'Please enter your secret phrase one more time',
			equalTo: 'Please enter the same secret phrase  as above'
		}
	});

}

function createAccount() {
	newUserValidator.form();
	if (newUserValidator.numberOfInvalids() == 0) {

		var error = 0;
		if ($('#CreateUser_password').val().length < 6 || $('#CreateUser_password').val().length > 80) {
			$('#pserror').html("Password length should be between 6 and 80 character long.");
			$('#passError').addClass('state-error');
			error = 1;
		}
		if ($('#CreateUser_password').val() != $('#CreateUser_passwordrepeat').val()) {
			$('#passwordrepeat').html("password not match");
			$('#passrError').addClass('state-error');
			error = 1;
		} else {
			$('#pserror').html("");
		}

		if ($('#CreateUser_secretword').val().length < 6 || $('#CreateUser_secretword').val().length > 80) {
			$('#swerror').html("Secret should be between 6 and 80 character long.");
			$('#secrError').addClass('state-error');
			error = 1;
		}
		if (error == 0) {
			var email = $('#CreateUser_email').val().toLowerCase().split('@')[0];
			email = email + '@scryptmail.com';

			//$('#CreateUser_email').val($('#CreateUser_email').val()+'@scryptmail.com');

			var rsa = forge.pki.rsa;
			var pki = forge.pki;

			var dfdseed = new $.Deferred();
			var dfdmail = new $.Deferred();
			var dfdsig = new $.Deferred();

			$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Seed keys..");

			var seedpair = rsa.createKeyPairGenerationState(512,0x10001);

			var step = function() {
				// run for 100 ms
				if(!rsa.stepKeyPairGenerationState(seedpair, 100)) {
					setTimeout(step, 1);
				}
				else {
					$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Mail keys..");
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
						$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Sign keys..");
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
						$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating User Object..");
						dfdsig.resolve();
					}
				};
				setTimeout(step);

			});

			dfdsig.done(function () {

				var salt = forge.random.getBytesSync(256);
				var secret = $('#CreateUser_secretword').val();

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

				$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Encrypting User Object..");

				var prof = toAes(folderKey, makerandom() + JSON.stringify(to64(prof_setting)) + makerandom());
				var contact = toAes(folderKey, makerandom() + JSON.stringify(contactObj) + makerandom());
				var blackList = toAes(folderKey, makerandom() + JSON.stringify(blackListObj) + makerandom());

				var MainObj = {};

				var token = forge.random.getBytesSync(256);
				var tokenHash=SHA512(token);
				var tokenAes=toAesToken(keyA, token);
				var tokenAesHash=SHA512(tokenAes);
				toFile=tokenAes;

				MainObj['salt'] = forge.util.bytesToHex(salt);
				MainObj['tokenHash'] = tokenHash;
				MainObj['tokenAesHash'] = tokenAesHash;
				MainObj['UserObject'] = usObFish.toString();
				MainObj['FolderObject'] = flObAesCipher.toString();
				MainObj['ModKey'] = SHA512(userObj['modKey']);
				MainObj['contacts'] = contact.toString();
				MainObj['blackList'] = blackList.toString();
				MainObj['seedKey'] = userObj['SeedPublic'];
				MainObj['mailKey'] = userObj['MailPublic'];
				MainObj['sigKey'] = userObj['SignaturePublic'];
				MainObj['prof'] = prof;
				MainObj['mailHash'] = SHA512(email);
				MainObj['password'] = SHA512($('#CreateUser_password').val());

				///console.log(MainObj['password']);


				MainObj = JSON.stringify(MainObj);


				// console.log('UserObj ' +MainObj );

				$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving user..");

				$.ajax({
					type: "POST",
					url: '/createSelectedUser',
					data: {
						'CreateUser': MainObj
					},
					success: function (data, textStatus) {
						if (data.email == 'success') {
							$('#reguser').text('User Created');
							$('#reguser i').remove();
							$('#yModal').modal("show");

						}else if (data.email == 'reserved') {
							noAnswer('This email address reserved for internal use.')
							$('#reguser i').remove();
						}else
							noAnswer('Error occurred. Please try again.')

					},
					dataType: 'json'
				});


			});


		}
	}
}