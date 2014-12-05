<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm */

?>
<body class="animated fadeInDown">

<header id="header">


	<span id="logo"><a href="/"> <img src="img/scriptmail_logo.png" alt="<?php echo Yii::app()->name; ?>"></a></span>

	<span id="extr-page-header-space"> <a href='createUser'
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

		<div class="row">

			<div class="col-xs-12 col-sm-12 col-md-7 col-lg-8">
				<h1 class="txt-color-red login-header-big">Welcome to scryptmail.com</h1>

				<div class="hero">

					<div class="pull-left">
Privacy is your right, not a privilege<br>
						<?php if($time){
						?>
							<h2 class="paragraph-header txt-color-green">
								We are open and welcome you to try our new service!

							</h2>
							Feel free to read about our service, but Hurry! We have limited registration.

						<?php }else{ ?>
							<h4 class="paragraph-header">
								Our beta registration is currently closed.<br> Please request an invitation or follow us on twitter for updates. <br> We will invite new users, based on our server availability</h4>
						<?php } ?>

						<div class="login-app-icons">
							<a href="http://blog.scryptmail.com/post/103536268805/scryptmail-features" target="_blank" class="btn btn-primary btn-sm">Why we are different</a>
							<a href="http://blog.scryptmail.com" target="_blank" class="btn btn-primary btn-sm" style="margin-left:20px;">Blog</a>
						</div>
					</div>

				</div>

		</div>

			<div class="col-xs-12 col-sm-12 col-md-5 col-lg-4">
				<div class="well no-padding">
					<div class="smart-form client-form" id="login-form" onkeydown="if (event.keyCode == 13) submitLogin();">

						<header>
							Sign In
							<h5 style="margin-top:10px;"><small><a href="http://blog.scryptmail.com/post/103842937050/scryptmail-browser-compatibility" target="_blank"> Supported Browsers</a></small></h5>
						</header>

						<fieldset>

							<section>
								<label class="input ">
									<div class="input-group">
										<input type="text" name="uN" id="LoginForm_username" placeholder="email">
										<span class="input-group-addon" id="cremail">@scryptmail.com</span>
									</div>
								</label>


							</section>

							<section>

								<label class="input ">
									<i class="icon-append fa fa-lock"></i>
									<input name="pP" id="LoginForm_password" type="password" placeholder="password">

							</section>
							<div class="note">
								<a href="/forgotPassword">Forgot password?</a>
							</div>

						</fieldset>
						<footer>


							<input class="btn btn-primary" onclick="submitLogin();" name="yt0" type="button" value="Sign in">
						</footer>

					</div>

				</div>

				<div><a href="https://twitter.com/scryptmail" target="_blank" class="twitter-follow-button pull-right btn btn-default btn-xs" data-show-count="false"><i class="fa fa-twitter txt-color-blue"></i> Follow us @scryptmail</a></div>
			</div>
		</div>



		<div class="row" style="text-align:center;margin-top:40px;margin-bottom:40px;">
		<div class="well col col-lg-12 text-align-left" style="border:0px solid;">
			<h2><i class="fa fa-bell-o text-warning"></i> Daily updates</h2>
			<a href="http://blog.scryptmail.com/post/103537538335/feature-request">Recommend new feature</a><br>
			Dec,5 <ul>
				<li>Beta registration is closed.</li>
				<li>All current accounts awarded with Advanced plan.</li>

			</ul>
			Dec,4 <ul>
				<li>Custom Folders is here! Extra options with right click or long press for smartphones</li>
				<li>Firefox bug with opening email is fixed.</li>
			</ul>

			<a href="http://blog.scryptmail.com/private/103537130180/tumblr_nfl3u9uT3n1u3cx2k" target="_blank">Older updates</a>

		</div>
		</div>

		<div class="row" style="text-align:center;">



			<h1> Why SCRYPTmail?</h1>
			<div class="row">


					<div class="well col col-lg-10 text-align-left pull-left">
						<h2><span class="glyphicon glyphicon-heart-empty text-danger"></span> Genuine</h2>
			<h5>We promise not to confuse or misrepresent your security risks</h5>
						<p>Trust is cornerstone of any business, but many companies fall short by trying to emphasize benefits and hide downsides. We promise to be clear and open as we can to provide you objective information about our technologies.  </p>
						</div>


					<div class="well col col-lg-10 text-align-left pull-right">
						<h2><span class="glyphicon glyphicon-eye-close"></span> Private</h2>
						<h5>Your email and data encrypted from the beginning, with secret phrase that never leaves your computer, so we can't scan or read your emails</h5>
						<p>SCRYPTmail users have a 2-step verification process to access your account.
						<ul>
							<li>Password verification</li>
							<li>Secret Phrase verification</li>
						</ul>
						Every SCRYPTmail user will need to complete the 2-step verification process in order to send and read emails. </p>
					</div>
				<div class="col col-lg-12 text-align-center">
				<span class="btn btn-info" id="rdm" onclick='$("#morepriv" ).slideToggle( "slow", function(){$( "#rdm" ).remove();});'> Read more</span>
				</div>
