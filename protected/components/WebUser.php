<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class WebUser extends CWebUser
{
	private $_model = null;
	public $loginUrl = null;


	function getRole($type = null)
	{
		if (isset(Yii::app()->user->id)) {
			$groups = User::getGroups($this->id);

			if ($role = User::getRole($this->id)) {
				$role['role'] = $groups[$role['groupId']];
				return $role;
			} else {
				$role['groupId'] = 6;
				$role['role'] = $groups[6];
				return $role;
			}
		} else {
			$role['groupId'] = 0;
			$role['role'] = 0;
			return $role;
		}


	}


	public function getUserData()
	{
		return $this->getState('userData');
	}

}

?>