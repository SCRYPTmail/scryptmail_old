<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class SiteController extends Controller
{
	public $data, $baseUrl;
	public $fileVers='0554';

	public function beforeAction($action)
	{
//print_r(parent::beforeAction($action));
		$userAction=strtolower($this->action->Id);

		$model = new CheckActions();
		$model->userAction = $userAction;

		if ($model->validate()){

			if($model->checkAllowedAction()){
				$this->baseUrl = Yii::app()->baseUrl;
				$cs = Yii::app()->getClientScript();
				$cs->registerScriptFile('/js/jquery-1.11.1.js');
				$cs->registerScriptFile('/js/jquery-ui-1.10.4.js');
				$cs->registerScriptFile('/js/forge.bundle.js');

				$cs->registerScriptFile('/js/core.js');
				$cs->registerScriptFile('/js/x64-core.js');
				$cs->registerScriptFile('/js/aes.js');
				$cs->registerScriptFile('/js/twofish.js');


				$cs->registerScriptFile("/js/uniFunctions.js?r=$this->fileVers");
				$cs->registerScriptFile("/js/genFunctions.js?r=$this->fileVers");


				//$cs->registerScriptFile("/js/genFunctions.js");
				$cs->registerScriptFile('/js/bootstrap/bootstrap.js');
				$cs->registerScriptFile('/js/plugin/masked-input/jquery.maskedinput.min.js');
				$cs->registerScriptFile("/js/app.config.js?r=$this->fileVers");

				$cs->registerScriptFile('/js/plugin/select2/select2.min.js');
				$cs->registerScriptFile('/js/notification/SmartNotification.js');
				$cs->registerScriptFile("/js/xss/xss.js?r=$this->fileVers");



				//rangy-core.js

				$cs->registerCssFile('/css/bootstrap.min.css');
				$cs->registerCssFile('/css/font-awesome.min.css');
				$cs->registerCssFile("/css/smartadmin-production.min.css?r=$this->fileVers");


				return true;
			}else{
				echo '{"answer":"Limit is reached"}';
				return false;
			}
		}else{
			echo json_encode($model->getErrors());
			return false;
		}


		//if (parent::beforeAction($action)) {


		//}
		//return false;

	}

	public function filters()
	{
		return array(
			'accessControl', // perform access control for actions
		);
	}

	public function accessRules()
	{
		return array(
			array('allow', // allow all users to perform 'index' and 'view' actions
				'actions' => array(
					'login',
					'ModalLogin',
					'error',
					'createUser',
					'LoginStatus',
					'crawler123',
					'acceptemailfrompostfix',
					'retrieveEmail',
					'downloadFile',
					'getClientInfo',
					'TermsAndConditions',
					'privacypolicy',
					'submitBug',
					'checkMail',
					'saveInvite',
					'submitError',
					'forgotPassword',
					'verifyToken',
					'verifyRawToken',
					'ResetPass',
					'checkInvitation',
					'safeBox',
					'canary',
					'about_us',
					'checkEmailExist',
					'createUserDb',
					'createSelectedUser',
					'resetPassOneStep',
					'getNewSeeds',
					'whyuse'
				),
				'expression' => 'Yii::app()->user->role["role"]==0'
			),
			array('allow', // allow all users to perform 'index' and 'view' actions
				'actions' => array(
					'composeMailUnreg',
					'sendLocalMessageUnreg',
					'getFile',
					'retrievePublicKeys',
					'deleteMessageUnreg',
					'checkDomain'
				),
				'expression' => 'Yii::app()->session["unregisteredLogin"]'
			),
			array('allow', // allow all users to perform 'index' and 'view' actions
				'actions' => array(
					'createUser',
					'login',
					'updateKeys',
					'ModalLogin',
					'logout',
					'error',
					'index',
					'getObjects',
					'mail',
					'getDomains',
					'retrievePublicKeys',
					'loginStatus',
					'saveEmail',
					'saveFolders',
					'getFolder',
					'retrieveFoldersMeta',
					'deleteMessage',
					'deleteMessageUnreg',
					'showMessage',
					'sendLocalMessage',
					'sendLocalMessageFail',
					'sendOutMessagePin',
					'sendOutMessageNoPin',
					'saveMailInSent',
					'crawler123',
					'saveContacts',
					'acceptemailfrompostfix',
					'getNewSeeds',
					'saveProfile',
					'getNewSeedsData',
					'moveNewMail',
					'getFile',
					'retrieveEmail',
					'downloadFile',
					'profile',
					'getClientInfo',
					'changePass',
					'saveSecret',
					'TermsAndConditions',
					'privacypolicy',
					'submitBug',
					'createSelectedUser',
					'checkMail',
					'saveInvite',
					'submitError',
					'verifyToken',
					'verifyPassword',
					'verifyRawToken',
					'forgotSecret',
					'forgotPassword',
					'resetUserObject',
					'generateNewToken',
					'checkInvitation',
					'inviteFriend',
					'getSafeBoxList',
					'safeBox',
					'deleteFileFromSafe',
					'retrieveFoldersData',
					'saveBlackList',
					'canary',
					'verifyEmail',
					'saveDisposableEmail',
					'ResetPass',
					'deleteDisposableEmail',
					'about_us',
					'checkDomain',
					'checkEmailExist',
					'createUserDb',
					'deleteMyAccount',
					'saveSecretOneStep',
					'resetPassOneStep',
					'updateAccount'

				),
				'expression' => 'Yii::app()->user->role["role"]!=0'
			),
			array('deny', // deny all users
				'users' => array('*'),
			),
		);
	}

	public function missingAction()
	{
		$this->renderPartial('404');
	}

	/**
	 * This is the default 'index' action that is invoked
	 * when an action is not explicitly requested by users.
	 */

	public function actionInviteFriend()
	{
		$model = new InviteFriend();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate())
			$model->invite();
		else
			echo json_encode($model->getErrors());
	}
	public function actionUpdateAccount()
	{
		$model = new UpdateAccount('updateAcc');
		$model->attributes = $_POST;
		if ($model->validate())
			$model->updateAcc(Yii::app()->user->getId());
		else
			echo json_encode($model->getErrors());
	}
	public function actionVerifyRawToken()
	{
		$model = new VerifyToken();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate())
			$model->checkRawToken();
		else
			echo json_encode($model->getErrors());
	}

	public function actionDeleteFileFromSafe()
	{
		$model = new SafeBox('deleteFileFromSafe');
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate())
			$model->deleteFileFromSafe(Yii::app()->user->getId());
		else
			echo json_encode($model->getErrors());
	}
	public function actionDeleteMyAccount()
	{
		$model = new DeleteAccount();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate())
			$model->removeAccount(Yii::app()->user->getId());
		else
			echo json_encode($model->getErrors());
	}
	public function actionGetSafeBoxList()
	{
		$model = new SafeBox('retrieveList');
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate())
			$model->retrieveList(Yii::app()->user->getId());
		else
			echo json_encode($model->getErrors());
	}

	public function actionSafeBox()
	{
		if (!isset($_SERVER['PHP_AUTH_USER'])) {
			header("WWW-Authenticate: Basic realm=\"Private Area\"");
			header("HTTP/1.0 401 Unauthorized");
			exit;
		} else {

			if(isset($_SERVER['HTTP_AUTHORIZATION'])){
				try{

					$stringData = base64_decode(trim(str_replace('Basic','',$_SERVER['HTTP_AUTHORIZATION'])));
					$userpass=explode(':',$stringData);
					$user=$userpass[0];
					$pass=$userpass[1];

					$model = new SafeBox('safeFile');
					$model->file=file_get_contents("php://input");
					$model->filename=Yii::app()->getRequest()->getQuery('fileName');

					//$model->username=isset($_SERVER['HTTP_AUTHORIZATION'])?$_SERVER['HTTP_AUTHORIZATION']:'';

					$model->username=isset($_SERVER['PHP_AUTH_USER'])?$_SERVER['PHP_AUTH_USER']:$userpass[0];
					$model->password=isset($_SERVER['PHP_AUTH_PW'])?$_SERVER['PHP_AUTH_PW']:$userpass[1];
					$model->action=isset($_SERVER['REQUEST_METHOD'])?$_SERVER['REQUEST_METHOD']:'';

					if(strlen($model->filename)!=0)
					{
						if ($model->validate())
							$model->fileWorks();

					}else
					{
						header($_SERVER['SERVER_PROTOCOL'] . ' 400'.$_SERVER['PHP_AUTH_USER'].$_SERVER['PHP_AUTH_PW'], true, 400);
						echo ' ';

					}


				} catch (Exception $e) {
					header($_SERVER['SERVER_PROTOCOL'] . ' 400'.$_SERVER['PHP_AUTH_USER'].$_SERVER['PHP_AUTH_PW'], true, 400);
					echo ' ';
			}


			}else{
				header($_SERVER['SERVER_PROTOCOL'] . ' 400'.$_SERVER['PHP_AUTH_USER'].$_SERVER['PHP_AUTH_PW'], true, 400);
				echo ' ';
			}


		}


	}

	public function actionVerifyToken()
	{
		$model = new VerifyToken();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate())
			$model->checkToken();
		else
			echo json_encode($model->getErrors());
	}

	public function actionResetUserObject()
	{
		$model = new CreateUser('resetUser');
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->resetUser();
		else
			echo json_encode($model->getErrors());
	}
	public function actionCheckInvitation()
	{
		$model = new CheckInvitation();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->verifyToken();
		else
			echo json_encode($model->getErrors());
	}
	public function actionVerifyPassword()
	{
		$model = new UserGroupManager('verifyPass');
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->verifyPass();
		else
			echo json_encode($model->getErrors());
	}

	public function actionForgotSecret()
	{
		$cs = Yii::app()->clientScript;


		$cs->scriptMap["genFunctions.js?r=$this->fileVers"] = false;
		$cs->scriptMap["xss.js?r=$this->fileVers"] = false;
		//$cs->scriptMap["SmartNotification.js"] = false;

		$cs->scriptMap['select2.min.js'] = false;
		$cs->scriptMap['jquery.maskedinput.min.js'] = false;
		$cs->scriptMap['jquery-ui-1.10.4.js'] = false;
		$cs->scriptMap["app.config.js?r=$this->fileVers"] = false;


		//$cs->registerScriptFile("/js/createInvitation.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/sha512.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/plugin/jquery-validate/jquery.validate.min.js");


		$cs->registerScriptFile("/js/resetSecret.js?r=$this->fileVers");

		$this->layout='main';
		$this->render('ForgotSecret');
	}

	public function actionForgotPassword()
	{
		$cs = Yii::app()->clientScript;

		//$cs->scriptMap['twofish.js'] = false;
		//$cs->scriptMap['x64-core.js'] = false;
		//$cs->scriptMap['forge.bundle.js'] = false;
		//$cs->scriptMap['core.js'] = false;
		//$cs->scriptMap['aes.js'] = false;

		//$cs->registerScriptFile('/js/core.js');
		//$cs->registerScriptFile('/js/x64-core.js');
		//$cs->registerScriptFile('/js/aes.js');
		//$cs->registerScriptFile('/js/twofish.js');



		$cs->scriptMap["genFunctions.js?r=$this->fileVers"] = false;
		$cs->scriptMap["xss.js?r=$this->fileVers"] = false;
		//$cs->scriptMap["SmartNotification.js"] = false;

		$cs->scriptMap['select2.min.js'] = false;
		$cs->scriptMap['jquery.maskedinput.min.js'] = false;
		$cs->scriptMap['jquery-ui-1.10.4.js'] = false;
		$cs->scriptMap["app.config.js?r=$this->fileVers"] = false;


		//$cs->registerScriptFile("/js/createInvitation.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/sha512.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/plugin/jquery-validate/jquery.validate.min.js");

		$cs->registerScriptFile("/js/resetPass.js?r=$this->fileVers");
		//--------------------

		//$cs = Yii::app()->clientScript;

		$this->layout='main';
		$this->render('ForgotPass');

	}
	public function actionRetrieveEmail()
	{
		$cs = Yii::app()->clientScript;
		$cs->registerScriptFile("/js/readEmailUnregistered.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/renderMail.js?r=$this->fileVers");

		$model = new RetrieveEmail('initialOpen');
		$model->emailHash=Yii::app()->getRequest()->getQuery('id');

		if (isset($_POST['ajax']) && $_POST['ajax'] === 'retrieve-mail') {
			$model->attributes=$_POST;
			if($model->validate()){
				$model->initialOpen();
			}else
				echo json_encode($model->getErrors());
			Yii::app()->end();
		}
		$this->layout='main';
		$this->render('RetrieveEmail', array('model' => $model));

	}

	public function actionDownloadFile()
	{

		$model = new downloadFile();
		$model->fileHash=Yii::app()->getRequest()->getQuery('id');
		$model->fileData= Yii::app()->getRequest()->getQuery('name');

		//print_r(Yii::app()->getRequest()->getQuery('fileName'));
		if($model->validate()){
			$model->download();
		}else
			echo json_encode($model->getErrors());

	}
	public function actionPrivacypolicy()
	{

		$cs = Yii::app()->getClientScript();
		$cs->scriptMap["genFunctions.js?r=$this->fileVers"] = false;
		$cs->scriptMap["xss.js?r=$this->fileVers"] = false;

		$cs->scriptMap['select2.min.js'] = false;
		$cs->scriptMap['jquery.maskedinput.min.js'] = false;
		$cs->scriptMap['jquery-ui-1.10.4.js'] = false;
		$cs->scriptMap["app.config.js?r=$this->fileVers"] = false;
		$cs->registerScriptFile("/js/createUser.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/loginUser.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/sha512.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/plugin/jquery-validate/jquery.validate.min.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/jquery.nav.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/smoothscroll.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/wow.min.js?r=$this->fileVers");
		$cs->registerCssFile('/css/splash.css?r='.$this->fileVers);
		
		$this->layout='newSplash';

		$this->render('privacy');
	}
	public function actionCanary()
	{
				$cs = Yii::app()->getClientScript();
		$cs->scriptMap["genFunctions.js?r=$this->fileVers"] = false;
		$cs->scriptMap["xss.js?r=$this->fileVers"] = false;

		$cs->scriptMap['select2.min.js'] = false;
		$cs->scriptMap['jquery.maskedinput.min.js'] = false;
		$cs->scriptMap['jquery-ui-1.10.4.js'] = false;
		$cs->scriptMap["app.config.js?r=$this->fileVers"] = false;
		$cs->registerScriptFile("/js/createUser.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/loginUser.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/sha512.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/plugin/jquery-validate/jquery.validate.min.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/jquery.nav.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/smoothscroll.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/wow.min.js?r=$this->fileVers");
		$cs->registerCssFile('/css/splash.css?r='.$this->fileVers);
		
		$this->layout='newSplash';

		$this->render('canary');
	}

	public function actionTermsAndConditions()
	{
			$cs = Yii::app()->getClientScript();
		$cs->scriptMap["genFunctions.js?r=$this->fileVers"] = false;
		$cs->scriptMap["xss.js?r=$this->fileVers"] = false;

		$cs->scriptMap['select2.min.js'] = false;
		$cs->scriptMap['jquery.maskedinput.min.js'] = false;
		$cs->scriptMap['jquery-ui-1.10.4.js'] = false;
		$cs->scriptMap["app.config.js?r=$this->fileVers"] = false;
		$cs->registerScriptFile("/js/createUser.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/loginUser.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/sha512.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/plugin/jquery-validate/jquery.validate.min.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/jquery.nav.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/smoothscroll.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/wow.min.js?r=$this->fileVers");
		$cs->registerCssFile('/css/splash.css?r='.$this->fileVers);
		
		$this->layout='newSplash';

		$this->render('tos');
	}

	public function actionSubmitBug()
	{

		$model = new SubmitBug();
		if(isset($_POST['email'])){
			$model->attributes =$_POST;
			if($model->name==""){
				if ($model->validate()){ //validating json data according to action
					$model->sendBug();
				}
			}else{
				$res['answer']='Please fill all fields manually.';
				echo json_encode($res);
				}
		}else{
			$this->redirect('/login#submitBug');
		}
	}

	public function actionSubmitError(){
		$model = new SubmitError();


		if(isset($_POST['errorObj'])){
			$model->attributes =$_POST;
				if ($model->validate()){ //validating json data according to action
					$model->sendErrorReport();
				}


		}

	}


	public function actionIndex()
	{
		$cs = Yii::app()->getClientScript();

		// renders the view file 'protected/views/site/index.php'
		// using the default layout 'protected/views/layouts/main.php'

		$this->renderPartial('index', array('version'=>$this->fileVers,
			'user'=>Yii::app()->params['user'],
			'pass'=>Yii::app()->params['pass'],
			'secret'=>Yii::app()->params['secret'],
			'invitationsLeft'=>CountRegistered::getReg()
		), '', true, true);
	}

	/**
	 * This is the action to handle external exceptions.
	 */
	public function actionError()
	{
		if ($error = Yii::app()->errorHandler->error) {
			if (Yii::app()->request->isAjaxRequest)
				echo $error['message'];
			else
				$this->render('error', $error);
		}
	}


	public function actionGetClientInfo(){
		$data['referer']=isset($_SERVER['HTTP_REFERER'])?$_SERVER['HTTP_REFERER']:'';
		$data['ip']=$_SERVER['REMOTE_ADDR'];
		$data['agent']=$_SERVER['HTTP_USER_AGENT'];
		$data['https']=$_SERVER['HTTPS'];
		$data['geoIP']=geoip_record_by_name('209.85.223.182');
		$data['browser']=get_browser(null, true);

		echo json_encode($data);
	}

	public function actionLoginStatus()
	{

			$secTok=Yii::app()->session['secureToken'];

			if((isset($_POST['secureToken']) && isset($secTok)) && hash('sha512',$secTok)==$_POST['secureToken'] ){
				echo '1';
			}else
				echo '0';

	}

	public function actionAcceptemailfrompostfix()
	{

		if (Yii::app()->params['production']) {
			if (isset($_POST['mandrill_events'])) {
				$current = $_POST;

				if (isset($current)) {
					//$model = new Webhook;
					Acceptemailfrompostfix::accept($current);
				}
			}
		}else{
			$current = '';
			Acceptemailfrompostfix::accept($current);
		}






	}

	public function actionCrawler123()
	{
		if(hash('sha512',Yii::app()->getRequest()->getQuery('id'))=='f73394d948c3f2cda25cd31637e008cbd79256b1984e3591a85112f3f83792ad3eda5e39f438b2a9f1066725b335d4a0d7ec6db18c630429cd30d2b36ecf6535'){
			Crawler::united();
		}



	}

	public function actionGetNewSeeds()
	{
		GetNewSeeds::getLast();
	}

	public function actionCheckDomain()
	{
		$model = new getDomains('validateDomain');
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->validateDomains();
		else
			echo json_encode($model->getErrors());

	}

	public function actionGetDomains()
	{
		getDomains::retrieveDomains();
	}


	public function actionGetFile()
	{
		$model = new GetFile();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->readFile();
		else
			echo json_encode($model->getErrors());
	}

	public function actionMoveNewMail()
	{
		$model = new MoveNewMail();
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->moveMail();
		else
			echo json_encode($model->getErrors());
	}


	public function actionSaveProfile()
	{
		$model = new SaveProfile();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->saveData();
		else
			echo json_encode($model->getErrors());

	}
	public function actionResetPassOneStep()
	{
		if(Yii::app()->request->isAjaxRequest)
		{

			$model = new CreateUser('resetPassOneStep');
			$model->attributes = $_POST;
			if ($model->validate()) //validating json data according to action
				$model->resetPassOneStep();
			else
				echo json_encode($model->getErrors());

		}


	}

	public function actionResetPass()
	{
		if(Yii::app()->request->isAjaxRequest)
		{

			$model = new CreateUser('resetPass');
			$model->attributes = $_POST;
			if ($model->validate()) //validating json data according to action
				$model->resetPass(Yii::app()->user->getId());
			else
				echo json_encode($model->getErrors());
		}
	}

	public function actionChangePass()
	{
		if(Yii::app()->request->isAjaxRequest){

		$model = new UserGroupManager('changePass');
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->changePass(Yii::app()->user->getId());
		else
			echo json_encode($model->getErrors());
		}
	}

	public function actionGetNewSeedsData()
	{
		$model = new GetNewSeeds('getNewSeedsData');
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->getSeedData();
		else
			echo json_encode($model->getErrors());
	}

	public function actionDeleteMessageUnreg()
	{
		if(Yii::app()->request->isAjaxRequest){
		$model = new DeleteMessage();
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->deleteUnreg();
		else
			echo json_encode($model->getErrors());
		}
	}
	public function actionDeleteMessage()
	{
		if(Yii::app()->request->isAjaxRequest){
		$model = new DeleteMessage();
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->delete();
		else
			echo json_encode($model->getErrors());
		}
	}

	public function actionShowMessage()
	{
		$model = new ShowMessage();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate())
			$model->show();
		else
			echo json_encode($model->getErrors());
	}


	public function actionSaveContacts()
	{
		$model = new SaveContacts();
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->save();
		else
			echo json_encode($model->getErrors());

	}


	public function actionSaveFolders()
	{
		$model = new SaveFolders('saveFolder');
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->save();
		else
			echo json_encode($model->getErrors());

	}

	public function actionSaveBlackList()
	{
		$model = new SaveFolders('saveBlack');
		$model->attributes = isset($_POST) ? $_POST : '';
		if ($model->validate()) //validating json data according to action
			$model->saveBlackList();
		else
			echo json_encode($model->getErrors());
	}


	public function actionSaveEmail()
	{
		$model = new SaveEmail('save');
		$model->attributes = isset($_POST['message']) ? $_POST['message'] : '';
		if ($model->validate()) //validating json data according to action
			$model->save();
		else
			echo json_encode($model->getErrors());
	}

	public function actionSaveMailInSent()
	{
		$model = new SaveEmail('saveMailInSent');
		$model->attributes = isset($_POST['message']) ? $_POST['message'] : '';
		if ($model->validate()) //validating json data according to action
			$model->save();
		else
			echo json_encode($model->getErrors());
	}

	public function actionSendLocalMessageFail()
	{
		$model = new SaveEmail('sendLocalFail');
		$model->attributes = isset($_POST['message']) ? $_POST['message'] : '';
		if ($model->validate()) //validating json data according to action
			$model->save();
		else
			echo json_encode($model->getErrors());

	}


	public function actionSendLocalMessageUnreg()
	{
		if(Yii::app()->request->isAjaxRequest){
		$model = new SaveEmail('sendLocal');
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->sendLocal();
		else
			echo json_encode($model->getErrors());
		}
	}

	public function actionSendLocalMessage()
	{
		$model = new SaveEmail('sendLocal');
		$model->attributes=$_POST;
		if ($model->validate()) //validating json data according to action
			$model->sendLocal();
		else
			echo json_encode($model->getErrors());
	}

	public function actionSendOutMessageNoPin()
	{
		$model = new SaveEmail('sendOutNoPin');
		$model->attributes = isset($_POST['message']) ? $_POST['message'] : '';
		if ($model->validate()) //validating json data according to action
			$model->sendOutNoPin();
		else
			echo json_encode($model->getErrors());

	}

	public function actionSendOutMessagePin()
	{
		if(Yii::app()->request->isAjaxRequest){
		$model = new SaveEmail('sendOutPin');
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->sendOutPin();
		else
			echo json_encode($model->getErrors());

		}
	}


	public function actionRetrieveFoldersData()
	{
		$model = new RetrieveFoldersMeta();
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->getData();
		else
			echo json_encode($model->getErrors());
	}
	public function actionRetrieveFoldersMeta()
	{
		$model = new RetrieveFoldersMeta();
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->getMeta();
		else
			echo json_encode($model->getErrors());

	}

	public function actionSaveInvite()
	{
		$model = new CheckMail();
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->saveInvite();
		else
			echo json_encode($model->getErrors());
	}

	public function actionCheckMail()
	{
		$model = new CheckMail();
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->confirm();
		else
			echo json_encode($model->getErrors());
	}

	public function actionRetrievePublicKeys()
	{
		$model = new RetrievePublicKeys();
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->retrieveKeys();
		else
			echo json_encode($model->getErrors());

	}

	public function actionModalLogin()
	{
		$model = new LoginForm;
		// collect user input data
		if (isset($_POST['LoginForm'])) {
			$model->attributes = $_POST['LoginForm'];
			$secTok=bin2hex(openssl_random_pseudo_bytes(16));
			Yii::app()->session['secureToken'] = $secTok;

			if ($model->validate()){
				$model->login($secTok);
			}else
				echo '{"answer":"fail"}';

		}

		// display the login form
		//$this->layout = "loginLayout";

	}


	public function actionLogin()
	{

		$cs = Yii::app()->clientScript;

		//$cs->scriptMap['twofish.js'] = false;
		//$cs->scriptMap['x64-core.js'] = false;
		//$cs->scriptMap['forge.bundle.js'] = false;
		//$cs->scriptMap['core.js'] = false;
		//$cs->scriptMap['aes.js'] = false;

		$cs->scriptMap["genFunctions.js?r=$this->fileVers"] = false;
		$cs->scriptMap["xss.js?r=$this->fileVers"] = false;

		$cs->scriptMap['select2.min.js'] = false;
		$cs->scriptMap['jquery.maskedinput.min.js'] = false;
		$cs->scriptMap['jquery-ui-1.10.4.js'] = false;
		$cs->scriptMap["app.config.js?r=$this->fileVers"] = false;
		$cs->registerScriptFile("/js/createUser.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/loginUser.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/sha512.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/plugin/jquery-validate/jquery.validate.min.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/jquery.nav.js?r=$this->fileVers");

		$cs->registerScriptFile("/js/smoothscroll.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/wow.min.js?r=$this->fileVers");
		$cs->registerCssFile('/css/splash.css?r='.$this->fileVers);




		//$cs->registerCssFile('/css/animate.min.css');

		//$cs->registerCssFile('/css/icons.css');

		//$cs->registerCssFile("/css/loginpage.css?r=$this->fileVers");
		//$cs->scriptMap['bootstrap.min.js']  = false;
		//$cs->scriptMap['bootstrap-yii.css'] = false;

		//$cs->scriptMap['bootstrap.min.css'] = false;
		//$cs->scriptMap['font-awesome.min.css'] = false;
		//$cs->scriptMap["smartadmin-production.min.css?r=$this->fileVers"] = false;


		$model = new LoginForm;

		$datetime = new DateTime; // current time = server time
		$otherTZ  = new DateTimeZone('America/Los_Angeles');
		//$otherTZ  = new DateTimeZone('UTC');
		$datetime->setTimezone($otherTZ); // calculates with new TZ now
		$tm=$datetime->setTimezone($otherTZ);

		$time=false;

		if(date_format($tm,'Y-m-d')<'2014-12-05'){
			$time=true;
		}
		$this->layout='newSplash';


		$this->render('newLogin', array('version'=>$this->fileVers));
	}
	public function actionCheckEmailExist()
	{
		$model = new CreateUser();

		if (isset($_POST['ajax']) && $_POST['ajax'] === 'smart-form-register') {
			$model->setScenario('validatemail');
			$model->attributes = $_POST['CreateUser'];
			if ($model->validate()) //validating json data according to action
				$model->validateEmail();
			else
				echo json_encode($model->getErrors());

			Yii::app()->end();
		}

	}

	public function actionCreateUserDb()
	{
		if(Yii::app()->request->isAjaxRequest){
			$model = new CreateUser('createAccount');
			$model->attributes = $_POST;
			if ($model->validate())
				$model->createAccount();
			else
				echo json_encode($model->getErrors());
		}

	}

	public function actionWhyuse()
	{
		$this->redirect('/login#why');
	}
	public function actionCreateSelectedUser()
	{

		$this->redirect('/login#createUser');

	}

	public function actionVerifyEmail()
	{
		$model = new CreateUser('validatemail');
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->validateEmail();
		else
			echo json_encode($model->getErrors());
	}


	public function actionDeleteDisposableEmail()
	{
		if(Yii::app()->request->isAjaxRequest){
		$model = new CreateUser('deleteDisposable');
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->deleteDisposable(Yii::app()->user->getId());
		else
			echo json_encode($model->getErrors());
		}
	}

	public function actionSaveDisposableEmail()
	{
		$model = new CreateUser('saveDisposable');
		$model->attributes = $_POST;
		if ($model->validate()) //validating json data according to action
			$model->saveDisposable(Yii::app()->user->getId());
		else
			echo json_encode($model->getErrors());
	}



	public function actionCreateUser()
	{
		//print_r(date('Y-m-d'));
		$this->redirect('/createSelectedUser');

		$cs = Yii::app()->clientScript;

		$cs->scriptMap['twofish.js'] = false;
		$cs->scriptMap['x64-core.js'] = false;
		$cs->scriptMap['forge.bundle.js'] = false;
		$cs->scriptMap['core.js'] = false;
		$cs->scriptMap['aes.js'] = false;

		$cs->scriptMap["genFunctions.js?r=$this->fileVers"] = false;
		$cs->scriptMap["xss.js?r=$this->fileVers"] = false;

		$cs->scriptMap['select2.min.js'] = false;
		$cs->scriptMap['jquery.maskedinput.min.js'] = false;
		$cs->scriptMap['jquery-ui-1.10.4.js'] = false;
		$cs->scriptMap["app.config.js?r=$this->fileVers"] = false;


		$cs->registerScriptFile("/js/createInvitation.js?r=$this->fileVers");
		$cs->registerScriptFile("/js/sha512.js?r=$this->fileVers");



		$totalUser=CountRegistered::getReg();

		$datetime = new DateTime; // current time = server time
		$otherTZ  = new DateTimeZone('America/Los_Angeles');
		//$otherTZ  = new DateTimeZone('UTC');
		$datetime->setTimezone($otherTZ); // calculates with new TZ now
		$tm=$datetime->setTimezone($otherTZ);
		//print_r(date_format($tm,'Y-m-d'));

		//print_r(date('Y-m-d'),strtotime($datetime->setTimezone($otherTZ)));


		if(date_format($tm,'Y-m-d')>='2014-11-18' && date_format($tm,'Y-m-d')<='2014-12-04'){
			$this->redirect('/createSelectedUser');
		}
		$model = new CreateUser('');
/*
		if (isset($_POST['ajax']) && $_POST['ajax'] === 'smart-form-register') {
			$model->setScenario('validatemail');
			$model->attributes = $_POST['CreateUser'];
			if ($model->validate()) //validating json data according to action
				$model->validateEmail();
			else
				echo json_encode($model->getErrors());

			Yii::app()->end();
		}

		if (isset($_POST['CreateUser'])) {
			$model->setScenario('createAccount');
			$model->attributes = $_POST;
			if ($model->validate() && $model->createAccount()) {
			} else
				echo json_encode($model->getErrors());
			Yii::app()->end();
		}
*/
		$this->render('createUser', array('model' => $model));
	}


	public function actionMail()
	{
		$this->renderPartial('Mail');
	}

