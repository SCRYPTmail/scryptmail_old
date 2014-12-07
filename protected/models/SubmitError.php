<?php

/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class SubmitError extends CFormModel
{
	public $errorObj;

	/**
	 * Declares the validation rules.
	 */
	public function rules()
	{
		return array(
			// name, email, subject and body are required
			array('errorObj', 'required'),
			// email has to be a valid email address
			//array('errorObj', 'checkFields'),
		);
	}


	public function sendErrorReport()
	{

	$msg = wordwrap($this->errorObj.'userAgent:'.$_SERVER['HTTP_USER_AGENT'].'ID:'.Yii::app()->user->getId(),70);

	// send email
	mail(Yii::app()->params['adminEmail'],"Bug Report Javascript",$msg);

		}
	}