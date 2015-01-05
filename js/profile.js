/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 2:30 PM
 */
$(document).ready(function () {

	activePage = 'profile';
	currentTab();
	$('#newFname').attr('name', makerandom());

	contactListProfileInitialized = false;
	safeBoxProfileInitialized = false;
	blackListProfileInitialized = false;
	disposableListProfileInitialized = false;

});

function narrowSelections(seedKey) {

	if (seedKey == 0) {

		$('#UpdateKeys_mode_0').attr('disabled', 'disabled');
		$('#label512').css('color', '#bbb');
		$('#label512').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_1').attr('disabled', 'disabled');
		$('#label1024').css('color', '#bbb');
		$('#label1024').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_3').attr('disabled', 'disabled');
		$('#labelcustom').css('color', '#bbb');
		$('#labelcustom').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_2').attr('disabled', 'disabled');
		$('#label2048').css('color', '#bbb')
		$('#label2048').attr('title', 'Please upgrade membership to unlock.');

	}

	if (seedKey == 512) {

		$('#UpdateKeys_mode_0').attr('checked', 'checked');

		$('#UpdateKeys_mode_1').attr('disabled', 'disabled');
		$('#label1024').css('color', '#bbb');
		$('#label1024').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_3').attr('disabled', 'disabled');
		$('#labelcustom').css('color', '#bbb');
		$('#labelcustom').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_2').attr('disabled', 'disabled');
		$('#label2048').css('color', '#bbb')
		$('#label2048').attr('title', 'Please upgrade membership to unlock.');

	}

	if (seedKey == 1024) {

		$('#UpdateKeys_mode_1').attr('checked', 'checked');

		$('#UpdateKeys_mode_3').attr('disabled', 'disabled');
		$('#labelcustom').css('color', '#bbb');
		$('#labelcustom').attr('title', 'Please upgrade membership to unlock.');

		$('#UpdateKeys_mode_2').attr('disabled', 'disabled');
		$('#label2048').css('color', '#bbb')
		$('#label2048').attr('title', 'Please upgrade membership to unlock.');

	}

	if (seedKey >= 2048) {

		$('#UpdateKeys_mode_2').attr('checked', 'checked');

		$('#UpdateKeys_mode_3').attr('disabled', 'disabled');
		$('#labelcustom').css('color', '#bbb');
		$('#labelcustom').attr('title', 'Please upgrade membership to unlock.');

	}
	if (roleData['role']['importKeys'] == "1") {
		$('#UpdateKeys_seedPrK').removeProp('disabled');
		$('#UpdateKeys_mailPrK').removeProp('disabled');
		$('#UpdateKeys_seedPubK').removeProp('disabled');
		$('#UpdateKeys_mailPubK').removeProp('disabled');
	}
}

function changeTimeout(tim) {

	if (!isNaN(tim.val())) {
		profileSettings['sessionExpiration'] = parseInt(tim.val());
		sessionTimeOut = parseInt(tim.val());
		checkProfile();
		Answer('Saved');
	}
	//console.log(tim.val());
}

function changeMessagesPerPage(tim) {
	if (!isNaN(tim.val())) {
		profileSettings['mailPerPage'] = parseInt(tim.val());
		checkProfile();
		Answer('Saved');
	}
}

function saveProfileName() {
	profileSettings['name'] = stripHTML($('#newFname').val());
	checkProfile();
	populateProfile();
}

function gotoUpdateKeys() {

	$("[rel=popover-hover]").popover({
		trigger : "hover",
		html: true

	});

	checkState(function () {
		var user = validateUserObject();
		var role = validateUserRole();
		var seedKey = role['role']['seedMaxKeyLength'];
		var mailKey = role['role']['mailMaxKeyLength'];

		$('#UpdateKeys_seedPrK').attr('name', makerandom());
		$('#UpdateKeys_mailPrK').attr('name', makerandom());
		$('#UpdateKeys_seedPubK').attr('name', makerandom());
		$('#UpdateKeys_mailPubK').attr('name', makerandom());
		//calcPerformance();
		//console.log('gggg');
		narrowSelections(seedKey);
	}, function () {

	});
}

function retrieveKeys() {

	provideSecret(function (secret) {
		if (userObj = validateUserObject()) {
			var user = dbToProfile(userObj, secret);

			user1 = JSON.parse(user, true);

			$('#UpdateKeys_seedPrK').val(from64(user1['SeedPrivate']));
			$('#UpdateKeys_seedPubK').val(from64(user1['SeedPublic']));
			$('#UpdateKeys_mailPrK').val(from64(user1['MailPrivate']));
			$('#UpdateKeys_mailPubK').val(from64(user1['MailPublic']));
			validateSeedKeys();
			validateMailKeys();
		}
	}, function () {

	});
}

