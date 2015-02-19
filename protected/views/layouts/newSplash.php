<!doctype html>
<html lang="en">


<head>
	<meta charset="utf-8">
	<title><?php echo Yii::app()->name; ?></title>
	<meta name="description" content="SCRYPTmail - Privacy is your right, not a privilege. Our service is easy to use and provides superior protection for your emails.">
	<meta property="og:title" content="SCRYPTmail - Encrypted and private email service"/>
	<meta property="og:image" content="https://scryptmail/img/favi.png"/>
	<meta property="og:description" content="SCRYPTmail - Privacy is your right, not a privilege. Our service is easy to use and provides superior protection for your emails."/>

	<meta name="author" content="">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">

	<!-- #FAVICONS-->
	<link rel="shortcut icon" href="/img/favicon/favicon.ico" type="image/x-icon">
	<link rel="icon" href="/img/favicon/favicon.ico" type="image/x-icon">


	<!-- =========================
	 FAV AND TOUCH ICONS AND FONT
	 ============================== -->
	<link rel="stylesheet" href="/css/animate.min.css">

	<!-- RESPONSIVE FIXES -->
	<link rel="stylesheet" href="/css/responsive.css">

	<!--[if lt IE 9]>
	<script src="/js/html5shiv.min.js"></script>
	<![endif]-->
	<!--[if gte IE 9]>
	<style type="text/css">
		.standard-button,
		.navbar-register-button {
			filter: none;
		}
	</style>
	<![endif]-->
	<!-- ****************
	  After neccessary customization/modification, Please minify HTML/CSS according to http://browserdiet.com/en/ for better performance
	  **************** -->
</head>
<body>

<!-- =========================
 PRE LOADER
 ============================== -->
<div class="preloader">
	<div class="status">
		&nbsp;
	</div>
</div>
<!-- =========================
 SECTION: HOME / HEADER
 ============================== -->
<header class="header" data-stellar-background-ratio="1" id="home">

	<!-- COLOR OVER IMAGE -->
	<div class="overlay-layer">

		<!-- STICKY NAVIGATION -->
		<div class="navbar navbar-inverse bs-docs-nav navbar-fixed-top sticky-navigation" role="navigation">
			<div class="container">
				<div class="navbar-header">

					<!-- LOGO ON STICKY NAV BAR -->
					<button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#stamp-navigation">
						<span class="sr-only">Toggle navigation</span>
						<i class="fa fa-reorder"></i>

					</button>

					<!-- LOGO -->
					<a class="navbar-brand" href='/'>
						<img style='max-width: 150px; position: relative; top: -10px;' src="/img/scriptmail_logo.png" alt="">
					</a>

				</div>

				<!-- TOP BAR -->
				<div class="navbar-collapse collapse" id="stamp-navigation">

					<!-- NAVIGATION LINK -->
					<ul class="nav navbar-nav navbar-left main-navigation small-text">
						<li><a href='#why' onclick='scrollToPosition($("#why").offset())'>why</a></li>
						<li><a href='#aboutUs' onclick='scrollToPosition($("#aboutUs").offset())'>about us</a></li>
						<li><a href='http://blog.scryptmail.com'>blog</a></li>
						<li><a href='http://blog.scryptmail.com/2015/01/how-to-use-scryptmail.html'>how to use</a></li>

						<!-- <li><a href="http://example.com" class="external">External Link Example</a></li> -->
					</ul>

					<?php if(Yii::app()->request->url=='/login' || Yii::app()->request->url=='/login/'){
					?>
						<ul class="nav navbar-nav navbar-right login-register small-text">
							<li class="login js-login"><a href="" data-toggle="modal" data-target="#login-modal">Login</a>
							</li>
							<li class="register-button js-register inpage-scroll"><a href="" class="navbar-register-button" data-toggle="modal" data-target="#createAccount-modal">Sign Up For Free</a>
							</li>
						</ul>
					<?php }else{ ?>
						<ul class="nav navbar-nav navbar-right login-register small-text">
							<li class="login"><a href=""  data-toggle="modal" data-target="#login-modal">Login</a>
							</li>
						</ul>
					<?php } ?>
					<!-- LOGIN REGISTER -->


				</div>
			</div>
			<!-- /END CONTAINER -->
		</div>
		<!-- /END STICKY NAVIGATION -->

		<?php if(Yii::app()->request->url=='/login' || Yii::app()->request->url=='/login/'){
			?>
			<!-- CONTAINER -->
			<div id="incomp" class="alert alert-warning fade in" style="display:none;">
				<button class="close" data-dismiss="alert">
					×
				</button>
				<i class="fa-fw fa fa-warning"></i>
				<strong>Warning: </strong><span></span>
			</div>
			<div class="container">

				<div class="row">
					<div class="col-md-12">

						<!-- HEADING AND BUTTONS -->
						<div class="intro-section">

							<!-- WELCOM MESSAGE -->
							<h1 class="intro white-text">Privacy Is Your Right</h1>
							<h5 class="white-text">end-to-end encrypted email with no stored meta data
								</h5>

							<!-- BUTTON -->
							<div class="button">
								<a  href="" data-toggle="modal" data-target="#createAccount-modal" class="btn btn-primary standard-button inpage-scroll">Sign Up For Free</a>
							</div>

						</div>
						<!-- /END HEADNING AND BUTTONS -->

						<div class="browser-image">
							<img src="/img/screenshots/compose.png" class="wow fadeInUp" data-wow-duration="1s" alt="">
						</div>

					</div>
				</div>
			</div>

		<?php } ?>

