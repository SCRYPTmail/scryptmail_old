<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class SaveEmail extends CFormModel
{

	public $newModKey;
	public $oldModKey;
	public $signature;
	public $mailHash;
	public $from;
	public $pinHash;

	public $modKey;
	public $modKeySeed;
	public $modKeyMail, $to,$files;

	public $mail,$meta,$ModKey,$key,$messageId,$seedMeta,$seedPassword,$seedModKey,$seedRcpnt;


	public function rules()
	{
		return array(
			// username and password are required
			array('mail,modKey,meta', 'required', 'on' => 'save,saveMailInSent,sendLocalFail'),


			array('files', 'safe', 'on' => 'sendLocal,saveMailInSent,sendOutNoPin,sendOutPin'),
			array('files', 'checkFile', 'on' => 'sendLocal,saveMailInSent,sendOutNoPin,sendOutPin'),

			array('mailHash', 'match', 'pattern' => "/^[a-z0-9\d]{1,24}$/i", 'allowEmpty' => true, 'on' => 'save,saveMailInSent'),


			array('from', 'checkFrom', 'on' => 'sendOutPin'),
			array('to', 'safe', 'on' => 'sendOutPin'),

			array('messageId,pinHash,ModKey', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'sendOutPin'),
			array('mail,meta', 'match', 'pattern' => "/^[a-z0-9\d]+$/i", 'allowEmpty' => false, 'on' => 'sendOutPin'),
			array('mail,meta', 'checkEmail', 'on' => 'sendOutPin'),



			array('mail,ModKey,key,meta', 'required', 'on' => 'sendOutNoPin'),

			//array('mail,ModKey,iv,key,meta', 'required','on'=>'saveMailInSentWithErrors'),

			array('ModKey,messageId,seedModKey', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'sendLocal'),
			array('seedRcpnt', 'match', 'pattern' => "/^[a-z0-9\d]{10}$/i", 'allowEmpty' => false, 'on' => 'sendLocal'),
			array('seedPassword,key', 'match', 'pattern' => "/^[a-z0-9\d]{1024}$/i", 'allowEmpty' => false, 'on' => 'sendLocal'),

			array('mail,meta', 'match', 'pattern' => "/^[a-z0-9\d]+$/i", 'allowEmpty' => false, 'on' => 'sendLocal'),
			array('mail,meta', 'checkEmail', 'on' => 'sendLocal'),
			array('seedMeta', 'match', 'pattern' => "/^[a-z0-9\d]{512}$/i", 'allowEmpty' => false, 'on' => 'sendLocal'),



		);
	}
	public function checkFrom()
	{

		$email=hash('sha512',EmailparseCommand::getEmail($this->from));

		$param[':id']=Yii::app()->user->getId();
		$param[':mailHash']=$email;

		if(!Yii::app()->db->createCommand("SELECT addressHash FROM addresses WHERE userId=:id AND addressHash=:mailHash")->queryRow(true,$param)){
			$this->addError('email', 'Email not correct');
		}

	}
	public function checkEmail()
	{

			if(!isset($this->mail) || strlen($this->mail)>2000000){
				$this->addError('mail', 'Email is too big');
			}

			if(!isset($this->meta) || strlen($this->meta)>20000){
				$this->addError('mail', 'Email is too big');
			}

	}
	public function checkFile()
	{
		if(is_array($this->files)){
			$size=0;
			foreach($this->files as $file){
				$size+=strlen($file['data']);
				if(!isset($file['fname']) || strlen($file['fname'])!=128){
					$this->addError('filename', 'Error please try again');
				}
				if(!isset($file['data']) || strlen($file['data'])>29000000 || strlen($file['data'])<1){
					$this->addError('filesize', 'Error please try again');
				}
				if($size>29000000 || $size<1)
					$this->addError('filesize', 'Error please try again');
			}
		}
	}
	public function save()
	{

		if(empty($this->mailHash))
		{
			//if new draft email no emailId, create new message and return message id

			$fileSize=0;
			if(isset($this->files)){

				foreach($this->files as $row){
					$fileNames[]=$row['fname'];

					if(FileWorks::writeFile($row['fname'],$row['data'])===false)
					{
						echo '{"messageId":"fail1"}';
					}
					$fileSize+=strlen($row['data']);
				}
				$files = json_encode($fileNames);
			}else
				$files  = null;

			$body=substr(hex2bin($this->mail),0,16).substr(hex2bin($this->mail),16);
			$meta=substr(hex2bin($this->meta),0,16).substr(hex2bin($this->meta),16);

			$person[]=array(
				"meta" => new MongoBinData($meta, MongoBinData::GENERIC),
				"body" => new MongoBinData($body, MongoBinData::GENERIC),
				"modKey"=>hash('sha512',$this->modKey),
				"emailSize"=>strlen($meta)+strlen($body)+$fileSize,
				"userId"=>Yii::app()->user->getId(),
				"file"=>$files
			);

			if($message=Yii::app()->mongo->insert('personalFolders',$person))
			{
				$result['messageId']=$message[0];

				echo json_encode($result);
			}



		}else{
			if(is_numeric($this->mailHash)) //old messages still have digital emailId
			{
				$fileSize=0;
				if(isset($this->files)){

					foreach($this->files as $row){
						$fileNames[]=$row['fname'];

						if(FileWorks::writeFile($row['fname'],$row['data'])===false)
						{
							echo '{"messageId":"fail1"}';
						}
						$fileSize+=strlen($row['data']);
					}
					$files = json_encode($fileNames);
				}else
					$files  = null;


				$body=substr(hex2bin($this->mail),0,16).substr(hex2bin($this->mail),16);
				$meta=substr(hex2bin($this->meta),0,16).substr(hex2bin($this->meta),16);

				$person=array(
					"meta" => new MongoBinData($meta, MongoBinData::GENERIC),
					"body" => new MongoBinData($body, MongoBinData::GENERIC),
					"modKey"=>hash('sha512',$this->modKey),
					"emailSize"=>strlen($meta)+strlen($body)+$fileSize,
					"userId"=>Yii::app()->user->getId(),
					"file"=>$files
				);

				$criteria=array("_id" => new MongoId(substr(hash('sha1',$this->mailHash),0,24)),'modKey'=>hash('sha512',$this->modKey));


				if($message=Yii::app()->mongo->update('personalFolders',$person,$criteria))
				{
					$result['messageId']=$message[0];

					echo json_encode($result);
				}

			}else if(ctype_xdigit($this->mailHash) && strlen($this->mailHash)==24)
			{
				$fileSize=0;
					if(isset($this->files)){

						foreach($this->files as $row){
							$fileNames[]=$row['fname'];

							if(FileWorks::writeFile($row['fname'],$row['data'])===false)
							{
								echo '{"messageId":"fail1"}';
							}
							$fileSize+=strlen($row['data']);
						}
						$files = json_encode($fileNames);
					}else
						$files  = null;


					$body=substr(hex2bin($this->mail),0,16).substr(hex2bin($this->mail),16);
					$meta=substr(hex2bin($this->meta),0,16).substr(hex2bin($this->meta),16);

					$person=array(
						"meta" => new MongoBinData($meta, MongoBinData::GENERIC),
						"body" => new MongoBinData($body, MongoBinData::GENERIC),
						"modKey"=>hash('sha512',$this->modKey),
						"emailSize"=>strlen($meta)+strlen($body)+$fileSize,
						"userId"=>Yii::app()->user->getId(),
						"file"=>$files
					);

					$criteria=array("_id" => new MongoId($this->mailHash),'modKey'=>hash('sha512',$this->modKey));


					if($message=Yii::app()->mongo->update('personalFolders',$person,$criteria))
					{
						$result['messageId']=$this->mailHash;

						echo json_encode($result);
					}

			}


		}
/*


		unset($fileNames);


		if (!is_numeric($this->mailHash)) {
			unset($params[':oldModKey']);

			if (Yii::app()->db->createCommand("INSERT INTO personalFolders (meta,body,modKey,file) VALUES(:meta,:body,:modKey,:file)")->execute($params))

				echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
			else
				echo '{"email":"Keys are not saved, please try again or report a bug"}';


		} else if (is_numeric($this->mailHash)) {
			$params[':messageHash'] = $this->mailHash;

			if (Yii::app()->db->createCommand("UPDATE personalFolders SET meta=:meta,body=:body,modKey=:modKey,file=:file WHERE messageHash=:messageHash AND modKey=:oldModKey")->execute($params))
				echo '{"messageId":' . $params[':messageHash'] . '}';
			else
				echo '{"email":"Keys are not saved, please try again or report a bug"}';

		}
		*/
	}


	public function sendLocalFail()
	{
		$params[':body'] = $this->mail;
		$params[':modKey'] = $this->modKey;
		$params[':meta'] = $this->meta;

		if (Yii::app()->db->createCommand("INSERT INTO personalFolders (meta,body,modKey) VALUES(:meta,:body,:modKey)")->execute($params))
		{	$ff=Yii::app()->db->getLastInsertID();
			echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
		}else
			echo '{"email":"Keys are not saved, please try again or report a bug"}';

	}

	public function sendLocal()
	{

		$params[':body'] = $this->mail;
		$params[':modKey'] = $this->ModKey;
		$params[':pass'] = $this->key;

		$params[':meta'] = $this->meta;
		$params[':whens'] = Date("Y-m-d H:i:s");

		$params[':seedMeta'] = $this->seedMeta;
		$params[':seedPass'] = $this->seedPassword;
		$params[':modKeySeed'] = $this->seedModKey;
		$params[':messageId'] = $this->messageId;
		$params[':rcpnt'] = $this->seedRcpnt;

		if(isset($this->files)){

		foreach($this->files as $row){
		$fileNames[]=$row['fname'];

			if(FileWorks::writeFile($row['fname'],$row['data'])===false)
			{
				echo '{"messageId":"fail1"}';
			}

		}
			$params[':file'] = json_encode($fileNames);
		}else
			$params[':file'] = null;

		unset($fileNames);

			if (Yii::app()->db->createCommand("INSERT INTO mailToSent (meta,body,pass,modKey,whens,file,seedMeta,seedPass,modKeySeed,rcpnt,messageId) VALUES(:meta,:body,:pass,:modKey,:whens,:file,:seedMeta,:seedPass,:modKeySeed,:rcpnt,:messageId)")->execute($params))
				echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
			else
				echo '{"messageId":"fail"}';




	}

	public function sendOutPin()
	{
		$params[':body'] = $this->mail;
		$params[':messageId'] = $this->messageId;
		$params[':modKey'] = $this->ModKey;
		$params[':meta'] = $this->meta;
		$params[':outside'] = 1;
		$params[':whens'] = Date("Y-m-d H:i:s");
		$params[':fromt'] = $this->from;
		$params[':tot'] = $this->to;
		$params[':pinHash'] = $this->pinHash;


		if(isset($this->files)){

			foreach($this->files as $row){
				$fileNames[]=$row['fname'];

				if(FileWorks::writeFile($row['fname'],$row['data'])===false)
				{
					echo '{"messageId":"fail1"}';
				}

			}
			$params[':file'] = json_encode($fileNames);
		}else
			$params[':file'] = null;

		if (Yii::app()->db->createCommand("INSERT INTO mailToSent (meta,body,fromt,tot,modKey,whens,outside,file,pinHash,messageId) VALUES(:meta,:body,:fromt,:tot,:modKey,:whens,:outside,:file,:pinHash,:messageId)")->execute($params))
			echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
		else
			echo '{"messageId":"fail"}';

	}

	public function sendOutNoPin()
	{

		$key = hex2bin($this->key);

		$encryptionMethod = "aes-256-cbc";


		$iv = hex2bin(substr($this->mail, 0, 32));
		$encrypted = base64_encode(hex2bin(substr($this->mail, 32)));
		$body = json_decode(openssl_decrypt($encrypted, $encryptionMethod, $key, 0, $iv), true);
		$body['from'] = base64_decode($body['from']);

		$email=hash('sha512',EmailparseCommand::getEmail($body['from']));


		$id=Yii::app()->user->getId();

		if (Yii::app()->db->createCommand("SELECT addressHash FROM addresses WHERE addressHash='$email' AND userId=$id")->queryRow())
		{

			$params[':body'] = $this->mail;
			$params[':modKey'] = $this->ModKey;
			$params[':meta'] = $this->meta;
			$params[':outside'] = 1;
			$params[':whens'] = Date("Y-m-d H:i:s");
			$params[':pass'] = $this->key;

			if(isset($this->files)){


				foreach($this->files as $row){
					$fileNames[]=$row['fname'];

					if(FileWorks::writeFile($row['fname'],$row['data'])===false)
					{
						echo '{"messageId":"fail1"}';
					}



				}
				$params[':file'] = json_encode($fileNames);
			}else
				$params[':file'] = null;


			if (Yii::app()->db->createCommand("INSERT INTO mailToSent (meta,body,pass,modKey,whens,outside,file) VALUES(:meta,:body,:pass,:modKey,:whens,:outside,:file)")->execute($params))
				echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
			else
				echo '{"messageId":"fail"}';

		}else
			echo '{"messageId":"fail"}';

	}


}