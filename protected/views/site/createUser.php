<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm */
?>
	<div class="row">
		<div class="row">
			<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 hidden-xs hidden-sm">
				<h1 class="txt-color-red login-header-big">Welcome to scryptmail.com</h1>

				<div class="hero">

					<div class="pull-left">
						Privacy is your right, not a privilege<br><br>
						<h4 class="paragraph-header">
							Our beta registration is currently closed.<br> Please request an invitation or follow us on twitter for updates on registration
							<br>
							We will invite new users based on our server availability</h4>

						<div class="login-app-icons">
							<a href="http://blog.scryptmail.com/2014/11/scryptmail-encrypted-email-service.html" target="_blank" class="btn btn-primary btn-sm">Why we are different</a>
							<a href="http://blog.scryptmail.com" target="_blank" class="btn btn-primary btn-sm" style="margin-left:20px;">Blog</a>
						</div>
					</div>

				</div>

			</div>

		<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
			<div class="well no-padding">
				<!--<div class="smart-form client-form" id="smart-form-register">-->
				<form action="javascript:void(0);" id="request-invitiation" class="smart-form" novalidate="novalidate" method="POST">

					<header class="text-center">
						Request Invitation
						<h5 style="margin-top:10px;"><small>Limited registration will be available soon</small>
					</header>

					<fieldset>

						<section>
							<label class="input" id="userError">
									<input placeholder="@email" maxlength="40"
										 name="email" id="inviteemail" type="text">
							</label>
						</section>


					</fieldset>

					<footer>
						<input class="btn btn-primary" onclick="requestInvitiation();" name="yt0" type="button"
							   value="Submit">
					</footer>

				</form>
			</div>

			<div><a href="https://twitter.com/scryptmail" target="_blank" class="twitter-follow-button pull-right btn btn-default btn-xs" data-show-count="false"><i class="fa fa-twitter txt-color-blue"></i> Follow us @scryptmail</a></div>
		</div>
	</div>

<script src="js/plugin/jquery-validate/jquery.validate.min.js"></script>
<script src="js/plugin/jquery-form/jquery-form.min.js"></script>

<script type="text/javascript">

	$( document ).ready(function() {
		requestInitInvitiation();
		$('#extr-page-header-space').html('<span id="extr-page-header-space"> <span class="hidden-mobile"></span> <a href="login" class="btn btn-default">Sign		In</a> </span>');


	});

</script>
