<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class VerifyToken extends CFormModel
{
	public $mailHash;
	public $tokenHash;

	public function rules()
	{
		return array(
			array('mailHash,tokenHash', 'required'),
			array('mailHash,tokenHash', 'match', 'pattern'=>'/^([a-z0-9_])+$/', 'message'=>'please provide correct hash'),
			array('mailHash,tokenHash','length', 'min' => 128, 'max'=>128),

		);
	}

	public function checkToken()
	{


		if ($salt=Yii::app()->db->createCommand("SELECT saltS,mailHash,tokenAesHash FROM user WHERE mailHash=:mailHash AND tokenAesHash=:tokenAesHash")->queryRow(true, array(':mailHash'=>$this->mailHash,':tokenAesHash'=>$this->tokenHash))) {
			$data['response']=true;
			$data['salt']=$salt['saltS'];;
			echo json_encode($data);
		}else
			echo '{"response":false}';

	}

	public function checkRawToken()
	{
		if (Yii::app()->db->createCommand("SELECT mailHash FROM user WHERE mailHash=:mailHash AND tokenHash=:tokenHash")->queryRow(true, array(':mailHash'=>$this->mailHash,':tokenHash'=>$this->tokenHash))) {
			$data['response']=true;
			echo 'true';
		}else
			echo 'false';
	}

}