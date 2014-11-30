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
		if (file_put_contents(Yii::app()->basePath . '/attachments/' . $filename, $encryptedMessage)){
			//		file_put_contents(Yii::app()->basePath . '/attachments/encr' . $filename, $encrypted);
			//	file_put_contents(Yii::app()->basePath . '/attachments/decrypt' . $filename, $data);
			//		file_put_contents(Yii::app()->basePath . '/attachments/decrypt_hex' . $filename, bin2hex($data));
			//	file_put_contents(Yii::app()->basePath . '/attachments/decoded_decr' . $filename, base64_decode($data));
			return true;

		}else
			return false;

	}


}