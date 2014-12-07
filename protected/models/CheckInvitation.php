<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class CheckInvitation extends CFormModel
{
	public $invitationToken;

	public function rules()
	{
		return array(
			array('invitationToken', 'required'),
			array('invitationToken', 'match', 'pattern'=>'/^([a-f0-9_])+$/', 'message'=>'please provide correct hash'),
			array('invitationToken','length', 'min' => 64, 'max'=>64),

		);
	}

	public function verifyToken()
	{

		if ($salt=Yii::app()->db->createCommand("SELECT id FROM invites WHERE invitationCode=:invitationToken AND registered IS NULL")->queryRow(true, array(':invitationToken'=>$this->invitationToken))) {
			echo 'true';
		}else
			echo 'false';

	}


}