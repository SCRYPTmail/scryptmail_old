<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class downloadFile extends CFormModel
{
	public $fileHash;
	public $fileData;

	public function rules()
	{
		return array(
			// username and password are required
			array('fileHash,fileData', 'required'),

			array('fileHash', 'match', 'pattern'=>'/^([a-z0-9_])+$/', 'message'=>'please provide correct link'),
			array('fileHash','length', 'min' => 192, 'max'=>192, 'tooShort'=>'file not found','tooLong'=>'file not found'),
		);
	}



	public function download()
	{
		$fileHash=$this->fileHash;
		$key=hex2bin(substr($fileHash,0,64));
		$fileName=substr($fileHash,64);

		$fileData=explode('-',$this->fileData);

		$name=base64_decode($fileData[0]);
		$type=base64_decode($fileData[1]);


			if($file=FileWorks::readFile($fileName)){
				try{

				$data = $file;
				$iv = hex2bin(substr($data, 0, 32));
				$encrypted = substr($data, 32);

					$encryptionMethod = "aes-256-cbc";
					$g=openssl_decrypt($encrypted, $encryptionMethod, $key, 0, $iv);

					header("Cache-Control: public");
					header("Content-Description: File Transfer");
					header("Content-Disposition: attachment; filename=".$name);
					header("Content-Type: ".$type);
					header("Content-Transfer-Encoding: binary");
					echo base64_decode($g);

				} catch (Exception $e) {
					echo '{"file":"file not found1"}';
				}

				}else
			echo 'File you requested is no longer available.';

	}
}