function validateSeedKeys() {
	var pki = forge.pki;
	if ($('#UpdateKeys_seedPrK').val() != '' && $('#UpdateKeys_seedPubK').val() != '') {
		try {
			var sprivateKey = pki.privateKeyFromPem($('#UpdateKeys_seedPrK').val());
			var spublicKey = pki.publicKeyFromPem($('#UpdateKeys_seedPubK').val());

			var sencrypted = spublicKey.encrypt('test', 'RSA-OAEP');
			var sdecrypted = sprivateKey.decrypt(sencrypted, 'RSA-OAEP');

			if (sdecrypted == "test") {
				$('#UpdateKeys_seedPrK').parent().removeClass('state-error');
				$('#UpdateKeys_seedPubK').parent().removeClass('state-error');
				$('#UpdateKeys_seedPrK').parent().addClass('state-success');
				$('#UpdateKeys_seedPubK').parent().addClass('state-success');
			} else {
				$('#UpdateKeys_seedPrK').parent().removeClass('state-success');
				$('#UpdateKeys_seedPubK').parent().removeClass('state-success');
				$('#UpdateKeys_seedPrK').parent().addClass('state-error');
				$('#UpdateKeys_seedPubK').parent().addClass('state-error');
			}

		}
		catch (err) {
			$('#UpdateKeys_seedPrK').parent().removeClass('state-success');
			$('#UpdateKeys_seedPubK').parent().removeClass('state-success');
			$('#UpdateKeys_seedPrK').parent().addClass('state-error');
			$('#UpdateKeys_seedPubK').parent().addClass('state-error');
		}
	} else {
		$('#UpdateKeys_seedPrK').parent().removeClass('state-success');
		$('#UpdateKeys_seedPubK').parent().removeClass('state-success');
		$('#UpdateKeys_seedPrK').parent().removeClass('state-error');
		$('#UpdateKeys_seedPubK').parent().removeClass('state-error');
	}

}

function validateMailKeys() {
	var pki = forge.pki;

	if ($('#UpdateKeys_mailPrK').val() != '' && $('#UpdateKeys_mailPubK').val() != '') {
		try {
			var mprivateKey = pki.privateKeyFromPem($('#UpdateKeys_mailPrK').val());
			var mpublicKey = pki.publicKeyFromPem($('#UpdateKeys_mailPubK').val());
			var mencrypted = mpublicKey.encrypt('test', 'RSA-OAEP');
			var mdecrypted = mprivateKey.decrypt(mencrypted, 'RSA-OAEP');
			if (mdecrypted == "test") {
				$('#UpdateKeys_mailPrK').parent().removeClass('state-error');
				$('#UpdateKeys_mailPubK').parent().removeClass('state-error');
				$('#UpdateKeys_mailPrK').parent().addClass('state-success');
				$('#UpdateKeys_mailPubK').parent().addClass('state-success');
			} else {
				$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
				$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
				$('#UpdateKeys_mailPrK').parent().addClass('state-error');
				$('#UpdateKeys_mailPubK').parent().addClass('state-error');
			}
		}
		catch (err) {
			$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
			$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
			$('#UpdateKeys_mailPrK').parent().addClass('state-error');
			$('#UpdateKeys_mailPubK').parent().addClass('state-error');
		}

	} else {
		$('#UpdateKeys_mailPrK').parent().removeClass('state-success');
		$('#UpdateKeys_mailPubK').parent().removeClass('state-success');
		$('#UpdateKeys_mailPrK').parent().removeClass('state-error');
		$('#UpdateKeys_mailPubK').parent().removeClass('state-error');
	}

}

