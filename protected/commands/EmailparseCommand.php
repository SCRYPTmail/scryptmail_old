<?php
class EmailparseCommand extends CFormModel
{
public $mails;


	public function rules()
	{
		return array(
			array('mails','email'),
		);
	}




	public function getEmail($string)
	{

		$row=trim(strtolower($string));

		if(strrpos($row,'<')===false){
			$email=$row;
		}else{
			$email=substr($row,strrpos($row,'<')+1,strrpos($row,'>')-strrpos($row,'<')-1);
		}

		return $email;
	}
	public function run($args) {

	$emailParsed=Yii::app()->EmailParser->getResults();


	if($emailParsed['to']!=''){
		$to=explode(',',$emailParsed['to']);

		foreach($to as $i=>$row)
		{
			if(strrpos($row,'<')===false){
				$name='';
			}else{
				$name=strip_tags(substr(trim($row),0,strrpos($row,'<')-1));
			}

			$email=EmailparseCommand::getEmail($row);
			$this->mails = $email;

			if($this->validate()){

				$dom=hash('sha512',explode('@',$email)[1]);
					$emailObject[$dom][]=$email;
					$emailNames[hash('sha512', $email)]=($name!='')?$name. "<$email>":$email;
					$verifyDomain[":domains_$i"]=$dom;
			}

		}
		unset($email,$name);

		$paramDomain=implode(array_keys($verifyDomain),',');

		if($verifiedDomains=Yii::app()->db->createCommand("SELECT domain FROM virtual_domains WHERE shaDomain IN ($paramDomain)")->queryAll(true,$verifyDomain))
		{
			foreach($verifiedDomains as $row){
				$verifiedEmailsArray[]=$emailObject[hash('sha512', $row['domain'])];
			}

		}

		unset($verifyDomain,$verifiedDomains);

		$count=0;
		if(isset($verifiedEmailsArray)){
			foreach($verifiedEmailsArray as $row)
				foreach($row as $krow){
					$verifiedEmailList[":emails_$count"]=hash('sha512',$krow);
					$count++;
				}


		}


		if(isset($verifiedEmailList) && count($verifiedEmailList)>0)
		{
			$paramEmailHashes=implode(array_keys($verifiedEmailList),',');

			if ($mailhash = Yii::app()->db->createCommand(
				"SELECT addresses.addressHash, addresses.mailKey FROM addresses WHERE addresses.addressHash IN ($paramEmailHashes)")->queryAll(true,$verifiedEmailList)) {


			foreach($mailhash as $row)
			{
				$mailKey = $row['mailKey'];

				//EmailparseCommand::getEmail($row);

				$from=trim(strip_tags($emailParsed['from']));

				$emailPreObj['from'] = ($from!=EmailparseCommand::getEmail($emailParsed['from']))?$from." <".EmailparseCommand::getEmail($emailParsed['from']).">":EmailparseCommand::getEmail($emailParsed['from']);

				$emailPreObj['subj'] = htmlspecialchars($emailParsed['subject'], ENT_QUOTES, "UTF-8");

				$text=isset($emailParsed['text']) ? strip_tags($emailParsed['text']):'';
				$html=isset($emailParsed['html'])?$emailParsed['html']:'';

				$emailPreObj['body']['text'] =  $text;
				$emailPreObj['body']['html'] = $html;

				$emailPreObj['meta']['subject'] = substr(htmlentities($emailParsed['subject']), 0, 150);

				$emailPreObj['meta']['from'] = $emailPreObj['from'];
				$metb=($text!='')?$text:$html;

				$emailPreObj['meta']['body'] = substr(strip_tags($metb), 0, 50);
				$emailPreObj['meta']['timeRcvd'] =  time();
				$emailPreObj['meta']['timeSent'] = 	strtotime($emailParsed['sent']);

				$emailPreObj['meta']['opened'] = false;
				$emailPreObj['meta']['type'] = 'received';
				$emailPreObj['meta']['pin'] = '';

				$emailPreObj['to'] = $emailNames[$row['addressHash']];
				$emailPreObj['meta']['to'] = $emailNames[$row['addressHash']];

				$emailPreObj['meta']['modKey'] = bin2hex(EmailparseCommand::makeModKey(16));
				$emailPreObj['modKey'] = $emailPreObj['meta']['modKey'];

				$emailPreObj['from'] = base64_encode($emailPreObj['from']);
				$emailPreObj['subj'] = base64_encode($emailPreObj['subj']);
				$emailPreObj['body']['text'] = base64_encode($emailPreObj['body']['text']);
				$emailPreObj['body']['html'] = base64_encode($emailPreObj['body']['html']);
				$emailPreObj['meta']['subject'] = base64_encode($emailPreObj['meta']['subject']);
				$emailPreObj['meta']['from'] = base64_encode($emailPreObj['meta']['from']);
				$emailPreObj['meta']['body'] = base64_encode($emailPreObj['meta']['body']);

				$emailPreObj['to'] = base64_encode($emailPreObj['to']);
				$emailPreObj['meta']['to'] = base64_encode($emailPreObj['meta']['to']);

				$key = EmailparseCommand::makeModKey(32);



			if (isset($emailParsed['attachmentObj'])) {
					foreach ($emailParsed['attachmentObj'] as $k => $file) {
						$fname = hash('sha512', $file['name'] . $emailPreObj['to'] . $emailPreObj['meta']['timeRcvd'] . time());


						$size=strlen($file['content']);
						if (FileWorks::encryptFile($file['content'], $fname, $key,null)) {
							$emailPreObj['attachment'][base64_encode($file['name'])] =
								array('name' => base64_encode($file['name']), 'type' => base64_encode($file['type']), 'filename' => base64_encode($fname),'size'=>base64_encode($size), 'base64' => true);
						}
						unset($fname);
					}
					$emailPreObj['meta']['attachment'] = 1;
				} else{
					$emailPreObj['meta']['attachment'] = '';
				}

				$body =EmailparseCommand::toAes($key,json_encode($emailPreObj));
				$meta = EmailparseCommand::toAes($key,json_encode($emailPreObj['meta']));

				$params[':body'] = $body;
				$params[':modKey'] = hash('sha512', $emailPreObj['modKey']);
				$params[':pass'] = bin2hex(EmailparseCommand::encrypt($mailKey, $key));
				$params[':messageId'] =bin2hex(EmailparseCommand::makeModKey(32));
				$params[':rcpnt'] = substr(hash('sha512',base64_decode($mailKey)), 0, 10);

				$params[':meta'] = $meta;
				$params[':whens'] = Date("Y-m-d H:i:s");

				unset($key, $iv);

				$r['mailId']=$params[':messageId'];
				$r['mailModKey']=$emailPreObj['modKey'];
				$r['seedModKey']=bin2hex(EmailparseCommand::makeModKey(16));


				$seedKey = EmailparseCommand::makeModKey(32);
				$params[':seedMeta'] =EmailparseCommand::toAes($seedKey,json_encode($r));
				$padstrHex=bin2hex(EmailparseCommand::makeModKey(512));
				$seedPass=bin2hex(EmailparseCommand::encrypt($mailKey, $seedKey));
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
			//print_r($verifiedEmailList);
		//print_r($body);
		//print_r($emailNames);
		//print_r($emailObject);

		//print_r($emailPreObj);
		//print_r($emailParsed);
	}
}

	public function makeModKey($size)
	{
		return openssl_random_pseudo_bytes($size);
	}
	public function toAes($key,$text){
		$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
		$iv = openssl_random_pseudo_bytes($iv_size);

		$encryptionMethod = "aes-256-cbc";

		$encryptedMessage = openssl_encrypt($text, $encryptionMethod, $key, 0, $iv);

		return bin2hex($iv).bin2hex(base64_decode($encryptedMessage));

	}
	public function encrypt($key, $data)
	{
		openssl_public_encrypt($data, $encrypted, base64_decode($key), OPENSSL_PKCS1_OAEP_PADDING);
		//$data = bin2hex($encrypted);

		return $encrypted;
	}

}

