<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */
class GetFile extends CFormModel
{
	public $fileName;

	public function rules()
	{
		return array(
			// username and password are required
			array('fileName', 'required'),
		);
	}



	public function readFile()
	{
		if($file=FileWorks::readFile($this->fileName)){
			echo $file;
		}else{
			echo '';
		}

	}
}