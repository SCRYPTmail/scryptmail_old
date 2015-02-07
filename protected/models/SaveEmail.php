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

	public $modKeySeed;
	public $modKeyMail, $to,$files;

	public $mail,$meta,$ModKey,$key,$messageId,$seedMeta,$seedPassword,$seedModKey,$seedRcpnt;


	public function rules()
	{
		return array(
			// username and password are required
			array('mail,newModKey,oldModKey,meta', 'required', 'on' => 'save,saveMailInSent'),
			array('mail,newModKey,meta', 'required', 'on' => 'sendLocalFail'),


			array('files', 'safe', 'on' => 'sendLocal,saveMailInSent,sendOutNoPin,sendOutPin'),
			array('files', 'checkFile', 'on' => 'sendLocal,saveMailInSent,sendOutNoPin,sendOutPin'),

			array('mailHash', 'numerical', 'integerOnly' => true, 'allowEmpty' => true, 'on' => 'save,saveMailInSent'),


			array('mail,ModKey,meta,from,to,pinHash', 'required', 'on' => 'sendOutPin'),
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
	public function checkEmail()
	{

			if(!isset($this->mail) || strlen($this->mail)>2000000){
				$this->addError('mail', 'Email is too big');
			}

			if(!isset($this->meta) || strlen($this->meta)>2000000){
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
		$params[':body'] = $this->mail;
		$params[':modKey'] = $this->newModKey;
		$params[':oldModKey'] = hash('sha512', $this->oldModKey);
		$params[':meta'] = $this->meta;

		if(isset($this->files)){
			foreach($this->files as $row){
				$fileNames[]=$row['fname'];
				if (file_put_contents(Yii::app()->basePath . '/attachments/' . $row['fname'], $row['data'])){

				}else
					echo '{"messageId":"fail1"}';
			}
			$params[':file'] = json_encode($fileNames);
		}else
			$params[':file'] = null;

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
	}

	public function sendLocalFail()
	{
		$params[':body'] = $this->mail;
		$params[':modKey'] = $this->newModKey;
		$params[':meta'] = $this->meta;

		if (Yii::app()->db->createCommand("INSERT INTO personalFolders (meta,body,modKey) VALUES(:meta,:body,:modKey)")->execute($params))
			echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
		else
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
			if (file_put_contents(Yii::app()->basePath . '/attachments/' . $row['fname'], $row['data'])){

			}else
				echo '{"messageId":"fail1"}';
		}
			$params[':file'] = json_encode($fileNames);
		}else
			$params[':file'] = null;

		unset($fileNames);

		if(!Yii::app()->db->createCommand("SELECT id FROM mailTable WHERE id=:id")->queryRow(true,array(':id'=>$this->messageId))){
			if (Yii::app()->db->createCommand("INSERT INTO mailToSent (meta,body,pass,modKey,whens,file,seedMeta,seedPass,modKeySeed,rcpnt,messageId) VALUES(:meta,:body,:pass,:modKey,:whens,:file,:seedMeta,:seedPass,:modKeySeed,:rcpnt,:messageId)")->execute($params))
				echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
			else
				echo '{"messageId":"fail"}';
		}else
			echo '{"messageId":"duplicate"}';



	}

	public function sendOutPin()
	{

		$params[':body'] = $this->mail;
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
				if (file_put_contents(Yii::app()->basePath . '/attachments/' . $row['fname'], $row['data'])){

				}else
					echo '{"messageId":"fail1"}';
			}
			$params[':file'] = json_encode($fileNames);
		}else
			$params[':file'] = null;


		if (Yii::app()->db->createCommand("INSERT INTO mailToSent (meta,body,fromt,tot,modKey,whens,outside,file,pinHash) VALUES(:meta,:body,:fromt,:tot,:modKey,:whens,:outside,:file,:pinHash)")->execute($params))
			echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
		else
			echo '{"messageId":"fail"}';
	}

	public function sendOutNoPin()
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
				if (file_put_contents(Yii::app()->basePath . '/attachments/' . $row['fname'], $row['data'])){

				}else
					echo '{"messageId":"fail1"}';
			}
			$params[':file'] = json_encode($fileNames);
		}else
			$params[':file'] = null;


		if (Yii::app()->db->createCommand("INSERT INTO mailToSent (meta,body,pass,modKey,whens,outside,file) VALUES(:meta,:body,:pass,:modKey,:whens,:outside,:file)")->execute($params))
			echo '{"messageId":' . Yii::app()->db->getLastInsertID() . '}';
		else
			echo '{"messageId":"fail"}';
	}


}