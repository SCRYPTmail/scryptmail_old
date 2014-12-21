<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class SafeBox extends CFormModel
{
	public $file,$filename,$username,$password,$action,$modKey,$fileId;

	public function rules()
	{
		return array(
			array('file,filename,username,password,action', 'checkFile','on'=>'safeFile'),
			array('modKey', 'match', 'pattern'=>'/^([a-z0-9_]){32,64}+$/','on'=>'retrieveList'),
			array('modKey', 'match', 'pattern'=>'/^([a-z0-9_]){32,64}+$/','on'=>'deleteFileFromSafe'),
			array('fileId', 'match', 'pattern'=>'/^([a-z0-9_]){128}+$/','on'=>'deleteFileFromSafe'),



		);
	}
	public function checkFile()
	{
			$size=0;
			$size=strlen($this->file);
		//$server=$this->server;
		if($size>5000000){
				header($_SERVER['SERVER_PROTOCOL'] . ' 412 File size is out of range Max 5Mb', true, 412);
				echo '';
				return false;
		}

		if(strlen($this->filename)>200){
			header($_SERVER['SERVER_PROTOCOL'] . ' 412 File name is too long Max (200)', true, 412);
			echo '';
			return false;
		}
		//$server=explode($this->server,'.');
		if(strpos($this->username, '@')){
			$this->username=hash('sha512',strtolower($this->username));
		}else if(strlen($this->username)==0 || !preg_match( '/[a-fA-F0-9]{128}/', $this->username)){
			header($_SERVER['SERVER_PROTOCOL'] . ' 412 Please provide username SHA512', true, 412);
			echo '';
			return false;
		}
		if(strlen($this->password)<=80){
			$this->password=hash('sha512',$this->password);
		}else if(strlen($this->password)==0 || !preg_match( '/[a-fA-F0-9]{128}/', $this->password)){
			header($_SERVER['SERVER_PROTOCOL'] . ' 412 Please provide password SHA512', true, 412);
			echo '';
			return false;
		}

	}
	public function deleteFileFromSafe($id)
	{
		$param[':id']=$id;
		$param[':modKey']=hash('sha512',$this->modKey);

		if($fileObj=Yii::app()->db->createCommand("SELECT safeBoxStorage.fileObjects FROM safeBoxStorage
		LEFT JOIN user ON user.id=safeBoxStorage.userId
		WHERE user.id=:id AND user.modKey=:modKey")->queryRow(true,$param))
		{
			$decodedHexObject=json_decode($fileObj['fileObjects'],true);
			unset($decodedHexObject[$this->fileId]);

			$parameters[':userId']=$id;
			$parameters[':fileObjects']=json_encode($decodedHexObject);

			if(Yii::app()->db->createCommand("UPDATE safeBoxStorage SET fileObjects=:fileObjects WHERE userId=:userId")->execute($parameters)){
				$result['result']='success';
				echo json_encode($result);
			}else{
				$result['result']='fail';
				echo json_encode($result);
			}

		}else{
			$result['result']='fail';
			echo json_encode($result);
		}
	}
	public function retrieveList($id)
	{
		$param[':id']=$id;
		$param[':modKey']=hash('sha512',$this->modKey);

		if($fileObj=Yii::app()->db->createCommand("SELECT safeBoxStorage.fileObjects FROM safeBoxStorage
		LEFT JOIN user ON user.id=safeBoxStorage.userId
		WHERE user.id=:id AND user.modKey=:modKey")->queryRow(true,$param))
		{
			$decodedHexObject=json_decode($fileObj['fileObjects'],true);
			foreach($decodedHexObject as $i=>$row){
				$userList[]=array(
					'index'=> $i,
					'name'=>$row['name'],
					'created'=>$row['created'],//isset($row['created'])?$row['created']:date('Y-m-d h:i'),
					'modified'=>$row['modified']
				);
			}
$result['response']='success';
			$result['data']=$userList;
			echo json_encode($result);

		}else{
			$result['response']='success';
			$result['data']=array();
			echo json_encode($result);
		}

	}

	public function fileWorks()
	{


		$correct=false;
		$par[':mailHash']=strtolower($this->username);
		if($user=Yii::app()->db->createCommand("SELECT user.id,user.mailHash,user.password,gd.filePerSafeBox FROM user
		LEFT JOIN user_groups ON user_groups.userId=user.id
		LEFT JOIN groups_definition as gd ON gd.id=user_groups.groupId
		 WHERE user.mailHash=:mailHash")->queryRow(true,$par)){
			if($user['password']==crypt(strtolower($this->password),$user['password']))
			{

				$correct=true;

			}else{
				header($_SERVER['SERVER_PROTOCOL'] . ' 401 User not found or password mismatch', true, 401);
				echo ' ';
				Yii::app()->end();
			}

		}else{
			header($_SERVER['SERVER_PROTOCOL'] . ' 401 User not found or password mismatch', true, 401);
			echo ' ';
			Yii::app()->end();
		}

		if($correct){
			if(isset($this->filename)){
				$fileBreak=explode('.',$this->filename);
				foreach($fileBreak as $row){
					$fname1[]=$row;
					if($row=='kdbx')
						break;
				}
				$fname=implode($fname1,'.');
			}

			if($this->action=='PUT'){
				if($userObj=Yii::app()->db->createCommand("SELECT fileObjects FROM safeBoxStorage WHERE userId=:id")->queryRow(true,array(':id'=>$user['id']))){
					$decodedHexObject=json_decode($userObj['fileObjects'],true);

					if(isset($decodedHexObject[hash('sha512',$fname)])){
						$decodedHexObject[hash('sha512',$fname)]['name']=base64_encode($fname);
						$decodedHexObject[hash('sha512',$fname)]['file']=base64_encode($this->file);
						$decodedHexObject[hash('sha512',$fname)]['modified']=date('Y-m-d h:i');

						header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
						echo ' ';

					}else if(count($decodedHexObject)<$user['filePerSafeBox']){

						$decodedHexObject[hash('sha512',$fname)]=array(
							'name'=>base64_encode($fname),
							'file'=>base64_encode($this->file),
							'modified'=>date('Y-m-d h:i'),
							'created'=>date('Y-m-d h:i')
						);
						header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
						//header($_SERVER['SERVER_PROTOCOL'] . ' 500 File Save Failed2', true, 500);
						echo ' ';
						//Yii::app()->end();
					}else if(count($decodedHexObject)>=$user['filePerSafeBox']){
						header($_SERVER['SERVER_PROTOCOL'] . ' 406 Maximum File limit of '.$user['filePerSafeBox'], true, 406);
						//header($_SERVER['SERVER_PROTOCOL'] . ' 500 File Save Failed4', true, 500);
						echo ' ';
						Yii::app()->end();
					}

					$parameters[':userId']=$user['id'];
					$parameters[':fileObjects']=json_encode($decodedHexObject);

					if(Yii::app()->db->createCommand("UPDATE safeBoxStorage SET fileObjects=:fileObjects WHERE userId=:userId")->execute($parameters)){

						header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
						//header($_SERVER['SERVER_PROTOCOL'] . ' 500 File Save Failed3', true, 500);
						echo ' ';
						Yii::app()->end();
					}else{
						header($_SERVER['SERVER_PROTOCOL'] . ' 500 File Save Failed', true, 500);
						echo ' ';
						Yii::app()->end();
					}

				}else{
					$userObj[hash('sha512',$fname)]=array(
						'name'=>base64_encode($fname),
						'file'=>base64_encode($this->file),
						'modified'=>date('Y-m-d h:i'),
						'created'=>date('Y-m-d h:i')
					);
					$parameters[':userId']=$user['id'];
					$parameters[':fileObjects']=json_encode($userObj);
					if(Yii::app()->db->createCommand("INSERT INTO safeBoxStorage (userId,fileObjects) VALUES(:userId,:fileObjects)")->execute($parameters)){
						header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
						echo ' ';
					}
				}
			}else if($this->action=='GET'){
				if($userObj=Yii::app()->db->createCommand("SELECT fileObjects FROM safeBoxStorage WHERE userId=:id")->queryRow(true,array(':id'=>$user['id']))){
					$decodedHexObject=json_decode($userObj['fileObjects'],true);

					if(isset($decodedHexObject[hash('sha512',$fname)])){

						$file=base64_decode($decodedHexObject[hash('sha512',$fname)]['file']);

						header("Cache-Control: public");
						header("Content-Description: File Transfer");
						header("Content-Disposition: attachment; filename=".$fname);
						header("Content-Type: octet/stream");
						header("Content-Transfer-Encoding: binary");
						echo $file;
						Yii::app()->end();

					}else{
						header($_SERVER['SERVER_PROTOCOL'] . ' 404 File not found', true, 404);
						echo ' ';
						Yii::app()->end();
					}

				}else{
					header($_SERVER['SERVER_PROTOCOL'] . ' 404 File not founds', true, 404);
					echo ' ';
					Yii::app()->end();
				}
			}else{
				header($_SERVER['SERVER_PROTOCOL'] . ' 200 OK', true, 200);
				echo ' ';
			}

		}else{
			header($_SERVER['SERVER_PROTOCOL'] . ' 500 Error Occurred', true, 500);
			echo ' ';
			Yii::app()->end();
		}

	}

}