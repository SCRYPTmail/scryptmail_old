<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class InviteFriend extends CFormModel
{
	public $message;

	public function rules()
	{
		return array(
			array('message', 'required'),
			array('message','length', 'min' => 50, 'max'=>300),

		);
	}

	public function invite()
	{

		$obj = json_decode($this->message, true);

		$param[':email']=$obj['to'];
		$param[':invitationCode']=hash('sha256',$obj['to']);
		$trans = Yii::app()->db->beginTransaction();
		if (Yii::app()->db->createCommand("INSERT IGNORE INTO invites (emails,invitationCode) VALUE (:email,:invitationCode)")->execute($param)) {

			$boundary = uniqid('np');

			$eol="\r\n";

			$headers = "MIME-Version: 1.0".$eol;
			$headers .= "From: " . 'support@scryptmail.com' . $eol."Reply-To: " . $obj['to']. $eol;

			$headers .= "Content-Type: multipart/alternative; boundary=$boundary".$eol.$eol;

			$message = "This is a MIME encoded message.";
			$message .=$eol.$eol."--$boundary".$eol;
			$message .= "Content-type: text/plain;charset=utf-8".$eol.$eol;


				$message .= strip_tags($obj['message']).'
				Invitation Link: '.'https://scryptmail.com/createSelectedUser/'.$param[':invitationCode'].$eol.$eol;

				$message .=$eol.$eol."--$boundary".$eol;

				$message .= "Content-type: text/html;charset=utf-8".$eol.$eol;
				$message .= strip_tags($obj['message']).'<br><br><a href="https://scryptmail.com/createSelectedUser/'.$param[':invitationCode'].'" target="_blank">Invitation Link</a>'.$eol.$eol;
				$message .=$eol.$eol."--$boundary--";

			if (mail($obj['to'], $obj['from'].' Invites you to use scryptmail', $message, $headers, "-f" . 'support@scryptmail.com')){
				$result['results']="ok";
				$trans->commit();
			echo json_encode($result);

			}else{
				$trans->rollback();
				$result['results']="Error Sending email. Please try again";
				echo json_encode($result);
			}

		}else{
			$result['results']="User already invited. Please invited another";
			echo json_encode($result);
		}

	}


}