</header>

<?php echo $content; ?>


<!-- REGISTRATION FORM FOR POPUP BOX -->
<div class="modal fade bs-example-modal-sm" id="createAccount-modal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="vertical-registration-form">
				<h4 class="dark-text form-heading">Create An Account</h4>
				<form class="registration-form smart-form" id="createUser-form">
					<div style='position:relative;'>

						<div class="text-align-left">
						<label class="input">
							<input class="input-box" placeholder="email" maxlength="160"  style="padding-right:150px;"
								   name="email" id="CreateUser_email" type="text">
							<span style="position:absolute;top:5px;right:10px;padding:6px;">@scryptmail.com</span>
						</label>
						</div>



						<div class="text-align-left">
						<label class="input">
							<input  class="input-box" name="CreateUser[password]" id="CreateUser_password" type="password" placeholder="password">
						</label>
						</div>
						<div class="text-align-left">
						<label class="input">
							<input  class="input-box" name="CreateUser[passwordrepeat]" id="CreateUser_passwordrepeat" type="password" placeholder="repeat password">
						</label>
						</div>

						<div style="clear:both;"></div>

						<section class="text-align-left">
							<label class="checkbox" id="terError">
								By clicking Register, I agree with the <a href="/TermsAndConditions" target="_blank"> Terms
									and Conditions </a></label>

						</section>

					</div>

					<button  id='reguser' class="btn btn-primary standard-button" type="button" onclick="createAccount();">Create</button>
				</form>
			</div>
		</div>
	</div>
</div>

<!-- Login FORM FOR POPUP BOX -->
<div class="modal fade bs-example-modal-sm" id="login-modal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="vertical-registration-form">
				<h4 class="dark-text form-heading">Login</h4>

				<div class="registration-form smart-form" id="contact-form" id="login-form" onkeydown="if (event.keyCode == 13) submitLogin();"  autocomplete="off">

					<div style='position:relative;'>
									<label class="input">
										<input class="input-box" placeholder="email" maxlength="160"  style="padding-right:150px;"
											   name="email" id="LoginForm_username" type="text">
										<span style="position:absolute;top:5px;right:10px;padding:6px;">@scryptmail.com</span>
									</label>




							<label class="input">
								<input  class="input-box" name="pP" id="LoginForm_password" type="password" placeholder="password">
							</label>

							<a href="/forgotPassword" class="pull-left" style="margin-top:-10px;">Forgot password?</a>

					</div>
					<br>
					<button class="btn btn-primary standard-button" type="button" onclick="submitLogin();" name="yt0">Login</button>
					<div style="margin-top:20px;">
					<a href="http://blog.scryptmail.com/2014/11/scryptmail-browser-compatibility.html" target="_blank"> Supported Browsers</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>



