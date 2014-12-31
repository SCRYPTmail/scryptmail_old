<div class="row" style="padding-bottom:70px;">

	<article class="col-sm-12 col-md-12 col-lg-6 sortable-grid ui-sortable">
			<div class="well well-light well-sm">

				<div class="row">

					<div class="col-sm-12">
						<div class="panel-body">
							<div class="row">
								<div class="col-xs-6" id="userFLName">
									<h1></h1>

									<ul class="list-unstyled">
										<li>
											<p class="text-muted" id="profEmail">
												<i class="fa fa-envelope"></i>&nbsp;&nbsp;<a href="javascript:void(0);"></a>
											</p>
										</li>


									</ul>

									<br>
									<br>

								</div>
								<div class="col-xs-6 pull-right">
									<div id="smart-form-register" class="smart-form">
										<fieldset>
											<div class="row">
												<section>
													<label class="input"> <i class="icon-prepend fa fa-user"></i>
														<input type="text" name="fname" placeholder="Name" id="newFname">
													</label>
												</section>
											</div>
										</fieldset>
										<a class="btn btn-primary btn-sm pull-right" href="javascript:void(0);" onclick="saveProfileName();">
											<i class="fa fa-save"></i> Update Name</a>
									</div>
								</div>

							</div>
						</div>
					</div>
				</div>

			</div>
