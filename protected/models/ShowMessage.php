<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class ShowMessage extends CFormModel
{

	public $messageId,$modKey;



	public function rules()
	{
		return array(
			// username and password are required
			//array('messageIds','checkArray'),
			array('messageId', 'numerical', 'integerOnly' => true, 'allowEmpty' => false),
			array('modKey', 'match', 'pattern'=>'/^([a-z0-9 _])+$/', 'message'=>'modKey is not correct'),
			array('modKey','length', 'min' => 32, 'max'=>32),
		);
	}

	public function show()
	{
		$par[':messageHash']=$this->messageId;
		$par[':modKey']=hash('sha512',$this->modKey);

		if ($result['results'] = Yii::app()->db->createCommand("SELECT * FROM personalFolders WHERE messageHash=:messageHash AND modKey=:modKey")->queryRow(true,$par)) {
			echo json_encode($result);
		} else
			echo '{"results":"empty"}';

	}


}