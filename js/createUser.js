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


	$.validator.addMethod("uniqueUserName", function (value, element) {
		var isSuccess = false;
		$.ajax({
			type: "POST",
			url: "/checkEmailExist",
			data: {'CreateUser[email]': SHA512singl($('#CreateUser_email').val().toLowerCase() + '@scryptmail.com'), 'ajax': 'smart-form-register'},
			dataType: "json",
			async: false,
			success: function (msg) {
				isSuccess = msg === true ? true : false
			}
		});
		return isSuccess;

	}, "Email is Already Taken");
/* invitation part
	$.validator.addMethod("uniqueInvitation", function (value, element) {
		var isSuccess = false;
		$.ajax({
			type: "POST",
			url: "/checkInvitation",
			data: {
				'invitationToken': $('#CreateUser_invitation').val().toLowerCase()
			},
			dataType: "json",
			async: false,
			success: function (msg) {
				isSuccess = msg === true ? true : false
			}
		});
		return isSuccess;

	}, "Token not found or already used");
*/

	newUserValidator = $("#createUser-form").validate();
/*
	$("#CreateUser_invitation").rules("add", {
		required: true,
		minlength: 3,
		maxlength: 200,
		uniqueInvitation: true
	});
*/
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
			required: 'Please enter your password one more time.',
			equalTo: 'Please enter the same password as above.'
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

		if (error == 0) {
			var email = $('#CreateUser_email').val().toLowerCase().split('@')[0];
			email = email + '@scryptmail.com';

			//$('#CreateUser_email').val($('#CreateUser_email').val()+'@scryptmail.com');


			var dfdmail = new $.Deferred();

			//$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Seed keys..");
			$('#reguser').prop('disabled', true);


			var mailpair ='';


			generatePairs(1024,function(keyPair){
				mailpair=keyPair;
				$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating User Object..");
				dfdmail.resolve();
			});



			dfdmail.done(function () {

				var secret = $('#CreateUser_password').val();

				$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Encrypting User Object..");

				generateUserObj(mailpair,secret,email,true,function(DATA){
					var derivedPass = makeDerivedFancy(secret, 'scrypTmail');
					MainObj=DATA['MainObj'];
					toFile=DATA['toFile'];
					MainObj['password'] = SHA512singl(derivedPass);

					$('#reguser').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving user..");

					$.ajax({
						type: "POST",
						url: '/CreateUserDb',
						data:  DATA['MainObj'],
						success: function (data, textStatus) {
							if (data.email == 'success') {
								$('#reguser').text('User Created');
								$('#reguser i').remove();
								//$('#reguser').prop('disabled', true);
								$("#createUser-form")[0].reset();
								$('#createAccount-modal').modal('hide');
								$('#yModal').modal("show");
								$('#reguser').prop('disabled', false);

							}else if (data.email == 'reserved') {
								noAnswer('This email address reserved for internal use.');
								$('#reguser').prop('disabled', false);
								$('#reguser i').remove();
							}else{
								$('#reguser').prop('disabled', false);
								$('#reguser').text('Create');
								$('#reguser i').remove();
								noAnswer('Error. Please try again.');
							}


						},
						error: function (data, textStatus) {
							$('#reguser').prop('disabled', false);
							$('#reguser').text('Create');
							$('#reguser i').remove();
							noAnswer('Error. Please try again.');
						},
						dataType: 'json'
					});
				});

			});


		}
	}
}


