<?php
/**
 * Created by JetBrains PhpStorm.
 * User: sak
 * Date: 4/19/15
 * Time: 1:09 PM
 * To change this template use File | Settings | File Templates.
 */

class MongoDBConnection extends CApplicationComponent {

	public $connectionString;

	public $options;

	public $db;

	public $autoConnect = true;

	/**
	 * The Mongo Connection instance
	 * @var Mongo MongoClient
	 */
	private $_mongo;

	/**
	 * The database instance
	 * @var MongoDB
	 */
	private $_db;

	private $_collection;
	private $connectOptions;

	/**
	 * The init function
	 * We also connect here
	 * @see yii/framework/base/CApplicationComponent::init()
	 */
	public function init()
	{
		parent::init();
		if($this->options['db']){
			$this->db=$this->options['db'];
			if($this->options['ssl']){
				$this->connectOptions['ssl']=$this->options['ssl'];
			}
			$this->connectOptions['db']=$this->options['db'];
		}

		if($this->autoConnect){
			$this->connect();
		}
	}

	/**
	 * Connects to our database
	 */
	public function connect()
	{
		if(!extension_loaded('mongo')){
			throw new EMongoException(
				yii::t(
					'yii',
					'We could not find the MongoDB extension ( http://php.net/manual/en/mongo.installation.php ), please install it'
				)
			);
		}
try {
		$this->_mongo = new MongoClient($this->connectionString, $this->connectOptions);
		$dbname=$this->db;
		$this->_db = $this->_mongo->$dbname;

		$this->_db->setWriteConcern($this->options['writeConcerns'], $this->options['wTimeoutMS']);
} catch (Exception $e) {

	throw new EMongoException(
		yii::t(
			'yii',
			'We could not find the MongoDB extension ( http://php.net/manual/en/mongo.installation.php ), please install it'
		)
	);
}

	}

	/**
	 * Gets the connection object
	 * Use this to access the Mongo/MongoClient instance within the extension
	 * @return Mongo MongoClient
	 */
	public function getConnection()
	{
		if(empty($this->_mongo)){
			$this->connect();
		}
		return $this->_mongo;
	}

	public function setCollection($name)
	{
		return  $this->_db->$name;
	}

	public function findOne($collectionName,$data,$selectFields=array())
	{

		if($reference = $this->setCollection($collectionName)->findOne($data,$selectFields))
		{
			$result=$reference;
			$result['_id']=(string)$reference['_id'];
		}

		return isset($result)?$result:null;

	}


	public function findAll($collectionName,$data,$selectFields=array())
	{

		$reference = $this->setCollection($collectionName)->find($data,$selectFields);

		foreach ($reference as $i=>$doc)
		{
			$result[$i]=$doc;
			$result[$i]['_id']=$i;
		}


		return isset($result)?$result:null;

	}

	public function findById($collectionName,$id,$selectFields=null)
	{
		$query = array(
			'_id' => new MongoId($id)
		);
		$reference=$this->setCollection($collectionName)->find($query,$selectFields);

		foreach ($reference as $i=>$doc){
			$result=$doc;
			$result['_id']=$i;
		}


		return isset($result)?$result:null;
	}


	public function findByUserId($collectionName,$userId)
	{
		$query = array(
			'userId' => (int) $userId
		);

		$reference = $this->setCollection($collectionName)->find($query);

		foreach ($reference as $doc)
			$result[]=$doc;

		return isset($result)?$result:null;

	}

	public function findByManyIds($collectionName,$arrayOfIds,$selectFields=null)
	{
		$query = array(
			'_id' =>array('$in'=>$arrayOfIds)
		);

		$reference = $this->setCollection($collectionName)->find($query,$selectFields);

		foreach ($reference as $i=>$doc){
			$result[$i]=$doc;
			$result[$i]['_id']=$i;

		}

		return isset($result)?array_values($result):null;

	}


	public function generateSlots($collectionName,$userId,$slotAmount) //pregenerate for email insert
	{
		if($slotAmount>0 && isset($userId)){

			for($i=0;$i<$slotAmount;$i++)
				$query[]=array("userId" => (int)$userId, 'removeIn'=>new MongoDate(strtotime('now')));

			$reference = $this->setCollection($collectionName)->batchInsert($query);

			foreach ($query as $doc)
				$result[]=(string)$doc['_id'];

		}

		return isset($result)?$result:null;

	}

	public function removeAll($collectionName,$data)
	{
		$reference = $this->setCollection($collectionName)->remove($data);

		return $reference;
		return isset($reference['err'])?false:true;
	}

	public function removeById($collectionName,$id)
	{

		$reference = $this->setCollection($collectionName)->remove(array('_id' => new MongoId($id)));

		return isset($result)?$result:null;

	}


	public function insert($collectionName,$dataArray,$optionsArray=array())
	{

		if(is_array($dataArray)){

			$reference = $this->setCollection($collectionName)->batchInsert($dataArray,$optionsArray);

			foreach ($dataArray as $doc)
				$result[]=(string)$doc['_id'];

		}
	unset($dataArray,$reference);
		return isset($result)?$result:null;

	}

	public function update($collectionName,$dataArray,$criteria)
	{

		if(is_array($dataArray)){

			$reference=$this->setCollection($collectionName)->update($criteria,$dataArray);
		}

		if(isset($reference) && $reference['nModified']>=1)
		{
			return true;
		}else
			return false;


	}

	/**
	 * You should never call this function.
	 * The PHP driver will handle connections automatically, and will
	 * keep this performant for you.
	 */
	public function close()
	{
		if(!empty($this->_mongo)){
			$this->_mongo->close ();
			return true;
		}
		return false;
	}
}