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
	public $keyHashes;

	public function rules()
	{
		return array(
			// username and password are required
			array('startSeed,limit', 'numerical', 'integerOnly' => true, 'on' => 'getNewSeedsData'),
			//array('keyHashes', 'checkHashes', 'on' => 'getNewSeedsData'),
			array('keyHashes', 'safe', 'on' => 'getNewSeedsData'),
		);
	}
	public function checkHashes()
	{
		if(is_array($this->keyHashes)){
			foreach($this->keyHashes as $hash)
			{
				if (strlen($hash) != 10 || !ctype_xdigit($hash)) {
					$this->addError('keyHashes', 'keyHashes wrong');
				}
			}

		}else
			$this->addError('keyHashes', 'keyHashes should be in an array');
	}

	public function getLast()
	{

		echo Yii::app()->db->createCommand('SELECT max(id) FROM seedTable')->queryScalar();

	}

	public function getSeedData()
	{

		if ($seedDat['data'] = Yii::app()->db->createCommand('SELECT id,meta,password,v1 FROM seedTable WHERE id>=' . $this->startSeed . ' LIMIT ' . $this->limit)->queryAll()) {
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