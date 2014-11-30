<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class ShowMessage extends CFormModel
{

	public $messageId;


	public function rules()
	{
		return array(
			// username and password are required
			//array('messageIds','checkArray'),
			array('messageId', 'numerical', 'integerOnly' => true, 'allowEmpty' => false),
		);
	}

	public function show()
	{

		if ($result['results'] = Yii::app()->db->createCommand("SELECT * FROM personalFolders WHERE messageHash=" . $this->messageId)->queryRow()) {
			echo json_encode($result);
		} else
			echo '{"results":"empty"}';

	}


}