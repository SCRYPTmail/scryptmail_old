<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class MyDbHttpSession extends CDbHttpSession
{
	public function setUserId($userId)
	{
		$db = $this->getDbConnection();
		$db->setActive(true);

		//print_r(Yii::app()->db->createCommand("UPDATE ".$this->sessionTableName." SET userId=:userId, id=:id WHERE id=:id"));
		if(Yii::app()->db->createCommand("UPDATE ".$this->sessionTableName." SET userId=:userId, id=:id WHERE id=:id")->execute(array(':userId' => $userId,':id'=>session_id()))){
		}else{
			Yii::app()->db->createCommand("INSERT INTO ".$this->sessionTableName." (userId,id) VALUES(:userId,:id)")->execute(array(':userId' => $userId,':id'=>session_id()));
		}

		/*$db->createCommand()->update(
			$this->sessionTableName,
			array('userId' => $userId),
			'id=:id',
			array(':id' => session_id())
		);*/
	}

	public function deleteOldUserSessions($userId)
	{
		$db = $this->getDbConnection();
		$db->setActive(true);
		Yii::app()->db->createCommand("DELETE FROM ".$this->sessionTableName." WHERE userId=:userId")->execute(array(':userId' => $userId));
	}
}