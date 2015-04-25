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
			//array('messageId', 'numerical', 'integerOnly' => true, 'allowEmpty' => false),
			array('messageId', 'match', 'pattern'=>'/^([a-z0-9 _])+$/', 'message'=>'messageId is not correct'),
			array('messageId','length', 'min' => 1, 'max'=>24),

			array('modKey', 'match', 'pattern'=>'/^([a-z0-9 _])+$/', 'message'=>'modKey is not correct'),
			array('modKey','length', 'min' => 32, 'max'=>32),
		);
	}

	public function show()
	{
		//move new email to mongo
		if(is_numeric($this->messageId)){
			$query=	array(
				'_id' => new MongoId(substr(hash('sha1',$this->messageId),0,24)),
				'modKey'=>hash('sha512',$this->modKey)
			);

			if($ref=Yii::app()->mongo->findOne('personalFolders',$query,array('_id'=>1,'meta'=>1,'body'=>1))){
				$result['results']['messageHash']=$this->messageId;

				$result['results']['meta']=base64_encode(substr($ref['meta']->bin,0,16)).';'.base64_encode(substr($ref['meta']->bin,16));
				$result['results']['body']=base64_encode(substr($ref['body']->bin,0,16)).';'.base64_encode(substr($ref['body']->bin,16));

				echo json_encode($result);
			}else
				echo '{"results":"empty"}';


		}else if(ctype_xdigit($this->messageId) && strlen($this->messageId)==24){
			$query=	array(
				'_id' => new MongoId($this->messageId),
				'modKey'=>hash('sha512',$this->modKey)
			);


			if($ref=Yii::app()->mongo->findOne('personalFolders',$query,array('_id'=>1,'meta'=>1,'body'=>1))){

				$result['results']['messageHash']=$this->messageId;

				$result['results']['meta']=base64_encode(substr($ref['meta']->bin,0,16)).';'.base64_encode(substr($ref['meta']->bin,16));
				$result['results']['body']=base64_encode(substr($ref['body']->bin,0,16)).';'.base64_encode(substr($ref['body']->bin,16));

				echo json_encode($result);

			}else
				echo '{"results":"empty"}';

		}else
			echo '{"results":"empty"}';


	}


}