</div>
				<div class="row" id="morepriv" style="height:0px;display:none;">

					<div class="well col col-lg-10 text-align-left pull-left">
						<h2><i class="fa fa-times txt-color-red"></i> No scripts from third party servers</h2>
						<h5>Protect yourself</h5>
						<p>Ever wonder who knows you are here?</p>
						We deliver all scripts from our servers. No Google Analytics, Facebook or twitter. When such scripts can be useful for us as service to track usage, they leak user information, location and more.
					</div>

					<div class="well col col-lg-10 text-align-left pull-right">
						<h2> PGP standards and NIST recommendations</h2>
						<h5>Standard protocol to exchange public keys between users</h5>
						<p>Email you about to send, will be encrypted by AES with random 256 bit key, and key encrypted with public key of intended recipient, so only person having corresponding private key will be able to decrypt it. We use only open source encryption libraries, to ensure public audit.</p>
					</div>



					<div class="well col col-lg-10 col-md-12 col-sm-12 text-align-left pull-left">
						<h2>Grade <strong class="text-success">A</strong> HTTPS encryption *</h2>
						<h5>Heartbleed attack? POODLE or BEAST? - We got you covered</h5>
						<p>We are regularly testing our service with third party security services, to ensure up to date communication protection<br>
						* Based on Qualys SSL <a href="https://www.ssllabs.com/ssltest/index.html" target="_blank">evaluation</a>. </p>
					</div>

					<div class="well col col-lg-10 text-align-left pull-right">
						<h2>Anonymous</h2>
						<h5>Can you be truly anonymous on internet?</h5>
						<p>Unfortunately answer is no. In order to establish connection with server, you have to provide IP address, that can be tracked back to your computer. It does not matter if we store logs or not, your provider does that.</p>
					</div>

					<div class="well col col-lg-10 text-align-left pull-left">
						<h2>Freedom and Simplicity</h2>
						<h5>Who told you, that privacy should be compromised for simplicity?</h5>
						<p>We spent a lot of time making simple but well protected tool. We won't overwhelm you with knobs and switches, but we won't repel you either. Features added to your settings panel, and have default values until you decide to change them.<br> We also give you access to regenerate your RSA keys anytime you want, or even let you save them offline</p>
					</div>

					<div class="well col col-lg-10 text-align-left pull-right">
						<h2>Communication with Gmail or YAHOO</h2>
						<h5>Send email in clear text or encrypted</h5>
						<p>Clear text message will be deleted from our servers immediately after successful delivery to the recipient domain.
							Encrypted message will require PIN to unlock and decrypt email, that you provide via another means of communication like a phone call, text or in person.</p>
					</div>


					<div class="well col col-lg-10 text-align-left pull-left">
						<h2>Encrypted</h2>
						<h5>We mean it, no half measures. Your message encrypted from start to finish</h5>
						<p>Many similar services advertise email encryption, but not all of them truly encrypt your email. Attachments, recipients, other metadata often left in clear text. We encrypt all of it.*
						<br>
						* Not applicable if you sending email to third servers.</p>
					</div>



			</div>


		</div>
		<div class="" style="margin-top:100px;">
			<div class="row">
				<div class="col-lg-12 text-align-center">
					<span class="txt-color-black">SCRYPTmail © 2014 - </span>
					<a href="/termofservice" target="_blank"><span class="txt-color-black">Term of Service</span></a>

					<a href="/privacypolicy" target="_blank"><span class="txt-color-black">Privacy Policy</span></a>

					<a href="/submitBug" target="_blank""><span id="add" class="" data-title="add">Report bug</span></a>

				</div>

			</div>
			<!-- end row -->
		</div>
	</div>

</div>


<!--[if IE 8]>
<h1>Your browser is out of date, please update your browser by going to www.microsoft.com/download</h1>
<![endif]-->
</body>
