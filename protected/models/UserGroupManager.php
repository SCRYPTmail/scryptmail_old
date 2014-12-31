<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class UserGroupManager extends CFormModel
{

	public $oldPass;
	public $newPass;
	public $pass;

	public $mailHash;
	public $tokenHash;
	public $tokenAesHash;



	public function rules()
	{
		return array(
			array('oldPass, newPass', 'required','on'=>'changePass'),
			array('mailHash, tokenHash,tokenAesHash,newPass', 'required','on'=>'resetPass'),
			array('mailHash, tokenHash,tokenAesHash,newPass', 'match', 'pattern'=>'/^([a-z0-9_])+$/', 'message'=>'please provide correct hash','on'=>'resetPass'),
			array('mailHash, tokenHash,tokenAesHash,newPass','length', 'min' => 128, 'max'=>128,'on'=>'resetPass'),
			array('mailHash, pass,tokenHash','length', 'min' => 128, 'max'=>128,'on'=>'verifyPass'),
			//verifyPass
		);
	}

	public function verifyPass()
	{
		$param[':mailHash']=$this->mailHash;
		$param[':tokenAesHash']=$this->tokenHash;
		//$param[':password']=$this->Pass;

		if($user=Yii::app()->db->createCommand("select id,password FROM user WHERE mailHash=:mailHash AND tokenAesHash=:tokenAesHash")->queryRow(true,$param)){

			if($user['password']==crypt($this->pass,$user['password']))
			{
				echo 'true';
			}else{
				echo 'fail';
			}

			//echo '{"result":"success"}';
		}else
			echo 'fail';

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


	public function savePass($id)
	{

		$user = Yii::app()->db->createCommand("SELECT password FROM user WHERE id=$id")->queryRow();

		if($user['password']==crypt($this->oldPass,$user['password']))
		{
			$params[':newPass']=crypt($this->newPass);
			$params[':id']=$id;
			if(Yii::app()->db->createCommand("UPDATE user SET password=:newPass WHERE id=:id")->execute($params))
				echo '{"result":"success"}';
			else
				echo '{"result":"fail"}';
		}else
			echo '{"result":"fail"}';

	}

	public function savegroup($userId, $groupId, $started, $end)
	{

		$param[':userId'] = $userId;
		$param[':groupId'] = $groupId;
		$param[':started'] = $started;
		$param[':ended'] = $end;

		if (
			Yii::app()->db->createCommand('INSERT INTO user_groups (userId,groupId,started,ended) VALUES(:userId,:groupId,:started,:ended)
		ON DUPLICATE KEY UPDATE groupId=:groupId')->execute($param) &&
			Yii::app()->db->createCommand('INSERT INTO user_group_history (userId,groupId,started,ended) VALUES(:userId,:groupId,:started,:ended)')->execute($param)
		)
			return true;
		else
			return false;

	}

	public function saveKeys($mailHash, $seedKey, $mailKey, $sigKey, $newMod)
	{
/*
		$param[':mailHash'] = $mailHash;
		$param[':seedKey'] = $seedKey;
		$param[':mailKey'] = $mailKey;
		$param[':sigKey'] = $sigKey;
		$param[':modKey'] = $newMod;


		if (Yii::app()->db->createCommand('REPLACE INTO public_exchange (mailHash,seedKey,mailKey,sigKey,modKey) VALUES(:mailHash,:seedKey,:mailKey,:sigKey,:modKey)')->execute($param))
			return true;
		else
			return false;
*/
	}


	public function updateKeys($mailHash, $seedKey, $mailKey, $sigKey, $newMod, $oldMod)
	{
/*
		$param[':mailHash'] = $mailHash;
		$param[':seedKey'] = $seedKey;
		$param[':mailKey'] = $mailKey;
		$param[':sigKey'] = $sigKey;
		$param[':modKey'] = $newMod;
		$param[':oldMod'] = $oldMod;
		if(Yii::app()->db->createCommand('SELECT mailHash FROM public_exchange WHERE mailHash=:mailHash')->queryRow(true,array(':mailHash'=>$mailHash))){
			if(Yii::app()->db->createCommand('UPDATE public_exchange SET seedKey=:seedKey,mailKey=:mailKey,sigKey=:sigKey,modKey=:modKey WHERE modKey=:oldMod AND mailHash=:mailHash')->execute($param))
			return true;
			else
				return false;
		}else{
			unset($param[':oldMod']);
			if(Yii::app()->db->createCommand('INSERT INTO public_exchange (mailHash,seedKey,mailKey,sigKey,modKey) VALUES (:mailHash,:seedKey,:mailKey,:sigKey,:modKey)')->execute($param))
			return true;
		else
			return false;
		}
*/
	}

}
