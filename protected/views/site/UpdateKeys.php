<?php
/* @var $this SiteController */
/* @var $model LoginForm */
/* @var $form CActiveForm */
?>
<style>
	.popover {
		padding: 5px;
	}
</style>
<div style="padding:10px;background:#fbfbfb;">


	<div class="smart-form">
		<header>RSA Keys</header>
		<?php $form = $this->beginWidget('CActiveForm', array(
			'id' => 'create_user-form',
			'enableClientValidation' => false,
			'enableAjaxValidation' => false,
			'clientOptions' => array(
				'validateOnSubmit' => false,
			),
		)); ?>
		<fieldset>
			<section>
				<label class="label">Recommended Keys Strength (seed/mail) <a href="javascript:void(0);"
																			  rel="popover-hover"
																			  data-placement="bottom"
																			  data-original-title=""
																			  data-content="Seed - encrypted message id / Mail - encrypted message key.Message body encrypted with AES 256"><b>?</b></a></label>

				<div class="row">
					<div class="col col-12">
						<label class="radio">
							<input type="radio" id="UpdateKeys_mode_0" value="light" name="UpdateKeys[mode]">
							<i></i><span id="label512"
										 rel="popover-hover" data-placement="bottom" data-original-title="512/1024"
										 data-content="Fastest encryption, providing basic protection.">Light Mode (~<span
									id='optimist' title='based on current computer performance'></span> to generate keys. And <span
									id="optimistspeed"
									title="time required to look through 1000 seeds to find a new message"> </span>to parse 1000 seeds)</span></label>

						<label class="radio">
							<input type="radio" id="UpdateKeys_mode_1" value="normal" name="UpdateKeys[mode]">
							<i></i><span id='label1024'
										 rel="popover-hover" data-placement="bottom" data-original-title="1024/2048"
										 data-content="Compromise between speed and security. Message encrypted by using 2012 NIST recommendations 2011-2030"> Normal Mode (~<span
									id='optimal' title='based on current computer performance'></span> to generate keys.And <span
									id='optimalspeed'
									title='time required to look through 1000 seeds to find a new message'> </span> to parse 1000 seeds)
						</span> </label>


						<label class="radio">
							<input type="radio" id="UpdateKeys_mode_2" value="paranoid" name="UpdateKeys[mode]">
							<i></i><span id='label2048'
										 rel="popover-hover" data-placement="bottom" data-original-title="2048/4096"
										 data-content="Slowest and most secured communication. Message key encryption should survive next 10 years or until dramatic quantum computer breakthrough"> Secured Mode (~<span
									id='paranoid' title='based on current computer performance'></span> to generate keys. And <span
									id='paranoidspeed'
									title='time required to look through 1000 seeds to find a new message'> </span> to parse 1000 seeds)
						</span></label>

					</div>

				</div>
			</section>


		</fieldset>

		<!-- widget content -->


		<a class="btn btn-primary btn-sm" href="javascript:retrieveKeys();"
		   rel="popover-hover" data-placement="bottom" data-original-title=""
		   data-content="Retrieve Key for off-line storage or verification"

			><i class="fa fa-upload"></i> Retrieve</a>


		<br><br>
		<fieldset>
			<legend><p class="note">Public keys are required</p></legend>

			<div class="row">
				<section class="col col-6">
					<label class="textarea"> <i class="icon-append fa fa-key" style="margin-right: 10px;"></i>
						<textarea rows="7" cols="30" name="UpdateKeys[seedPrK]" placeholder="Seed Private Key"
								  class="valid" id="UpdateKeys_seedPrK" spellcheck="false" disabled="disabled"
								  oninput="javascript:validateSeedKeys();"></textarea>
					</label>
				</section>

				<section class="col col-6">
					<label class="textarea"> <i class="icon-append fa fa-key" style="margin-right: 10px;"></i>
						<textarea rows="7" cols="30" name="UpdateKeys[mailPrK]" placeholder="Mail Private Key"
								  class="valid" id="UpdateKeys_mailPrK" spellcheck="false" disabled="disabled"
								  oninput="javascript:validateMailKeys();"></textarea>
					</label>
				</section>
			</div>

			<div class="row">
				<section class="col col-6">
					<label class="textarea"> <i class="icon-append fa fa-key" style="margin-right: 10px;"></i>
						<textarea rows="7" cols="30" name="UpdateKeys[seedPubK]" placeholder="Seed Public Key"
								  class="valid" id="UpdateKeys_seedPubK" spellcheck="false" disabled="disabled"
								  oninput="javascript:validateSeedKeys();"></textarea>
					</label>
				</section>

				<section class="col col-6">
					<label class="textarea"> <i class="icon-append fa fa-key" style="margin-right: 10px;"></i>
						<textarea rows="7" cols="30" name="UpdateKeys[mailPubK]" placeholder="Mail Public Key"
								  class="valid" id="UpdateKeys_mailPubK" spellcheck="false" disabled="disabled"
								  oninput="javascript:validateMailKeys();"></textarea>
					</label>
				</section>
			</div>

			<div class="row buttons">
				<a class="btn btn-primary btn-sm" href="javascript:generateKeys();"
				   rel="popover-hover" data-placement="top" data-original-title="Caution:"
				   data-content="During RSA key generation, page will not be responsive!"><i class="fa fa-cog"></i>
					Generate</a>

			</div>
			<br><br>

			<div class="row buttons">

				<a class="btn btn-primary btn-sm" href="javascript: saveKeys();"
				   rel="popover-hover" data-placement="top" data-original-title="Caution:"
				   data-content="Saving Keys will overwrite your existing keys. You wont be able to receive messages encrypted with old keys"
					><i class="fa fa-save"></i> Save</a>

				<p class="note">Caution: It will overwrite your existing keys. You wont be able to receive messages
					encrypted with old keys</p>
			</div>
		</fieldset>
		<?php $this->endWidget(); ?>

	</div>
	<!-- form -->
</div>


<script>

	$(document).ready(function () {
		// activate tooltips
		pageSetUp();
		activePage='updateKeys';
	});

</script>