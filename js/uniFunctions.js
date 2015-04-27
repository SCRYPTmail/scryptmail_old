/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 12/26/14
 * Time: 8:17 PM
 */

function fromAesToken(key, text) {

	var vector = forge.util.hexToBytes(text.substring(0, 32));
	var encrypted = text.substring(32);

	var cipher = forge.cipher.createDecipher('AES-CBC', key);
	var new_buffer = forge.util.createBuffer(forge.util.hexToBytes(encrypted));

	cipher.start({iv: vector});
	cipher.update(new_buffer);
	cipher.finish();

	return (cipher.output.data);
}

function makeDerived(secret, salt) {
	return forge.pkcs5.pbkdf2(secret, salt, 4096, 64);
}
function makeDerivedFancy(secret, salt) {
	return forge.pkcs5.pbkdf2(secret, salt, secret.charCodeAt(0), 64);
}

function makerandom() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < Math.floor(Math.random() * 15) + 1; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
}

function generatePairs(length,callback){

	var rsa = forge.pki.rsa;

	var KeyPair = rsa.createKeyPairGenerationState(length, 0x10001);

	var step = function() {
		if(!rsa.stepKeyPairGenerationState(KeyPair, 100)) {
			setTimeout(step, 1);
		}
		else
			callback(KeyPair);

	};
	setTimeout(step);

}
function generateUserObj(mailpair,secret,email,oneStep,callback)
{
	var rsa = forge.pki.rsa;
	var pki = forge.pki;

	var salt = forge.random.getBytesSync(256);
	var derivedKey = makeDerived(secret, salt);

	var Test = forge.util.bytesToHex(derivedKey);
	var Part1 = Test.substr(0, 64);
	var Part2 = Test.substr(64, 128);
	var keyT = CryptoJS.enc.Hex.parse(Part1);
	var keyA = forge.util.hexToBytes(Part2);
	var folderKey = forge.random.getBytesSync(32);
	var testString=forge.util.bytesToHex(mailpair.keys.publicKey.encrypt('test string', 'RSA-OAEP'));
	var testStringLength=testString.length*4;
	var userObj = {};

	userObj['keys']={};
	userObj['keys'][SHA512singl(email)]={
		'email':email,
		'privateKey':to64(pki.privateKeyToPem(mailpair.keys.privateKey)),
		'publicKey':to64(pki.publicKeyToPem(mailpair.keys.publicKey)),
		'canSend':'1',
		'keyLength':testStringLength,
		'receiveHash':SHA512singl(pki.publicKeyToPem(mailpair.keys.publicKey)).substring(0,10)
	};
	userObj['folderKey'] = to64(forge.util.bytesToHex(folderKey));
	userObj['modKey'] = forge.util.bytesToHex(forge.pkcs5.pbkdf2(makerandom(), salt, 216, 32));


	var folderObj = {};
	folderObj['Inbox'] = {};
	folderObj['Sent'] = {};
	folderObj['Draft'] = {};
	folderObj['Spam'] = {};
	folderObj['Trash'] = {};
	folderObj['Custom'] = {};

	var flObAesCipher = toAes(folderKey, JSON.stringify(folderObj));


	var contactObj = {}
	var blackListObj = [];

	var prof_setting = {};
	prof_setting['email'] = email;
	prof_setting['name'] = '';
	prof_setting['lastSeed'] = 0;
	prof_setting['oneStep'] = oneStep;

	prof_setting['version'] = 1;
	prof_setting['disposableEmails'] = {};

	var prof = toAes(folderKey, JSON.stringify(to64(prof_setting)));
	var contact = toAes(folderKey, JSON.stringify(contactObj));
	var blackList = toAes(folderKey, JSON.stringify(blackListObj));

	var ret = {};

	var MainObj = {};

	var token = forge.random.getBytesSync(256);
	var tokenHash=SHA512singl(token);
	var tokenAes=toAesToken(keyA, token);
	var tokenAesHash=SHA512singl(tokenAes);

	MainObj['salt'] = forge.util.bytesToHex(salt);
	MainObj['tokenHash'] = tokenHash;
	MainObj['tokenAesHash'] = tokenAesHash;
	MainObj['UserObject'] = profileToDb(userObj,secret,forge.util.bytesToHex(salt));
	MainObj['FolderObject'] = flObAesCipher.toString();
	MainObj['ModKey'] = SHA512singl(userObj['modKey']);
	MainObj['contacts'] = contact.toString();
	MainObj['blackList'] = blackList.toString();
	MainObj['mailKey'] =to64(pki.publicKeyToPem(mailpair.keys.publicKey));

	MainObj['prof'] = prof;
	MainObj['mailHash'] = SHA512singl(email);


	ret['MainObj']=MainObj;
	ret['toFile']=tokenAes;
	callback(ret);
}

