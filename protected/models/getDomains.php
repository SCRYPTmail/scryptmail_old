<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class getDomains extends CFormModel
{

	public $domain;
	public function rules()
	{
		return array(
			// username and password are required
			array('domain', 'required','on'=>'validateDomain'),
			array('domain', 'match', 'pattern'=>'/^([a-z0-9_])+$/', 'message'=>'please provide correct domain','on'=>'validateDomain'),
			array('domain','length', 'min' => 128, 'max'=>128, 'tooShort'=>'domain not found','tooLong'=>'domain not found','on'=>'validateDomain'),
		);
	}


	public function retrieveDomains()
	{

		$f = Yii::app()->params['params']['allowedDomains'];
		//foreach($f as $i=>$row){
		//	$f[$i]=base64_encode($row);
		//}
		echo json_encode($f);
	}

	public function validateDomains()
	{
		if(Yii::app()->db->createCommand("SELECT id FROM virtual_domains WHERE shaDomain=:shaDomain")->queryRow(true,array(':shaDomain'=>$this->domain))){
		$result['response'] = 'success';
			echo json_encode($result);
		}else{
			$result['response'] = 'fail';
			echo json_encode($result);
		}

	}

	public function domainAvalailableForAlias()
	{
		if($domains=Yii::app()->db->createCommand("SELECT domain FROM virtual_domains WHERE availableForAliasReg=1")->queryAll()){
			foreach($domains as $row){
				$result['domains'][]=$row['domain'];
			}
			$result['response'] = 'success';
			echo json_encode($result);
		}else{
			$result['response'] = 'fail';
			echo json_encode($result);
		}
	}
}