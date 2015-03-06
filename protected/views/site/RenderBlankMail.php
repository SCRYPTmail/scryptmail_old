<div class="well well-sm well-light">
	<div class="row tags" id="emTags" style="display:none;">
		<div class="form-group">
			<div class="col col-xs-4 col-sm-1">
			<label class="control-label"><strong><i class="fa fa-tags fa-lg"></i> Tags: </strong></label>
			</div>
			<div class="col col-xs-8 col-sm-11" style="margin-top: -4px;">
				<input type="hidden" id="tags" style="width:100%;"/>
			</div>
		</div>
	</div>
	<h2 class="email-open-header">
	</h2>
	<div class="inbox-info-bar">
		<div class="row">
			<div class="col-sm-9" id="rcptHeader">
			</div>

		</div>
	</div>

	<div class="padding-5" id="rendIm">
		To protect you from tracking, images are disabled. <button class="btn btn-primary btn-xs" onclick="renderImages()">Render Images</button>
	</div>


</div>

<div class="inbox-message" style="padding:0;">

	<div id="emailbody">
<p></p>
		<p></p>
	</div>
</div>

<div class="ui-dialog ui-widget ui-widget-content ui-corner-all ui-front ui-dialog-buttons ui-draggable" tabindex="-1" role="dialog" aria-describedby="dialog_simple" aria-labelledby="ui-id-22" style="display: none;"><div id="dialog_simple" class="ui-dialog-content ui-widget-content">
		<p class="padding-5" style="word-break: break-word;">
		</p>
	</div>
</div>

<script src="/js/readEmail.js?r=<?php echo $version;?>"></script>
<script src="/js/renderMail.js?r=<?php echo $version;?>"></script>
