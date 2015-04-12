<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class Acceptemailfrompostfix extends CFormModel
{
	public function accept($current)
	{

		if (Yii::app()->params['production']) {
			set_time_limit(300);
			$rr = json_decode($current['mandrill_events'], true);
		} else {
			set_time_limit(300);
			$current = file_get_contents('new1.txt');
			//$enc=urldecode($current)			;
			$enc = base64_decode($current);
			//$enc=json_encode($current);
			$ff = json_decode($enc, true);
			$rr = json_decode($ff['mandrill_events'], true);
			//$rr=$ff['mandrill_events'];
		}

		//print_r($rr);

		//Yii::app()->end();
		//print_r($rr);
		//Yii::app()->end();
		//;	print_r($rr);
		/*
				$current = file_get_contents('newfile.txt');
				$f=base64_decode($current);
				//$z=urldecode($current);
				$ff=json_decode($f,true);
				$rr=json_decode($ff['mandrill_events'],true);
				//$error = json_last_error_msg();
				print_r($rr);
		*/


	//$current = file_get_contents('emailtest.txt');
	//$current=json_decode($current);
	//print_r($current);
//echo $current;
		/*
	//echo Yii::app()->createAbsoluteUrl('Acceptemailfrompostfix');
	$myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
	//$txt = "John Doe\n";
	fwrite($myfile, base64_encode(json_encode($current)));
	//$txt = "Jane Doe\n";
	//fwrite($myfile, $txt);
	fclose($myfile);
	//echo 'ura';
	//Crawler::accept(); //reading ready to send mail
*/

		//$rr=json_decode($ff,true);
//for($k=0;$k<5000;$k++){
		//echo $k.'
		//';

		//print_r($rr);

		foreach ($rr as $index => $row) {
			unset($row['msg']['raw_msg']);
			//print_r($row);

			if(isset($row['msg']['to']) || isset($row['email'])){

				$recipient=isset($row['msg']['to'])?$row['msg']['to']:array(0=>array(0=>$row['email']));

				if(isset($row['msg']['cc'])){
					$recipient=array_merge($recipient,isset($row['msg']['cc'])?$row['msg']['cc']:array(0=>array(0=>$row['email'])));

				}

				foreach ($recipient as $i => $rcpt) {
					$fieldTo[]=($rcpt[0] != $rcpt[1]) ? strip_tags($rcpt[1]) . '<' . strip_tags($rcpt[0]) . '>' : strip_tags($rcpt[0]);
				}


				foreach ($recipient as $i => $rcpt) {

					if ($mailhash = Yii::app()->db->createCommand(
						"SELECT addresses.mailKey, user.mailKey as userMailKey
			FROM addresses
			LEFT JOIN user ON user.id=addresses.userId
			WHERE addresses.addressHash= '" . hash('sha512', $rcpt[0]) . "'")->queryRow()) {

						if(isset($mailhash['mailKey'])){
							unset($mailhash['userMailKey']);
						}else{
							$mailhash['mailKey']=$mailhash['userMailKey'];
							unset($mailhash['userMailKey']);
						}

						$mailKey = $mailhash['mailKey'];

						$emailPreObj['from'] = (isset($row['msg']['from_name']) && $row['msg']['from_name'] != $row['msg']['from_email']) ? strip_tags($row['msg']['from_name']) . '<' . $row['msg']['from_email'] . '>' : $row['msg']['from_email'];
						$emailPreObj['subj'] = htmlspecialchars(is_array($row['msg']['subject'])?$row['msg']['subject'][0]:$row['msg']['subject'], ENT_QUOTES, "UTF-8");

						$text=isset($row['msg']['text']) ? strip_tags($row['msg']['text']):'';
						$html=isset($row['msg']['html'])?$row['msg']['html']:'';

						$emailPreObj['body']['text'] =  $text;
						$emailPreObj['body']['html'] = $html;
						$emailPreObj['meta']['subject'] = substr(htmlentities(is_array($row['msg']['subject'])?$row['msg']['subject'][0]:$row['msg']['subject']), 0, 150);
						$emailPreObj['meta']['from'] = $emailPreObj['from'];
						$metb=($text!='')?$text:$html;
						$emailPreObj['meta']['body'] = substr(strip_tags($metb), 0, 50);
						$emailPreObj['meta']['timeRcvd'] = $row['ts'];
						$emailPreObj['meta']['timeSent'] = isset($row['msg']['headers']['Date']) ? strtotime($row['msg']['headers']['Date']) : $row['ts'];
						$emailPreObj['meta']['opened'] = false;
						$emailPreObj['meta']['type'] = 'received';
						$emailPreObj['meta']['pin'] = '';

						$emailPreObj['to'] = implode($fieldTo,'; ');
						$emailPreObj['meta']['to'] = ($rcpt[0] != $rcpt[1]) ? strip_tags($rcpt[1]) . '<' . strip_tags($rcpt[0]) . '>' : strip_tags($rcpt[0]);
						$emailPreObj['meta']['modKey'] = bin2hex(Acceptemailfrompostfix::makeModKey(16));
						$emailPreObj['modKey'] = $emailPreObj['meta']['modKey'];

						//print_r($emailPreObj);

						$emailPreObj['from'] = base64_encode($emailPreObj['from']);
						$emailPreObj['subj'] = base64_encode($emailPreObj['subj']);

						$emailPreObj['body']['text'] = base64_encode($emailPreObj['body']['text']);
						$emailPreObj['body']['html'] = base64_encode($emailPreObj['body']['html']);
						$emailPreObj['meta']['subject'] = base64_encode($emailPreObj['meta']['subject']);
						$emailPreObj['meta']['from'] = base64_encode($emailPreObj['meta']['from']);
						$emailPreObj['meta']['body'] = base64_encode($emailPreObj['meta']['body']);

						$emailPreObj['to'] = base64_encode($emailPreObj['to']);
						$emailPreObj['meta']['to'] = base64_encode($emailPreObj['meta']['to']);


						$key = Acceptemailfrompostfix::makeModKey(32);

						if (isset($row['msg']['attachments'])) {
							foreach ($row['msg']['attachments'] as $k => $file) {
								$fname = hash('sha512', $file['name'] . $emailPreObj['to'] . $emailPreObj['meta']['timeRcvd'] . time());

								$size=($file['base64'])?strlen(base64_decode($file['content'])):strlen($file['content']);
								if (FileWorks::encryptFile($file['content'], $fname, $key, $file['base64'])) {
									$emailPreObj['attachment'][base64_encode($k)] =
										array('name' => base64_encode($file['name']), 'type' => base64_encode($file['type']), 'filename' => base64_encode($fname),'size'=>base64_encode($size), 'base64' => $file['base64']);
								}
								unset($fname);
							}
							$emailPreObj['meta']['attachment'] = 1;
						} else{
							$emailPreObj['meta']['attachment'] = '';
						}

						$body =Acceptemailfrompostfix::toAes($key,json_encode($emailPreObj));

						$meta = Acceptemailfrompostfix::toAes($key,json_encode($emailPreObj['meta']));

						$params[':body'] = $body;
						$params[':modKey'] = hash('sha512', $emailPreObj['modKey']);
						$params[':pass'] = bin2hex(Acceptemailfrompostfix::encrypt($mailKey, $key));
						$params[':messageId'] =bin2hex(Acceptemailfrompostfix::makeModKey(32));
						$params[':rcpnt'] = substr(hash('sha512',base64_decode($mailKey)), 0, 10);

						$params[':meta'] = $meta;
						$params[':whens'] = Date("Y-m-d H:i:s");

						unset($key, $iv);

						$r['mailId']=$params[':messageId'];
						$r['mailModKey']=$emailPreObj['modKey'];
						$r['seedModKey']=bin2hex(Acceptemailfrompostfix::makeModKey(16));


						$seedKey = Acceptemailfrompostfix::makeModKey(32);
						$params[':seedMeta'] =Acceptemailfrompostfix::toAes($seedKey,json_encode($r));
						$padstrHex=bin2hex(Acceptemailfrompostfix::makeModKey(512));
						$seedPass=bin2hex(Acceptemailfrompostfix::encrypt($mailKey, $seedKey));
						$params[':seedPass'] = substr_replace($padstrHex, $seedPass, 0, strlen($seedPass));
						$params[':modKeySeed'] = hash('sha512',$r['seedModKey']);


						$trans = Yii::app()->db->beginTransaction();

						if (Yii::app()->db->createCommand("INSERT INTO mailToSent (meta,body,pass,modKey,whens,fromOut,messageId,rcpnt,seedMeta,modKeySeed,seedPass) VALUES(:meta,:body,:pass,:modKey,:whens,1,:messageId,:rcpnt,:seedMeta,:modKeySeed,:seedPass)")->execute($params)) {
								$trans->commit();
						} else {
							$trans->rollback();
						}

						unset($params, $param);


					}

				}

			}

		}
		echo 'success';

		//}

		//echo base64_decode($current);

		/*
		//$current = file_get_contents('emailtest.txt');
		//$current=json_decode($current);
		//print_r($current);
//echo $current;
		//echo Yii::app()->createAbsoluteUrl('Acceptemailfrompostfix');
		$myfile = fopen("newfile.txt", "w") or die("Unable to open file!");
		//$txt = "John Doe\n";
		fwrite($myfile, base64_encode(json_encode($current)));
		//$txt = "Jane Doe\n";
		//fwrite($myfile, $txt);
		fclose($myfile);
		//echo 'ura';
		//Crawler::accept(); //reading ready to send mail
		*/
	}

	public function toAes($key,$text){
		$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
		$iv = openssl_random_pseudo_bytes($iv_size);

		$encryptionMethod = "aes-256-cbc";

		$encryptedMessage = openssl_encrypt($text, $encryptionMethod, $key, 0, $iv);

		return bin2hex($iv).bin2hex(base64_decode($encryptedMessage));

	}
	public function makeModKey($size)
	{
		return openssl_random_pseudo_bytes($size);
	}

	public function encrypt($key, $data)
	{
		openssl_public_encrypt($data, $encrypted, base64_decode($key), OPENSSL_PKCS1_OAEP_PADDING);
		//$data = bin2hex($encrypted);

		return $encrypted;
	}

}