function generateKeys() {

	$('#profileGenerateKeys').prop('disabled', true);
	$('#profileGenerateKeys').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Seed keys..");

	var dfdseed = new $.Deferred();
	var dfdmail = new $.Deferred();


	var selected = 0;
	var rsa = forge.pki.rsa;
	var pki = forge.pki;
	var seedStrength = 0;
	var mailStrength = 0;

	if ($('#UpdateKeys_mode_0').is(':checked')) {
		seedStrength = 512;
		mailStrength = 1024;
		selected = 1;

	}
	if ($('#UpdateKeys_mode_1').is(':checked')) {
		seedStrength = 1024;
		mailStrength = 2048;
		selected = 1;
	}
	if ($('#UpdateKeys_mode_2').is(':checked')) {
		seedStrength = 2048;
		mailStrength = 4096;
		selected = 1;
	}

	if (selected == 0) {
		noAnswer('Please select Key Strength');
	} else {

		var seedpair = rsa.createKeyPairGenerationState(seedStrength, 0x10001);
		var mailpair = '';
		var step = function () {
			if (!rsa.stepKeyPairGenerationState(seedpair, 100)) {
				setTimeout(step, 1);
			}
			else {
				$('#profileGenerateKeys').html("<i class='fa fa-refresh fa-spin'></i>&nbsp;Generating Mail keys..");
				dfdseed.resolve();
			}
		};
		setTimeout(step);


		dfdseed.done(function () {

			mailpair = rsa.createKeyPairGenerationState(mailStrength, 0x10001);

			var step = function () {
				if (!rsa.stepKeyPairGenerationState(mailpair, 100)) {
					setTimeout(step, 1);
				}
				else {
					$('#profileGenerateKeys').prop('disabled', false);
					$('#profileGenerateKeys').html("<i class='fa fa-cog'></i>&nbsp;Generate Keys");

					dfdmail.resolve();
				}
			};
			setTimeout(step);
		});

		dfdmail.done(function () {
			$('#UpdateKeys_seedPrK').val(pki.privateKeyToPem(seedpair.keys.privateKey));
			$('#UpdateKeys_seedPubK').val(pki.publicKeyToPem(seedpair.keys.publicKey));

			$('#UpdateKeys_mailPrK').val(pki.privateKeyToPem(mailpair.keys.privateKey));
			$('#UpdateKeys_mailPubK').val(pki.publicKeyToPem(mailpair.keys.publicKey));

			validateSeedKeys();
			validateMailKeys();
		});
	}

}

function generateSigKeys() {

	var rsa = forge.pki.rsa;
	var pki = forge.pki;

	var sigpair = rsa.generateKeyPair({bits: 1024, e: 0x10001});

	sigPubKeyTemp = sigpair.publicKey;
	sigPrivateKeyTemp = sigpair.privateKey;


}

