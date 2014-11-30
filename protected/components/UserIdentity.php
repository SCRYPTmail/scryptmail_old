<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class UserIdentity extends CUserIdentity
{
	private $_id;
	public $userData;

	public function authenticate()
	{
		$username = strtolower($this->username);
		//$user=User::model()->find('LOWER(username)=?',array($username));
		$user = User::findUser($username);
		//print_r(crypt($this->password,$user->password));
		//print_r(crypt($this->password,$user['password']));
		//print_r($user['password']);

		if ($user === null)
			$this->errorCode = self::ERROR_USERNAME_INVALID;
		else if ($user['password'] !== crypt($this->password, $user['password']))
			$this->errorCode = self::ERROR_PASSWORD_INVALID;
		else {
			$this->_id = $user['id'];
			$this->username = $username;
			//$f=$user;
			//unset($f['mailHash'],$f['password']);
			//$this->setState('userData', $f);
			$this->errorCode = self::ERROR_NONE;
		}
		return $this->errorCode == self::ERROR_NONE;
	}

	public function getId()
	{
		return $this->_id;
	}

}