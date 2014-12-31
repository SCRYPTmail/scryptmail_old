/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 12/26/14
 * Time: 5:36 PM
 */


function requestInitInvitiation() {
	$('#inviteemail').attr('name', makerandom());

	$.validator.addMethod("uniqueUserName", function (value, element) {
		var isSuccess = false;
		$.ajax({
			type: "POST",
			url: "/checkMail",
			data: {'email': $('#inviteemail').val().toLowerCase(), 'ajax': 'smart-form-register'},
			dataType: "json",
			async: false,
			success: function (msg) {
				isSuccess = msg === true ? true : false
			}
		});
		return isSuccess;

	}, "Not correct email or already registered");

	newinvitation = $("#request-invitiation").validate();

	$("#inviteemail").rules("add", {
		email: true,
		required: true,
		minlength: 3,
		maxlength: 200,
		uniqueUserName: true
	});

}
function requestInvitiation() {
	newinvitation.form();

	if (newinvitation.numberOfInvalids() == 0) {

		$.ajax({
			type: "POST",
			url: '/saveInvite',
			data: {
				'email': $('#inviteemail').val().toLowerCase()
			},
			success: function (data, textStatus) {
				if (data.response === true) {
					Answer('Your request has been submitted');
					$('#inviteemail').val('');
				} else {
					noAnswer('Error occurred. Please try again, or submit a bug report');

				}

			},
			dataType: 'json'
		});

	}

}