function saveKeys() {

	if ($('#UpdateKeys_seedPubK').val() != '' && $('#UpdateKeys_mailPubK').val() != '') {


		checkState(function () {
			provideSecret(function (secret) {
				if (validatePublics()) {

					var userObj = userData;

					var pki = forge.pki;
					var dfd = $.Deferred();

					var user = dbToProfile(userObj, secret);
					user = JSON.parse(user);

					var NuserObj = [];
					NuserObj['userObj'] = {};


					var seedp = pki.publicKeyFromPem($('#UpdateKeys_seedPubK').val());
					NuserObj['userObj']['SeedPublic'] = to64(pki.publicKeyToPem(seedp)); //seedPb

					var seedpr = pki.privateKeyFromPem($('#UpdateKeys_seedPrK').val());
					NuserObj['userObj']['SeedPrivate'] = to64(pki.privateKeyToPem(seedpr)); //seedPr


					var mailp = pki.publicKeyFromPem($('#UpdateKeys_mailPubK').val());
					NuserObj['userObj']['MailPublic'] = to64(pki.publicKeyToPem(mailp)); //mailPb

					var mailpr = pki.privateKeyFromPem($('#UpdateKeys_mailPrK').val());
					NuserObj['userObj']['MailPrivate'] = to64(pki.privateKeyToPem(mailpr)); //mailPr

					//sigPubKey = pki.publicKeyFromPem(from64(user1['SignaturePublic']));
					//sigPrivateKey = pki.privateKeyFromPem(from64(user1['SignaturePrivate']));

					try {

						if (sigPubKeyTemp != '' && sigPrivateKeyTemp != '') {

							NuserObj['userObj']['SignaturePrivate'] = to64(pki.privateKeyToPem(sigPrivateKeyTemp));
							NuserObj['userObj']['SignaturePublic'] = to64(pki.publicKeyToPem(sigPubKeyTemp));
							var sigKHash = SHA512(pki.publicKeyToPem(sigPubKeyTemp));
						} else {
							NuserObj['userObj']['SignaturePrivate'] = to64(pki.privateKeyToPem(sigPrivateKey));
							NuserObj['userObj']['SignaturePublic'] = to64(pki.publicKeyToPem(sigPubKey));
							var sigKHash = SHA512(pki.publicKeyToPem(sigPubKey));
						}
					} catch (err) {
						noAnswer('Keys are corrupted. Please generate new signature keys.');
					}


					NuserObj['userObj']['folderKey'] = to64(forge.util.bytesToHex(folderKey));
					NuserObj['userObj']['modKey'] = forge.util.bytesToHex(forge.pkcs5.pbkdf2(makerandom(), userObj['saltS'], 216, 32));

					NuserObj['secret'] = secret;
					NuserObj['saltS'] = userObj['saltS'];

					var NewObj = profileToDb(NuserObj);

					var presend = {
						'OldModKey': userModKey,
						'mailKey': NuserObj['userObj']['MailPublic'],
						'seedKey': NuserObj['userObj']['SeedPublic'],
						'sigKey': NuserObj['userObj']['SignaturePublic'],
						'userObj': NewObj.toString(),
						'NewModKey': SHA512(NuserObj['userObj']['modKey']),
						'mailHash': SHA512(profileSettings['email']),
						'seedKHash': SHA512(pki.publicKeyToPem(seedp)),
						'mailKHash': SHA512(pki.publicKeyToPem(mailp)),
						'sigKHash': sigKHash
					};

					$.ajax({
						type: "POST",
						url: '/updateKeys',
						data: {
							'sendObj': presend
						},
						success: function (data, textStatus) {
							if (data.email == 'good') {
								userModKey = NuserObj['userObj']['modKey'];
								Answer('Successfully Saved!');
								dfd.resolve();
							} else if (data.email == 'Keys are not saved. Please try another key or report a bug.') {
								noAnswer('Error. Please try again.');
							} else {
								noAnswer('Error. Please try again.');

							}

						},
						error: function (data, textStatus) {
							noAnswer('Error occurred. Try again');
						},
						dataType: 'json'
					});

					dfd.done(function () {
						$('#keyGenForm')[0].reset();

						mailPrivateKey = pki.privateKeyFromPem(from64(NuserObj['userObj']['MailPrivate']));
						mailPublickKey = pki.publicKeyFromPem(from64(NuserObj['userObj']['MailPublic']));

						seedPrivateKey = pki.privateKeyFromPem(from64(NuserObj['userObj']['SeedPrivate']));
						seedPublickKey = pki.publicKeyFromPem(from64(NuserObj['userObj']['SeedPublic']));

						if (sigPubKeyTemp != '' && sigPrivateKeyTemp != '') {
							sigPubKey = sigPubKeyTemp;
							sigPrivateKey = sigPrivateKeyTemp;
							sigPubKeyTemp = '';
							sigPrivateKeyTemp = '';
						}

						getMainData();
					});


				} else
					noAnswer('Key size larger than allowed by plan.  Please upgrade your plan or choose lesser key strength.');

			}, function () {
			});
		}, function () {
		});
	} else {
		noAnswer('Provide New Keys before saving.');
	}
}

function initSavePass() {

	$('#passwordOld').attr('name', makerandom());
	$('#passwordNew').attr('name', makerandom());
	$('#passwordNewRep').attr('name', makerandom());

	validator = $("#smart-form-changepass").validate();

	$("#passwordOld").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#passwordNew").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#passwordNewRep").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#passwordNew',
		messages: {
			required: 'Please enter your password one more time',
			equalTo: 'Please enter the same password as above'
		}
	});
}

function savePassword() {

	validator.form();

	if (validator.numberOfInvalids() == 0) {

		//var oldPas = SHA512($('#passwordOld').val());
		//var newPas = SHA512($('#passwordNew').val());

		checkState(function () {
			$.ajax({
				type: "POST",
				url: '/changePass',
				data: {
					'oldPass': SHA512($('#passwordOld').val()),
					'newPass': SHA512($('#passwordNew').val())
				},
				success: function (data, textStatus) {
					if (data['result'] == 'success') {
						Answer('Saved');
						$("#smart-form-changepass")[0].reset();
					} else
						$.ajax({
							type: "POST",
							url: '/changePass',
							data: {
								'oldPass': SHA512old($('#passwordOld').val()),
								'newPass': SHA512($('#passwordNew').val())
							},
							success: function (data, textStatus) {
								if (data['result'] == 'success') {
									Answer('Saved');
									$("#smart-form-changepass")[0].reset();
								} else
									noAnswer('Failed to save. Try Again');
							},
							error: function (data, textStatus) {
								noAnswer('Error. Please try again.')
							},
							dataType: 'json'
						});
				},
				error: function (data, textStatus) {
					noAnswer('Error. Please try again.')
				},
				dataType: 'json'
			});
		}, function () {
		});
	}
}

