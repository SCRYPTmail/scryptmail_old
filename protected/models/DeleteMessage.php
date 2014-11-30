<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class DeleteMessage extends CFormModel
{

	public $messageIds;


	public function rules()
	{
		return array(
			// username and password are required
			array('messageIds', 'checkArray'),
			//	array('mailHash', 'numerical','integerOnly'=>true,'allowEmpty'=>true),
		);
	}

	public function checkArray()
	{
		try {
			$this->messageIds = json_decode($this->messageIds, true);
		} catch (Exception $e) {
			$this->addError('message', 'Messages should be in an array');
		}
		;
		if (is_array($this->messageIds)) {
			foreach ($this->messageIds as $row) {
				if (!is_numeric($row['id']))
					$this->addError('message', 'Message ids should be an integers');
				return false;
			}
			return true;
		} else {
			$this->addError('message', 'Messages should be in an array');
		}
	}

	public function delete()
	{
		if (count($this->messageIds) > 0) {
			foreach ($this->messageIds as $i => $row) {
				$par[] = "(:id_$i,:mod_$i)";
				$param[":id_$i"] = $row['id'];
				$param[":mod_$i"] = hash('sha512', $row['modKey']);
			}
			if($fileRemove=Yii::app()->db->createCommand("SELECT file FROM personalFolders WHERE (messageHash,modKey) IN (" . implode($par, ',') . ")")->queryAll(true,$param)){
				foreach($fileRemove as $filejson){
					if($files=json_decode($filejson['file'],true)){
						foreach($files as $names){
							try {
							@unlink(Yii::app()->basePath . '/attachments/' . $names);
							} catch (Exception $e) {
							}
						}
					}
				}
			}
			if (Yii::app()->db->createCommand("DELETE FROM personalFolders WHERE (messageHash,modKey) IN (" . implode($par, ',') . ")")->execute($param)) {
				echo '{"results":"success"}';
			} else
				echo '{"results":"fail"}';

		} else {
			echo '{"results":"success"}';
		}

	}

	public function deleteUnreg()
	{
		if (count($this->messageIds) > 0) {
			foreach ($this->messageIds as $i => $row) {
				$par[] = "(:id_$i,:mod_$i)";
				$param[":id_$i"] = $row['id'];
				$param[":mod_$i"] = hash('sha512', $row['modKey']);
			}
			if($fileRemove=Yii::app()->db->createCommand("SELECT file FROM mailTable WHERE (id,modKey) IN (" . implode($par, ',') . ")")->queryAll(true,$param)){
				foreach($fileRemove as $filejson){
					if($files=json_decode($filejson['file'],true)){
						foreach($files as $names){
							try {
								@unlink(Yii::app()->basePath . '/attachments/' . $names);
							} catch (Exception $e) {
							}
						}
					}
				}
			}
			if (Yii::app()->db->createCommand("DELETE FROM mailTable WHERE (id,modKey) IN (" . implode($par, ',') . ")")->execute($param)) {
				echo '{"results":"success"}';
			} else
				echo '{"results":"fail"}';

		} else {
			echo '{"results":"success"}';
		}

	}
}