<div class="modal fade bs-example-modal-sm" id="reportBug-modal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<div class="vertical-registration-form">
				<h4 class="dark-text form-heading">Contact US</h4>
				<form class="report-form" id="report-form" action="/submitBug" method="POST">
						<section class="text-align-left">

						<label class="input col col-xs-12">
							<input type="name" name="name" placeholder="name" id="hname">
							<input type="email" name="email" class="form-control input-box" placeholder="Email to contact">
						</label>

						</section>
							<section class="text-align-left">
						<label class="select col col-xs-12">
							<select name="os" class="form-control input-box">
								<option value="0" selected="" disabled="">Operating System</option>
								<option value="Windows">Windows</option>
								<option value="Linux">Linux</option>
								<option value="Mac OC">Mac OC</option>
								<option value="Other">Other</option>
							</select> <i></i>
						</label>
							</section>
								<section class="text-align-left">
							<label class="select col col-xs-12">
									<select name="device" class="form-control input-box">
										<option value="0" selected="" disabled="">Device</option>
										<option value="Desktop">Desktop</option>
										<option value="Tablet">Tablet</option>
										<option value="Smartphone">Smartphone</option>
										<option value="Other">Other</option>
									</select>
							</label>
								</section>
									<section class="text-align-left">
									<label class="textarea col col-xs-12">
							<textarea class="form-control textarea-box placeholder" rows="5" name="comment" placeholder="Please explain problem (1000 max)"></textarea>
							</label>
						</section>

					</div>
					<button class="btn btn-primary standard-button" type="button" onclick="submitBug();">Submit</button>
				</form>
			</div>
		</div>
	</div>
</div>


<div class="modal fade bs-example-modal-sm" id="yModal" tabindex="-1" role="dialog" aria-hidden="true">
	<div class="modal-dialog modal-md">
		<div class="modal-content">
			<h4 class="modal-title" id="yModalLabel">Thank you for registration!</h4>

			<div class="modal-body custom-scroll terms-body">

				<div id="left">
					<!--Please login to your account.-->
					Before logging in, please <b>download the secret token</b>. You will need this token to reset your password or secret phrase. You can read more about it in our <a href="http://blog.scryptmail.com/2014/11/guide-to-reset-secret-phrase-password.html" target="_blank">blog</a>.<br><br>
					<span class="text-danger" style="display:none;" id="browsfailed"><i class="fa fa-warning"></i> Some browsers are not able to save the generated file, and this message will show. Please save this string into file:<br> <b class="text-default" style="word-break:break-all;"></b></span>
				</div>

					<button class="btn btn-primary standard-button" id="token" type="button" onclick="downloadToken();" style="margin-bottom:20px;"><i class="fa fa-save"></i> Download Token</button>


					<button class="btn btn-primary standard-button" type="button"  data-toggle="modal" data-target="#yModal"><i class="fa fa-check"></i> Ok</button>


			</div>

		</div>
	</div>
</div>

<!-- FOOTER -->
<footer class="footer grey-bg">
	©2015 SCRYPTMail

	<!-- OPTIONAL FOOTER LINKS -->
	<ul class="footer-links small-text">
		<li><a href="/TermsAndConditions" class="dark-text">Terms</a>
		</li>
		<li><a href="/privacypolicy" class="dark-text">Privacy</a>
		</li>
		<li><a href="" data-toggle="modal" class="dark-text" data-target="#reportBug-modal">Report</a>
		</li>
		<li><a href="/canary" class="dark-text">Canary</a>
		</li>
	</ul>

	<!-- SOCIAL ICONS -->
	<ul class="social-icons">
		<li><a href="https://twitter.com/scryptmail" target="_blank"><span class="iconsplash-social-twitter transparent-text-dark"></span></a>
		</li>
	</ul>

</footer>

<!-- =========================
 SCRIPTS
 ============================== -->

<script>

	$( document ).ready(function() {
		isCompatible();
	});
	/* PRE LOADER */
	jQuery(window).load(function() {
		"use strict";
		jQuery(".status").fadeOut();
		jQuery(".preloader").delay(500).fadeOut("slow");

	});

	function scrollToTop(){
		$('html, body').animate({
			scrollTop: 0
		});
	}

	function scrollToPosition(position){
		if(!position){
			return;
		}
		$('html, body').animate({
			scrollTop: position.top
		});
	}


</script>
<script src="/js/custom.js"></script>

</body>

</html>