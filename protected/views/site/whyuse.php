<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm */

?>
<body class="animated fadeInDown">

<header id="header">


	<span id="logo"> <img src="img/scriptmail_logo.png" style="width:180px;" alt="<?php echo Yii::app()->name; ?>"> </span>


	<span id="extr-page-header-space"> <span class="hidden-mobile"></span> <a href="login"
																			  class="btn btn-default">Sign
			In</a> <a href='createUser'
																							  class="btn btn-danger">Create
			account</a> </span>

</header>

<div id="main" role="main">

	<!-- MAIN CONTENT -->
	<div id="content" class="container">

		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">
				<h1 class="txt-color-red login-header-big"><?php echo Yii::app()->name; ?></h1>


					<h3>How will I use SCRYPTmal?</h3>
					<p>Just like normal email, it works on any device, that can run chrome browser. We just have few "enhancements" that help with security.</p>

					<div class="well well-lg text-left col col-sm-12 col-lg-5" style="margin-right:20px;border:0px solid;">
						<h5 class="about-heading">Emailing between SCRYPTmail users</h5>

						<p>
							SCRYPTmail users have a 2-step verification process when they log in.
						<ul>
							<li> Password verification</li>
							<li>Secret Phrase verification</li>
						</ul>
						</p>
						<p>
							Every SCRYPTmail user will need to complete the 2-step verification process in order to send and read emails.
							Therefore, when you send an email to a SCRYPTmail user, they will receive it in their inbox and can open it without any additional passwords or codes (since they already passed their 2-step verification)
						</p>
					</div>
					<div class="well well-lg text-left col col-sm-12 col-lg-6" style="border:0px solid;">
						<h5 class="about-heading">Emailing to non-SCRYPTmail users</h5>

						<p>
							When you email a person that is using a third-party email server (like gmail or hotmail), they may receive 2 different types of email.
						<ul>
							<li> Clear text - unsecured type</li>
							<li> Password protected email, as a link to SCRYPTmail server </li>
						</ul>
						</p>
						<p> Clear text message will be deleted from our server immediately after delivery.<br>
							Encrypted message will require PIN to unlock and decrypt email, that you provide via another means of communication like a phone call, text or in person. </p><p>
							Attachments will be sent as link to download from SCRYPTmail server to enhance privacy, when server or server administrators can read or scan your attachments. Encrypted message will be stored for 14 days, and deleted regardless it was opened or not.
						</p>

					</div>


			</div>

		</div>
		<div class="row" style="margin-top:100px;">
			<div class="col-lg-12 text-align-center">
				<span class="txt-color-black">SCRYPTmail © 2014 - </span>
				<a href="/termofservice" target="_blank"><span class="txt-color-black">Term of Service</span></a>

				<a href="/privacypolicy" target="_blank"><span class="txt-color-black">Privacy Policy</span></a>


			</div>

		</div>


	</div>
</div>


<!--[if IE 8]>
<h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>
<![endif]-->

</body>