function initSaveSecret() {
	$('#newSec').attr('name', makerandom());
	$('#repeatSec').attr('name', makerandom());


	validatorSecret = $("#smart-form-secret").validate();

	$("#newSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80
	});

	$("#repeatSec").rules("add", {
		required: true,
		minlength: 6,
		maxlength: 80,
		equalTo: '#newSec',
		messages: {
			required: 'Please enter your Secret one more time',
			equalTo: 'Please enter the same password as above'
		}
	});

}

function downloadTokenProfile() {
	checkState(function () {
		provideSecret(function (secret) {
			getObjects()
				.always(function (data) {
					if (data.userData && data.userRole) {
						var tempPro = JSON.parse(dbToProfile(data['userData'], secret));

						var secretnew = secret;
						var salt = forge.util.hexToBytes(data.userData['saltS']);
						var derivedKey = makeDerived(secretnew, salt);
						var Test = forge.util.bytesToHex(derivedKey);
						var Part2 = Test.substr(64, 128);
						var keyA = forge.util.hexToBytes(Part2);
						var token = forge.random.getBytesSync(256);
						var tokenHash = SHA512(token);
						var tokenAes = toAesToken(keyA, token);
						var tokenAesHash = SHA512(tokenAes);


						var presend = {
							'OldModKey': tempPro['modKey'],
							'tokenHash': tokenHash,
							'tokenAesHash': tokenAesHash,
							'mailHash': SHA512(profileSettings['email'])
						};
						$.ajax({
							type: "POST",
							url: '/generateNewToken',
							data: {
								'sendObj': presend
							},
							success: function (data, textStatus) {
								if (data.email != 'good') {
									noAnswer('Error. Please try again.');
								} else {
									toFile = tokenAes;
									downloadToken();
									Answer('Saved!');
								}

							},
							error: function (data, textStatus) {
								noAnswer('Error. Please try again.');
							},
							dataType: 'json'
						});
					} else
						noAnswer('Error. Please try again.');
				});

		}, function () {
		});
	}, function () {
	});

}

function saveSecret() {
	validatorSecret.form();

	if (validatorSecret.numberOfInvalids() == 0) {

		checkState(function () {
			provideSecret(function (secret) {
				getObjects()
					.always(function (data) {
						if (data.userData && data.userRole) {

							var tempPro = JSON.parse(dbToProfile(data['userData'], secret));

							var NuserObj = [];
							NuserObj['userObj'] = {};

							NuserObj['userObj']['SeedPublic'] = tempPro['SeedPublic'];
							NuserObj['userObj']['SeedPrivate'] = tempPro['SeedPrivate'];
							NuserObj['userObj']['MailPublic'] = tempPro['MailPublic'];
							NuserObj['userObj']['MailPrivate'] = tempPro['MailPrivate'];

							NuserObj['userObj']['SignaturePrivate'] = tempPro['SignaturePrivate'];
							NuserObj['userObj']['SignaturePublic'] = tempPro['SignaturePublic'];

							NuserObj['userObj']['folderKey'] = tempPro['folderKey'];
							NuserObj['userObj']['modKey'] = forge.util.bytesToHex(forge.pkcs5.pbkdf2(makerandom(), userObj['saltS'], 216, 32));

							NuserObj['secret'] = $('#newSec').val();
							NuserObj['saltS'] = data.userData['saltS'];

							var NewObj = profileToDb(NuserObj);
							//----------------------------------------------------

							var secretnew = $('#newSec').val();
							var salt = forge.util.hexToBytes(data.userData['saltS']);

							var derivedKey = makeDerived(secretnew, salt);

							var Test = forge.util.bytesToHex(derivedKey);
							var Part2 = Test.substr(64, 128);

							var keyA = forge.util.hexToBytes(Part2);

							var token = forge.random.getBytesSync(256);
							var tokenHash = SHA512(token);

							var tokenAes = toAesToken(keyA, token);
							var tokenAesHash = SHA512(tokenAes);


							var presend = {
								'OldModKey': tempPro['modKey'],
								'userObj': NewObj.toString(),
								'NewModKey': SHA512(NuserObj['userObj']['modKey']),
								'mailHash': SHA512(profileSettings['email']),
								'tokenHash': tokenHash,
								'tokenAesHash': tokenAesHash
							};
							$.ajax({
								type: "POST",
								url: '/saveSecret',
								data: {
									'sendObj': presend
								},
								success: function (data, textStatus) {
									if (data.email != 'good') {
										noAnswer('Error. Please try again.');
									} else {
										userModKey = NuserObj['userObj']['modKey'];
										$('#smart-form-secret')[0].reset();

										toFile = tokenAes;
										//downloadToken();
										getObjects()
											.always(function (data) {
												logOutTime();
												if (data.userData && data.userRole) {
													userData = data.userData;
													roleData = data.userRole;
												}
											});
										Answer('Saved!');
										//dfd.resolve();
									}

								},
								error: function (data, textStatus) {
									noAnswer('Error. Please try again.');
								},
								dataType: 'json'
							});
						} else
							noAnswer('Error. Please try again.');
					});

			}, function () {
			});
		}, function () {
		});
	}
}

