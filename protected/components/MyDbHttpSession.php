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
		$db->createCommand()->update(
			$this->sessionTableName,
			array('userId' => $userId), // I asume you added a column 'userId' to your session table
			'id=:id',
			array(':id' => session_id())
		);
	}

	public function deleteOldUserSessions($userId)
	{
		$db = $this->getDbConnection();
		$db->setActive(true);

		Yii::app()->db->createCommand("DELETE FROM ".$this->sessionTableName." WHERE userId=:userId")->execute(array(':userId' => $userId));
	}
}