<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class LoginForm extends CFormModel
{
	public $username;
	public $password;
	public $rememberMe;

	private $_identity;

	/**
	 * Declares the validation rules.
	 * The rules state that username and password are required,
	 * and password needs to be authenticated.
	 */
	public function rules()
	{
		return array(
			// username and password are required
			array('username, password', 'required'),
			// rememberMe needs to be a boolean
			//array('username', 'allowedDomain'),
			// password needs to be authenticated
			array('password', 'authenticate'),
		);
	}

	/**
	 * Declares attribute labels.
	 */
	public function attributeLabels()
	{
		return array(//	'rememberMe'=>'Remember me next time',
		);
	}

	public function allowedDomain()
	{
		if (isset($this->username)) {
			$arr = explode("@", $this->username);
			if (count($arr) == 2 && in_array($arr[1], Yii::app()->params['params']['allowedDomains'])) {
				return true;
			}
			if (count($arr) > 2 && in_array($arr[1], Yii::app()->params['params']['allowedDomains'])) {
				$this->username = $arr[0] . '@' . $arr[1];
				return true;
			}
			//if($this->password=="")
			//$this->username=str_replace('@scryptmail.com','',$this->username);
			//else if(count($arr)==1){
			//	$this->username=$this->username.'@scryptmail.com';
			//}
		}
		return false;
	}

	/**
	 * Authenticates the password.
	 * This is the 'authenticate' validator as declared in rules().
	 */
	public function authenticate($attribute, $params)
	{
		if (!$this->hasErrors()) {
			$this->_identity = new UserIdentity($this->username, $this->password);
			if (!$this->_identity->authenticate()) {
				$this->username = str_replace('@scryptmail.com', '', $this->username);
				$this->addError('username', 'Incorrect username or password.');
			}
		}
	}

	/**
	 * Logs in the user using the given username and password in the model.
	 * @return boolean whether login is successful
	 */
	public function login()
	{
		if ($this->_identity === null) {
			$this->_identity = new UserIdentity($this->username, $this->password);
			$this->_identity->authenticate();
		}
		if ($this->_identity->errorCode === UserIdentity::ERROR_NONE) {
			$duration = $this->rememberMe ? 3600 * 24 * 30 : 0; // 30 days
			Yii::app()->user->login($this->_identity, $duration);
			return true;
		} else
			return false;
	}
}