function delSafeFile(row, id) {

	checkState(function () {
		$.ajax({
			type: "POST",
			url: '/deleteFileFromSafe',
			data: {
				'modKey': userModKey,
				'fileId': id
			},
			success: function (data, textStatus) {
				if (data['result'] == 'success') {
					$('#safeList').DataTable().row($(row).parents('tr')).remove().draw(false);
				}
			},
			error: function (data, textStatus) {

			},
			dataType: 'json'
		});


	}, function () {
	});


}

function initSafeBox() {
	if (!safeBoxProfileInitialized) {
		var dfd = $.Deferred();
		var dataSet = [];
		var fileList = {};

		checkState(function () {
			$.ajax({
				type: "POST",
				url: '/getSafeBoxList',
				data: {
					'modKey': userModKey
				},
				success: function (data, textStatus) {
					if (data['response'] == 'success') {
						fileList = data['data'];
						dfd.resolve();
						//tryDecryptSeed(data.data);
					}
				},
				error: function (data, textStatus) {

				},
				dataType: 'json'
			});


		}, function () {
		});

		dfd.done(function () {
			//console.log(fileList);
			if (Object.keys(fileList).length > 0) {
				//console.log(fileList);
				$.each(fileList, function (index, value) {
					var el = [from64(value['name']), value['modified'], value['created'], '<a class="delete" href="javascript:void(0);" onclick="delSafeFile($(this),\'' + value['index'] + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
					dataSet.push(el);
				});

			} else
				dataSet = [];

			contactTable = $('#safeList').dataTable({
				"sDom": "R<'dt-toolbar'" +
					"r>t" +
					"<'dt-toolbar-footer'" +
					"<'col-sm-6 col-xs-2'i>" +
					"<'#safepaginator'p>" +
					">",
				"columnDefs": [
					{ "sClass": 'col col-xs-6', "targets": 0},
					{ "sClass": 'col col-xs-2', "targets": 1 },
					{ "sClass": 'col col-xs-2', "targets": 2 },
					{ "sClass": 'col col-xs-1 text-align-center', "targets": 3},
					{ 'bSortable': false, 'aTargets': [ 3 ] },
					{ "orderDataType": "data-sort", "targets": 0 }
				],
				"order": [
					[ 0, "asc" ]
				],
				"iDisplayLength": 10,
				"data": dataSet,
				columns: [
					{ "title": "name" },
					{ "title": "modified" },
					{ "title": "created"},
					{ "title": "delete"}

				],
				"language": {
					"emptyTable": "No Files"
				}

			});

			safeBoxProfileInitialized = true;
			$('#safeIcons').css('float', 'left');


		});


	}

}


function delContact(row, email) {

	$('#dialog_simple >p').html('<b>' + email + '</b> will be deleted. Continue?');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 300,
		resizable: false,
		modal: true,
		title: "Delete contact",
		buttons: [
			{
				html: "<i class='fa fa-trash-o'></i>&nbsp; Delete",
				"class": "btn btn-danger",
				click: function () {
					$('#contactList').DataTable().row($(row).parents('tr')).remove().draw(false);
					delete contacts[email];
					checkContacts();

					$(this).dialog("close");
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default",
				click: function () {
					$(this).dialog("close");
				}
			}
		]
	});

	$('#dialog_simple').dialog('open');

}


