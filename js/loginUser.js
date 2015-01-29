/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 2:20 PM
 */
function submitBug() {

	var submBug =$("#report-form").validate({
		rules : {

			email : {
				required : true,
				email : true
			},
			os : {
				required : true
			},
			device : {
				required : true
			},
			comment : {
				required : true,
				minlength: 10,
				maxlength: 1000

			}
		},

		// Messages for form validation
		messages : {
			email : {
				required : 'Please enter your email address',
				email : 'Please enter a valid email address'
			},
			comment : {
				required : 'Please provide information'
			},
			os : {
				required : 'Please select Operation System'
			},
			device : {
				required : 'Please select your device'
			}
		},

		// Do not change code below
		errorPlacement : function(error, element) {
			error.insertAfter(element.parent());
		}
	});
	submBug.form();
	if (submBug.numberOfInvalids() == 0) {
		$.ajax({
			type: "POST",
			url: '/SubmitBug',
			data: $('#report-form').serialize(),

			success: function (data, textStatus) {
				if(data.answer=='success'){
					Answer('Your report has been submitted.');
					setTimeout(function () {
						$("#report-form")[0].reset();
						$('#reportBug-modal').modal('hide');
					}, 700);

				}else{
					noAnswer('Error. Please try again.');
				}
			},
			error: function (data, textStatus) {
				noAnswer('Error. Please try again.')
			},
			dataType: 'json'
		});

	}
}


function submitLogin() {

	var arr = $('#LoginForm_username').val().split("@");

	if (arr.length == 1)
		var email = arr[0].toLowerCase() + '@scryptmail.com';
	else
		var email = $('#LoginForm_username').val().toLowerCase();

	$.ajax({
		type: "POST",
		url: '/ModalLogin',
		data: {
			'LoginForm[username]': SHA512singl(email),
			'LoginForm[password]': SHA512singl($('#LoginForm_password').val()),
			'LoginForm[newPassword]': SHA512singl(makeDerivedFancy($('#LoginForm_password').val(), 'scrypTmail'))

		},
		success: function (data, textStatus) {
			if (data.answer == "welcome") {
				if(data.oneStep===true){
					window.name = data.data+','+to64($('#LoginForm_password').val());
					$(window).unbind('beforeunload');
					window.location = '/';
				}else{
					window.name = data.data;
					$(window).unbind('beforeunload');
					window.location = '/';
				}

			}else if(data.answer == "Limit is reached"){
				noAnswer('You\'ve reached the maximum of login attempts. Please try again in few minutes.');
			} else {
				noAnswer('Wrong Username or Password. Please try again.');
			}
		},
		error: function (data, textStatus) {
			//cancel();
			noAnswer('Error. Please try again.')
		},
		dataType: 'json'
	});


	// LoginForm_password1
}
