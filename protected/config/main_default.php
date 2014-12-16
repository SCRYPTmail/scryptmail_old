<?php

// uncomment the following to define a path alias
// Yii::setPathOfAlias('local','path/to/local-folder');

// This is the main Web application configuration. Any writable
// CWebApplication properties can be configured here.
return array(
	'basePath' => dirname(__FILE__) . DIRECTORY_SEPARATOR . '..',
	'name' => 'SCRYPTmail.com',
	//'defaultController' => 'site',

	// preloading 'log' component
	'preload' => array('log'),

	// autoloading model and component classes
	'import' => array(
		'application.models.*',
		'application.components.*',
	),

	'modules' => array(// uncomment the following to enable the Gii tool

	),

	// application components
	'components' => array(
		'user' => array(
			// enable cookie-based authentication
			'allowAutoLogin' => true,
			'class' => 'WebUser',
			'loginUrl' => array('login'),

		),
		'cache' => array(
			'class' => 'system.caching.CDbCache',
			'connectionID' => 'db',
			'autoCreateCacheTable' => true,
			'cacheTableName' => 'cache_data',
		),
		'session' => array(
			'sessionName' => 'sessionname',
			'class' => 'application.components.MyDbHttpSession',
			'autoStart' => 'false',
			'cookieMode' => 'only',
			'connectionID' => 'db',
			'sessionTableName' => 'cache_session',
			'autoCreateSessionTable' => true,
			'cookieParams' => array(
				'httponly' => true,
			),
		),
		'request'=>array(
			'enableCookieValidation'=>true,
		),
		'urlManager' => array(
			'urlFormat' => 'path',
			'showScriptName' => false,
			'rules' => array(
				'<action:\w+>/<id:\w+>' => 'site/<action>',
				'<action:\w+>/<fileName:.*>' => 'site/<action>', //safebox
				'<action:\w+>/<id:\w+>/*' => 'site/<action>',
				'<action:\w+>' => 'site/<action>',
				'<controller:\w+>/<id:\d+>' => '<controller>/view',
				'<controller:\w+>/<action:\w+>/<id:\d+>' => '<controller>/<action>',
				'<controller:\w+>/<action:\w+>' => '<controller>/<action>',
				'<fileName:.*>' => 'site/index', //bots
			),
		),

		'db' => array(
			'connectionString' => 'mysql:host=localhost;dbname=encrypted',
			'emulatePrepare' => true,
			'username' => 'user',
			'password' => 'password',
			'charset' => 'utf8',
			'class' => 'CDbConnection',
			//'enableProfiling'=>true,
			'enableParamLogging' => true,
			'schemaCachingDuration' => '100',
		),

		'errorHandler' => array(
			// use 'site/error' action to display errors
			'errorAction' => 'site/error',
		),
		'log' => array(
			'class' => 'CLogRouter',
			'routes' => array(
				array(

					'class' => 'CProfileLogRoute',
					'enabled' => false,
					//'levels' => 'profile,error,warning,notice,trace',
					'filter' => 'CLogFilter',
					//'ignoreAjaxInFireBug'=>false,
				),
				// uncomment the following to show log messages on web pages

				array(
					'class' => 'CWebLogRoute',
					'levels' => 'error, warning, info',
				),

			),
		),
	),

	// application-level parameters that can be accessed
	// using Yii::app()->params['paramName']
	'params' => array(
		// this is used in contact page
		'params' => include(dirname(__FILE__) . '/params.php'), //<– our internal params
		'adminEmail' => 'admin@example.com',
		'production' => false
	),
);