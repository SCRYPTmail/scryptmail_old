<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class RetrievePublicKeys extends CFormModel
{
	public $mails;

	public function rules()
	{
		return array(
			// username and password are required
			array('mails', 'required'),
		);
	}

	public function retrieveKeys()
	{
		$emailsArray = json_decode($this->mails, true);
		foreach ($emailsArray as $i => $row) {
			$emailsArr['mailhash'][$i] = $row;
			$param[":mailHash_$i"] = $row;

			$temp[] = ":mailHash_$i";
		}
		//print_r($param);
		$result = array();

		if ($hashes = Yii::app()->db->createCommand(
			"SELECT addresses.addressHash as mailHash,addresses.mailKey, user.mailKey as userMailKey
			FROM addresses
			LEFT JOIN user ON user.id=addresses.userId
			WHERE addresses.addressHash IN(" . implode($temp, ',') . ")")->queryAll(true, $param)) {

			foreach ($hashes as $row)
			{
				if(isset($row['mailKey'])){
					unset($row['userMailKey']);
				}else{
					$row['mailKey']=$row['userMailKey'];
					unset($row['userMailKey']);
				}
				$result[$row['mailHash']] = $row;
			}
		}

		//$result[0]['whatIGet']=$this->mails;
		//$result[0]['whatHash']=$emailsArr;

		echo json_encode($result);
	}
}