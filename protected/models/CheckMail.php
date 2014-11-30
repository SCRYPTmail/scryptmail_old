<?php

/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class CheckMail extends CFormModel
{
	public $email;

	public function rules()
	{
		return array(
			// username and password are required
			array('email', 'email','allowEmpty'=>false),
		);
	}

	public function confirm()
	{
		if (Yii::app()->db->createCommand("SELECT * FROM invites WHERE emails=:emails")->queryRow(true, array(':emails'=>$this->email))) {
			echo 'false';
		}else
			echo 'true';

	}

	public function saveInvite(){
		if (Yii::app()->db->createCommand("INSERT INTO invites (emails) VALUES (:emails)")->execute(array(':emails'=>$this->email))) {
			echo '{"response":true}';
		}else
			echo '{"response":false}';
	}
}