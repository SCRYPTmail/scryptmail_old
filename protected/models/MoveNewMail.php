<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class MoveNewMail extends CFormModel
{
	public $chunks;

	public function rules()
	{
		return array(
			// username and password are required
			array('chunks', 'checkArray'),
		);
	}

	public function checkArray()
	{
		if (is_array($this->chunks)) {
			foreach ($this->chunks as $i => $row) {
				if (!isset($row['seedId']) || !is_numeric($row['seedId'])) {
					$this->addError('index', 'index should be in an integer');
				}
				if (!isset($row['seedModKey']) || strlen($row['seedModKey']) != 32 || !ctype_xdigit($row['seedModKey'])) {
					$this->addError('seedModKey', 'seedModKey wrong');
				}
				if (!isset($row['mailModKey']) || strlen($row['mailModKey']) != 32 || !ctype_xdigit($row['mailModKey'])) {
					$this->addError('mailModKey', 'mailModKey wrong');
				}
				//backward compatible with v0 system enable Jul, 2015
				//if (!isset($row['mailId']) || strlen($row['mailId']) != 128 || !ctype_xdigit($row['mailId'])) {
				//	$this->addError('mailId', 'mailId wrong');
				//}
			}
		} else

			$this->addError('chunks', 'chunks should be in an array');

	}

	public function moveMail()
	{
		if (count($this->chunks) > 0)
		{
			foreach ($this->chunks as $i => $row) {
				$par[] = "(:id_$i,:mod_$i)";
				$param[":id_$i"] = $row['mailId'];
				$param[":mod_$i"] = hash('sha512', $row['mailModKey']);

				$parMail[] = "(:mailId_$i,:mailModKey_$i)";
				$parSeed[] = "(:seedId_$i,:seedModKey_$i)";

				$paramMailDelete[":mailId_$i"] = $row['mailId'];
				$paramMailDelete[":mailModKey_$i"] = hash('sha512', $row['mailModKey']);

				$paramSeedDelete[":seedId_$i"] = $row['seedId'];
				$paramSeedDelete[":seedModKey_$i"] = hash('sha512', $row['seedModKey']);
				$rcpnt[hash('sha512',$row['mailModKey'])]=$row['rcpnt'];

				$newMail2field[]=array('oldId'=>$row['mailId'],'modKey'=>hash('sha512', $row['mailModKey']));

			}
			$user = array('$or'=>$newMail2field
			);
			$trans = Yii::app()->db->beginTransaction();

			if ($mails = Yii::app()->db->createCommand("SELECT id as messageHash,meta,body,pass,modKey,file FROM mailTable WHERE (id,modKey) IN (" . implode($par, ',') . ")")->queryAll(true, $param))
			{

				foreach ($mails as $i => $row) {

					$meta=substr(hex2bin($row['meta']),0,16).substr(hex2bin($row['meta']),16);
					$body=substr(hex2bin($row['body']),0,16).substr(hex2bin($row['body']),16);
					$pass[$row['modKey']]=$row['pass'];

					$person[]=array(
						"meta" => new MongoBinData($meta, MongoBinData::GENERIC),
						"body" => new MongoBinData($body, MongoBinData::GENERIC),
						"modKey"=>$row['modKey'],
						"file"=>$row['file'],
						"emailSize"=>strlen($row['meta'])+strlen($row['body']),
						"userId"=>Yii::app()->user->getId()
					);
				}

			}else if($newMails=Yii::app()->mongo->findAll('mailQueue',$user))
			{

				foreach ($newMails as $i => $row) {
					$pass[$row['modKey']]=$row['pass'];

					$person[]=array(
						"meta" => $row['meta'],
						"body" => $row['body'],
						"modKey"=>$row['modKey'],
						"file"=>$row['file'],
						"emailSize"=>$row['emailSize'],
						"userId"=>Yii::app()->user->getId()
					);

				}


			} else
				echo '{"response":"fail"}';


				if(isset($person) && Yii::app()->mongo->insert('personalFolders',$person))
				{
					foreach ($person as $index=>$doc) {
						if(isset($doc['_id'])){
							$results['data'][$index]['id'] = (string)$doc['_id'];
							$results['data'][$index]['pass'] = $pass[$doc['modKey']];
							$results['data'][$index]['meta'] = base64_encode(substr($doc['meta']->bin,0,16)).';'.base64_encode(substr($doc['meta']->bin,16));
							$results['data'][$index]['rcpnt']=$rcpnt[$doc['modKey']];
						}

					}
					$results['response'] = 'success';

					//print_r($person);
					$mngDataAgregate=array('$or'=>$newMail2field);

					//print_r(Yii::app()->mongo->removeAll('mailQueue',$mngDataAgregate));
				if ((Yii::app()->db->createCommand("DELETE FROM mailTable
					WHERE (id,modKey) IN (" . implode($parMail, ',') . ")")->execute($paramMailDelete)
						||
					Yii::app()->mongo->removeAll('mailQueue',$mngDataAgregate)
				)&&
					Yii::app()->db->createCommand("DELETE FROM seedTable
				 			WHERE (seedTable.id,seedTable.modKey) IN (" . implode($parSeed, ',') . ")")->execute($paramSeedDelete)
					)
					{
						$trans->commit();
						echo json_encode($results);
					}else {
						$trans->rollback();
						echo '{"response":"fail"}';
					}


				}else
					echo '{"response":"fail"}';

			} else
				echo '{"response":"fail"}';

			//print_r($mails);

	}
}