/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 2:20 PM
 */

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
			'LoginForm[password]': SHA512singl($('#LoginForm_password').val())

		},
		success: function (data, textStatus) {
			if (data.answer == "welcome") {
				window.name = data.data;
				$(window).unbind('beforeunload');
				window.location = '/';
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
