<div class="form-horizontal" id="email-compose-form" style="padding-left:0px;">

		<h2>
		Compose Email
	</h2>

	<div class="inbox-info-bar">
		<div class="row">
			<div class="form-group">
				<label class="control-label col col-xs-1"><strong>To: </strong></label>
				<div class="control-label col col-xs-10 text-align-left" id="recipient">
				</div>
			</div>
		</div>
	</div>

	<div class="inbox-info-bar no-padding">
		<div class="row">
			<div class="form-group">
				<label class="control-label col col-xs-1"><strong>Subject:</strong></label>

				<div class="col col-xs-11 text-align-left">
					<input class="form-control" style="padding-left:0px;" placeholder="Email Subject" type="text" id="subj" maxlength="150">

					<em><a href="javascript:void(0);" class="show-next" rel="tooltip" data-placement="left"
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

			<div class="well-md well-light smart-form">
				<button class="btn btn-primary btn-sm" type="button" id="sendMail">
					Send
				</button>
				</div>


	</div>

</div>


<script type="text/javascript" src="/js/plugin/summernote/summernote.js?r=<?php echo $version;?>">></script>
<script src="/js/composeEmailUnreg.js?r=<?php echo $version;?>"></script>