function delFromBlackList(row, email) {
	$('#blackListTable').DataTable().row($(row).parents('tr')).remove().draw(false);
	delete blackList[email];
	checkBlackList();
}
function initBlackList() {
	if (!blackListProfileInitialized) {

		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(blackList).length > 0) {
			$.each(blackList, function (index, value) {
				var el = [value['email'], '<a class="delete" href="javascript:void(0);" onclick="delFromBlackList($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#blackListTable').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#contactSearch'f>" +
				"<'#contactIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-10', "targets": 0},
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 1},
				{ 'bSortable': false, 'aTargets': [ 1 ] },
				{ "orderDataType": "data-sort", "targets": 0 }
			],
			"order": [
				[ 0, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "email"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "Empty"
			}

		});

		blackListProfileInitialized = true;

	}

}

function initdisposable() {
	//disposableListProfileInitialized
	if (!disposableListProfileInitialized) {
		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(profileSettings['disposableEmails']).length > 0) {

			$.each(profileSettings['disposableEmails'], function (index, value) {
				var el = [value['name'], '<a class="delete" href="javascript:void(0);" onclick="delDisposedEmail($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#disposeList').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#disposeSearch'f>" +
				"<'#disposeIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-10', "targets": 0},
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 1},
				{ 'bSortable': false, 'aTargets': [ 1 ] },
				{ "orderDataType": "data-sort", "targets": 0 }
			],
			"order": [
				[ 0, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "email"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "No Emails"
			}

		});

		disposableListProfileInitialized = true;
		$('#disposeIcons').html('<a class="btn btn-primary" style="width:50px;" href="javascript:void(0);" rel="tooltip" data-original-title="Add Disposable Email" data-placement="bottom" onclick="addNewDisposableEmail();"><i class="fa fa-plus"></i></a>');
		$('#disposeIcons').css('float', 'left');

		$("[rel=tooltip]").tooltip();

	}
}

