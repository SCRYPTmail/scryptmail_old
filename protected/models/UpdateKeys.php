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

	public $UserObject,$modKey,$tokenHash,$tokenAesHash,$oldPassword,$newPassword,$oneStep;



	public function rules()
	{
		return array(

			//saveSecretOneStep
			array('UserObject', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]+$/i", 'allowEmpty' => false, 'on' => 'saveSecretOneStep,saveSecret'),
			array('UserObject','length', 'max'=>2580000,'min'=>4000,'on'=>'saveSecretOneStep,saveSecret'),

			array('modKey', 'match', 'pattern' => "/^[a-z0-9\d]{32,64}$/i", 'allowEmpty' => false, 'on' => 'saveSecretOneStep,saveSecret,generateToken'),
			array('tokenHash,tokenAesHash,oldPassword,newPassword', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'saveSecretOneStep'),
			array('oneStep','required', 'on' => 'saveSecretOneStep'),

			array('tokenHash,tokenAesHash', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'saveSecret,generateToken'),
		);
	}


	public function generateToken($id)
	{

		$param[':modKey'] = hash('sha512', $this->modKey);
		$param[':id'] = $id;

		$param[':tokenHash']=$this->tokenHash;
		$param[':tokenAesHash']=$this->tokenAesHash;

		$trans = Yii::app()->db->beginTransaction();
		if (
			Yii::app()->db->createCommand("UPDATE user SET tokenHash=:tokenHash,tokenAesHash=:tokenAesHash WHERE id=:id AND modKey=:modKey")->execute($param)){
				$trans->commit();
				echo '{"email":"good"}';
			} else {
				$trans->rollback();
				echo '{"email":"Token not saved"}';

			}

	}

	public function saveSecret($id)
	{
		$param[':modKey'] = hash('sha512', $this->modKey);

		$param[':userObj'] = $this->UserObject;
		$param[':id'] = $id;

		$param[':tokenHash']=$this->sendObj['tokenHash'];
		$param[':tokenAesHash']=$this->sendObj['tokenAesHash'];

		$trans = Yii::app()->db->beginTransaction();

		if (
			Yii::app()->db->createCommand("UPDATE user SET
			userObj=:userObj,
			tokenHash=:tokenHash,
			tokenAesHash=:tokenAesHash WHERE id=:id AND modKey=:modKey")->execute($param)

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
			$user = Yii::app()->db->createCommand("SELECT password,oneStep FROM user WHERE id=$id")->queryRow();

			if(($user['oneStep']==1 && $user['password']==crypt($this->oldPassword,$user['password'])) ||	($user['oneStep']==0))
			{
				$param[':id'] = $id;
				$param[':userObj'] = $this->UserObject;
				$param[':tokenHash']=$this->tokenHash;
				$param[':tokenAesHash']=$this->tokenAesHash;
				$param[':newPass']=crypt($this->newPassword);
				$param[':modKey'] = hash('sha512', $this->modKey);
				$param[':oneStep']=1;

				$trans = Yii::app()->db->beginTransaction();
				if (
					Yii::app()->db->createCommand("
				UPDATE user SET
				userObj=:userObj,
				tokenHash=:tokenHash,
				tokenAesHash=:tokenAesHash,
				password=:newPass,
				oneStep=:oneStep WHERE id=:id AND modKey=:modKey")->execute($param)

				){
					$trans->commit();
					echo '{"email":"good"}';

				}else {
					$trans->rollback();
					echo '{"email":"Keys are not saved, please try again or report a bug"}';

				}
			}else
				echo '{"email":"fail"}';

		}else{
			$user = Yii::app()->db->createCommand("SELECT password FROM user WHERE id=$id")->queryRow();

			if($user['password']==crypt($this->oldPassword,$user['password']))
			{
				$param[':modKey'] = hash('sha512', $this->modKey);

				$param[':userObj'] = $this->UserObject;
				$param[':id'] = $id;


				$param[':tokenHash']=$this->tokenHash;
				$param[':tokenAesHash']=$this->tokenAesHash;

				$param[':newPass']=crypt($this->newPassword);
				$param[':oneStep']=0;

				$trans = Yii::app()->db->beginTransaction();
				if (
					Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj,tokenHash=:tokenHash,tokenAesHash=:tokenAesHash, password=:newPass,oneStep=:oneStep WHERE id=:id AND modKey=:modKey")->execute($param)

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


}
