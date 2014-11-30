<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class GetObjects extends CFormModel
{
	public function retrieveData()
	{
		$param[':id'] = Yii::app()->user->getId();
		$result['userData'] = Yii::app()->db->createCommand("SELECT id,userObj,folderObj,contacts,blackList,profileSettings,saltS FROM user WHERE id=:id")->queryRow(true, $param);
		$result['userRole'] = Yii::app()->user->role;

		echo json_encode($result);

	}


}