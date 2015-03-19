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
						noAnswer('Error. Please try again.')
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


			var dfdmail = new $.Deferred();


			var mailpair ='';

			$('#resetSecButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Keys..");

			generatePairs(2048, function (keyPair) {
				mailpair = keyPair;
				dfdmail.resolve();
			});


			dfdmail.done(function () {


				var email = $('#resetSecret_email').val().toLowerCase();
				var secret = $('#resetSecret_secret').val();

				$('#resetSecButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating User Object..");

				generateUserObj(mailpair, secret, email,false, function (DATA) {

					MainObj = DATA['MainObj'];
					toFile = DATA['toFile'];
					MainObj['oldAesTokenHash'] = resetAesTokenHash;
					MainObj['password'] = SHA512singl($('#resetSecret_password').val());

					$('#resetSecButton').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Saving user..");


					$.ajax({
						type: "POST",
						url: '/resetUserObject',
						data: MainObj,

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
								systemMessage('tryAgain');
								$('#resetSecButton').prop("disabled",false);
								$('#resetSecButton i').remove();
								$('#resetSecButton').text('Reset Secret');
							}


						},
						error: function (data, textStatus) {
							$('#resetSecButton').prop("disabled",false);
							$('#resetSecButton i').remove();
							$('#resetSecButton').text('Reset Secret');
							systemMessage('tryAgain');
						},
						dataType: 'json'
					});

				});

			});
		}

	}else{
		systemMessage('tryAgain');
		$('#resetSecButton').prop("disabled",false);
		$('#resetSecButton i').remove();
		$('#resetSecButton').text('Reset Secret');
	}
}
