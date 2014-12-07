<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class CountRegistered extends CFormModel
{




	public function getReg()
	{

		return 5-Yii::app()->db->createCommand("SELECT count(id) FROM invites WHERE date(requsted)=curdate() AND invitationCode IS NOT NULL")->queryScalar();

	}

}