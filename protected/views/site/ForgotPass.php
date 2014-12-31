<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm */
?>

		<div class="col-xs-12 col-sm-12 col-md-6 col-lg-6 col-md-offset-3 col-lg-offset-3">
			<div class="well no-padding">

				<form class="smart-form client-form" id="resetPass-form" onkeydown="if (event.keyCode == 13) resetForgotPass();" method="POST">

					<header>
						Reset Password
						<h5 style="margin-top:10px;">

							<small>Please follow the order</small></h5>
					</header>

					<fieldset>
						<section>

							<label class="input ">
								<i class="icon-append fa fa-eye-slash"></i>
								<input name="pema" id="resetPass_email" type="email" placeholder="1. email address">
							</label></section>

						<section>
						<section>
							<label for="file" class="input input-file">
								<div class="button">
									<input type="file" name="file" id="tokenField" onchange="verifyToken();">Browse
								</div>
								<input type="text" name ='secTok' id="showToken" placeholder="2. secret token" readonly="">
							</label>
							<div class="note">
								<a href="http://blog.scryptmail.com/2014/11/guide-to-reset-secret-phrase-password.html" target="_blank">Secret what?</a>
							</div>
						</section>

						<section>

							<label class="input ">
								<i class="icon-append fa fa-eye-slash"></i>
								<input name="psec" id="resetPass_secret" type="password" placeholder="3. secret phrase">

							</label></section>


					</fieldset>
					<fieldset>
						<section>
							<label class="input ">
								<i class="icon-append fa fa-lock"></i>
								<input name="ppas" id="resetPass_password" type="password" placeholder="4. new password">

							</label></section>
						<section>

							<label class="input ">
								<i class="icon-append fa fa-lock"></i>
								<input name="ppasrep" id="resetPass_passwordRepeat" type="password" placeholder="5. repeat new password">

							</label></section>

					</fieldset>
					<footer>

						<button id='resetPassButton' class="btn btn-primary" onclick="resetForgotPass();" name="yt0" type="button">Reset Password</button>
					</footer>

				</form>

			</div>
		</div>

<script>
	$(document).ready(function () {
		initialResetPassword();
	$("[rel=popover]").popover();
		$('#extr-page-header-space').html('<span id="extr-page-header-space"> <span class="hidden-mobile"></span> <a href="login" class="btn btn-default">Sign In</a> </span>');

	});
	</script>
</body>