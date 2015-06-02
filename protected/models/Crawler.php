<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class Crawler extends CFormModel
{
	public function united()
	{
		Crawler::postOffice(); //send mail
		Crawler::houseCleaner(); //deleting expired emails

	}

	public function houseCleaner()
	{
		if (!Yii::app()->db->createCommand("SELECT * FROM crawler WHERE action='cleaningHouse'")->queryRow()) {
			Yii::app()->db->createCommand("INSERT INTO crawler (action,active) VALUES('cleaningHouse',1)")->execute();

			//$newMail2field[]=array('oldId'=>$row['mailId'],'modKey'=>hash('sha512', $row['mailModKey']));

			$user = array('expireAfter' => array('$lte'=>new MongoDate(strtotime('now'))));

			if ($emailsToClean = Yii::app()->db->createCommand("SELECT file,id,expired FROM mailTable WHERE expired <NOW()")->queryAll())
			{
					foreach($emailsToClean as $i=>$row){
						$emailToDeleteId[":mailId_$i"]=$row['id'];
						if($files=json_decode($row['file'],true)){
							foreach($files as $filename){
								FileWorks::deleteFile($filename);
							}
						}
					}
					Yii::app()->db->createCommand("DELETE FROM mailTable WHERE id IN (".implode(array_keys($emailToDeleteId),',').")")->execute($emailToDeleteId);
					unset($emailToDeleteId);

			}else if($newEmailsToClean=Yii::app()->mongo->findAll('mailQueue',$user))
			{

				foreach($newEmailsToClean as $i=>$doc){
					$emailToDeleteId[]=array('_id'=>new MongoId($doc['_id']));
					if($files=json_decode($doc['file'],true)){
						foreach($files as $filename){
							FileWorks::deleteFile($filename);
						}
					}
				}
				$mngDataAgregate=array('$or'=>$emailToDeleteId);
				Yii::app()->mongo->removeAll('mailQueue',$mngDataAgregate);

			}

			Yii::app()->db->createCommand("DELETE FROM crawler WHERE action ='cleaningHouse'")->execute();
		}
		echo 'success
		';
	}
	public function postOffice()
	{
		set_time_limit(600);
		//check if available
		if (!Yii::app()->db->createCommand("SELECT * FROM crawler WHERE action='takingMail'")->queryRow()) {

			Yii::app()->db->createCommand("INSERT INTO crawler (action,active) VALUES('takingMail',1)")->execute();
			//blocking function

			//read emails to send
			if ($emails = Yii::app()->db->createCommand("SELECT * FROM mailToSent WHERE indexmail IS NULL LIMIT 4000")->queryAll()) {
				Yii::app()->db->createCommand("INSERT INTO mailToSent (indexmail) VALUES(1)")->execute();

				//print_r($emails);
				foreach ($emails as $row) {

					if ($row['outside'] == 1)
					{ //send email third server

						if ($row['pass'] == '') {
							if (Crawler::sendMailOutWithPin($row)) {

								$meta=substr(hex2bin($row['meta']),0,16).substr(hex2bin($row['meta']),16);
								$body=substr(hex2bin($row['body']),0,16).substr(hex2bin($row['body']),16);

								$person[]=array(
									"oldId"=>$row['messageId'],
									"meta" => new MongoBinData($meta, MongoBinData::GENERIC),
									"body" => new MongoBinData($body, MongoBinData::GENERIC),
									"modKey"=>$row['modKey'],
									"file"=>$row['file'],
									"pinHash" => $row['pinHash'],
									"tryCounter"=>0,
									"expireAfter"=>new MongoDate(strtotime('now'.'+ 4 weeks'))
								);
								if(Yii::app()->mongo->insert('mailQueue',$person))
								{
									Yii::app()->db->createCommand("DELETE FROM mailToSent WHERE id=" . $row['id'])->execute();
								}
								unset($person);
							}

						} else {
							if (Crawler::sendMailOutWithoutPin($row)) {
								if(isset($row['file']) &&$row['file']!=''){
									$person[]=array(
										"oldId"=>$row['messageId'],
										"modKey"=>$row['modKey'],
										"file"=>$row['file'],
										"expireAfter"=>new MongoDate(strtotime('now'.'+ 4 weeks'))
									);
									Yii::app()->mongo->insert('mailQueue',$person);
									unset($person);
								}
									Yii::app()->db->createCommand("DELETE FROM mailToSent WHERE id=" . $row['id'])->execute();

							}

						}

					}
					//end send email third server
					if ($row['fromOut'] == 1 || ($row['outside'] == 0 && $row['fromOut'] == 0))
					{
						$fileSize=0;
						if(isset($row['file'])){ //calculate space occupied by files
							$files=json_decode($row['file']);
							foreach($files as $file){
								$fileSize+=FileWorks::getFileSize($file);
							}
						}

						$trans = Yii::app()->db->beginTransaction();
						$par[':id'] = $row['id'];
						$par[':meta'] = $row['seedMeta'];
						$par[':modKey'] = $row['modKeySeed'];
						$par[':password'] = $row['seedPass'];
						$par[':rcpnt'] = $row['rcpnt'];
						$par[':v1'] = 1;

						if (Yii::app()->db->createCommand("INSERT INTO seedTable (id,meta,modKey,password,rcpnt,v1) VALUES (:id,:meta,:modKey,:password,:rcpnt,:v1)")->execute($par)) {
							unset($par);
							$meta=substr(hex2bin($row['meta']),0,16).substr(hex2bin($row['meta']),16);
							$body=substr(hex2bin($row['body']),0,16).substr(hex2bin($row['body']),16);

							$person[]=array(
								"oldId"=>$row['messageId'],
								"meta" => new MongoBinData($meta, MongoBinData::GENERIC),
								"body" => new MongoBinData($body, MongoBinData::GENERIC),
								"pass" => $row['pass'],
								"modKey"=>$row['modKey'],
								"file"=>$row['file'],
								"emailSize"=>strlen($meta)+strlen($body)+$fileSize,
							);
							if(Yii::app()->mongo->insert('mailQueue',$person))
							{
								unset($fileSize,$person);
								if(Yii::app()->db->createCommand("DELETE FROM mailToSent WHERE id=" . $row['id'])->execute()){
									$trans->commit();
								}else{
									$trans->rollback();
								}
							}else{
								$trans->rollback();
							}

						}

					}


				}

			}

			Yii::app()->db->createCommand("DELETE FROM crawler WHERE action ='takingMail'")->execute();

		}
		echo 'success
		';

	}


	public function sendMailOutWithoutPin($row)
	{
		$key = hex2bin($row['pass']);

		$encryptionMethod = "aes-256-cbc";

		//if (isset($row['file']) && is_array(json_decode($row['file'], true))) {
		//	foreach (json_decode($row['file'], true) as $fileName) {
		//		$file[$fileName] = file_get_contents(Yii::app()->basePath . '/attachments/' . $fileName);
		//	}
			//print_r($file);
		//}

		$iv = hex2bin(substr($row['body'], 0, 32));
		$encrypted = base64_encode(hex2bin(substr($row['body'], 32)));
		$body = json_decode(openssl_decrypt($encrypted, $encryptionMethod, $key, 0, $iv), true);

		$body['to'] = base64_decode($body['to']);
		$body['from'] = base64_decode($body['from']);

		$body['subj'] = base64_decode($body['subj']);
		
		$preferences = ["input-charset" => "UTF-8", "output-charset" => "UTF-8"];
		$body['subj'] =  iconv_mime_encode("Subject", $body['subj'], $preferences);
		$body['subj'] = str_replace("Subject:", "", $body['subj']);

		$body['body']['html'] = base64_decode($body['body']['html']);
		$body['body']['text'] = base64_decode($body['body']['text']);

		if (isset($body['attachment']) && is_array($body['attachment'])) {
			$attach[]="<br><br>Email Attachments:<br>";
			$attachtxt[]='\n\r\n\rEmail Attachments:';
			foreach ($body['attachment'] as $fileN => $frow) {
				$attach[]=base64_decode($frow['name']).' <a href="https://scryptmail.com/downloadFile/'.$row['pass'].base64_decode($frow['filename']).'/name/'.$frow['name'].'-'.$frow['type'].'"  target="_blank">Download</a> It will be stored on our server for 4 weeks.';
				$attachtxt[]=base64_decode($frow['name']).'https://scryptmail.com/downloadFile/'.$row['pass'].base64_decode($frow['filename']).'/name/'.$frow['name'].'-'.$frow['type'].' It will be stored on our server for 4 weeks.';

				/*
				$body['attachment'][($fileN)]['name'] = base64_decode($frow['name']);
				$body['attachment'][($fileN)]['type'] = base64_decode($frow['type']);
				$body['attachment'][($fileN)]['filename'] = base64_decode($frow['filename']);
				$body['attachment'][($fileN)]['size'] = base64_decode($frow['size']);
				$body['attachment'][($fileN)]['base64'] = 1;

				$data = $file[base64_decode($frow['filename'])];
				$iv = hex2bin(substr($data, 0, 32));
				$encrypted = substr($data, 32);
				$body['attachment'][($fileN)]['data'] = openssl_decrypt($encrypted, $encryptionMethod, $key, 0, $iv);
				//unset($body['attachment'][$fileN]);
				*/
			}
		}
		if (!is_array($body)) {
			return false;
		}

		if (Yii::app()->params['production']) {


			$boundary = uniqid('np');

			$eol="\r\n";

			$headers = "MIME-Version: 1.0".$eol;
			$headers .= "From: " . $body['from'] . $eol."Reply-To: " . $body['from']. $eol;
			//$headers .= "To: ".$body['to'].$eol;
			$headers .= "Content-Type: multipart/alternative; boundary=$boundary".$eol.$eol;

			$message = "This is a MIME encoded message.";
			$message .=$eol.$eol."--$boundary".$eol;
			$message .= "Content-type: text/plain;charset=utf-8".$eol.$eol;

			if (is_array($body['attachment']) && count($body['attachment'])>0) {


				if($pos = strpos($body['body']['text'], '---------------------------------')){
					$message.= substr_replace($body['body']['text'], implode($attachtxt,' '), $pos, 0).$eol.$eol;

				}else{
					$message .= $body['body']['text'].implode($attachtxt,' ').$eol.$eol;
				}


				$message .=$eol.$eol."--$boundary".$eol;
				$message .= "Content-type: text/html;charset=utf-8".$eol.$eol;

				if($pos = strpos($body['body']['html'], '<div class="replied">')){
					$message.= substr_replace($body['body']['html'], implode($attach,'<br>'), $pos, 0).$eol.$eol;

				}else{
					$message .= $body['body']['html'].implode($attach,'<br>').$eol.$eol;
				}



				$message .=$eol.$eol."--$boundary--";

			}else{


			$message .= $body['body']['text'].$eol.$eol;
			$message .=$eol.$eol."--$boundary".$eol;

			$message .= "Content-type: text/html;charset=utf-8".$eol.$eol;

			$message .= $body['body']['html'].$eol.$eol;

			$message .=$eol.$eol."--$boundary--";

		}
			/*
			if (is_array($body['attachment']) && count($body['attachment'])>0) {
				$headers .= "Content-Type: multipart/mixed;boundary=mixed-$boundary". $eol.$eol;

				$message = "--mixed-" . $boundary .$eol;
				$message .="Content-Type: multipart/alternative; boundary=$boundary".$eol.$eol;

				$message .="--$boundary".$eol;
				$message .= "Content-type: text/plain;charset=utf-8".$eol.$eol;

				$message .= $body['body']['text'].$eol.$eol;

				$message .="--$boundary".$eol;
				$message .= "Content-type: text/html;charset=utf-8".$eol.$eol;

				$message .= $body['body']['html'].$eol.$eol;

				$message .="--$boundary--".$eol;


				if (is_array($body['attachment']) && count($body['attachment'])>0) {
					foreach ($body['attachment'] as $fName => $frow) {
						$message .="--mixed-$boundary".$eol;

						$message .='Content-Type: ' . $frow['type'] . '; name="'.$frow['name'].'"'.$eol;
						$message .='Content-Disposition: attachment; filename="'.$frow['name'].'"'.$eol;
						$message .='Content-Transfer-Encoding: base64'.$eol;
						$message .='X-Attachment-Id: '.hash('sha256',$frow['name']).$eol.$eol;

						$message .=chunk_split($frow['data']).$eol;

					}
					$message .="--mixed-$boundary--";
				}

			}else{

				$message ="Content-Type: multipart/alternative; boundary=$boundary".$eol.$eol;

				$message .="--$boundary".$eol;
				$message .= "Content-type: text/plain;charset=utf-8".$eol.$eol;

				$message .= $body['body']['text'].$eol.$eol;

				$message .="--$boundary".$eol;
				$message .= "Content-type: text/html;charset=utf-8".$eol.$eol;

				$message .= $body['body']['html'].$eol.$eol;

				$message .="--$boundary--";



			}
*/
			//$message .= $eol.$eol."--" . $boundary . "--".$eol.$eol;




//print_r($message);

			if (mail($body['to'], $body['subj'], $message, $headers, "-f" . EmailparseCommand::getEmail($body['from'])))
				return true;
			else
				return false;

		} else
			return true;

		return false;

	}

	public function sendMailOutWithPin($data)
	{
		//print_r($data);

		if (Yii::app()->params['production']) {
			///work/encryptedmail/protected/views/templates/emailWithPin.php

			$message = file_get_contents(Yii::app()->basePath . '/views/templates/emailWithPin.php');
			$message = str_replace('*|SENDER|*', $data['fromt'], $message);
			$message = str_replace('*|RECIPIENT|*', $data['tot'], $message);
			$message = str_replace('*|LINK_TO_MESSAGE|*', 'https://scryptmail.com/retrieveEmail/' . $data['messageId'], $message);
			//	echo $message;
			$to = $data['tot'];

// subject
			$subject = 'Email from ' . $data['fromt'];

// message


			$headers = 'MIME-Version: 1.0' . "\r\n";
			$headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

// Additional headers
			$headers .= 'Reply-To: ' . $data['fromt'] . "\r\n";
			$headers .= 'From: ' . $data['fromt'] . "\r\n";
//print_r($message);
// Mail it
			if (mail($to, $subject, $message, $headers, "-f" . EmailparseCommand::getEmail($data['fromt'])))
				return true;
			else
				return false;

		} else
			return true;

	}


}
