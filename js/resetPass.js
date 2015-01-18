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

function resetForgotPass(){

	var respvalidator = $( "#resetPass-form" ).validate();
	respvalidator.form();

	if(respvalidator.numberOfInvalids()==0){
		$('#resetPassButton').prop("disabled",true);
		$('#resetPassButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving Password");

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

