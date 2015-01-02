<!DOCTYPE html>
<html lang="en-us" id="extr-page">
<head>
	<meta charset="utf-8">
	<title><?php echo Yii::app()->name; ?></title>
	<meta name="description" content="Scryptmail - Privacy is your right, not a privilege. Our service easy to use and provide superior protection for your emails">
	<meta property="og:title" content="Scryptmail - Encrypted and private email service"/>
	<meta property="og:image" content="https://scryptmail/img/favi.png"/>
	<meta property="og:description" content="Scryptmail - Privacy is your right, not a privilege. Our service easy to use and provide superior protection for your emails"/>

	<meta name="author" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

	<!-- #FAVICONS-->
	<link rel="shortcut icon" href="/img/favicon/favicon.ico" type="image/x-icon">
	<link rel="icon" href="/img/favicon/favicon.ico" type="image/x-icon">

</head>
<body class="animated">
<header id="header">


	<span id="logo"><a href="/"> <img src="/img/scriptmail_logo.png" alt="<?php echo Yii::app()->name; ?>"></a></span>

	<span id="extr-page-header-space"> <a href='/createUser'
										  class="btn btn-danger">Create
			account</a> </span>

</header>
<div id="main" role="main">
	<!--[if IE 8]>
	<h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download.<br> Or use Google Chrome / Firefox</h1>
	<![endif]-->
	<div id="incomp" class="alert alert-warning fade in" style="display:none;">
		<button class="close" data-dismiss="alert">
			×
		</button>
		<i class="fa-fw fa fa-warning"></i>
		<strong>Warning: </strong><span></span>
	</div>
	<!-- MAIN CONTENT -->
	<div id="content" class="container">

<?php echo $content; ?>
	</div>
	<div class="" style="margin-top:100px;">
		<div class="row">
			<div class="col-lg-12 text-align-center">
				<span class="txt-color-black">SCRYPTmail © 2015 - </span>
				<a href="/TermsAndConditions" target="_blank"><span class="txt-color-black">Terms And Conditions</span></a>
|
				<a href="/privacypolicy" target="_blank"><span class="txt-color-black">Privacy Policy</span></a>
|
				<a href="/submitBug" target="_blank""><span id="add" class="" data-title="add">Report bug</span></a>
|
				<a href="/canary" target="_blank""><span id="add" class="" data-title="add">Canary</span></a>

			</div>

		</div>
		<!-- end row -->
	</div>
</div>

</div>

<script type="text/javascript">

	$( document ).ready(function() {
		isCompatible();
	});

</script>
</body>
</html>