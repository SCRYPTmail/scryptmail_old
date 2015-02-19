<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class UpdateAccount extends CFormModel
{

	public $modKey,$userAddress,$userObj;

	public function rules()
	{
		return array(

			array('userObj', 'match', 'pattern' => "/^[a-zA-Z0-9+\/=\d]+$/i", 'allowEmpty' => false, 'on' => 'updateAcc'),

			array('userObj',  'checkUserObj', 'on' => 'updateAcc'),
			array('modKey', 'match', 'pattern' => "/^[a-z0-9\d]{32,64}$/i", 'allowEmpty' => false, 'on' => 'updateAcc'),
			array('userAddress','type','type'=>'array', 'allowEmpty' => false, 'on' => 'updateAcc'),
		);
	}

	public function checkUserObj()
	{
		if(!isset($this->userObj) || strlen($this->userObj)>700000){
			$this->addError('userObj', 'userObj wrong');
		}
	}

	public function updateAcc($id)
	{

		foreach($this->userAddress as $i=>$row){

			$adrHash[]=":addressHash_$i";
			$param[":addressHash_$i"]=$row['emailHash'];
			$param[":mailKey_$i"]=$row['mailKey'];
			$sql[]="WHEN :addressHash_$i THEN :mailKey_$i ";
		}
		$trans = Yii::app()->db->beginTransaction();

		if(Yii::app()->db->createCommand("UPDATE addresses SET mailKey = CASE addressHash
		".implode($sql,' ')." END
		WHERE addressHash IN (".implode($adrHash,',').") AND userId=$id
		")->execute($param)){

			$par[":userObj"]=$this->userObj;

		if(Yii::app()->db->createCommand("UPDATE user SET userObj=:userObj, seedKey=NULL, seedKHash=NULL,mailKey=NULL,mailKHash=NULL,sigKey=NULL,sigKHash=NULL WHERE id=$id")->execute($par))
			{
				//$trans->rollback();
				$trans->commit();
				echo  '{"result":"success"}';
			}else{
			echo  '{"result":"error"}';
			$trans->rollback();
			}

		}else{
			echo  '{"result":"error"}';
			$trans->rollback();
		}

		//print_r($this->userObj);
		//	print_r($this->userAddress);
		//print_r($this->modKey);
	}

}
