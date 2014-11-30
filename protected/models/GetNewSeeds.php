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

	public function rules()
	{
		return array(
			// username and password are required
			array('startSeed,limit', 'numerical', 'integerOnly' => true, 'on' => 'getNewSeedsData'),
		);
	}


	public function getLast()
	{

		echo Yii::app()->db->createCommand('SELECT max(id) FROM seedTable')->queryScalar();

	}

	public function getSeedData()
	{

		if ($seedDat['data'] = Yii::app()->db->createCommand('SELECT id,meta FROM seedTable WHERE id>' . $this->startSeed . ' LIMIT ' . $this->limit)->queryAll()) {
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