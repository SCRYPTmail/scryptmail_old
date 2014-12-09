<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class getDomains extends CFormModel
{

	public function retrieveDomains()
	{

		$f = Yii::app()->params['params']['allowedDomains'];
		//foreach($f as $i=>$row){
		//	$f[$i]=base64_encode($row);
		//}
		echo json_encode($f);
	}
}