<?php
/**
 * User: Sergei Krutov
 * https://scryptmail.com
 * Date: 11/29/14
 * Time: 3:28 PM
 */

class DeleteAccount extends CFormModel
{
	public $usermodKey;

	public function rules()
	{
		return array(
			array('usermodKey', 'required'),
			array('usermodKey', 'match', 'pattern'=>'/^([a-f0-9_])+$/', 'message'=>'please provide correct hash'),

		);
	}

	public function removeAccount($id)
	{
		$trans = Yii::app()->db->beginTransaction();
		$param[':id']=$id;
		$param[':modKey']=hash('sha512',$this->usermodKey);

		if(Yii::app()->db->createCommand("DELETE FROM user WHERE id=:id AND modKey=:modKey")->execute($param)){
			unset($param[':modKey']);
			if(Yii::app()->db->createCommand("DELETE FROM addresses WHERE userId=:id")->execute($param)){
				if(Yii::app()->db->createCommand("DELETE FROM user_groups WHERE userId=:id")->execute($param)){
					if(Yii::app()->db->createCommand("DELETE FROM user_group_history WHERE userId=:id")->execute($param)){
						Yii::app()->db->createCommand("DELETE FROM safeBoxStorage WHERE userId=:id")->execute($param);
						Yii::app()->db->createCommand("DELETE FROM virtual_domains WHERE userId=:id")->execute($param);
						$trans->commit();
						echo  '{"results":"success"}';

					}else{
						echo  '{"results":"failed"}';
						$trans->rollback();
					}

				}else{
					echo  '{"results":"failed"}';
					$trans->rollback();
				}

			}else{
				echo  '{"results":"failed"}';
				$trans->rollback();
			}

		}else{
			echo  '{"results":"failed"}';
			$trans->rollback();
		}


	}


}