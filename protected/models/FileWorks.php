<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class FileWorks extends CFormModel
{

	public function encryptFile($data, $filename, $key, $base64)
	{
		$iv_size = mcrypt_get_iv_size(MCRYPT_RIJNDAEL_128, MCRYPT_MODE_CBC);
		$iv = openssl_random_pseudo_bytes($iv_size);

		$encryptionMethod = "aes-256-cbc";

		if ($base64) {

			//if already encoded64
			if ($encryptedMessage = bin2hex($iv).openssl_encrypt($data, $encryptionMethod, $key, 0, $iv)) {

			} else
				return false;

		} else {
			//not encoded64
			if ($encryptedMessage = bin2hex($iv).openssl_encrypt(base64_encode($data), $encryptionMethod, $key, 0, $iv)) {

			} else
				return false;
		}
		//unset($data['filecyp']);

		if(FileWorks::writeFile($filename,$encryptedMessage)===false)
		{
			return false;
		}else
		{
			return true;
		}


	}


	public function writeFile($fname,$fdata)
	{

		$options = array('adapter' => ObjectStorage_Http_Client::SOCKET, 'timeout' => 10);
		$host = Yii::app()->params['host'];
		$username = Yii::app()->params['username'];
		$folder=Yii::app()->params['folder'];
		$password = Yii::app()->params['password'];

		try{
			$fOname=hash('sha512',$fname);
			$objectStorage = new ObjectStorage($host, $username, $password, $options);
			$objectStorage->with($folder.'/'.$fOname)->setBody($fdata)
				->setHeader('Content-type', 'application/octet-stream')
				->create();

		} catch (Exception $e) {
			if (file_put_contents(Yii::app()->basePath . '/attachments/' . $fname, $fdata)){
			}else
				return false;
		}
		return true;

	}

	public function readFile($fname)
	{

		$options = array('adapter' => ObjectStorage_Http_Client::SOCKET, 'timeout' => 10);
		$host = Yii::app()->params['host'];
		$folder=Yii::app()->params['folder'];
		$username = Yii::app()->params['username'];
		$password = Yii::app()->params['password'];

		try{
			$fOname=hash('sha512',$fname);
			$objectStorage = new ObjectStorage($host, $username, $password, $options);
			$result = $objectStorage->with($folder.'/'.$fOname)->get();

			return $result->getBody();

		} catch (Exception $e) {

			if($file=@file_get_contents(Yii::app()->basePath . '/attachments/' .$fname)){
				return $file;

			}
		}
		return false;
	}
	public function getFileSize($fname)
	{

		$options = array('adapter' => ObjectStorage_Http_Client::SOCKET, 'timeout' => 10);
		$host = Yii::app()->params['host'];
		$folder=Yii::app()->params['folder'];
		$username = Yii::app()->params['username'];
		$password = Yii::app()->params['password'];

		try{
			$fOname=hash('sha512',$fname);
			$objectStorage = new ObjectStorage($host, $username, $password, $options);
			$result = $objectStorage->with($folder.'/'.$fOname)->getInfo()->getHeader('Content-length');

			return $result;

		} catch (Exception $e) {

			if($file=@file_get_contents(Yii::app()->basePath . '/attachments/' .$fname)){
				return strlen($file);

			}
		}
		return false;
	}

	public function deleteFile($fname)
	{
		$options = array('adapter' => ObjectStorage_Http_Client::SOCKET, 'timeout' => 10);
		$host = Yii::app()->params['host'];
		$folder=Yii::app()->params['folder'];
		$username = Yii::app()->params['username'];
		$password = Yii::app()->params['password'];

		try{
			$fOname=hash('sha512',$fname);
			$objectStorage = new ObjectStorage($host, $username, $password, $options);
			$result = $objectStorage->with($folder.'/'.$fOname)->delete();

		} catch (Exception $e) {
			try {
				@unlink(Yii::app()->basePath . '/attachments/' . $fname);
			} catch (Exception $e) {
			}
		}
		return true;
	}

}