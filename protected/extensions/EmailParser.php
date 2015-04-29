<?php
/**
 * User: sak
 * Date: 3/30/15
 * Time: 9:58 PM
 */

class EmailParser extends CApplicationComponent
{

public $Parser;

	public function init()
	{
		include 'EmailParserExtension/Parser.php';
		include 'EmailParserExtension/Attachment.php';
		include 'EmailParserExtension/Exception.php';

		$this->Parser = new Parser();
		//require("libs/nusoap-0.9.5/lib/nusoap.php");
		return parent::init();


	}

	public function getHeader($email)
	{

			$pars=$this->Parser;


			$pars->setText($email);

			$headerPos=$pars->getHeaderAll();


			return substr($email,$headerPos['start'],$headerPos['end']);
		}


	public function getResults($rawEmail)
		{


		$Parser = new Parser();

		$Parser->setStream($rawEmail);
		//$Parser->setText($rawEmail);

// We can get all the necessary data
		$email['to']=$Parser->getHeader('to');
		$email['cc']=$Parser->getHeader('cc');
		$email['from']=$Parser->getHeader('from');
		$email['subject']=$Parser->getHeader('subject');
		$email['received']=date('Y-m-d H:i:s');
		$email['sent']=date('Y-m-d H:i:s',strtotime($Parser->getHeader('date')));
		$email['text']=$Parser->getMessageBody('text');
		$email['html']=$Parser->getMessageBody('html');
		$email['htmlEmbedded']=$Parser->getMessageBody('htmlEmbedded');//HTML Body included data



// and the attachments also
		//$attach_dir = Yii::app()->basePath.'/extensions/';
		$email['attachmentObj']=$Parser->saveAttachments();
		//$Parser->saveAttachments($attach_dir);

		return $email;


	/*
			$newObject = $objectStorage->with('attachments/object.txt')
				//->setBody('test object')
				//->setMeta('description', 'first test file')
				->delete();

	*/
		/*
$file = fopen("/srv/www/mailparser/postfixtest", "w");
fwrite($file, "Script successfully ran at ".date("Y-m-d H:i:s")."\n");


// read from stdin
$fd = fopen("php://stdin", "r");
$email = "";
while (!feof($fd)) {
	$line = fread($fd, 1024);
	$email .= $line;
}
fclose($fd);

fwrite($file, $email);
fclose($file);

 */
		/*
		 $path = '/work/emailparser/m0001';

		//$buffer =$email; // Mail Content from pipe or whatever
		$buffer =fopen($path, "r");
		$file1 = fopen("/work/emailparser/postfixParsed", "w");

		$mail = mailparse_msg_create();
		mailparse_msg_parse($mail,$buffer);
		$struct = mailparse_msg_get_structure($mail);

		foreach($struct as $st) {
			$section = mailparse_msg_get_part($mail, $st);
			$info = mailparse_msg_get_part_data($section);
			$results = print_r($info, true);
			fwrite($file1, $results);
			//print_r($info);
		}
		fclose($file1);

		 */
//require 'parse/Parser.php';
		//===================================================================


		/*
		include 'EmailParserExtension/Parser.php';
		include 'EmailParserExtension/Attachment.php';
		include 'EmailParserExtension/Exception.php';

		$path = Yii::app()->basePath.'/extensions/m0001';

		$Parser = new Parser();


		//There are three input methods of the mime mail to be parsed
//specify a file path to the mime mail :
		$Parser->setPath($path);

// Or specify a php file resource (stream) to the mime mail :
		$Parser->setStream(fopen($path, "r"));

// Or specify the raw mime mail text :
		$Parser->setText(file_get_contents($path));

// We can get all the necessary data
		$email['to']=$Parser->getHeader('to');
		$email['from']=$Parser->getHeader('from');
		$email['subject']=$Parser->getHeader('subject');
		$email['received']=date('Y-m-d H:i:s');
		$email['sent']=date('Y-m-d H:i:s',strtotime($Parser->getHeader('date')));
		$email['text']=$Parser->getMessageBody('text');
		$email['html']=$Parser->getMessageBody('html');
		$email['htmlEmbedded']=$Parser->getMessageBody('htmlEmbedded');//HTML Body included data



// and the attachments also
		$attach_dir = Yii::app()->basePath.'/extensions/';
		$email['attachmentObj']=$Parser->saveAttachments($attach_dir);
		//$Parser->saveAttachments($attach_dir);

		return $email;
*/
	}


}