function makeModKey(salt) {

	return forge.util.bytesToHex(forge.pkcs5.pbkdf2(makerandom(), salt, 16, 16));
}

function profileToDb(obj,secret,salt) {


	salt = forge.util.hexToBytes(salt);
	var derivedKey = makeDerived(secret, salt)

	var Test = forge.util.bytesToHex(derivedKey);

	var keyT = CryptoJS.enc.Hex.parse(Test.substr(0, 64));
	var keyA = forge.util.hexToBytes(Test.substr(64, 128));

	var f = toAes(keyA, JSON.stringify(obj));
	var Fis = toFish(keyT, f);

	return Fis;

}

function to64(data) {

	if (data instanceof Array) {
		$.each(data, function (index, value) {
			data[index] = to64(value);
		});
		return data;
	} else if (data instanceof Object) {
		$.each(data, function (index, value) {
			//console.log(index);
			//console.log(value);
			data[index] = to64(value);
		});
		return data;
	} else
		return forge.util.encode64(forge.util.encodeUtf8(String(data)));

}

function from64(data) {
	if (data instanceof Array) {
		$.each(data, function (index, value) {
			data[index] = from64(value);
		});
		return data;
	} else if (data instanceof Object) {
		//console.log('object');
		$.each(data, function (index, value) {
			data[index] = from64(value);
		});
		return data;
	} else
		return forge.util.decodeUtf8(forge.util.decode64(data));
}


function to64bin(data) {

	return forge.util.encode64(data);
}

function from64bin(data) {

		return forge.util.decode64(data);
}

function toAes64(key, text) {

	var vector = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher('AES-CBC', key);
	cipher.start({iv: vector});

	var usUtf8 = forge.util.encodeUtf8(text);
	cipher.update(forge.util.createBuffer(usUtf8));
	cipher.finish();

	return to64bin(vector)+';' + to64bin(cipher.output.data);

}
function fromAes64(key, text) {

	var textData = text.split(';');

	var vector = from64bin(textData[0]);
	var encrypted = from64bin(textData[1]);

	var cipher = forge.cipher.createDecipher('AES-CBC', key);
	var new_buffer = forge.util.createBuffer(encrypted);

	cipher.start({iv: vector});
	cipher.update(new_buffer);
	cipher.finish();
	//return forge.util.decodeUtf8(cipher.output.toString());
	return cipher.output.toString();
}


function toAes(key, text) {

	var vector = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher('AES-CBC', key);
	cipher.start({iv: vector});

	var usUtf8 = forge.util.encodeUtf8(text);
	cipher.update(forge.util.createBuffer(usUtf8));
	cipher.finish();

	return forge.util.bytesToHex(vector) + cipher.output.toHex();

}
function isValidHex(hex) {
	var regex =/\b[0-9A-F]{24}\b/gi

	return regex.test(hex);

}

function parseEmail(emailText,callback){
	/*
	 parse text email w/o name and return object
	 */
	var email=getEmailsFromString(emailText);
	var name=stripHTML(emailText.substring(0, emailText.indexOf('<')));

	if(name!=''){
		var display=name+'<'+email+'>';
	}else{
		var display=email;
	}

	var result={'name':name,'email':email,'display':display};

	if(callback)
		callback(result);
	else
		return result;
}

