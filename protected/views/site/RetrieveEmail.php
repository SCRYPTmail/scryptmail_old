<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm */
?>
	<div class="row">
		<div class="col-xs-12 col-sm-12 col-md-7 col-lg-7 hidden-xs hidden-sm">
			<h1 class="txt-color-red login-header-big">Welcome to scryptmail.com</h1>

			<div class="hero">

				<div class="pull-left">
					Privacy is your right, not a privilege<br><br>
					<h4 class="paragraph-header">
						Please contact sender for a PIN. Email will be deleted after 3 unsuccessful attempts
						</h4>

				</div>

			</div>


		<!--	<div class="well col-xs-12 col-sm-12 col-md-12 col-lg-12 hidden-xs hidden-sm" style="border:0px solid;">
				<i class="fa fa-exclamation txt-color-yellow fa-lg"></i> Did you know that the first 500 registered users will get a Free Advanced account for a year?
			</div>-->


		</div>
		<div class="col-xs-12 col-sm-12 col-md-5 col-lg-5">
			<div class="well no-padding">

				<?php $form = $this->beginWidget('CActiveForm', array(
					'id' => 'smart-form-register',
					'enableClientValidation' => false,
					'enableAjaxValidation' => false,
					'clientOptions' => array(
						'validateOnSubmit' => false,
					),
					'htmlOptions' => array('autocomplete' => "off", 'class' => "smart-form client-form"),
				)); ?>
				<div class="form">


					<header>
						<h5>Retrieve Message<br><small><a href="http://blog.scryptmail.com/2014/11/scryptmail-browser-compatibility.html" target="_blank"> Supported Browsers</a></small></h5>
					</header>

					<fieldset>

						<section>
							<label class="input">

								<input placeholder="Enter Email hash" name="emailHashtag" id="emailHashtag" value="<?php echo $model->emailHash; ?>">
								<input style="display:none" type="text" name="fakeusernameremembered"/>
								<b class="tooltip tooltip-bottom-right">Enter email hash you received</b> </label>
							<em for="password" class="invalid">
								<div class="errorMessage" id='hserror'></div>
							</em>

						</section>
						<div style="clear:both;"></div>

						<section>
							<label class="input" id="passError"> <i class="icon-append fa fa-lock"></i>
								<input style="display:none" type="password" name="fakepasswordremembered"/>
								<input placeholder="PIN" name="emailHashpass" id="emailHashpass" type="password">
								<b class="tooltip tooltip-bottom-right">Enter pin you recived from sender</b> </label>
							<em for="password" class="invalid">
								<div class="errorMessage" id='pserror'></div>
							</em>

						</section>


						<section>
							<label class="checkbox" id="terError">
								By clicking Read Email, I agree with the <a href="#" data-toggle="modal" data-target="#myModal"> Terms
									and Conditions </a></label>
						</section>
					</fieldset>
					<footer>
						<?php echo CHtml::Button('Read Email', array('class' => "btn btn-primary", 'onclick' => 'readEmail()')); ?>
					</footer>

					<?php $this->endWidget(); ?>

				</div>

			</div>
		</div>
	</div>



<!-- Modal -->

