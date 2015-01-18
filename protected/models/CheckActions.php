<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class CheckActions extends CFormModel
{
	public $userAction;

	public function rules()
	{
		return array(
			array('userAction', 'required'),
			array('userAction', 'match', 'pattern'=>'/^([a-z0-9 _])+$/', 'message'=>'action is not correct'),
			//array('userAction','arrayOfActions'),

		);
	}

	public function arrayOfActions()
	{
		$allActions=array(
			'about_us'=>1,
			'acceptemailfrompostfix'=>2,

			'canary'=>3,
			'crawler123'=>4,
			'createUser'=>5,
			'createSelectedUser'=>6,
			'checkDomain'=>7,
			'checkInvitation'=>8,
			'checkMail'=>9,
			'changePass'=>10,
			'composeMail'=>11,

			'deleteDisposableEmail'=>12,
			'deleteFileFromSafe'=>13,
			'deleteMessage'=>14,
			'deleteMessageUnreg'=>15,
			'downloadFile'=>16,

			'error'=>17,

			'forgotSecret'=>18,
			'forgotPassword'=>19,

			'generateNewToken'=>20,
			'getClientInfo'=>21,
			'getDomains'=>22,
			'getFile'=>23,
			'getFolder'=>24,
			'getNewSeeds'=>25,
			'getNewSeedsData'=>26,
			'getObjects'=>27,
			'getSafeBoxList'=>28,

			'index'=>29,
			'inviteFriend'=>30,

			'login'=>31,
			'LoginStatus'=>32,
			'logout'=>33,

			'mail'=>34,
			'ModalLogin'=>35,
			'moveNewMail'=>36,

			'privacypolicy'=>37,
			'profile'=>38,

			'reportBug'=>39,
			'ResetPass'=>40,
			'resetUserObject'=>41,
			'retrieveEmail'=>42,
			'retrieveFoldersData'=>43,
			'retrieveFoldersMeta'=>44,
			'retrievePublicKeys'=>45,

			'saveBlackList'=>46,
			'safeBox'=>47,
			'saveContacts'=>48,
			'saveDisposableEmail'=>49,
			'saveEmail'=>50,
			'saveFolders'=>51,
			'saveInvite'=>52,
			'saveMailInSent'=>53,
			'saveProfile'=>54,
			'saveSecret'=>55,
			'sendLocalMessage'=>56,
			'sendLocalMessageFail'=>57,
			'sendLocalMessageSeed'=>58,
			'sendOutMessagePin'=>59,
			'sendOutMessageNoPin'=>60,
			'showMessage'=>61,
			'submitBug'=>62,
			'submitError'=>63,

			'TermsAndConditions'=>64,

			'verifyEmail'=>65,
			'verifyPassword'=>66,
			'verifyRawToken'=>67,
			'verifyToken'=>68,

			'updateKeys'=>69,

			'checkEmailExist'=>70,
			'createUserDb'=>71,
			'sendEmail'=>72, //virtual value for any email sent registered
			'SendLocalMessageUnreg'=>73,
			'composeMailUnreg'=>74

		);

		$allActions=array_change_key_case($allActions, CASE_LOWER);

	//	print_r($allActions);



		return $allActions;
	}

	public function mailHashPerMinute($allActions,$maxPerMinute)
	{
		$param[':emailHash']=$_POST['LoginForm']['username'];
		$param[':transaction_type']=$allActions['modallogin'];
		$param[':ipaddress']=hash('sha256',$_SERVER['REMOTE_ADDR']);
		$param[':created']=time();

		if(Yii::app()->db->createCommand('
		SELECT count(userId) FROM transLimits WHERE transaction_type=:transaction_type AND emailhash=:emailHash AND ipaddress=:ipaddress AND created>:created-60
		')->queryScalar($param)<$maxPerMinute){

			$param[':expire']=time()+86400;
			Yii::app()->db->createCommand("
			INSERT INTO transLimits (transaction_type,emailHash,created,expire,ipaddress) VALUES(:transaction_type,:emailHash,:created,:expire,:ipaddress)
			")->execute($param);
		return true;

		}else
			return false;
	}

	public function sessionIdPerTenMinutes($allActions,$maxPerMinute)
	{
		$param[':sessionId']=Yii::app()->session->sessionID;
		$param[':transaction_type']=$allActions['modallogin'];
		$param[':ipaddress']=hash('sha256',$_SERVER['REMOTE_ADDR']);
		$param[':created']=time();

		if(Yii::app()->db->createCommand('
		SELECT count(userId) FROM transLimits WHERE transaction_type=:transaction_type AND sessionId=:sessionId AND ipaddress=:ipaddress AND created>:created-600
		')->queryScalar($param)<$maxPerMinute){

			$param[':expire']=time()+86400;
			Yii::app()->db->createCommand("
			INSERT INTO transLimits (transaction_type,sessionId,created,expire,ipaddress) VALUES(:transaction_type,:sessionId,:created,:expire,:ipaddress)
			")->execute($param);
			return true;

		}else
			return false;
	}


	public function sessionIdPerMinute($allActions,$maxPerMinute)
	{
		$param[':sessionId']=Yii::app()->session->sessionID;
		$param[':transaction_type']=$allActions['modallogin'];
		$param[':created']=time();

		if(Yii::app()->db->createCommand('
		SELECT count(userId) FROM transLimits WHERE transaction_type=:transaction_type AND sessionId=:sessionId AND created>:created-60
		')->queryScalar($param)<$maxPerMinute){

			$param[':expire']=time()+86400;
			Yii::app()->db->createCommand("
			INSERT INTO transLimits (transaction_type,sessionId,created,expire) VALUES(:transaction_type,:sessionId,:created,:expire)
			")->execute($param);
			return true;

		}else
			return false;
	}


	public function checkAllowedAction()
	{
		$result=true;
		$allActions=CheckActions::arrayOfActions();

		if($this->userAction=='modallogin'){
			$result=$this->mailHashPerMinute($allActions,30);
		}

		//if($this->userAction=='getobjects'){
		//	$result=$this->sessionIdPerMinute($allActions,3);
		//}

		//if($this->userAction=='checkemailexist'){
		//	$result=$this->mailHashPerTenMinutes($allActions,1);
		//}

		if($this->userAction=='sendlocalmessage'){
			$result=$this->sendEmailPerHour($allActions);
		}

		if($this->userAction=='sendoutmessagenopin'){
			$result=$this->sendEmailPerHour($allActions);
		}
		if($this->userAction=='sendoutmessagepin'){
			$result=$this->sendEmailPerHour($allActions);
		}

		if($this->userAction=='sendlocalmessageunreg'){
			$result=$this->sendEmailPerHourUnreg($allActions);
		}




		//print_r();
		return $result;

	}

	public function sendEmailPerHourUnreg($allActions)
	{
		//print_r(Yii::app()->session['unregisteredLogin']);

		$param[':emailHash']=hash('sha512',Yii::app()->session['unregisteredMailHash']);
		$param[':transaction_type']=$allActions[$this->userAction];
		$param[':created']=time();

		if(Yii::app()->db->createCommand('
		SELECT count(userId) FROM transLimits WHERE transaction_type=:transaction_type AND emailHash=:emailHash AND created>:created-3600
		')->queryScalar($param)<3){
			$param[':expire']=time()+7200;

			Yii::app()->db->createCommand("
			INSERT INTO transLimits (transaction_type,emailHash,created,expire) VALUES(:transaction_type,:emailHash,:created,:expire)
			")->execute($param);
			return true;

		}

	}

	public function sendEmailPerHour($allActions)
	{
		$param[':userId']=Yii::app()->user->getId();

		$limits=Yii::app()->db->createCommand("SELECT gd.emailsPerHour FROM user
		LEFT JOIN user_groups as ug ON ug.userId=user.id
		LEFT JOIN groups_definition as gd ON gd.id=ug.groupId
		WHERE user.id=:userId
		")->queryScalar($param);

		$param[':transaction_type']=$allActions['sendemail'];
		$param[':created']=time();

		if(Yii::app()->db->createCommand('
		SELECT count(userId) FROM transLimits WHERE transaction_type=:transaction_type AND userId=:userId AND created>:created-3600
		')->queryScalar($param)<$limits){
			$param[':expire']=time()+7200;

			Yii::app()->db->createCommand("
			INSERT INTO transLimits (transaction_type,userId,created,expire) VALUES(:transaction_type,:userId,:created,:expire)
			")->execute($param);
			return true;

		}

	}


}