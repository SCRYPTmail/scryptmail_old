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
			array('messageIds', 'safe'),
			//	array('mailHash', 'numerical','integerOnly'=>true,'allowEmpty'=>true),
		);
	}

	public function checkArray()
	{
		try {
			$this->messageIds = json_decode($this->messageIds, true);
		} catch (Exception $e) {
			$this->addError('results', 'Messages should be in an array');
		}
		;
		if (is_array($this->messageIds)) {
			return true;
		} else {
			$this->addError('results', 'Messages should be in an array');
		}
	}


	public function delete()
	{

		if (count($this->messageIds) > 0) {
			foreach ($this->messageIds as $i => $row) {

				if(is_numeric($row['id']))
					$mngData[]=array('_id'=>new MongoId(substr(hash('sha1',$row['id']),0,24)),'modKey'=>isset( $row['modKey'])?hash('sha512', $row['modKey']):'');
				else if(ctype_xdigit($row['id']))
					$mngData[]=array('_id'=>new MongoId($row['id']),'modKey'=>isset( $row['modKey'])?hash('sha512', $row['modKey']):'');


			}
				$mngDataAgregate=array('$or'=>$mngData);

				if($ref=Yii::app()->mongo->findAll('personalFolders',$mngDataAgregate,array('_id'=>1,'file'=>1))){
					foreach($ref as $doc){
						if($files=json_decode($doc['file'],true)){
							foreach($files as $names)
								FileWorks::deleteFile($names);

						}
					}
				}


			if(Yii::app()->mongo->removeAll('personalFolders',$mngDataAgregate))
				echo '{"results":"success"}';
			else
				echo '{"results":"fail"}';

		}else{
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

					$mngData=array('oldId'=>$row['id'],'modKey'=>isset( $row['modKey'])?hash('sha512', $row['modKey']):'');
				}

				if($fileRemove=Yii::app()->db->createCommand("SELECT file FROM mailTable WHERE (id,modKey) IN (" . implode($par, ',') . ")")->queryAll(true,$param)){

					foreach($fileRemove as $filejson){
						if($files=json_decode($filejson['file'],true)){
							foreach($files as $names)
								FileWorks::deleteFile($names);

						}
					}
				}
				if($newEmailsToClean=Yii::app()->mongo->findOne('mailQueue',$mngData)){
						$emailToDeleteId=array('_id'=>new MongoId($newEmailsToClean['_id']),'modKey'=>$newEmailsToClean['modKey']);

						if($files=json_decode($newEmailsToClean['file'],true)){
							foreach($files as $filename){
								FileWorks::deleteFile($filename);
							}
						}

				}

				if (Yii::app()->db->createCommand("DELETE FROM mailTable WHERE (id,modKey) IN (" . implode($par, ',') . ")")->execute($param)
				||
					Yii::app()->mongo->removeAll('mailQueue',$emailToDeleteId)
				)
					echo '{"results":"success"}';
				else
					echo '{"results":"fail"}';

			} else
				echo '{"results":"success"}';


	}
}