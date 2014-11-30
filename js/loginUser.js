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
			} else {
				//remove in future
				$.ajax({
					type: "POST",
					url: '/ModalLogin',
					data: {
						'LoginForm[username]': SHA512singl(email),
						'LoginForm[password]': SHA512old($('#LoginForm_password').val())

					},
					success: function (data, textStatus) {
						if (data.answer == "welcome") {
							window.name = data.data;

							$(window).unbind('beforeunload');
							setTimeout(function(){
								window.location = '/#profile';
							},5000);

							noAnswer('Password with old HASH, Please update your password in settings');
						} else {
							noAnswer('Wrong Usernaim or password. Please try again');
						}
					},
					error: function (data, textStatus) {
						cancel();
						noAnswer('Error. Please try again9')
					},
					dataType: 'json'
				});
				//end remove in 2 weeks
			}
		},
		error: function (data, textStatus) {
			cancel();
			noAnswer('Error. Please try again9')
		},
		dataType: 'json'
	});


	// LoginForm_password1
}