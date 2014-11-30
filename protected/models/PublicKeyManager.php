<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class PublicKeyManager extends CFormModel
{


	public function saveKeys($userId, $mailKey, $seedKey)
	{

		$param[':userId'] = $userId;
		$param[':mailKey'] = $mailKey;
		$param[':seedKey'] = $seedKey;

		Yii::app()->db->createCommand('INSERT INTO user_groups (userId,groupId,started,ended) VALUES(:userId,:groupId,:started,:ended)
		ON DUPLICATE KEY UPDATE groupId=:groupId')->execute($param);
		Yii::app()->db->createCommand('INSERT INTO user_group_history (userId,groupId,started,ended) VALUES(:userId,:groupId,:started,:ended)')->execute($param);

		return true;
	}

}
