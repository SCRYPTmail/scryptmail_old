<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class CheckMXrecord extends CFormModel
{
	public $domain,$vrfString,$overrideCache,$domains;
	public function rules()
	{
		return array(
			// name, email, subject and body are required
			//array('vrfString', 'required'),
			array('overrideCache', 'boolean','allowEmpty'=>true,'on'=>'checkMX'),

			array('domains', 'checkArr','on'=>'checkRegList'),

			array('domain', 'url', 'defaultScheme' => 'http','on'=>'checkMX'),
			array('vrfString', 'match', 'pattern'=>'/^([a-z0-9_]){64}+$/','on'=>'checkMX'),
			array('domain','length', 'min' => 2, 'max'=>200,'on'=>'checkMX'),
		);
	}
	public function checkArr(){

		try {
			$this->domains = json_decode($this->domains, true);
		} catch (Exception $e) {
			$this->addError('results', 'Messages should be in an array');
		}

		if (is_array($this->domains)) {

			foreach($this->domains as $i=>$dom){
				$this->domain='http://'.$dom;

				$req = CValidator::createValidator('url', $this, array('domain'), array('defaultScheme' => 'http', 'allowEmpty' => false));
				$req1 = CValidator::createValidator('match', $this, array('vrfString'), array('pattern' => '/^([a-z0-9_]){64}+$/', 'allowEmpty' => false));

				$this->vrfString=$i;
				$req->validate($this);
				$req1->validate($this);
			}
			return true;
		} else {
			$this->addError('results', 'Messages should be in an array');
		}
	}

	public function registeredList($id)
	{
		foreach($this->domains as $i=>$row){
				$this->domain=$row;
				$this->vrfString=$i;
				CheckMXrecord::checkMX(true);
			}

			if($domains=Yii::app()->db->createCommand("SELECT domain,spfRec,mxRec,vrfRec,dkimRec,availableForAliasReg FROM virtual_domains WHERE userId=$id")->queryAll()){
				foreach($domains as $row){
					$result['domains'][hash('sha256',$row['domain'])]=$row;
				}
				$result['response'] = 'success';
			}else{
				$result['domains']=array();
				$result['response'] = 'success';
			}


		echo json_encode($result);

	}

	public function removeDomain()
	{
		$domain=str_ireplace('http://','',$this->domain);
		$param[':shaDomain']=hash('sha512',$domain);
		$param[':userId']=Yii::app()->user->getId();

		if(Yii::app()->db->createCommand("DELETE FROM virtual_domains WHERE shaDomain=:shaDomain AND userId=:userId")->execute($param)){
			$resultF['result']='success';
		}else
			$resultF['result']='fail';

		echo json_encode($resultF);
	}

	public function saveMX()
	{

		$id=Yii::app()->user->getId();

		if(Yii::app()->db->createCommand("SELECT count(id) as curn FROM virtual_domains WHERE userId=$id")->queryScalar()<Yii::app()->user->role["role"]["customDomains"])
		{

		$valid=CheckMXrecord::checkMX(true);
		$domain=str_ireplace('http://','',$this->domain);

		if(
			$valid['result']==='successful' &&
			$valid['mxRecordValid']===true &&
			$valid['spfRecordValid']===true &&
			$valid['domainOwnerValid']===true &&
		//	$valid['dkimRecordValid']===true &&
			$valid['domainRegistered']===false
		){
			$param[':domain']=$domain;
			$param[':destination']='myhook';
			$param[':shaDomain']=hash('sha512',$domain);

			$param[':spfRec']=1;
			$param[':mxRec']=1;
			$param[':vrfRec']=1;
			$param[':dkimRec']=$valid['dkimRecordValid'];
			$param[':availableForAliasReg']=1;
			$param[':vrfString']=hash('sha256',$this->vrfString);
			$param[':userId']=Yii::app()->user->getId();


			if(Yii::app()->db->createCommand("INSERT INTO virtual_domains (domain,destination,shaDomain,spfRec,mxRec,vrfRec,dkimRec,availableForAliasReg,vrfString,userId) VALUES (:domain,:destination,:shaDomain,:spfRec,:mxRec,:vrfRec,:dkimRec,:availableForAliasReg,:vrfString,:userId)")->execute($param)){
				$resultF['result']='successful';
			}

		}else{
			$resultF['result']='fail';
		}

	}else{
		$resultF['result']='fail';
		}

		echo json_encode($resultF);
	}

	public function checkMXdomains($paramDomain,$domains)
	{
		if ($verifiedDomains = Yii::app()->db->createCommand("SELECT domain,shaDomain FROM virtual_domains WHERE shaDomain IN ($paramDomain)")->queryAll(true, $domains)) {
			foreach ($verifiedDomains as $row) {


				$par[':sha']=$row['shaDomain'];
				$spfRecordValid=false;
				$mxRecordValid=false;

				if($res=Yii::app()->db->createCommand("SELECT * FROM virtual_domains WHERE shaDomain=:sha")->queryRow(true,$par)){

					if(strtotime($res['lastTimeChecked'])<strtotime('now - 5 minute')){

					$validMx=array(
						'host'=>'',
						'class'=>'',
						'pri'=>'100-',
						'target'=>''
					);
					$validTXT=array(
						'host'=>$res['domain'],
						'class'=>'IN',
						'txt'=>'v=spf1 include:scryptmail.com ~all'
					);


					if($result = dns_get_record($res['domain'])){
						foreach($result as $i=>$row)
						{
							if($row['type']!='MX' && $row['type']!='TXT'){
								unset($result[$i]);
							}else if($row['type']=='MX' && $row['pri']<$validMx['pri']){
								$validMx=$row;
							}else if($row['type']=='TXT'){
								if(
									$row['host']==$validTXT['host'] &&
									$row['class']==$validTXT['class'] &&
									$row['txt']==$validTXT['txt']
								){
									$spfRecordValid=true;
								}
							}

						}
						if(
							$validMx['host']==$res['domain'] &&
							$validMx['class']=='IN' &&
							$validMx['type']=='MX' &&
							$validMx['target']=='scryptmail.com'
						){
							$mxRecordValid=true;
						}


						if(isset($res)){
							$parameter[':sha']=hash('sha512',$res['domain']);
							$parameter[':spfRec']=$spfRecordValid;
							$parameter[':mxRec']=$mxRecordValid;
							$parameter[':lastModified']=date('Y-m-d H:i:s',strtotime('now'));
							$parameter[':lastTimeChecked']=date('Y-m-d H:i:s',strtotime('now'));

							Yii::app()->db->createCommand("UPDATE virtual_domains SET spfRec=:spfRec,mxRec=:mxRec,lastModified=:lastModified,lastTimeChecked=:lastTimeChecked WHERE shaDomain=:sha AND globalDomain=0")->execute($parameter);
						}





					}

				}
				}
			}

		}

	}


	public function checkMX($int=null)
	{
		$domain=str_ireplace('http://','',$this->domain);

		$par[':sha']=hash('sha512',$domain);
		$domainRegistered=false;
		$domainBelongsToUser=false;
		$avToReg=false;
		$dkimRecordValid=false;
		$domainOwnerValid=false;
		$spfRecordValid=false;
		$mxRecordValid=false;

		if($res=Yii::app()->db->createCommand("SELECT * FROM virtual_domains WHERE shaDomain=:sha")->queryRow(true,$par)){
			if($res['userId']=Yii::app()->user->getId()){
				$domainBelongsToUser=true;
			}
			if($res['availableForAliasReg']==1){
				$avToReg=true;
			}
			$domainRegistered=true;
		}

		if(isset($res) && strtotime($res['lastTimeChecked'])>strtotime('now - 5 minute') && $this->overrideCache!=1){

			$domainRegistered=true;
			$domainBelongsToUser=Yii::app()->user->getId()==$res['userId']?true:false;
			$avToReg=$res['availableForAliasReg']==1?true:false;
			$domainOwnerValid=$res['vrfRec']==1?true:false;
			$spfRecordValid=$res['spfRec']==1?true:false;
			$mxRecordValid=$res['mxRec']==1?true:false;


			$resultF['mxRecordValid']=$mxRecordValid; //MX record
			$resultF['spfRecordValid']=$spfRecordValid; //SPF record
			$resultF['domainOwnerValid']=$domainOwnerValid; //DNS verification String

			$resultF['domainRegistered']=$domainRegistered; //Domain registered in SCRYPTmail
			$resultF['domainBelongsToUser']=$domainBelongsToUser; //Registered by requesting user

			$resultF['avToReg']=$avToReg; // can be registered future use

			$resultF['result']='successful';

		}else{
			$validMx=array(
				'host'=>'',
				'class'=>'',
				'pri'=>'100-',
				'target'=>''
			);
			$validTXT=array(
				'host'=>$domain,
				'class'=>'IN',
				'txt'=>'v=spf1 include:scryptmail.com ~all'
			);

			$validTXTVerif=array(
				'host'=>$domain,
				'class'=>'IN',
				'txt'=>"scryptmail=".hash('sha256',$this->vrfString)
			);

			if($result = dns_get_record($domain)){
				foreach($result as $i=>$row)
				{
					if($row['type']!='MX' && $row['type']!='TXT'){
						unset($result[$i]);
					}else if($row['type']=='MX' && $row['pri']<$validMx['pri']){
						$validMx=$row;
					}else if($row['type']=='TXT'){
						if(
							$row['host']==$validTXT['host'] &&
							$row['class']==$validTXT['class'] &&
							$row['txt']==$validTXT['txt']
						){
							$spfRecordValid=true;
						}else if(
							$row['host']==$validTXTVerif['host'] &&
							$row['class']==$validTXTVerif['class'] &&
							$row['txt']==$validTXTVerif['txt']
						){
							$domainOwnerValid=true;
						}

					}

				}
				if(
					$validMx['host']==$domain &&
					$validMx['class']=='IN' &&
					$validMx['type']=='MX' &&
					$validMx['target']=='scryptmail.com'
				){
					$mxRecordValid=true;
				}


				if(isset($res)){
					$parameter[':sha']=hash('sha512',$domain);
					$parameter[':spfRec']=$spfRecordValid;
					$parameter[':mxRec']=$mxRecordValid;
					$parameter[':vrfRec']=$domainOwnerValid;
					$parameter[':lastModified']=date('Y-m-d H:i:s',strtotime('now'));
					$parameter[':lastTimeChecked']=date('Y-m-d H:i:s',strtotime('now'));

					Yii::app()->db->createCommand("UPDATE virtual_domains SET spfRec=:spfRec,mxRec=:mxRec,vrfRec=:vrfRec,lastModified=:lastModified,lastTimeChecked=:lastTimeChecked WHERE shaDomain=:sha AND globalDomain=0")->execute($parameter);
				}



				if($dkim=dns_get_record("default._domainkey.$domain", DNS_TXT))
				{
					foreach($dkim as $record){
						if(
							$record['txt']=='v=DKIM1; k=rsa; p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDTNXD2KoQUiAmAJcp05gt0dStpoiXf0xDsD6T4M/THCT461Ata4EyuYQhJHSbZ6IDvMMrkZymLYdhbgsue6YWX44UVoX1LSYKt64HaMG+H9TrEbksH6UpbYcCDKGc7cUYolrwwmUh4fxnC3x5REbpCT7FhsHj5I3D1wmid+Yj25wIDAQAB;'
						){
							$dkimRecordValid=true;
						}
					}
				}

				$resultF['mxRecordValid']=$mxRecordValid; //MX record
				$resultF['spfRecordValid']=$spfRecordValid; //SPF record
				$resultF['domainOwnerValid']=$domainOwnerValid; //DNS verification String
				$resultF['dkimRecordValid']=$dkimRecordValid;

				$resultF['domainRegistered']=$domainRegistered; //Domain registered in SCRYPTmail
				$resultF['domainBelongsToUser']=$domainBelongsToUser; //Registered by requesting user

				$resultF['avToReg']=$avToReg; // can be registered future use

				$resultF['result']='successful';



			}else{
				$resultF['result']='fail';
			}

		}
		//print_r($result);

		if(isset($int)){
			return $resultF;
		}else
			echo json_encode($resultF);

	}


}
