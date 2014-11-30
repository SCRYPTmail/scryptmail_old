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
				if (!is_numeric($i)) {
					$this->addError('index', 'index should be in an integer');
				}
				if (!isset($row)) {
					$this->addError('key', 'key should be in an hash');
				}
			}
		} else

			$this->addError('chunks', 'chunks should be in an array');

	}

	public function moveMail()
	{
		if (count($this->chunks) > 0) {
			foreach ($this->chunks as $i => $row) {
				$par[] = "(:id_$i,:mod_$i)";
				$param[":id_$i"] = $i;
				$param[":mod_$i"] = hash('sha512', $row['mod']);

			}
			if ($mails = Yii::app()->db->createCommand("SELECT id as messageHash,meta,body,pass,modKey,file FROM mailTable WHERE (id,modKey) IN (" . implode($par, ',') . ")")->queryAll(true, $param)) {
				unset($par, $param);
				foreach ($mails as $i => $row) {
					//$result[]=array('id'=>$row['messageHash'],'pass'=>$row['pass']);

					$par[] = "(:meta_$i,:body_$i,:modKey_$i,:file_$i)";

					//$params[":messageHash_$i"]=$row['messageHash'];
					$params[":meta_$i"] = $row['meta'];
					$params[":body_$i"] = $row['body'];
					$params[":modKey_$i"] = $row['modKey'];
					$params[":file_$i"] = $row['file'];
					$mods[":modKey_$i"] = $row['modKey'];
					$gets[] = ":modKey_$i";
					$pass[$row['modKey']] = $row['pass'];
				}
				if (Yii::app()->db->createCommand("INSERT INTO personalFolders (meta,body,modKey,file) VALUES " . implode($par, ','))->execute($params)) {
					if ($newMessages = Yii::app()->db->createCommand("SELECT messageHash,modKey FROM personalFolders WHERE modKey IN (" . implode($gets, ',') . ")")->queryAll(true, $mods)) {

						foreach ($newMessages as $index => $row) {
							$results['data'][$index]['id'] = $row['messageHash'];
							$results['data'][$index]['pass'] = $pass[$row['modKey']];
						}
					}
					$results['response'] = 'success';

					//print_r($results);
					echo json_encode($results);
				} else
					echo '{"response":"fail"}';
			} else
				echo '{"response":"fail"}';

			//print_r($mails);
		} else
			echo '{"response":"fail"}';
		//if($seedDat['data']=Yii::app()->db->createCommand('SELECT * FROM seedTable WHERE id>'.$this->startSeed.' LIMIT '.$this->limit)->queryAll()){
		//	$seedDat['response']='success';
		//	echo json_encode($seedDat);
		//}

	}
}