<!--
		<div class="jarviswidget" id="wid-id-0">
			<header role="heading">
				<h2>Security Meter </h2>
				<div class="widget-toolbar" role="menu">

					<div class="progress progress-striped active" rel="tooltip" data-original-title="55%" data-placement="bottom">
						<div class="progress-bar progress-bar-success" role="progressbar" style="width: 15%"></div>
					</div>

				</div>
				</header>
					<div class="panel-body">
						<article class="col-sm-6">

								<ul class="list-unstyled">
									<li>
										<p>
											Https Connection:
										</p>
									</li>
									<li>
										<p>
											IP Address:
										</p>
									</li>

									<li>
										<p>
											Location:
										</p>
									</li>
								</ul>

								<br>
								<br>


						</article>
						<article class="col-sm-6">

							<ul class="list-unstyled">
								<li>
									<p>
										Browser Detected:
									</p>
								</li>
								<li>
									<p>
										OS:
									</p>
								</li>

								<li>
									<p>
										OS Version :
									</p>
								</li>
							</ul>

							<br>
							<br>


						</article>
					</div>


		</div>
		!-->
		<div class="panel-group smart-accordion-default" id="accordion" onclick="initdisposable();">
			<div class="panel panel-default">
				<div class="panel-heading">
					<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse1l"
											   class="collapsed"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i
								class="fa fa-lg fa-angle-up pull-right"></i> Disposable emails</a></h4>
				</div>
				<div id="collapse1l" class="panel-collapse collapse">
					<div class="panel-body">
						<div class="table-responsive">
							<table class="table table-striped table-hover" id="disposeList">
							</table>
						</div>
					</div>
				</div>
			</div>

	</article>


	<article class="col-sm-12 col-md-12 col-lg-6 sortable-grid ui-sortable">

		<div class="widget-body">

		<div class="panel-group smart-accordion-default" id="accordion">
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse7"
										   class="collapsed"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i
							class="fa fa-lg fa-angle-up pull-right"></i> Settings </a></h4>
			</div>
			<div id="collapse7" class="panel-collapse collapse">
				<div class="panel-body">
					<div class="row">
						<div class="col-xs-3">
							<div id="smart-form-session-time" class="smart-form">
								<label class="select">
									<select onchange="changeTimeout($(this));">
										<option value="0" selected="" disabled="">Select Session Time Out</option>
										<option value="30">0.5 Minute</option>
										<option value="600">10 Minutes - Shared Facilities</option>
										<option value="1800">30 Minutes - Personal Office</option>
										<option value="3600">1 Hour - Home</option>
										<option value="10800">3 Hours - Home Alone (Unsafe)</option>
									</select> <i></i> </label>


							</div>
						</div>
						<div class="col-xs-3">
							<div id="smart-form-session-time" class="smart-form">
								<label class="select">
									<select onchange="changeMessagesPerPage($(this));">
										<option value="0" selected="" disabled="">Emails per page</option>
										<option value="10">10</option>
										<option value="25">25</option>
										<option value="50">50</option>
										<option value="100">100</option>
									</select> <i></i> </label>


							</div>
						</div>

					</div>
				</div>
			</div>
		</div>
		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapseOne" class="collapsed"
										   onclick="gotoUpdateKeys()"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i
							class="fa fa-lg fa-angle-up pull-right"></i> RSA Keys </a></h4>
			</div>
			<div id="collapseOne" class="panel-collapse collapse" style="height: 0px;">
				<div class="panel-body">
					<form class="smart-form" id="keyGenForm">

						<fieldset>
							<section>
								<label class="label">Recommended Keys Strength (seed/mail)
									<a href="javascript:void(0);"
									   rel="popover-hover"
									   data-placement="bottom"
									   data-original-title=""
									   data-content="Seed - encrypted message id / Mail - encrypted message key.Message body encrypted with AES 256"><b>?</b></a></label>

								<div class="row">
									<div class="col col-12">
										<label class="radio">
											<input type="radio" id="UpdateKeys_mode_0" value="light" name="UpdateKeys[mode]">
											<i></i><span id="label512"
														 rel="popover-hover" data-placement="bottom"
														 data-original-title="512/1024"
														 data-content="Fastest encryption, providing basic protection">Light Mode (512/1024) ~ 4sec. to generate</label>

										<label class="radio">
											<input type="radio" id="UpdateKeys_mode_1" value="normal" name="UpdateKeys[mode]">
											<i></i><span id='label1024'
														 rel="popover-hover" data-placement="bottom"
														 data-original-title="1024/2048"
														 data-content="Compromise between speed and security. Message encrypted by using 2012 NIST recommendations up to 2030"> Normal Mode (1024/2048) ~20 sec. to generate
										</label>

										<label class="radio">
											<input type="radio" id="UpdateKeys_mode_2" value="paranoid" name="UpdateKeys[mode]">
											<i></i><span id='label2048'
														 rel="popover-hover" data-placement="bottom"
														 data-original-title="2048/4096"
														 data-content="Slowest and most secured communication. Message key encryption should survive next 10 years or until dramatic quantum computer breakthrough"> Secured Mode (2048/4096) ~2 minutes to generate</label>

									</div>

								</div>
							</section>


						</fieldset>

						<!-- widget content -->


						<a class="btn btn-primary btn-sm" href="javascript:void(0);" onclick="retrieveKeys();"
						   rel="popover-hover" data-placement="bottom" data-original-title=""
						   data-content="Retrieve Key for offline storage or verification"

							><i class="fa fa-upload"></i> Retrieve</a>


						<br><br>
						<fieldset>
							<legend><p class="note">Public keys are required</p></legend>

							<div class="row">
								<section class="col col-6">
									<label class="textarea"> <i class="icon-append fa fa-key" style="margin-right: 10px;"></i>
										<textarea rows="7" cols="30" name="UpdateKeys[seedPrK]" placeholder="Seed Private Key"
												  class="valid" id="UpdateKeys_seedPrK" spellcheck="false" disabled="disabled"
												  oninput="validateSeedKeys();"></textarea>
									</label>
								</section>

								<section class="col col-6">
									<label class="textarea"> <i class="icon-append fa fa-key" style="margin-right: 10px;"></i>
										<textarea rows="7" cols="30" name="UpdateKeys[mailPrK]" placeholder="Mail Private Key"
												  class="valid" id="UpdateKeys_mailPrK" spellcheck="false" disabled="disabled"
												  oninput="validateMailKeys();"></textarea>
									</label>
								</section>
							</div>

							<div class="row">
								<section class="col col-6">
									<label class="textarea"> <i class="icon-append fa fa-key" style="margin-right: 10px;"></i>
										<textarea rows="7" cols="30" name="UpdateKeys[seedPubK]" placeholder="Seed Public Key"
												  class="valid" id="UpdateKeys_seedPubK" spellcheck="false" disabled="disabled"
												  oninput="validateSeedKeys();"></textarea>
									</label>
								</section>

								<section class="col col-6">
									<label class="textarea"> <i class="icon-append fa fa-key" style="margin-right: 10px;"></i>
										<textarea rows="7" cols="30" name="UpdateKeys[mailPubK]" placeholder="Mail Public Key"
												  class="valid" id="UpdateKeys_mailPubK" spellcheck="false" disabled="disabled"
												  oninput="validateMailKeys();"></textarea>
									</label>
								</section>
							</div>
							<div class="row">
							<div class="buttons pull-left col col-sm-6">
								<button class="btn btn-primary btn-sm" onclick="generateKeys()" id="profileGenerateKeys"><i
										class="fa fa-cog"></i>
									Generate Keys</button>

							</div>

							<div class="buttons pull-left col col-sm-6">
								<a class="btn btn-primary btn-sm" href="javascript:void(0);" onclick="generateSigKeys()"
								   rel="popover-hover" data-placement="top" data-original-title="Caution:"
								   data-content="Use only when your keys are corrupted. New Signature Keys will render all your previous message to show as forged."><i
										class="fa fa-cog"></i>
									Generate Signature Keys</a>

							</div>
							</div>

							<div class="row">
							<div class="buttons col col-sm-12">

								<a class="btn btn-primary btn-sm pull-right " href="javascript:void(0);" onclick="saveKeys();"
								   rel="popover-hover" data-placement="top" data-original-title="Caution:"
								   data-content="Saving Keys will overwrite your existing keys. You wont be able to receive messages encrypted with old keys"
									><i class="fa fa-save"></i> Save</a>

								<p class="note">Caution: It will overwrite your existing keys. You wont be able to receive
									messages
									encrypted with old keys</p>
							</div>
							</div>
						</fieldset>

					</form>
				</div>
			</div>
		</div>

		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapseTwo" onclick="initSavePass()"
										   class="collapsed"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i
							class="fa fa-lg fa-angle-up pull-right"></i> Passwords </a></h4>
			</div>
			<div id="collapseTwo" class="panel-collapse collapse" style="height: 0px;">
				<div class="panel-body">
					<form id="smart-form-changepass" class="smart-form" novalidate="novalidate">
						<fieldset>
							<section>
								<label class="input"> <i class="icon-append fa fa-lock"></i>
									<input type="password" name="password" placeholder="Old Password" id="passwordOld">
									</label>
							</section>
						</fieldset>
						<fieldset>
							<section>
								<label class="input"> <i class="icon-append fa fa-lock"></i>
									<input type="password" name="passwordNew" placeholder="New Password" id="passwordNew">
									</label>
							</section>

							<section>
								<label class="input"> <i class="icon-append fa fa-lock"></i>
									<input type="password" name="passwordConfirm" placeholder="Confirm password" id="passwordNewRep">
									</label>
							</section>
						</fieldset>


						<a class="btn btn-primary btn-sm pull-right" href="javascript:void(0);" onclick="savePassword();">
							<i class="fa fa-save"></i> Save</a>
					</form>
				</div>
			</div>
		</div>

		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapseThree" onclick="initSaveSecret()"
										   class="collapsed"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i
							class="fa fa-lg fa-angle-up pull-right"></i> Secret Phrase </a></h4>
			</div>
			<div id="collapseThree" class="panel-collapse collapse">
				<div class="panel-body">
					<form id="smart-form-secret" class="smart-form" novalidate="novalidate">
						<fieldset>
							<section>
								<label class="input"> <i class="icon-append fa fa-lock"></i>
									<input type="password" name="newSec" placeholder="New Secret" id="newSec">
								</label>
							</section>

							<section>
								<label class="input"> <i class="icon-append fa fa-lock"></i>
									<input type="password" name="repeatSec" placeholder="Repeat Secret" id="repeatSec">
								</label>
							</section>
						</fieldset>
						<div class="row padding-10">
							<div class="col col-sm-6">
						<a class="btn btn-primary btn-sm pull-left" href="javascript:void(0);" id="token" onclick="downloadTokenProfile();">
							<i class="fa fa-save"></i> Download Token</a><br><br>
						<a class="pull-left col col-sm 6"" href="http://blog.scryptmail.com/2014/11/guide-to-reset-secret-phrase-password.html" target="_blank">What it is?</a>
								</div>
							<div class="col col-sm-6">
						<a class="btn btn-primary btn-sm pull-right" href="javascript:void(0);" onclick="saveSecret();">
							<i class="fa fa-save"></i> Save</a>
							</div>
							<div class="col col-sm-12">
								<br>
								<span class="text-danger" style="display:none;" id="browsfailed"><i class="fa fa-warning"></i> Some browsers not able to save generated file and this message will show, please save this string into file:<br> <b class="text-default" style="word-break:break-all;"></b></span>
								</div>
							</div>
					</form>
				</div>
			</div>
		</div>

		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapseFive" onclick="initContacts();"
										   class="collapsed"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i
							class="fa fa-lg fa-angle-up pull-right"></i> Contacts </a></h4>
			</div>
			<div id="collapseFive" class="panel-collapse collapse">
				<div class="panel-body">
					<div class="table-responsive">
						<table class="table table-striped table-hover" id="contactList">
						</table>
					</div>
				</div>
			</div>
		</div>

		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapseSix" onclick="initSafeBox();"
										   class="collapsed"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i
							class="fa fa-lg fa-angle-up pull-right"></i> SafeBox </a></h4>
			</div>
			<div id="collapseSix" class="panel-collapse collapse">
				<div class="panel-body">
					<div class="table-responsive">
						URL to safe: https://scryptmail.com/safeBox/[MY FILE NAME].kdbx  <a class="pull-right" href="http://blog.scryptmail.com/2014/12/keepass-safebox.html" target="_blank">Help</a></li>
						<table class="table table-striped table-hover" id="safeList">
						</table>
					</div>
				</div>
			</div>
		</div>



		<div class="panel panel-default">
			<div class="panel-heading">
				<h4 class="panel-title"><a data-toggle="collapse" data-parent="#accordion" href="#collapse8" onclick="initBlackList();"
										   class="collapsed"> <i class="fa fa-lg fa-angle-down pull-right"></i> <i
							class="fa fa-lg fa-angle-up pull-right"></i> Spam List </a></h4>
			</div>
			<div id="collapse8" class="panel-collapse collapse">
				<div class="panel-body">
					<div class="table-responsive">
						<table class="table table-striped table-hover" id="blackListTable">
						</table>
					</div>
				</div>
			</div>
		</div>

		</div>

		</div>



	</article>

</div>


<form class="smart-form client-form" id="dialog-AddContact" title="New Contact" style="display:none;">

	<section>
		<label class="input"> <i class="icon-prepend fa fa-user"></i>
			<input type="text" name="fname" id="newClientName" placeholder="name">
		</label>
	</section>

		<section>
		<label class="input"> <i class="icon-prepend fa fa-envelope-o"></i>
			<input type="email" name="email" id="newClientEmail" placeholder="E-mail">
		</label>
	</section>


</form>

<div class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ui-dialog-buttons ui-draggable" tabindex="-1" role="dialog" aria-describedby="dialog_simple" aria-labelledby="ui-id-22" style="display: none;"><div id="dialog_simple" class="ui-dialog-content ui-widget-content">
		<p class="padding-5">
		</p>
	</div>
</div>

<script src="/js/profile.js?r=<?php echo $version;?>"></script>
<script>
	$(document).ready(function () {
		activePage='profile';
	});

	</script>