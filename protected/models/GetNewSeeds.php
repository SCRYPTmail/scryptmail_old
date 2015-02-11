<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class GetNewSeeds extends CFormModel
{
	public $startSeed;
	public $limit;
	public $hashes;

	public function rules()
	{
		return array(
			// username and password are required
			array('startSeed,limit', 'numerical', 'integerOnly' => true, 'on' => 'getNewSeedsData'),
			array('hashes', 'checkHashes', 'on' => 'getNewSeedsData'),

		);
	}
	public function checkHashes()
	{
		if(isset($this->hashes)){
			$this->hashes=json_decode($this->hashes);
		}
		if(is_array($this->hashes)){
			foreach($this->hashes as $hash)
			{
				if (strlen($hash) != 10 || !ctype_xdigit($hash)) {
					$this->addError('hashe', 'hashe is wrong');
				}
			}

		}//else
			//$this->addError('keyHashes', 'keyHashes should be in an array');
	}

	public function getLast()
	{

		$result['v0']=(int)Yii::app()->db->createCommand('SELECT max(id) FROM seedTable WHERE v1=0')->queryScalar();
		$result['v1']=(int)Yii::app()->db->createCommand('SELECT max(id) FROM seedTable')->queryScalar();
		echo json_encode($result);

	}

	public function getSeedData()
	{

		//print_r($this->hashes);
		if(is_array($this->hashes)){
			foreach($this->hashes as $i=> $hash)
			{
				$param[":hash_$i"]=$hash;
			}

			if ($seedDat['data'] = Yii::app()->db->createCommand('SELECT id,meta,password,v1,rcpnt FROM seedTable WHERE id>=' . $this->startSeed . ' AND rcpnt IN ('.implode(array_keys($param),',').') LIMIT ' . $this->limit)->queryAll(true,$param)) {

				//print_r($seedDat);

				$seedDat['response'] = 'success';
				//foreach($seedDat['data'] as $index=>$row){
				//	$seedDat['data'][$index]['id']=$row['id'];
				//	$seedDat['data'][$index]['meta']=base64_encode($row['meta']);
				//}

				echo json_encode($seedDat); //escaping non utf strings
			}

		}else{

			if ($seedDat['data'] = Yii::app()->db->createCommand('SELECT id,meta,password,v1,rcpnt FROM seedTable WHERE id>=' . $this->startSeed . ' AND v1=0 LIMIT ' . $this->limit)->queryAll()) {

				//print_r($seedDat);

				$seedDat['response'] = 'success';
				//foreach($seedDat['data'] as $index=>$row){
				//	$seedDat['data'][$index]['id']=$row['id'];
				//	$seedDat['data'][$index]['meta']=base64_encode($row['meta']);
				//}

				echo json_encode($seedDat); //escaping non utf strings
			}
		}



	}
}