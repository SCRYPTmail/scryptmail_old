<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class SaveFolders extends CFormModel
{

	public $folderObj;
	public $blackObj;
	public $modKey;


	public function rules()
	{
		return array(
			// username and password are required

			array('modKey', 'match', 'pattern' => "/^[a-z0-9\d]{32,64}$/i", 'allowEmpty' => false, 'on' => 'saveFolder'),

			array('folderObj', 'match', 'pattern' => "/^[a-zA-Z0-9+;\/=\d]+$/i", 'allowEmpty' => false, 'on' => 'saveFolder'),
			array('folderObj','length', 'max'=>8000000,'min'=>20,'on'=>'saveFolder'),


			array('blackObj,modKey', 'required','on'=>'saveBlack'),
			//	array('mailHash', 'numerical','integerOnly'=>true,'allowEmpty'=>true),
		);
	}


	public function save()
	{
		$params[':folderObj'] = $this->folderObj;
		$params[':modKey'] = hash('sha512', $this->modKey);
		$params[':id'] = Yii::app()->user->getId();

		if (Yii::app()->db->createCommand("UPDATE user SET folderObj=:folderObj WHERE modKey=:modKey AND id=:id")->execute($params))
			echo '{"response":"success"}';
		else
			echo '{"response":"fail"}';

	}


	public function saveBlackList()
	{
		$params[':blackList'] = $this->blackObj;
		$params[':modKey'] = hash('sha512', $this->modKey);
		$params[':id'] = Yii::app()->user->getId();

		if (Yii::app()->db->createCommand("UPDATE user SET blackList=:blackList WHERE modKey=:modKey AND id=:id")->execute($params))
			echo '{"response":"success"}';
		else
			echo '{"response":"fail"}';

	}
}