function fromAes(key, text) {

	var vector = forge.util.hexToBytes(text.substring(0, 32));
	var encrypted = text.substring(32);

	var cipher = forge.cipher.createDecipher('AES-CBC', key);
	var new_buffer = forge.util.createBuffer(forge.util.hexToBytes(encrypted));

	cipher.start({iv: vector});
	cipher.update(new_buffer);
	cipher.finish();
	//return forge.util.decodeUtf8(cipher.output.toString());
	return cipher.output.toString();
}


function toFish(keyT, text) {

	var vector = CryptoJS.lib.WordArray.random(16);
	var cipher = CryptoJS.TwoFish.encrypt(text, keyT, { iv: vector });

	//console.log(keyT.toString());

	return vector.toString() + cipher.toString();

}

function toAesToken(key, text) {

	var vector = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher('AES-CBC', key);
	cipher.start({iv: vector});

	cipher.update(forge.util.createBuffer(text));
	cipher.finish();

	return forge.util.bytesToHex(vector) + cipher.output.toHex();

}

function downloadToken(){
	try{
		var oMyBlob = new Blob([toFile], {type:'text/html'});

		var a = document.createElement('a');
		a.href = window.URL.createObjectURL(oMyBlob);
		a.download = 'ScryptmailToken.key';
		document.body.appendChild(a);
		a.click();
	} catch (err) {
		$('#browsfailed').css('display','block');
		$('#browsfailed b').text(toFile);
	}
}

function noAnswer(text) {

	$.smallBox({
		title: text,
		content: "",
		color: "#A65858",
		iconSmall: "fa fa-times",
		timeout: 5000
	});
};

function omgAnswer(text) {

	$.smallBox({
		title: text,
		content: "",
		color: "#B4990D",
		iconSmall: "fa fa-times",
		timeout: 8000
	});
};


function Answer(text) {

	$.smallBox({
		title: text,
		content: "",
		color: "green",
		iconSmall: "fa fa-check",
		timeout: 2000
	});
};


function get_browser_version(){
	var ua=navigator.userAgent,tem,M=ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	if(/trident/i.test(M[1])){
		tem=/\brv[ :]+(\d+)/g.exec(ua) || [];
		return 'IE '+(tem[1]||'');
	}
	if(M[1]==='Chrome'){
		tem=ua.match(/\bOPR\/(\d+)/)
		if(tem!=null)   {return 'Opera '+tem[1];}
	}
	M=M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	if((tem=ua.match(/version\/(\d+)/i))!=null) {M.splice(1,1,tem[1]);}
	return M[1];
}

function isCompatible(){
	var compatible=['Chrome','Firefox'];
	var inCompatible=['Safari','iPad','iPhone','iPod','MSIE 8.0','MSIE 9.0'];
	var checkCapability=$.Deferred();
	bug=false;
	error=false;

	//return (navigator.userAgent.indexOf("iPad") != -1);
	var browser_version=get_browser_version();
	if(navigator.userAgent.indexOf("Chrome") != -1 || navigator.userAgent.indexOf("Firefox") != -1){
		if(
			navigator.userAgent.indexOf("iPad") != -1||
				navigator.userAgent.indexOf("iPod") != -1||
				navigator.userAgent.indexOf("iPhone") != -1||
				navigator.userAgent.indexOf("MSIE 8.0") != -1 ||
				navigator.userAgent.indexOf("MSIE 9.0") != -1 ||
				browser_version<33
			){

			//console.log(browser_version);
			bug=true;
		}
		try{
		//	forge.util.hexToBytes('3df5');
		}catch (err) {
			error=true;
		}

		if(window.FileReader) {
			//do this
		} else {
			error=true;
		}
		checkCapability.resolve();
	}else{
		if(navigator.userAgent.indexOf("Safari") != -1 ||
			navigator.userAgent.indexOf("iPad") != -1||
			navigator.userAgent.indexOf("iPod") != -1||
			navigator.userAgent.indexOf("iPhone") != -1||
			navigator.userAgent.indexOf("MSIE 8.0") != -1||
			navigator.userAgent.indexOf("MSIE 9.0") != -1){

			bug=true;
		}

		try{
			forge.util.hexToBytes('3df5');
		}catch (err) {
			error=true;
		}

		if(window.FileReader) {
			//do this
		} else {
			error=true;
		}
		checkCapability.resolve();

	}
//console.log(bug);
	//console.log(error);
	checkCapability.done(function () {
		if(bug){
			$('#incomp').css('display','block');
			$('#incomp span').html('Your browser/device not 100% compatible with this service. Please refer to our list of <a href="http://blog.scryptmail.com/supported-browsers" target="_blank">compatible browsers</a>');
			//alert('Your browser/device not 100% compatible with this website. Please read list of compatible devices and browser at our blog');
		}
		if(error){
			$('#incomp').css('display','block');
			$('#incomp span').html('Your browser/device may not be compatible with this service, and your connection may not be secure. Please refer to our list of <a href="http://blog.scryptmail.com/supported-browsers" target="_blank">compatible browsers</a>');
			//alert('');
		}

	});

}

