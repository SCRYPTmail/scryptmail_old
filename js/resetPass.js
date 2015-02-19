/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
function initialResetPassword() {

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
		var secret = $("#resetPass_secret").val();

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
				'tokenHash': SHA512singl(f)
			},
			dataType: "json",
			async: false,
			success: function (msg) {
				if (msg === true)
					resetRawTokenHash = SHA512singl(f);
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

function verifyToken() { //for reset password

	var respvalidator = $("#resetPass-form").validate();
	respvalidator.element("#resetPass_email");

	if (respvalidator.element("#resetPass_email")) {
		file = $('#tokenField')[0].files[0];
		var reader = new FileReader();
		reader.onload = function (e) {
			toFile = reader.result;
			$.ajax({
				type: "POST",
				url: '/verifyToken',
				data: {
					'mailHash': SHA512singl($('#resetPass_email').val().toLowerCase()),
					'tokenHash': SHA512singl(toFile)
				},
				success: function (data, textStatus) {
					if (data.response === true) {
						resSalt = data.salt;
						resetAesTokenHash = SHA512singl(toFile);
						$('#showToken').val(toFile.substring(1, 20) + '...');
						$("#showToken").valid();
						$('#resetPass_secret').val('');
						$('#resetPass_passwordRepeat').val('');
						$('#resetPass_password').val('');
						$('#tokenField').val('');
						if (data.oneStep) {
							oneStep = true;
							//$("#resetPass_secret").rules( "remove", "required verifySecret" );
							$("#resPass").remove();
							$('#resetPass-form small').html('<small>Please follow the order<br><i class="fa fa-warning txt-color-red"></i> Resetting your secret phrase will render all your previous messages and contacts unavailable. Proceed with caution.</small>');
						} else {
							oneStep = false;
						}

					} else if (data.response === false) {
						respvalidator.showErrors({
							"pema": "Email is not assigned to this token"
						});
						$('#tokenField').val('');
						$('#resetPass_secret').val('');
						$('#resetPass_passwordRepeat').val('');
						$('#resetPass_password').val('');
						$('#showToken').val('');
					} else {
						$('#tokenField').val('');
						noAnswer('Error. Please try again.')
					}
//aaaaaa@scryptmail.com
				},
				dataType: 'json'
			});

		}
		reader.readAsText(file);
	} else {
		$('#resetPass_secret').val('');
		$('#resetPass_passwordRepeat').val('');
		$('#resetPass_password').val('');
		$('#tokenField').val('');
		$('#showToken').val('');
	}


}

function resetOneStepPass(count) {
	if (count <= 2) {

		$('#resetPassButton').prop("disabled", true);
		$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Keys..");
		var dfdmail = new $.Deferred();


		var mailpair = '';

		generatePairs(1024, function (keyPair) {
			mailpair = keyPair;
			dfdmail.resolve();
		});

		dfdmail.done(function () {

			var email = $('#resetPass_email').val().toLowerCase();
			var secret = $('#resetPass_password').val();

			$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Encrypting User Object..");

			generateUserObj(mailpair, secret, email,true, function (DATA) {
				var derivedPass = makeDerivedFancy(secret, 'scrypTmail');
				MainObj = DATA['MainObj'];
				toFile = DATA['toFile'];
				MainObj['oldAesTokenHash'] = resetAesTokenHash;
				MainObj['password'] = SHA512singl(derivedPass);

				$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving user..");

				//console.log(MainObj);

				$.ajax({
					type: "POST",
					url: '/resetPassOneStep',
					data: MainObj,
					success: function (data, textStatus) {
						if (data.email == 'success') {
							$('#resetPassButton').text('New Password is set.');
							$('#resetPassButton i').remove();
							//$('#resetPassButton').prop("disabled",false);
							$('#yModal').modal("show");

						} else if (data.email == 'error') {
							count++;
							resetForgotSecret(count);

						} else {
							noAnswer('Error. Please try again.');
							$('#resetPassButton').prop("disabled", false);
							$('#resetPassButton i').remove();
							$('#resetPassButton').text('Reset Secret');
						}


					},
					error: function (data, textStatus) {
						noAnswer('Error. Please try again.');
						$('#resetPassButton').prop("disabled", false);
						$('#resetPassButton i').remove();
						$('#resetPassButton').text('Reset Secret');
					},
					dataType: 'json'
				});

			});


		});


	} else {
		noAnswer('Error. Please try again.');
		$('#resetPassButton').prop("disabled", false);
		$('#resetPassButton i').remove();
		$('#resetPassButton').text('Reset Password');
	}

}


function resetForgotPass() {

	var respvalidator = $("#resetPass-form").validate();
	respvalidator.form();

	if (respvalidator.numberOfInvalids() == 0) {
		$('#resetPassButton').prop("disabled", true);
		$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving Password");

		if (oneStep) {
			resetOneStepPass(0);

		} else {
			$.ajax({
				type: "POST",
				url: '/resetPass',
				data: {
					'mailHash': SHA512singl($("#resetPass_email").val().toLowerCase()),
					'tokenHash': resetRawTokenHash,
					'tokenAesHash': resetAesTokenHash,
					'newPass': SHA512singl($('#resetPass_password').val())
				},
				success: function (data, textStatus) {
					if (data.result == 'success') {

						$('#resetPassButton').html("Saved");
						systemMessage('Saved');
						respvalidator.resetForm();
						$('#resetPass-form')[0].reset();
					} else if (data.result == 'fail') {
						$('#resetPassButton').prop("disabled", false);
						$('#resetPassButton').html("Reset Password");
						errorMessage('tryAgain');
					} else {
						$('#tokenField').val('');
						systemMessage('tryAgain');
					}
				},
				error: function (data, textStatus) {
					$('#resetPassButton').prop("disabled", false);
					$('#resetPassButton').html("Reset Password");
					systemMessage('tryAgain');
				},
				dataType: 'json'
			});
		}

	}
}

