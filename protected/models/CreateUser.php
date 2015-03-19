<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class CreateUser extends CFormModel
{

	public $email, $CreateUser,$modKey;

	public $salt,$tokenHash,$tokenAesHash,$UserObject,$FolderObject,$ModKey,$contacts,$blackList,$mailKey,$mailKHash,$prof,$mailHash,$password; //create Account

	public $oldAesTokenHash;

	public $newPass,$token;

	public function rules()
	{
		return array(
			//array('email', 'length', 'min' => 3, 'max' => 255, 'allowEmpty' => false, 'on' => 'validatemail'),
			array('email', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'validatemail'),

			array('email', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'saveDisposable,deleteDisposable'),
			array('modKey', 'match', 'pattern' => "/^[a-z0-9\d]{32,64}$/i", 'allowEmpty' => false, 'on' => 'saveDisposable,deleteDisposable,updateKeys'),
			array('UserObject', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]+$/i", 'allowEmpty' => false, 'on' => 'saveDisposable,deleteDisposable,updateKeys'),
			array('UserObject','length', 'max'=>80000,'min'=>4000,'on'=>'saveDisposable,deleteDisposable,updateKeys'),
			array('mailKey', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]{200,2000}$/i", 'allowEmpty' => false, 'on' => 'saveDisposable,updateKeys'),

			array('mailKey', 'checkKeyLength', 'on' => 'updateKeys,saveDisposable'),
			//array('CreateUser', 'isJson', 'on' => 'createAccount'),
			//array('CreateUser', 'isJsonResetUser', 'on' => 'resetUser'),

			//array('CreateUser', 'isJsonResetUser', 'on' => 'resetPassOneStep'),

			//Reset One Step password
			array('salt', 'match', 'pattern' => "/^[a-z0-9\d]{512}$/i", 'allowEmpty' => false, 'on' => 'resetPassOneStep,resetUser'),
			array('tokenHash,tokenAesHash,ModKey,mailHash,password,oldAesTokenHash', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'resetPassOneStep,resetUser'),
			array('UserObject', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]+$/i", 'allowEmpty' => false, 'on' => 'resetPassOneStep,resetUser'),
			array('UserObject','length', 'max'=>80000,'min'=>4000,'on'=>'resetPassOneStep,resetUser'),
			array('FolderObject,contacts,blackList,prof', 'match', 'pattern' => "/^[a-z0-9\d]{20,1024}$/i", 'allowEmpty' => false, 'on' => 'resetPassOneStep,resetUser'),
			array('mailKey', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]{200,2000}$/i", 'allowEmpty' => false, 'on' => 'resetPassOneStep,resetUser'),


			//resetPass 2-Fact
			array('mailHash,tokenHash,tokenAesHash,newPass', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'resetPass'),


			array('salt', 'match', 'pattern' => "/^[a-z0-9\d]{512}$/i", 'allowEmpty' => false, 'on' => 'createAccount'),
			array('token', 'match', 'pattern' => "/^[a-z0-9\d]{32}$/i", 'allowEmpty' => false, 'on' => 'createAccount'),

			array('tokenHash,tokenAesHash,ModKey,mailHash,password', 'match', 'pattern' => "/^[a-z0-9\d]{128}$/i", 'allowEmpty' => false, 'on' => 'createAccount'),
			array('UserObject', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]{4000,20000}$/i", 'allowEmpty' => false, 'on' => 'createAccount'),
			array('FolderObject,contacts,blackList', 'match', 'pattern' => "/^[a-z0-9\d]{20,1024}$/i", 'allowEmpty' => false, 'on' => 'createAccount'),
			array('mailKey', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]{200,2000}$/i", 'allowEmpty' => false, 'on' => 'createAccount'),

			array('prof', 'match', 'pattern' => "/^[a-z0-9\d]{200,1000}$/i", 'allowEmpty' => false, 'on' => 'createAccount'),

		);
	}

public function checkKeyLength(){

	if(isset($this->mailKey)){

		openssl_public_encrypt('SCRYPTmail', $encrypted, base64_decode($_POST['mailKey']), OPENSSL_PKCS1_OAEP_PADDING);
		if(strlen($encrypted)*4>Yii::app()->user->role['role']['mailMaxKeyLength']){
			$this->addError('mailKey', 'mail key is bigger than allowed by plan');
		}
	}else{
		$this->addError('mailKey', 'mailKey is not set');
	}

}


	public function resetPass()
	{

		$param[':mailHash']=$this->mailHash;
		$param[':tokenHash']=$this->tokenHash;
		$param[':tokenAesHash']=$this->tokenAesHash;
		$param[':newPass']=crypt($this->newPass);

		//print_r($param);

		if(Yii::app()->db->createCommand("UPDATE user SET password=:newPass WHERE mailHash=:mailHash AND tokenHash=:tokenHash AND tokenAesHash=:tokenAesHash")->execute($param)){
			echo '{"result":"success"}';
		}else
			echo '{"result":"fail"}';
	}


	public function resetPassOneStep()
	{


		$param[':mailHash'] = $this->mailHash;
		$param[':oldAesTokenHash'] = $this->oldAesTokenHash;

		if($user=Yii::app()->db->createCommand("SELECT id,password FROM user WHERE mailHash=:mailHash AND oneStep=1 AND tokenAesHash=:oldAesTokenHash")->queryRow(true,$param)){

				$param[':profileSettings'] = $this->prof;
				$param[':userObj'] = $this->UserObject;
				$param[':folderObj'] = $this->FolderObject;
				$param[':contacts'] = $this->contacts;
				$param[':blackList'] = $this->blackList;
				$param[':modKey'] = $this->ModKey;
				$param[':saltS'] = $this->salt;
				$param[':tokenHash'] = $this->tokenHash;
				$param[':tokenAesHash'] = $this->tokenAesHash;
				$param[':userId'] =$user['id'];

				$param[':password'] = crypt($this->password);

				$trans = Yii::app()->db->beginTransaction();

				if(Yii::app()->db->createCommand(
					"UPDATE user SET profileSettings=:profileSettings, userObj=:userObj,folderObj=:folderObj,contacts=:contacts,blackList=:blackList,modKey=:modKey,saltS=:saltS,tokenHash=:tokenHash,tokenAesHash=:tokenAesHash,password=:password WHERE id=:userId AND mailHash=:mailHash AND tokenAesHash=:oldAesTokenHash"
				)->execute($param) &&
					Yii::app()->db->createCommand(
						"UPDATE addresses SET mailKey=:mailKey WHERE userId=:userId AND addressHash=:addressHash AND addr_type=1")->execute(array(':mailKey'=>$this->mailKey,':addressHash'=>$this->mailHash,':userId'=>$user['id'])))
				{

					Yii::app()->db->createCommand('DELETE FROM addresses WHERE userId='.$user['id'].' AND addr_type IN (2,3)')->execute();
					$trans->commit();
					echo  '{"email":"success"}';
				}else{
					echo  '{"email":"error"}';
					$trans->rollback();
				}


		}else{
			echo  '{"email":"not found"}';
		}



	}
	public function resetUser()
	{


		$param[':mailHash'] = $this->mailHash;
		$param[':oldAesTokenHash'] = $this->oldAesTokenHash;

		if($user=Yii::app()->db->createCommand("SELECT id,password FROM user WHERE mailHash=:mailHash AND oneStep=0 AND tokenAesHash=:oldAesTokenHash")->queryRow(true,$param)){

			if($user['password']==crypt($this->password,$user['password']))
			{
				$param[':profileSettings'] = $this->prof;
				$param[':userObj'] = $this->UserObject;
				$param[':folderObj'] = $this->FolderObject;
				$param[':contacts'] = $this->contacts;
				$param[':blackList'] = $this->blackList;
				$param[':modKey'] = $this->ModKey;
				$param[':saltS'] = $this->salt;
				$param[':tokenHash'] = $this->tokenHash;
				$param[':tokenAesHash'] = $this->tokenAesHash;


				//$param[':mailKey'] = $this->mailKey;


				$trans = Yii::app()->db->beginTransaction();

				if(Yii::app()->db->createCommand(
					"UPDATE user SET
					profileSettings=:profileSettings,
					userObj=:userObj,
					folderObj=:folderObj,
					contacts=:contacts,
					blackList=:blackList,
					modKey=:modKey,
					saltS=:saltS,
					tokenHash=:tokenHash,
					tokenAesHash=:tokenAesHash WHERE mailHash=:mailHash AND tokenAesHash=:oldAesTokenHash"
				)->execute($param) &&
					Yii::app()->db->createCommand(
						"UPDATE addresses SET mailKey=:mailKey WHERE userId=:userId AND addressHash=:addressHash AND addr_type=1")->execute(array(':mailKey'=>$this->mailKey,':addressHash'=>$this->mailHash,':userId'=>$user['id'])))
				{
					Yii::app()->db->createCommand('DELETE FROM addresses WHERE userId='.$user['id'].' AND addr_type IN (2,3)')->execute();
						$trans->commit();
						echo  '{"email":"success"}';
				}else{
					echo  '{"email":"error"}';
					$trans->rollback();
				}

			}else{
				echo  '{"email":"password wrong"}';
			}

		}else{
			echo  '{"email":"not found"}';
		}
	}
	public function validateEmail()
	{
		$param[':mailHash'] = $this->email;
		if (Yii::app()->db->createCommand("SELECT addressHash FROM addresses WHERE addressHash=:mailHash")->queryRow(true, $param) && $this->email!='e89322d21da8e8d5dd1ef398f189bd11179f44436e9a296e8898356f34b3ecef2d6d34c9d703b2c8ea7e97684158a42d21a5af265bdc26157027af4c130ef98c') {
			echo  'false';
		} else
			echo  'true';
	}

	public function deleteDisposable($id){

		$param[':email'] =$this->email;
		$param[':userId'] =$id;
		$param[':modKey'] =hash('sha512',$this->modKey);

		$paramUser[':userObj'] =$this->UserObject;
		$paramUser[':userId'] =$id;
		$paramUser[':modKey'] =hash('sha512',$this->modKey);

		$trans = Yii::app()->db->beginTransaction();
		if (Yii::app()->db->createCommand("
			DELETE addresses.*
				FROM addresses
				LEFT JOIN user ON user.id = addresses.userId
			WHERE user.id=:userId AND modKey=:modKey AND addresses.addressHash=:email AND addresses.addr_type=2")->execute($param) &&
			Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj WHERE id=:userId AND modkey=:modKey")->execute($paramUser)
		) {
			$trans->commit();
			echo  'true';
		} else{
			$trans->rollback();
			echo  'false';
		}


	}

	//updateKeys
	public function updateKeys($id)
	{
		$param[':userId'] =$id;
		$param[':mailKey'] =$this->mailKey;


		$paramUser[':userId'] =$id;
		$paramUser[':modKey'] =hash('sha512',$this->modKey);
		$paramUser[':userObj'] =$this->UserObject;

		$trans = Yii::app()->db->beginTransaction();
		if(Yii::app()->db->createCommand('UPDATE addresses SET mailKey=:mailKey WHERE userId=:userId AND addr_type=1')->execute($param) &&
			Yii::app()->db->createCommand('UPDATE user SET userObj=:userObj WHERE id=:userId AND modKey=:modKey')->execute($paramUser)
		){
			$trans->commit();
			echo  'true';
		}else{
			$trans->rollback();
			echo  'false';
		}

	}


	public function saveDisposable($id)
	{

		if(Yii::app()->db->createCommand("SELECT count(userId) FROM addresses WHERE userId=$id AND addr_type=2")->queryScalar()<Yii::app()->user->role['role']['dispAddPerBox']){

			$param[':email'] =$this->email;
			$param[':userId'] =$id;
			$param[':modKey'] =hash('sha512',$this->modKey);
			$param[':mailKey'] =$this->mailKey;

			$paramUser[':userObj'] =$this->UserObject;
			$paramUser[':userId'] =$id;
			$paramUser[':modKey'] =hash('sha512',$this->modKey);

			$trans = Yii::app()->db->beginTransaction();

			if (Yii::app()->db->createCommand(
				"INSERT INTO addresses (userId,addressHash,addr_type,mailKey)
					SELECT :userId, :email,'2',:mailKey
						FROM user
							WHERE id=:userId AND modkey=:modKey")->execute($param) &&
				Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj WHERE id=:userId AND modkey=:modKey")->execute($paramUser)) {
				$trans->commit();
				echo  'true';
			} else{
				$trans->rollback();
				echo  'false';
			}


		}else
			echo  'false';


	}

	public function createAccount()
	{

			if($this->mailHash=='e89322d21da8e8d5dd1ef398f189bd11179f44436e9a296e8898356f34b3ecef2d6d34c9d703b2c8ea7e97684158a42d21a5af265bdc26157027af4c130ef98c'){
				//echo  '{"email":"reserved"}'; //todo revert back before push
				echo  '{"email":"success"}';
				return true;
			}

		if($invite=Yii::app()->db->createCommand("SELECT id,user_group FROM invites WHERE invitationCode='$this->token'")->queryRow())
		{

			$param[':userObj'] = $this->UserObject;
			$param[':folderObj'] = $this->FolderObject;
			$param[':modKey'] = $this->ModKey;

			$param[':tokenHash'] = $this->tokenHash;
			$param[':tokenAesHash'] = $this->tokenAesHash;

			$param[':contacts'] = $this->contacts;
			$param[':blackList'] = $this->blackList;
			$param[':saltS'] = $this->salt;
			$param[':profileSettings'] = $this->prof;

			$param[':mailHash'] = $this->mailHash;
			$param[':invitationId'] = $invite['id'];
			$param[':password'] = crypt($this->password);


			$trans = Yii::app()->db->beginTransaction();


			if(
				Yii::app()->db->createCommand(
					"INSERT INTO user (mailHash,password,userObj,folderObj,contacts,blackList,modKey,saltS,profileSettings,tokenHash,tokenAesHash,invitationId) VALUES(:mailHash,:password,:userObj,:folderObj,:contacts,:blackList,:modKey,:saltS,:profileSettings,:tokenHash,:tokenAesHash,:invitationId)")->execute($param)
			) {
				$usId=Yii::app()->db->getLastInsertID();

				//$param[':mailKey'] = $this->mailKey;
				//$param[':mailKHash'] = $this->mailKHash;


				if(
					Yii::app()->db->createCommand("INSERT INTO addresses (userId,addressHash,addr_type,mailKey) VALUES (:userId,:addressHash,'1',:mailKey)")->execute(array(':userId'=>$usId,':addressHash'=>$this->mailHash,':mailKey'=>$this->mailKey)) &&
					UserGroupManager::savegroup($usId, $invite['user_group'], date('Y-m-d H:i:s'), date('Y-m-d H:i:s', strtotime('+52 weeks')))
					&&	Yii::app()->db->createCommand("UPDATE invites SET registered=NOW() WHERE invitationCode='$this->token'")->execute()
				){
					$trans->commit();
					echo  '{"email":"success"}';
					return true;
				}
			} else {
				$trans->rollback();
				$this->addError('email', 'error');
			}


		}else{
			$this->addError('email', 'error');
		}



	}
}
