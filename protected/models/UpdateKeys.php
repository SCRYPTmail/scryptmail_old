<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class UpdateKeys extends CFormModel
{

	public $email;
	public $seedPrK;
	public $seedPubK;
	public $mailPrK;
	public $mailPubK;
	public $sendObj;

	public $OldModKey,$mailKey,$userObj,$NewModKey,$mailHash,$mailKHash;

	public $tokenHash,$tokenAesHash,$oldPassword,$newPassword,$oneStep;

	public function rules()
	{
		return array(
			//array('sendObj', 'validateObj', 'on' => 'saveKeys'),

			array('OldModKey', 'match', 'pattern' => "/^[a-z0-9\d]{64}$/i", 'allowEmpty' => false, 'on' => 'saveKeys'),

			array('mailKey', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]{10,2000}$/i", 'allowEmpty' => false, 'on' => 'saveKeys'),
			array('userObj', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]{4000,20000}$/i", 'allowEmpty' => false, 'on' => 'saveKeys'),
			array('NewModKey,mailHash,mailKHash', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'saveKeys'),




			array('sendObj', 'validateSecretObj', 'on' => 'saveSecret'),
			array('sendObj', 'validateTokObj', 'on' => 'generateToken'),


			array('OldModKey', 'match', 'pattern' => "/^[a-z0-9\d]{64}$/i", 'allowEmpty' => false, 'on' => 'saveSecretOneStep'),
			array('userObj', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]{4000,20000}$/i", 'allowEmpty' => false, 'on' => 'saveSecretOneStep'),
			array('NewModKey,mailHash,tokenHash,tokenAesHash,oldPassword,newPassword', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'saveSecretOneStep'),
			array('oneStep','required', 'on' => 'saveSecretOneStep'),


		);
	}

	public function validateTokObj()
	{
		if (isset($this->sendObj) && is_array($this->sendObj)) {
			if (isset($this->sendObj['tokenHash']) &&
				isset($this->sendObj['OldModKey'])&&
				isset($this->sendObj['mailHash']) &&
				isset($this->sendObj['tokenAesHash'])
			) {
				return true;
			} else
				$this->addError('sendObj', 'not valid');

		} else
			$this->addError('sendObj', 'empty');
	}


	public function validateSecretObj()
	{
		if (isset($this->sendObj) && is_array($this->sendObj)) {
			if (isset($this->sendObj['userObj']) &&
				isset($this->sendObj['NewModKey']) &&
				isset($this->sendObj['OldModKey'])&&
				isset($this->sendObj['tokenHash'])&&
				isset($this->sendObj['tokenAesHash'])&&
				isset($this->sendObj['mailHash'])
			) {
				return true;
			} else
				$this->addError('sendObj', 'not valid');

		} else
			$this->addError('sendObj', 'empty');
	}

	public function generateToken($id){

		$param[':oldModKey'] = hash('sha512', $this->sendObj['OldModKey']);
		$param[':id'] = $id;
		$param[':mailHash']=$this->sendObj['mailHash'];
		$param[':tokenHash']=$this->sendObj['tokenHash'];
		$param[':tokenAesHash']=$this->sendObj['tokenAesHash'];

		$trans = Yii::app()->db->beginTransaction();
		if (
			Yii::app()->db->createCommand("UPDATE user SET tokenHash=:tokenHash,tokenAesHash=:tokenAesHash WHERE id=:id AND modKey=:oldModKey AND mailHash=:mailHash")->execute($param)){
				$trans->commit();
				echo '{"email":"good"}';
			} else {
				$trans->rollback();
				echo '{"email":"Token not saved"}';

			}

	}

	public function saveSecret($id)
	{
		$param[':oldModKey'] = hash('sha512', $this->sendObj['OldModKey']);
		$param[':userObj'] = $this->sendObj['userObj'];
		$param[':id'] = $id;
		$param[':newModKey'] = $this->sendObj['NewModKey'];
		$param[':mailHash']=$this->sendObj['mailHash'];
		$param[':tokenHash']=$this->sendObj['tokenHash'];
		$param[':tokenAesHash']=$this->sendObj['tokenAesHash'];

		$trans = Yii::app()->db->beginTransaction();
		if (
			Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj,modKey=:newModKey,tokenHash=:tokenHash,tokenAesHash=:tokenAesHash WHERE id=:id AND modKey=:oldModKey AND mailHash=:mailHash")->execute($param)

		){
			$trans->commit();
			echo '{"email":"good"}';

	}else {
			$trans->rollback();
			echo '{"email":"Keys are not saved, please try again or report a bug"}';

		}


	}


	public function saveSecretOneStep($id)
	{
		if($this->oneStep=="true"){

				$param[':oldModKey'] = hash('sha512', $this->OldModKey);
				$param[':userObj'] = $this->userObj;
				$param[':id'] = $id;
				$param[':newModKey'] = $this->NewModKey;
				$param[':mailHash']=$this->mailHash;
				$param[':tokenHash']=$this->tokenHash;
				$param[':tokenAesHash']=$this->tokenAesHash;
				$param[':newPass']=crypt($this->newPassword);
				$param[':oneStep']=1;

				$trans = Yii::app()->db->beginTransaction();
				if (
					Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj,modKey=:newModKey,tokenHash=:tokenHash,tokenAesHash=:tokenAesHash, password=:newPass,oneStep=:oneStep WHERE id=:id AND modKey=:oldModKey AND mailHash=:mailHash")->execute($param)

				){
					$trans->commit();
					echo '{"email":"good"}';

				}else {
					$trans->rollback();
					echo '{"email":"Keys are not saved, please try again or report a bug"}';

				}



		}else{
			$user = Yii::app()->db->createCommand("SELECT password FROM user WHERE id=$id")->queryRow();

			if($user['password']==crypt($this->oldPassword,$user['password']))
			{
				$param[':oldModKey'] = hash('sha512', $this->OldModKey);
				$param[':userObj'] = $this->userObj;
				$param[':id'] = $id;
				$param[':newModKey'] = $this->NewModKey;
				$param[':mailHash']=$this->mailHash;
				$param[':tokenHash']=$this->tokenHash;
				$param[':tokenAesHash']=$this->tokenAesHash;
				$param[':newPass']=crypt($this->newPassword);
				$param[':oneStep']=0;

				$trans = Yii::app()->db->beginTransaction();
				if (
					Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj,modKey=:newModKey,tokenHash=:tokenHash,tokenAesHash=:tokenAesHash, password=:newPass,oneStep=:oneStep WHERE id=:id AND modKey=:oldModKey AND mailHash=:mailHash")->execute($param)

				){
					$trans->commit();
					echo '{"email":"good"}';

				}else {
					$trans->rollback();
					echo '{"email":"Keys are not saved, please try again or report a bug"}';

				}

			}else
				echo '{"email":"fail"}';
		}


	}

	public function saveKeys()
	{

		$param[':oldModKey'] = hash('sha512', $this->OldModKey);
		$param[':userObj'] = $this->userObj;
		$param[':id'] = Yii::app()->user->getId();
		$param[':newModKey'] = $this->NewModKey;

		//$param[':seedKey'] = $this->sendObj['seedKey'];
		$param[':mailKey'] = $this->mailKey;
		//$param[':sigKey'] = $this->sendObj['sigKey'];

		//$param[':seedKHash'] = $this->sendObj['seedKHash'];
		$param[':mailKHash'] =$this->mailKHash;
		//$param[':sigKHash'] = $this->sendObj['sigKHash'];


		$trans = Yii::app()->db->beginTransaction();
		//print_r($param);

		if (
			Yii::app()->db->createCommand(
				"UPDATE user SET userObj=:userObj,modKey=:newModKey,mailKey=:mailKey,mailKHash=:mailKHash WHERE id=:id AND modKey=:oldModKey")->execute($param)
		) {
			$trans->commit();
			echo '{"email":"good"}';
		} else {
			$trans->rollback();
			echo '{"email":"Keys are not saved, please try another keys or report a bug"}';

		}


	}

	public function updateKey()
	{

		$this->email = isset($_POST["CreateUser"]['email']) ? $_POST["CreateUser"]['email'] : '';
		$this->seedPrK = isset($_POST["CreateUser"]['seedPrK']) ? $_POST["CreateUser"]['seedPrK'] : '';
		$this->seedPubK = isset($_POST["CreateUser"]['seedPrK']) ? $_POST["CreateUser"]['seedPubK'] : '';
		$this->mailPrK = isset($_POST["CreateUser"]['seedPrK']) ? $_POST["CreateUser"]['mailPrK'] : '';
		$this->mailPubK = isset($_POST["CreateUser"]['seedPrK']) ? $_POST["CreateUser"]['mailPubK'] : '';


	}


}
