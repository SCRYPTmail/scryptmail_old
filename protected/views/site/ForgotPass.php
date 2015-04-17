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
								<a href="http://blog.scryptmail.com/reset-password" target="_blank">Secret what?</a>
							</div>
						</section>

						<section id='resPass'>

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

<div class="modal fade" id="yModal" tabindex="-1" role="dialog" aria-labelledby="yModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="yModalLabel">Your password has been reset!</h4>
			</div>
			<div class="modal-body custom-scroll terms-body">

				<div id="left">
					<!--Please login to your account.-->
					Before logging in, please <b>download the secret token</b>. You will need this token to reset your password or secret phrase. You can read more about it in our <a href="http://blog.scryptmail.com/reset-password" target="_blank">blog</a>.<br><br>
					<span class="text-danger" style="display:none;" id="browsfailed"><i class="fa fa-warning"></i> If your browser can't save this file, please save this string:<br> <b class="text-default" style="word-break:break-all;"></b></span>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary" id="token"
							onclick='downloadToken();'>
						<i class="fa fa-save"></i> Download Token
					</button>

					<button type="button" class="btn btn-primary" data-dismiss="modal" id="y-agree"
							onclick='javascript: window.location = "login";'>
						<i class="fa fa-check"></i> Ok
					</button>

				</div>
			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
</div>


<script>
	$(document).ready(function () {
		initialResetPassword();
	$("[rel=popover]").popover();
		$('#extr-page-header-space').html('<span id="extr-page-header-space"> <span class="hidden-mobile"></span> <a href="login" class="btn btn-default">Sign In</a> </span>');

	});
	</script>
</body>