function createMessage(publicKey,recipient,files,sender,subject,bodyMeta,sentMeta,opened,metaPin,modKey,bodyText,bodyHTML,metaType,metaStatus,encryptionKey,bdRcpt,sndrMod,fromExtra,callback){

	var d = new Date();
	var pki = forge.pki;

	var key = encryptionKey;

	var emailPreObj = {
		'to': '',
		'from': '',
		'subj': '',
		'meta': {},
		'body': {},
		'attachment': {},
		'modKey': '',
		'mailId': ''
	};
	messaged = {};

	emailPreObj['attachment'] = {};

	if (Object.keys(files).length > 0) {
		emailPreObj['meta']['attachment'] = 1;
		messaged['files'] = [];
		$.each(files, function (index, valueFile) {
			var fname = SHA512(valueFile['name'] + recipient + Math.round(d.getTime() / 1000) + d.getTime());
			emailPreObj['attachment'][index] = {'name': valueFile['name'], 'type': valueFile['type'], 'filename': to64(fname), 'size': valueFile['size'], 'base64': true};

			var el = {'fname': fname, 'data': toAesBinary(key, valueFile['data'])};
			messaged['files'].push(el);
		});

	} else {
		emailPreObj['meta']['attachment'] = '';
	}

	emailPreObj['meta']['to'] = recipient;
	emailPreObj['meta']['from'] = sender;
	emailPreObj['meta']['subject'] =subject;
	emailPreObj['meta']['body'] = bodyMeta;
	emailPreObj['meta']['fromExtra'] = fromExtra;

	emailPreObj['meta']['timeSent'] = sentMeta;
	emailPreObj['meta']['opened'] = opened;
	emailPreObj['meta']['pin'] = metaPin;
	emailPreObj['meta']['modKey'] = modKey;
	emailPreObj['meta']['type'] = metaType;
	emailPreObj['meta']['status'] =metaStatus;


	emailPreObj['to'] = recipient;
	emailPreObj['from'] = sender;
	emailPreObj['subj'] = subject;

	emailPreObj['body']['text'] =bodyText;
	emailPreObj['body']['html'] = bodyHTML;

	emailPreObj['modKey'] = modKey;

	emailPreObj['badRcpt'] = bdRcpt;
	emailPreObj['senderMod'] = sndrMod;

var t=emailPreObj;
	//console.log(t);
	var body = JSON.stringify(emailPreObj);

	var md = forge.md.sha256.create();
	md.update(body, 'utf8');

	//if(mailPrivateKey!=''){
	if(Object.keys(signingKey).length==0 ){
		emailPreObj['meta']['signature'] = '';
	}else{
		var sign=signingKey[SHA512(getEmailsFromString(from64(sender)))]['privateKey'];
		emailPreObj['meta']['signature'] = forge.util.bytesToHex(sign.sign(md));
	}


	var meta = JSON.stringify(emailPreObj['meta']);

	messaged['mail'] = toAes(key, body);
	messaged['meta'] = toAes(key, meta);
	messaged['ModKey'] = SHA512(modKey);
	if(publicKey!==false){
		messaged['key'] = addPaddingToString(forge.util.bytesToHex(publicKey.encrypt(key, 'RSA-OAEP')));
	}

	callback(messaged);
}

