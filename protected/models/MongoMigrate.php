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
					//"metaOld"=>new MongoBinData($row['met'], MongoBinData::GENERIC),
					"body" => new MongoBinData($row['body'], MongoBinData::GENERIC),
					//"bodyOld"=>new MongoBinData($row['bod'], MongoBinData::GENERIC),
					"modKey"=>$row['modKey'],
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

		//$dbhost = '173.193.178.242';
		//$dbname = 'scryptmail';

		// Connect to test database
		//$m = new MongoClient("mongodb://root:61saksak@$dbhost", array("ssl" => true,'db'=>'scryptmail'));
//
		//print_r($m);

		//$db = $m->$dbname;

		//print_r($db);
//
		// Get the users collection
		//$c_users = $db->personalFolders;

		//print_r($c_users);

		//$user = array(
		//	'first_name' => 'Jd'
		//);
		//print_r(Yii::app()->mongo->findAll('personalFolders',$user));


		//print_r(Yii::app()->mongo->generateSlots('personalFolders',1,1));

		//print_r(Yii::app()->mongo->findById('personalFolders','5533db808df161e6058b4568'));


		//print_r(Yii::app()->mongo->removeById('personalFolders','5534500a8df161f3058b457b'));

		//$person[]=array("name" => "Joe", "age" => 20,'removeIn'=>new MongoDate(strtotime('now')));
		//$person[]=array("name" => "Joe", "age" => 20,'_id'=>new MongoId(substr(hash('sha1','1'),0,24)));
		//	print_r(Yii::app()->mongo->insert('personalFolders',$person));
		//	unset($person);

		//$f[]=new MongoId(substr(hash('sha1','1'),0,24));
		//$f[]=new MongoId(substr(hash('sha1','2'),0,24));

		//$f[2]='356a192b7913b04c54574d19';
		//$f[3]='356a192b7913b04c54574d18';

		//print_r($f);
		//print_r(Yii::app()->mongo->findByManyIds('personalFolders',$f));


		//$res=Yii::app()->db->createCommand("SELECT * FROM personalFolders WHERE messageHash =12359")->queryRow();

		//$res['meta']=hex2bin($res['meta']);
		//$res['body']=hex2bin($res['body']);

		//$person[]=array(
		//	'_id'=>new MongoId(substr(hash('sha1',$res['messageHash']),0,24)),
		//	"meta" => new MongoBinData($res['meta'], MongoBinData::GENERIC),
		////	"body" => new MongoBinData($res['body'], MongoBinData::GENERIC),
		//	"modKey"=>$res['modKey'],
		//	"file"=>$res['file']
		//);

		//print_r(Yii::app()->mongo->insert('personalFolders',$person));

		//print_r($res);




		//if(Yii::app()->mongo->findAll('personalFolders',$user)){
		//	echo 'true';
		//}else{
		//	echo 'false';
		//}

		// Find the user with first_name 'MongoDB' and last_name 'Fan'

		//find
		/*
		$user = array(
			'secondString' => 'dva'
		);
		//multiple
		$user = $c_users->find($user);
		foreach ($user as $doc) {
			var_dump($doc);
		}
*/
		//end find

		//insert
		/*
				//$a = array('removeIn' => date('Y-d-m h:i:s'));
				//$c_users->insert($a);

				$person[]=array("name" => "Joe", "age" => 20,'removeIn'=>new MongoDate(strtotime('now')));
				$person[]=array("name" => "Joe", "age" => 20,'removeIn'=>new MongoDate(strtotime('now')));

				$c_users->batchInsert($person);
				foreach ($person as $user) {
					echo $user['_id']."\n"; // populated with instanceof MongoId
					$f=$user['_id'];
				}

				//$c_users->insert($person);

				var_dump($person);
				/*
				try {
					$c_users->insert($person, array("w" => 1));
				} catch(MongoCursorException $e) {
					echo "Can't save the same person twice!\n";
				}
				*/
		//var_dump($a);
		//end insert

		//update
		//$c_users->update(array("_id" => $f), array('$set' => array("first_name" => 'Jd', "updated_at" => 'now'))); /adding fields
		//$c_users->update(array("_id" => $f), array("first_name" => 'Jd', "updated_at" => 'now'));
		//end update

		//delete
		//$radioactive->remove(array('type' => 94), array("justOne" => true));
		//$c_users->remove(array('name' => "Joe"));
		
		//end delete

	}


}