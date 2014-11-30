<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class User extends CFormModel
{

	public function findUser($username)
	{
		$param[':mailHash'] = $username;
		return Yii::app()->db->createCommand("SELECT mailHash,id,password,userObj,folderObj,saltS FROM user WHERE mailHash=:mailHash")->queryRow(true, $param);
	}


	public function getRole($id)
	{
		$data = Yii::app()->db->createCommand("SELECT * FROM user_groups WHERE userId=$id AND ended>NOW()")->queryRow();

		return $data;
	}

	public function getGroups($id)
	{
		$data = Yii::app()->db->createCommand("SELECT * FROM groups_definition")->queryAssoc('id');

		return $data;
	}

}
