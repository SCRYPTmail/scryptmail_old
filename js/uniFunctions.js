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

function makerandom() {
	var text = "";
	var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

	for (var i = 0; i < Math.floor(Math.random() * 15) + 1; i++)
		text += possible.charAt(Math.floor(Math.random() * possible.length));

	return text;
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

function toAes(key, text) {

	var vector = forge.random.getBytesSync(16);

	var cipher = forge.cipher.createCipher('AES-CBC', key);
	cipher.start({iv: vector});

	var usUtf8 = forge.util.encodeUtf8(text);
	cipher.update(forge.util.createBuffer(usUtf8));
	cipher.finish();

	return forge.util.bytesToHex(vector) + cipher.output.toHex();

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


	$('#y-agree').prop('disabled',false);
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