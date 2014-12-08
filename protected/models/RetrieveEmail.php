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
	public $pinHash;


	public function rules()
	{
		return array(
			// username and password are required
			array('emailHash', 'required'),
			array('emailHash,pinHash', 'match', 'pattern'=>'/^([a-f0-9_])+$/', 'message'=>'please provide correct email hash'),
			array('emailHash,pinHash','length', 'min' => 128, 'max'=>200, 'message'=>'please provide correct email hash'),
		);
	}

	public function initialOpen()
	{
		$f=explode('_',$this->emailHash);
		$param[':modKey']=$f[1];
		$param[':id']=$f[0];
		//retrieve message to check pin provided to system is correct
		if($tryPin=Yii::app()->db->createCommand("SELECT pinHash,tryCounter FROM mailTable WHERE modKey=:modKey and id=:id")->queryRow(true,$param)){

			//old messages without pin delete dec 24,2014
			if($tryPin['pinHash']==''){
				if($email=Yii::app()->db->createCommand("SELECT meta,body FROM mailTable WHERE modKey=:modKey and id=:id")->queryRow(true,$param)){
					$result['success']=true;
					$result['email']=$email;
					$result['messageId']=$f[0];
					echo json_encode($result);
				}else{
					echo '{"emailHash":["Emailhash Not Found"]}';
				}
			//end old

			//if pin match, retrieve message
			}else if($tryPin['pinHash']==$this->pinHash && $tryPin['tryCounter']<=2){
				if($email=Yii::app()->db->createCommand("SELECT meta,body FROM mailTable WHERE modKey=:modKey and id=:id")->queryRow(true,$param)){
					Yii::app()->db->createCommand("UPDATE mailTable SET tryCounter=0 WHERE modKey=:modKey and id=:id")->execute($param);
					$result['success']=true;
					$result['email']=$email;
					$result['messageId']=$f[0];
					echo json_encode($result);
				}else{
					echo '{"emailHash":["Emailhash Not Found"]}';
				}


			//if pin is invalid add counter
			}else if($tryPin['pinHash']!=$this->pinHash && $tryPin['tryCounter']<=3){
				if($tryPin['tryCounter']<2){
					$param[':tryCounter']=$tryPin['tryCounter']+1;
					Yii::app()->db->createCommand("UPDATE mailTable SET tryCounter=:tryCounter WHERE modKey=:modKey and id=:id")->execute($param);
					echo '{"emailHash":["Emailhash Not Found"]}';
				}
				//set expire immediately for crawler cleanup
				if($tryPin['tryCounter']>=2){
					$param[':tryCounter']=$tryPin['tryCounter']+1;
					Yii::app()->db->createCommand("UPDATE mailTable SET expired=NOW(),tryCounter=:tryCounter WHERE modKey=:modKey and id=:id")->execute($param);
					//Yii::app()->db->createCommand("DELETE FROM mailTable WHERE modKey=:modKey AND id=:id")->execute($param);
					echo '{"emailHash":["Emailhash Not Found"]}';
				}

			}


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