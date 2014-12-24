<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class RetrieveFoldersMeta extends CFormModel
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
			$this->messageIds = json_decode($this->messageIds);
		} catch (Exception $e) {
			$this->addError('message', 'Messages should be in an array');
		}

		if (is_array($this->messageIds)) {
			foreach ($this->messageIds as $row) {
				if (!is_numeric($row))
					$this->addError('message', 'Message ids should be an integers');
				return false;
			}
			return true;
		} else {
			//echo '{"message":"Messages should be in an array"}';
			$this->addError('message', 'Messages should be in an array');
		}
	}

	public function getData()
	{
		foreach ($this->messageIds as $i => $row) {
			if (is_numeric($row))
				$f[$i] = $row;
		}
		$params = implode($f, ',');

		if ($result['results'] = Yii::app()->db->createCommand("SELECT messageHash,body FROM personalFolders WHERE messageHash IN ($params)")->queryAll()) {
			echo json_encode($result);
		} else
			echo '{"results":"empty"}';

	}

	public function getMeta()
	{
		foreach ($this->messageIds as $i => $row) {
			if (is_numeric($row))
				$f[$i] = $row;
		}
		$params = implode($f, ',');

		if ($result['results'] = Yii::app()->db->createCommand("SELECT messageHash,meta FROM personalFolders WHERE messageHash IN ($params)")->queryAll()) {
			echo json_encode($result);
		} else
			echo '{"results":"empty"}';

	}


}