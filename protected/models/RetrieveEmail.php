<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class RetrieveEmail extends CFormModel
{
	public $emailHash;


	public function rules()
	{
		return array(
			// username and password are required
			array('emailHash', 'required'),
			array('emailHash', 'match', 'pattern'=>'/^([a-z0-9_])+$/', 'message'=>'please provide correct email hash'),
			array('emailHash','length', 'min' => 128, 'max'=>200, 'message'=>'please provide correct email hash'),
		);
	}

	public function initialOpen()
	{
		$f=explode('_',$this->emailHash);
		$param[':modKey']=$f[1];
		$param[':id']=$f[0];

		if($email=Yii::app()->db->createCommand("SELECT meta,body FROM mailTable WHERE modKey=:modKey and id=:id")->queryRow(true,$param)){
$result['success']=true;
			$result['email']=$email;
			$result['messageId']=$f[0];
			echo json_encode($result);
		}else{
			echo '{"emailHash":["Emailhash Not Found"]}';
		}
		//$f = Yii::app()->params['params']['allowedDomains'];
		//foreach($f as $i=>$row){
		//	$f[$i]=base64_encode($row);
		//}


		//echo json_encode($f);
	}
}