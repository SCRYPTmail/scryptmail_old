<?php

/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class SubmitBug extends CFormModel
{
	public $email;
	public $os;
	public $device;
	public $comment;
	public $name;

	/**
	 * Declares the validation rules.
	 */
	public function rules()
	{
		return array(
			// name, email, subject and body are required
			array('os, email, device, comment', 'required'),
			// email has to be a valid email address
			array('email', 'email'),
			array('name', 'safe'),
		);
	}


	public function sendBug()
	{

	$msg = 'Email: '.$this->email.'<br>'.
		'Device: '.$this->device.'<br>'.
		'OS: '.$this->os.'<br>'.
		'Comment: '.$this->comment;

	$msg = wordwrap($msg,70);

	// send email
	mail(Yii::app()->params['adminEmail'],"Bug Report",$msg);
		$res['answer']='success';
echo json_encode($res);
		}
	}