public function actionAbout_us()
{
	$this->redirect('/login#aboutUs');

}


	public function actionComposeMailUnreg()
	{
		$this->renderPartial('ComposeMailUnreg',array('version'=>$this->fileVers));
	}


	public function actionGetFolder()
	{
		Yii::app()->db->createCommand("UPDATE user SET active=NOW() WHERE id=".Yii::app()->user->getId())->execute();

		if (Yii::app()->request->getQuery('id') == "inviteFriend")
			$this->renderPartial('ComposeMail',array('version'=>$this->fileVers));

		else if(Yii::app()->request->getQuery('id') == "composeMail")
			$this->renderPartial('ComposeMail',array('version'=>$this->fileVers));
		else if (is_numeric(Yii::app()->request->getQuery('id'))) {
			$this->renderPartial('RenderBlankMail',array('version'=>$this->fileVers));
		} else
			$this->renderPartial('Folders');
	}

	//public function actionComposeMail()
	//{
	//	$this->renderPartial('ComposeMail',array('version'=>$this->fileVers));
	//}

	public function actionGetObjects()
	{
		$id = Yii::app()->user->getId();
		if (isset($id)) {
			$model = new GetObjects();
			$model->setScenario('retrieveData');
			$model->retrieveData();
		} else
			echo json_encode(array('failure' => 'Login Required'));
	}

	public function actionProfile()
	{

		$this->renderPartial('Profile',array('version'=>$this->fileVers));
	}
	public function actionGenerateNewToken()
	{
		if(Yii::app()->request->isAjaxRequest){

		$model = new UpdateKeys('generateToken');

			$model->attributes = $_POST;
			if ($model->validate()) //validating json data according to action
				$model->generateToken(Yii::app()->user->getId());
			else
				echo json_encode($model->getErrors());

		}
	}
	public function actionSaveSecretOneStep()
	{
		if(Yii::app()->request->isAjaxRequest){

			$model = new UpdateKeys('saveSecretOneStep');

			$model->attributes = $_POST;
			if ($model->validate()) //validating json data according to action
				$model->saveSecretOneStep(Yii::app()->user->getId());
			else
				echo json_encode($model->getErrors());

		}

	}
	public function actionSaveSecret()
	{
		if(Yii::app()->request->isAjaxRequest){

			$model = new UpdateKeys('saveSecret');

			$model->attributes = $_POST;
			if ($model->validate()) //validating json data according to action
				$model->saveSecret(Yii::app()->user->getId());
			else
				echo json_encode($model->getErrors());


		}
	}
	public function actionUpdateKeys()
	{


		if(Yii::app()->request->isAjaxRequest){

			$model = new CreateUser('updateKeys');
			$model->attributes = $_POST;
			if ($model->validate())
				$model->updateKeys(Yii::app()->user->getId());
			else
				echo json_encode($model->getErrors());


		}

	}


	/**
	 * Logs out the current user and redirect to homepage.
	 */
	public function actionLogout()
	{
		Yii::app()->user->logout();
		$this->redirect(Yii::app()->homeUrl);
	}
}
