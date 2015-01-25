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
				browser_version<32
			){

			console.log(browser_version);
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
			$('#incomp span').html('Your browser/device not 100% compatible with this service. Please refer to our list of <a href="http://blog.scryptmail.com/2014/11/scryptmail-browser-compatibility.html" target="_blank">compatible browsers</a>');
			//alert('Your browser/device not 100% compatible with this website. Please read list of compatible devices and browser at our blog');
		}
		if(error){
			$('#incomp').css('display','block');
			$('#incomp span').html('Your browser/device may not be compatible with this service, and your connection may not be secure. Please refer to our list of <a href="http://blog.scryptmail.com/2014/11/scryptmail-browser-compatibility.html" target="_blank">compatible browsers</a>');
			//alert('');
		}

	});

}