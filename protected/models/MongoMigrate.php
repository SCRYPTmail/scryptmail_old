<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class MongoMigrate extends CFormModel
{

	public function movePersonalFolders($messageIdArray)
	{
		//print_r($messageIdArray);

		$params = implode($messageIdArray, ',');

		if($oldData = Yii::app()->db->createCommand("SELECT * FROM personalFolders WHERE messageHash IN ($params)")->queryAll())
		{

			foreach($oldData as $i=>$row){

				$vect=substr(hex2bin($row['meta']),0,16);
				$data=substr(hex2bin($row['meta']),16);
				//$row['met']=base64_encode($vect).';'.base64_encode($data);
				$row['meta']=$vect.$data;

				$vect=substr(hex2bin($row['body']),0,16);
				$data=substr(hex2bin($row['body']),16);
				//$row['bod']=base64_encode($vect).';'.base64_encode($data);
				$row['body']=$vect.$data;

				$person[]=array(
					'_id'=>new MongoId(substr(hash('sha1',$row['messageHash']),0,24)),
					'oldId'=>$row['messageHash'],
					"meta" => new MongoBinData($row['meta'], MongoBinData::GENERIC),
					"body" => new MongoBinData($row['body'], MongoBinData::GENERIC),
					"emailSize"=>strlen($row['meta'])+strlen($row['body']),
					"modKey"=>$row['modKey'],
					"userId"=>Yii::app()->user->getId(),
					"file"=>$row['file']
				);
			}

			if(Yii::app()->mongo->insert('personalFolders',$person))
			{
				unset($person);

				Yii::app()->db->createCommand("DELETE FROM personalFolders WHERE messageHash IN ($params)")->execute();

				return true;
			}else
				return false;

		}else
			return true;

	}


	public function runTest()
	{
	}


}