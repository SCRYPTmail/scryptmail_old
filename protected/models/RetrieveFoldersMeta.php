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
				if (!is_numeric($row) && (!ctype_xdigit($row) || strlen($row)!=24)){
					$this->addError('message', 'Message ids incorrect');
					return false;
				}
			}
			return true;
		} else {
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
				if (is_numeric($row)){ //compatibility with old messageids=numeric
					$f[$row] = $row;
					$mongof[]=new MongoId(substr(hash('sha1',$row),0,24));
					$refMong[substr(hash('sha1',$row),0,24)]=$row;
				}else if(ctype_xdigit($row) && strlen($row)==24) //if new messageid=hex
				{
					$mongof[]=new MongoId($row);
					$refMong[$row]=$row;
				}
			}

			if(isset($f))
			{
				//if old messages will try to move into mongo before fetching
				if(MongoMigrate::movePersonalFolders($f))
				{
					if($ref=Yii::app()->mongo->findByManyIds('personalFolders',$mongof,array('_id'=>1,'meta'=>1,'')))
					{
						foreach($ref as $doc){

							$vect=substr($doc['meta']->bin,0,16);
							$data=substr($doc['meta']->bin,16);
							$row=base64_encode($vect).';'.base64_encode($data);
							$result['results'][]=array('messageHash'=>$refMong[$doc['_id']],'meta'=>$row);
						}
						echo json_encode($result);


					}else
						echo '{"results":"empty"}';
				}

			}else if(isset($mongof))
			{
				//if new ids just fetch
				if($ref=Yii::app()->mongo->findByManyIds('personalFolders',$mongof,array('_id'=>1,'meta'=>1,'')))
				{
					foreach($ref as $doc){

						$vect=substr($doc['meta']->bin,0,16);
						$data=substr($doc['meta']->bin,16);
						$row=base64_encode($vect).';'.base64_encode($data);
						$result['results'][]=array('messageHash'=>$refMong[$doc['_id']],'meta'=>$row);
					}
					echo json_encode($result);


				}else
					echo '{"results":"empty"}';

			}else
				echo '{"results":"empty"}';

		}else{
			echo '{"results":"empty"}';
		}

	}


}