function makerandomEmail() {
	var text = "";
	var possible = "abcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < 27; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function addNewDisposableEmail(count) {
	count = typeof count !== 'undefined' ? count : 0;
	if (count <= 2) {
		if (Object.keys(profileSettings['disposableEmails']).length < roleData['role']['dispAddPerBox']) {
			var email = makerandomEmail() + '@scryptmail.com';
			$.ajax({
				type: "POST",
				url: '/verifyEmail',
				data: {
					'email': SHA512(email)
				},
				success: function (data, textStatus) {
					if (data===true) {
						saveNewDisposableEmail(email);
					} else if (!data) {
						count++;
						addNewDisposableEmail(count);
					}

				},
				error: function (data, textStatus) {
					noAnswer('Error. Please try again.');
				},
				dataType: 'json'
			});

		} else {
			noAnswer('Limit of disposable email addresses has been reached.');
		}
	} else {
		noAnswer('Error. Please try again.');
	}


}
function delDisposedEmail(row, email)
{
	$('#dialog_simple >p').html('<b>' + profileSettings['disposableEmails'][email]['name'] + '</b><br> will be deleted. Continue?');

	$('#dialog_simple').dialog({
		autoOpen: false,
		width: 340,
		resizable: false,
		modal: true,
		title: "Delete Email",
		buttons: [
			{
				html: "<i class='fa fa-trash-o'></i>&nbsp; Delete",
				"class": "btn btn-danger",
				click: function () {

					checkState(function () {
						$.ajax({
							type: "POST",
							url: '/deleteDisposableEmail',
							data: {
								'email': email,
								'modKey': userModKey
							},
							success: function (data, textStatus) {
								if (data===true) {
									$('#disposeList').DataTable().row($(row).parents('tr')).remove().draw(false);
									delete profileSettings['disposableEmails'][email];
									checkProfile();
									$('#dialog_simple').dialog('close');
									Answer('Email Removed');

								} else {
									noAnswer('Error. Please try again.');
								}

							},
							error: function (data, textStatus) {
								noAnswer('Error. Please try again.');
							},
							dataType: 'json'
						});


					}, function () {
					});

				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-default",
				click: function () {
					$('#dialog_simple').dialog('close');
				}
			}
		]
	});

	$('#dialog_simple').dialog('open');
}

function saveNewDisposableEmail(email) {

	checkState(function () {
		$.ajax({
			type: "POST",
			url: '/saveDisposableEmail',
			data: {
				'email': SHA512(email),
				'modKey': userModKey
			},
			success: function (data, textStatus) {
				if (data===true) {
					var t = $('#disposeList').DataTable();
					t.clear();
					profileSettings['disposableEmails'][SHA512(email)] = {'name':email};
					checkProfile();
					var dataSet = [];
					$.each(profileSettings['disposableEmails'], function (index, value) {
						var el = [value['name'], '<a class="delete" href="javascript:void(0);" onclick="delDisposedEmail($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
						dataSet.push(el);
					});
					var addId = t.rows.add(dataSet)
					t.draw();

				} else {
					noAnswer('Error. Please try again.');
				}

			},
			error: function (data, textStatus) {
				noAnswer('Error. Please try again.');
			},
			dataType: 'json'
		});


	}, function () {
	});

}
function initContacts() {
	if (!contactListProfileInitialized) {

		var dataSet = [];
		//console.log(contacts);
		if (Object.keys(contacts).length > 0) {
			$.each(contacts, function (index, value) {
				var el = [value['name'], index, '<a class="delete" href="javascript:void(0);" onclick="delContact($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
				dataSet.push(el);
			});

		} else
			dataSet = [];


		contactTable = $('#contactList').dataTable({
			"sDom": "R<'dt-toolbar'" +
				"<'#contactSearch'f>" +
				"<'#contactIcons'>" +
				"<'col-sm-3 pull-right'l>" +
				"r>t" +
				"<'dt-toolbar-footer'" +
				"<'col-sm-6 col-xs-2'i>" +
				"<'#paginator'p>" +
				">",
			"columnDefs": [
				{ "sClass": 'col col-xs-4', "targets": 0},
				{ "sClass": 'col col-xs-4', "targets": 1 },
				{ "sClass": 'col col-xs-1 text-align-center', "targets": 2},
				{ 'bSortable': false, 'aTargets': [ 2 ] },
				{ "orderDataType": "data-sort", "targets": 1 }
			],
			"order": [
				[ 1, "asc" ]
			],
			"iDisplayLength": 10,
			"data": dataSet,
			columns: [
				{ "title": "name" },
				{ "title": "email"},
				{ "title": "delete"}

			],
			"language": {
				"emptyTable": "No Contacts"
			}

		});

		contactListProfileInitialized = true;
		$('#contactIcons').html('<a class="btn btn-primary" style="width:50px;" href="javascript:void(0);" rel="tooltip" data-original-title="Add Contact" data-placement="bottom" onclick="addNewContact();"><i class="fa fa-plus"></i>&nbsp;&nbsp;<i class="fa fa-user"></i></a>');
		$('#contactIcons').css('float', 'left');

		$("[rel=tooltip]").tooltip();
	}

}

function addNewContact() {

	$('#dialog-AddContact').dialog({
		autoOpen: false,
		height: 230,
		width: 300,
		modal: true,
		resizable: false,
		buttons: [
			{
				html: "<i class='fa fa-check'></i>&nbsp; Add",
				"class": "btn btn-primary pull-right",
				"id": 'loginok',
				click: function () {
					validatorNewClient.form();
					if (validatorNewClient.numberOfInvalids() == 0) {
						var name = $('#newClientName').val() != '' ? $('#newClientName').val() : 'Click to edit';
						var email = $('#newClientEmail').val().toLowerCase();
						var t = $('#contactList').DataTable();
						t.clear();
						contacts[email] = {'name': name};
						var dataSet = [];
						if (Object.keys(contacts).length > 0) {
							$.each(contacts, function (index, value) {
								var el = [value['name'], index, '<a class="delete" href="javascript:void(0);" onclick="delContact($(this),\'' + index + '\');"><i class="fa fa-times fa-lg txt-color-red"></i></a>'];
								dataSet.push(el);
							});
						}
						var addId = t.rows.add(dataSet)
						t.draw();
						//console.log(contacts);
						checkContacts();
						$('#dialog-AddContact').dialog('close');
					}
				}
			},
			{
				html: "<i class='fa fa-times'></i>&nbsp; Cancel",
				"class": "btn btn-warning pull-left",
				"id": 'loginclose',
				click: function () {
					$('#dialog-AddContact').dialog('close');
				}
			}
		],
		close: function () {
		}
	});

	$('#dialog-AddContact').dialog('open');


	$('#newClientName').attr('name', makerandom());
	$('#newClientEmail').attr('name', makerandom());


	validatorNewClient = $("#dialog-AddContact").validate();

	$("#newClientName").rules("add", {
		minlength: 2,
		maxlength: 60
	});

	$("#newClientEmail").rules("add", {
		required: true,
		email: true,
		minlength: 6,
		maxlength: 200
	});

}

