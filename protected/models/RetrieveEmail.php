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

			$param[':id']=$this->emailHash;

			//retrieve message to check pin provided to system is correct
			//$newMail2field[]=array('oldId'=>$f[0],'modKey'=>$f[1]);
			$newMail2field=array('oldId'=>$this->emailHash);


			if($tryPin=Yii::app()->db->createCommand("SELECT pinHash,tryCounter FROM mailTable WHERE id=:id")->queryRow(true,$param))
			{
					if($tryPin['pinHash']==$this->pinHash && $tryPin['tryCounter']<=2){

						if($email=Yii::app()->db->createCommand("SELECT meta,body FROM mailTable WHERE id=:id")->queryRow(true,$param)){
							Yii::app()->db->createCommand("UPDATE mailTable SET tryCounter=0 WHERE id=:id")->execute($param);
							$result['success']=true;
							$result['email']=$email;
							$result['messageId']=$this->emailHash;

							Yii::app()->session['unregisteredLogin'] = true;
							Yii::app()->session['unregisteredMailHash'] = $this->emailHash;

							echo json_encode($result);
						}else{
							echo '{"emailHash":["Emailhash Not Found"]}';
						}


						//if pin is invalid add counter
					}else if($tryPin['pinHash']!=$this->pinHash && $tryPin['tryCounter']<=3){
						if($tryPin['tryCounter']<2){
							$param[':tryCounter']=$tryPin['tryCounter']+1;
							Yii::app()->db->createCommand("UPDATE mailTable SET tryCounter=:tryCounter WHERE id=:id")->execute($param);
							echo '{"emailHash":["Emailhash Not Found"]}';
						}
						//set expire immediately for crawler cleanup
						if($tryPin['tryCounter']>=2){
							$param[':tryCounter']=$tryPin['tryCounter']+1;
							Yii::app()->db->createCommand("UPDATE mailTable SET expired=NOW(),tryCounter=:tryCounter WHERE id=:id")->execute($param);
							//Yii::app()->db->createCommand("DELETE FROM mailTable WHERE modKey=:modKey AND id=:id")->execute($param);
							echo '{"emailHash":["Emailhash Not Found"]}';
						}

					}


			}else if($newMails=Yii::app()->mongo->findOne('mailQueue',$newMail2field)){

				if($newMails['pinHash']==$this->pinHash && $newMails['tryCounter']<=2){

					$criteria=array("_id" => new MongoId($newMails['_id']));
					$person=array('$set' =>array("tryCounter" => 0));
					$message=Yii::app()->mongo->update('mailQueue',$person,$criteria);

					$result['success']=true;
					$result['email']=array('body'=>bin2hex($newMails['body']->bin),'meta'=>bin2hex($newMails['meta']->bin));
					$result['messageId']=$this->emailHash;

					Yii::app()->session['unregisteredLogin'] = true;
					Yii::app()->session['unregisteredMailHash'] = $this->emailHash;

					echo json_encode($result);
					//if pin is invalid add counter
				}else if($newMails['pinHash']!=$this->pinHash && $newMails['tryCounter']<=3){
					$criteria=array("_id" => new MongoId($newMails['_id']));
					if($newMails['tryCounter']<2){
						$person=array('$set' =>array(
							"tryCounter" => $newMails['tryCounter']+1,
						));
						$message=Yii::app()->mongo->update('mailQueue',$person,$criteria);
						echo '{"emailHash":["Emailhash Not Found"]}';
					}
					//set expire immediately for crawler cleanup
					if($newMails['tryCounter']>=2){
						$person=array('$set' =>array(
							"tryCounter" => $newMails['tryCounter']+1,
							"expireAfter"=>new MongoDate(strtotime('now'))
						));
						$message=Yii::app()->mongo->update('mailQueue',$person,$criteria);
						echo '{"emailHash":["Emailhash Not Found"]}';
					}
				}

			}else{
				echo '{"emailHash":["Emailhash Not Found"]}';
			}



	}
}