function retrievePublicKeys(success, cancel, mails, emailparsed) {

	$.ajax({
		type: "POST",
		url: '/retrievePublicKeys',
		data: {'mails': JSON.stringify(mails)
		},
		success: function (data, textStatus) {
			if (typeof data.mail == "undefined") {
				//console.log(data);

				//emailparsed['indomain']=indomainLoop(emailparsed,mails,data);

				success(data);
			} else {
				$('.sendMailButton').html('Send');
				$('.sendMailButton').prop('disabled', false);
				noAnswer('Error. Please try again.');
			}

		},
		error: function (data, textStatus) {
			$('.sendMailButton').html('Send');
			$('.sendMailButton').prop('disabled', false);
			noAnswer('Error. Please try again.');
			cancel();

		},
		dataType: 'json'
	});
}

function addPaddingToString(pass){

	var padstrHex=forge.util.bytesToHex(forge.random.getBytesSync(512));

	return pass+padstrHex.substr(0,1024-pass.length);

}
function enableEmailControl(){
	//$('#readMaildiv').css('display','block');
	$('#readEmailOpt').css('display','inline-block');
	$('#boxEmailOption').css('display','none');

	//$('#mailIcons').addClass('col-xs-6');
	//$('#mailIcons').removeClass('col-xs-8');
	$("[rel=tooltip]").tooltip();
}

function systemMessage(messageCode)
{
	switch (messageCode) {
		case 'tryAgain':
			noAnswer('Error. Please try again.');
			break;
		case 'Saved':
			Answer('Saved.');
			break;
		case 'Sent':
			Answer('Sent');
			break;
		case 'messageMoved':
			Answer('Moved');
			break;
		case 'MarkedAsSpam':
			Answer('Marked as spam');
			break;
		case 'Thank you':
			Answer('Thank you');
			break;

	}
}


function changeSystemFont(tim){

	if (!isNaN(tim)) {
		switch (tim) {
			case "1":
				$("body").css("font-family", "Georgia, serif");
				break;
			case "2":
				$("body").css("font-family", '"Palatino Linotype", "Book Antiqua", Palatino, serif');
				break;
			case "3":
				$("body").css("font-family", '"Times New Roman", Times, serif');
				break;
			case "4":
				$("body").css("font-family", 'Arial, Helvetica, sans-serif');
				break;


			case "5":
				$("body").css("font-family", '"Arial Black", Gadget, sans-serif');
				break;
			case "6":
				$("body").css("font-family", '"Comic Sans MS", cursive, sans-serif');
				break;
			case "7":
				$("body").css("font-family", '"Lucida Sans Unicode", "Lucida Grande", sans-serif');
				break;
			case "8":
				$("body").css("font-family", 'Tahoma, Geneva, sans-serif');
				break;
			case "9":
				$("body").css("font-family", '"Trebuchet MS", Helvetica, sans-serif');
				break;
			case "10":
				$("body").css("font-family", 'Verdana, Geneva, sans-serif');
				break;
			case "11":
				$("body").css("font-family", '"Courier New", Courier, monospace');
				break;
			case "12":
				$("body").css("font-family", '"Lucida Console", Monaco, monospace');
				break;

		}
		profileSettings['fontType']=tim;
		checkProfile();
	}

}

function changeFontSize(tim){

	if (!isNaN(tim)) {

		switch (tim) {
			case "9":
				$("body").css("font-size", "9px");
				break;

			case "10":
				$("body").css("font-size", "10px");
				break;
			case "11":
				$("body").css("font-size", "11px");
				break;
			case "12":
				$("body").css("font-size", "12px");
				break;
			case "13":
				$("body").css("font-size", "13px");
				break;
			case "14":
				$("body").css("font-size", "14px");
				break;
			case "15":
				$("body").css("font-size", "15px");
				break;
			case "16":
				$("body").css("font-size", "16px");
				break;
			case "17":
				$("body").css("font-size", "17px");
				break;

		}
		profileSettings['fontSize']=tim;
		checkProfile();
	}

}