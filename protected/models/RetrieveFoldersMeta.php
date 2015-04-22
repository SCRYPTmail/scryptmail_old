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
		if(count($this->messageIds)>0){
			foreach ($this->messageIds as $i => $row) {
				if (is_numeric($row))
					$f[$row] = $row;
					$mongof[]=new MongoId(substr(hash('sha1',$row),0,24));
					$refMong[substr(hash('sha1',$row),0,24)]=$row;

			}

			if(isset($f))
			{
				//if(MongoMigrate::movePersonalFolders($f))
				//{
					if($ref=Yii::app()->mongo->findByManyIds('personalFolders',$mongof,array('_id'=>1,'meta'=>1,''))){
						foreach($ref as $doc){

							$vect=substr($doc['meta']->bin,0,16);
							$data=substr($doc['meta']->bin,16);
							$row=base64_encode($vect).';'.base64_encode($data);
							//$row=$doc['meta']->bin;
							$result['results'][]=array('messageHash'=>$refMong[$doc['_id']],'meta'=>$row);
						}
						//print_r($result);
						echo json_encode($result);
						//$ref[0]['meta']=$ref[0]['meta']->bin;


					}
				//}

			}else
				echo '{"results":"empty"}';



			//if($ref=Yii::app()->mongo->findByManyIds('personalFolders',$mongof,array('_id'=>1,'meta'=>1,''))){
			//	$ref[0]['meta']=$ref[0]['meta']->bin;


			//}


			//print_r($ref);
/*
			if ($result['results'] = Yii::app()->db->createCommand("SELECT messageHash,meta FROM personalFolders WHERE messageHash IN ($params)")->queryAll()) {
				foreach($result['results'] as $i=>$row){
					$vect=hex2bin(substr($row['meta'],0,32));
					$data=hex2bin(substr($row['meta'],32));
					$resul['results'][$row['messageHash']]['meta']=base64_encode($vect).';'.base64_encode($data);
					$resul['results'][$row['messageHash']]['messageHash']=(int)$row['messageHash'];
					//print_r($vect);
				}

				if(isset($ref)){
					$resul['results'][$refMong[$ref[0]['_id']]]['messageHash']=$refMong[$ref[0]['_id']];
					$resul['results'][$refMong[$ref[0]['_id']]]['meta']=$ref[0]['meta'];
				}


				$resul['results']=array_values($resul['results']);
				//print_r($resul);
				echo json_encode($resul);
			} else
				echo '{"results":"empty"}';

			*/
		}else{
			echo '{"results":"empty"}';
		}

	}


}