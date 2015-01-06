<div class="form-horizontal" id="email-compose-form" style="padding-left:0px;">

		<h2  class="row email-open-header">
		Compose Email
	</h2>

	<div class="inbox-info-bar no-padding">
		<div class="row">
			<div class="form-group">
				<label class="control-label col col-xs-1"><strong>To</strong></label>

				<div class="col col-xs-10">
					<input type="hidden" id="toRcpt" style="width:100%;"/>
				</div>
			</div>
		</div>
	</div>

	<div class="inbox-info-bar no-padding">
		<div class="row">
			<div class="form-group">
				<label class="control-label col col-xs-1"><strong>Subject</strong></label>

				<div class="col col-xs-11">
					<input class="form-control" placeholder="Email Subject" type="text" id="subj" maxlength="150">
					<em><a href="javascript:void(0);" class="show-next" rel="tooltip" data-placement="bottom"
						   data-original-title="Attachments"><i class="fa fa-paperclip fa-lg"></i></a></em>
				</div>
			</div>
		</div>
	</div>

	<div class="inbox-info-bar no-padding hidden">
		<div class="row">
			<div class="form-group">

				<label class="control-label pull-left" style="margin-left:15px;">
					<button onclick="fileSelector.click()" class="btn btn-primary btn-xs">Attachments</button></label>

				<div class="col col-xs-10 pull-left">
					<input type="hidden" id="atachFiles" style="width:100%;margin-top:2px;"/>
				</div>
				<div class="col-md-11">
					<input type="file" id="ddd" name="files" onchange="getFile($(this))" style="display:none;"/>

				</div>
			</div>
		</div>
	</div>
	<div class="inbox-message no-padding">

		<div id="emailbody">

		</div>
	</div>

	<div class="inbox-compose-footer">

		<span id="composeEmailPin"></span>

	</div>

</div>

<div id="email-pin-form" class="col col-sm-2 col-xs-12" style="display:none;">
	<h3>Email PIN:</h3>
</div>



<script src="/js/composeEmail.js?r=<?php echo $version;?>"></script>