<div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
	<div class="modal-dialog">
		<div class="modal-content">
			<div class="modal-header">
				<button type="button" class="close" data-dismiss="modal" aria-hidden="true">
					&times;
				</button>
				<h4 class="modal-title" id="myModalLabel">Terms & Conditions for SCRYPTmail</h4>
			</div>
			<div class="modal-body custom-scroll terms-body">

				<div id="left">
					<h2>Introduction</h2>

					<p>By using this site, you agree to abide by the following Terms and Conditions for use for SCRYPTmail. These Terms and Conditions cover all present and future features offered by your SCRYPTmail account, individually and collectively referred to as the "Service".</p>

					<p>This Service is provided exclusively to individuals who are at least 18 years of age or to minors who have obtained parental consent to open and maintain an account. Each user is solely responsible for all of his or her messages sent through the Service. As a condition for using this Service, you agree to not use this Service for any unlawful or prohibited activities. You also agree to be bound by these Terms and Conditions. At its sole discretion, SCRYPTmail may terminate service without cause or notice.</p>

					<p>By using the Service, you agree to abide by all national and international laws and regulations and to not use SCRYPTmail for illegal purposes. You also agree to not disrupt the SCRYPTmail networks and servers. You further agree to not use SCRYPTmail to send spam or junk mail or mailing list emails which contain persons that have not specifically agreed to be included on that list.</p>

					<h2>Account Termination</h2>

					<p>SCRYPTmail may terminate your access to the Service and any related service(s) at any time, with or without cause, with or without notice, effective immediately, for any reason whatsoever. SCRYPTmail has no obligation to store or forward the contents of your account.</p>

					<p>If there is any indication that you are using your account for illegal activity, your account will be terminated immediately and without notice. Activities that are absolutely not tolerated include, but are not limited to, the purchase or sale of substances that are illegal in many jurisdictions, purchase or sale of stolen goods, making threats to person or property, possession or distribution of child pornography, and fraud.</p>


					<p>SCRYPTmail also has no obligations to store messages for accounts that are over their storage quotas. Due to the encrypted nature of SCRYPTmail, you acknowledge that SCRYPTmail has no ability or obligation to recover your data if you misplace your decryption password.</p>


					<h2>Liability</h2>

					<p>SCRYPTmail is still in beta so the Service may include errors. SCRYPTmail may make improvements and changes to the Service at any time without notice. SCRYPTmail does not make any guarantees about the reliability of the Service and does not guarantee the security of user data despite best efforts. The Service is provided “as is” and you agree to not hold SCRYPTmail responsible for any damages that arise as a result of the loss of use, data, or profits connected to the performance of the Service. Furthermore, you will not hold SCRYPTmail liable if confidential material is unintentionally released as the result of a security failure or vulnerability.</p>

					<p>SCRYPTmail will not be liable to you (whether under the law of contact, the law of torts or otherwise) in relation to the contents of, or use of, or otherwise in connection with, this website:</p>
					<ul>
						<li>to the extent that the website is provided free-of-charge, for any direct loss;</li>
						<li>for any indirect, special or consequential loss; or</li>
						<li>for any business losses, loss of revenue, income, profits or anticipated savings, loss of contracts or business relationships, loss of reputation or goodwill, or loss or corruption of information or data.</li>
					</ul>
					<p>These limitations of liability apply even if SCRYPTmail has been expressly advised of the potential loss.</p>

					<h2>Indemnification</h2>

					<p>You agree that SCRYPTmail, its parents, subsidiaries, officers, and employees cannot be held responsible for any third party claim, demand, or damage, including reasonable attorneys’ fees, arising out of your use of this Service.</p>

					<h2>Exceptions</h2>

					<p>Nothing in this website disclaimer will exclude or limit any warranty implied by law that it would be unlawful to exclude or limit; and nothing in this website disclaimer will exclude or limit the liability of ScryptMail in respect of any:</p>
					<ul>
						<li>death or personal injury caused by the negligence of SCRYPTmail or its agents, employees or shareholders/owners;</li>
						<li>fraud or fraudulent misrepresentation on the part of SCRYPTmail; or</li>
						<li>matter which it would be illegal or unlawful for SCRYPTmail to exclude or limit, or to attempt or purport to exclude or limit, its liability.</li>
					</ul>

					<h2>Unenforceable provisions</h2>

					<p>If any provision of this website disclaimer is, or is found to be, unenforceable under applicable law, that will not affect the enforceability of the other provisions of this website disclaimer.</p>


					<h2>Assignment</h2>

					<p>SCRYPTmail may transfer, sub-contract or otherwise deal with SCRYPTmail's rights and/or obligations under these terms and conditions without notifying you or obtaining your consent.</p>

					<p>You may not transfer, sub-contract or otherwise deal with your rights and/or obligations under these terms and conditions.</p>

					<h2>Severability</h2>

					<p>If a provision of these terms and conditions is determined by any court or other competent authority to be unlawful and/or unenforceable, the other provisions will continue in effect.  If any unlawful and/or unenforceable provision would be lawful or enforceable if part of it were deleted, that part will be deemed to be deleted, and the rest of the provision will continue in effect.</p>

					<h2>Entire agreement</h2>

					<p>These terms and conditions, together with SCRYPTmail's Privacy Policy constitute the entire agreement between you and SCRYPTmail in relation to your use of this website, and supersede all previous agreements in respect of your use of this website.</p>

					<h2>Law and jurisdiction</h2>

					<p>These terms and conditions will be governed by and construed in accordance with the laws of state WASHINGTON, USA, and any disputes relating to these terms and conditions will be subject to the exclusive jurisdiction of the courts of state WASHINGTON, USA.</p>

					<h2>Modifications to Terms of Service</h2>

					<p>SCRYPTmail reserves the right to review and change this agreement at any time.</p>

					<p>These terms and conditions govern your use of this website; by using this website, you accept these terms and conditions in full and without reservation. If you disagree with these terms and conditions or any part of these terms and conditions, you must not use this website.</p>

					<br>
					<h4>Updated December 26, 2014</h4>


				</div>

			</div>
			<!-- /.modal-content -->
		</div>
		<!-- /.modal-dialog -->
	</div>
	<!-- /.modal -->
</div>


