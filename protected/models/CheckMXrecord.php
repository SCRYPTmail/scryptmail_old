<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class CheckMXrecord extends CFormModel
{
	public $domainName,$vrfString;
	public function rules()
	{
		return array(
			// name, email, subject and body are required
			array('vrfString', 'required'),
			array('domainName', 'url', 'defaultScheme' => 'http','on'=>'checkMX'),
			array('vrfString', 'match', 'pattern'=>'/^([a-z0-9_])+$/','on'=>'checkMX'),
			array('vrfString','length', 'min' => 128, 'max'=>128,'on'=>'checkMX'),
		);
	}
	public function registeredList($id)
	{

		if(Yii::app()->db->createCommand("SELECT domain FROM virtual_domains WHERE userId=$id")->queryRow()){
			$result['response'] = 'success';
			echo json_encode($result);
		}else{
			$result['response'] = 'fail';
			echo json_encode($result);
		}


		$result['success']='fffffff';
		echo json_encode($result);
	}

	public function checkMX()
	{
		$domainOwnerValidn=false;
		$mxRecordValid=false;
		$mailServerRecordValid=false;

		if($result = dns_get_record("7nd.me")){
			foreach($result as $i=>$row)
			{
				if($row['type']!='MX' && $row['type']!='TXT'){
					unset($result[$i]);

				}
			}
			print_r($result);
		}


	}


}