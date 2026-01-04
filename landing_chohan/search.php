<section class="elementor-section elementor-top-section elementor-element elementor-element-952996c animated-slow elementor-section-boxed elementor-section-height-default elementor-section-height-default elementor-invisible" data-id="952996c" data-element_type="section" data-settings="{&quot;animation&quot;:&quot;fadeInUp&quot;}">
<div class="elementor-container elementor-column-gap-default">
<div class="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-ca7d1ef" data-id="ca7d1ef" data-element_type="column" data-settings="{&quot;background_background&quot;:&quot;classic&quot;}">
<div class="elementor-widget-wrap elementor-element-populated">
<div class="elementor-element elementor-element-a04719f elementor-widget elementor-widget-metform" data-id="a04719f" data-element_type="widget" data-widget_type="metform.default">
<div class="elementor-widget-container">
<div id="mf-response-props-id-74" data-editswitchopen="" data-erroricon="fas fa-exclamation-triangle" data-successicon="fas fa-check" data-messageposition="top" class="   mf-scroll-top-no">
<div class="formpicker_warper formpicker_warper_editable" data-metform-formpicker-key="74" >
<div class="elementor-widget-container">
<div
id="metform-wrap-a04719f-74"
class="mf-form-wrapper"
data-form-id="74"
data-action="wp-json/metform/v1/entries/insert/74"
data-wp-nonce="57a0ae4d5e"
data-form-nonce="9f33df0566"
data-stop-vertical-effect=""
></div>
<!----------------------------- 
* controls_data : find the the props passed indie of data attribute
* props.SubmitResponseMarkup : contains the markup of error or success message
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals
--------------------------- -->
<script type="text/mf" class="mf-template">
function controls_data (value){
let currentWrapper = "mf-response-props-id-74";
let currentEl = document.getElementById(currentWrapper);

return currentEl ? currentEl.dataset[value] : false
}


let is_edit_mode = '' ? true : false;
let message_position = controls_data('messageposition') || 'top';


let message_successIcon = controls_data('successicon') || '';
let message_errorIcon = controls_data('erroricon') || '';
let message_editSwitch = controls_data('editswitchopen') === 'yes' ? true : false;
let message_proClass = controls_data('editswitchopen') === 'yes' ? 'mf_pro_activated' : '';

let is_dummy_markup = is_edit_mode && message_editSwitch ? true : false;


return html`
<form
className="metform-form-content"
ref=${parent.formContainerRef}
onSubmit=${ validation.handleSubmit( parent.handleFormSubmit ) }

>


${is_dummy_markup ? message_position === 'top' ?  props.ResponseDummyMarkup(message_successIcon, message_proClass) : '' : ''}
${is_dummy_markup ? ' ' :  message_position === 'top' ? props.SubmitResponseMarkup`${parent}${state}${message_successIcon}${message_errorIcon}${message_proClass}` : ''}

<!--------------------------------------------------------
*** IMPORTANT / DANGEROUS ***
${html``} must be used as in immediate child of "metform-form-main-wrapper"
class otherwise multistep form will not run at all
---------------------------------------------------------->

<div className="metform-form-main-wrapper" key=${'hide-form-after-submit'} ref=${parent.formRef}>
${html`
		<div data-elementor-type="wp-post" data-elementor-id="74" className="elementor elementor-74">
			<section className="elementor-section elementor-top-section elementor-element elementor-element-28da0b7 elementor-section-full_width elementor-hidden-tablet elementor-hidden-mobile elementor-section-height-default elementor-section-height-default" data-id="28da0b7" data-element_type="section">
<div className="elementor-container elementor-column-gap-default">
<div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-86110a2" data-id="86110a2" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<section className="elementor-section elementor-inner-section elementor-element elementor-element-18985ac elementor-section-full_width elementor-section-height-default elementor-section-height-default" data-id="18985ac" data-element_type="section">
<div className="elementor-container elementor-column-gap-default">
<div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-065dd2e" data-id="065dd2e" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-42c3eb7 elementor-widget elementor-widget-mf-select" data-id="42c3eb7" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-select-from&quot;}" data-widget_type="mf-select.default">
<div className="elementor-widget-container">


<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-select-42c3eb7">
${ parent.decodeEntities(`From`) } 					<span className="mf-input-required-indicator"></span>
</label>

<${props.Select}
   className=${"mf-input mf-input-select  " + ( validation.errors['mf-select-from'] ? 'mf-invalid' : '' )}
   classNamePrefix="mf_select"
   name="mf-select-from"
   placeholder="${ parent.decodeEntities(`Select Destination`) } "
   isSearchable=${false}
   options=${[{"label":"Bali","value":"value-1","isDisabled":false},{"label":"Jakarta","value":"value-2","isDisabled":false},{"label":"Bandung","value":"value-3","isDisabled":false},{"label":"Surabaya","value":"value-4","isDisabled":false},{"label":"Yogyakarta","value":"value-5","isDisabled":false}]}
   value=${parent.getValue("mf-select-from") ? [{"label":"Bali","value":"value-1","isDisabled":false},{"label":"Jakarta","value":"value-2","isDisabled":false},{"label":"Bandung","value":"value-3","isDisabled":false},{"label":"Surabaya","value":"value-4","isDisabled":false},{"label":"Yogyakarta","value":"value-5","isDisabled":false}].filter(item => item.value === parent.getValue("mf-select-from"))[0] : []}
   onChange=${parent.handleSelect}
   ref=${() => {
	   register({ name: "mf-select-from" }, parent.activateValidation({"message":"This field is required.","minLength":1,"maxLength":"","type":"none","required":false}));
	   if ( parent.getValue("mf-select-from") === '' && false ) {
		   parent.handleChange({
			   target: {
				   name: 'mf-select-from',
				   value: ''
			   }
		   });
		   parent.setValue( 'mf-select-from', '', true );
	   }
   }}
   />

			<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-select-from"
as=${html`<span className="mf-error-message"></span>`}
/>

	</div>


</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-e3e4a44" data-id="e3e4a44" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-6a92e73 elementor-widget elementor-widget-mf-select" data-id="6a92e73" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-select-to&quot;}" data-widget_type="mf-select.default">
<div className="elementor-widget-container">


<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-select-6a92e73">
${ parent.decodeEntities(`To`) } 					<span className="mf-input-required-indicator"></span>
</label>

<${props.Select}
   className=${"mf-input mf-input-select  " + ( validation.errors['mf-select-to'] ? 'mf-invalid' : '' )}
   classNamePrefix="mf_select"
   name="mf-select-to"
   placeholder="${ parent.decodeEntities(`Select Destination`) } "
   isSearchable=${false}
   options=${[{"label":"Bali","value":"value-1","isDisabled":false},{"label":"Jakarta","value":"value-2","isDisabled":false},{"label":"Bandung","value":"value-3","isDisabled":false},{"label":"Surabaya","value":"value-4","isDisabled":false},{"label":"Yogyakarta","value":"value-5","isDisabled":false}]}
   value=${parent.getValue("mf-select-to") ? [{"label":"Bali","value":"value-1","isDisabled":false},{"label":"Jakarta","value":"value-2","isDisabled":false},{"label":"Bandung","value":"value-3","isDisabled":false},{"label":"Surabaya","value":"value-4","isDisabled":false},{"label":"Yogyakarta","value":"value-5","isDisabled":false}].filter(item => item.value === parent.getValue("mf-select-to"))[0] : []}
   onChange=${parent.handleSelect}
   ref=${() => {
	   register({ name: "mf-select-to" }, parent.activateValidation({"message":"This field is required.","minLength":1,"maxLength":"","type":"none","required":false}));
	   if ( parent.getValue("mf-select-to") === '' && false ) {
		   parent.handleChange({
			   target: {
				   name: 'mf-select-to',
				   value: ''
			   }
		   });
		   parent.setValue( 'mf-select-to', '', true );
	   }
   }}
   />

			<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-select-to"
as=${html`<span className="mf-error-message"></span>`}
/>

	</div>


</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-6db42b4" data-id="6db42b4" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-396fa2d elementor-widget elementor-widget-mf-date" data-id="396fa2d" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-date&quot;}" data-widget_type="mf-date.default">
<div className="elementor-widget-container">


<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-date-396fa2d">
${ parent.decodeEntities(`When`) } 					<span className="mf-input-required-indicator"></span>
</label>

<${props.Flatpickr}
name="mf-date"
className="mf-input mf-date-input mf-left-parent "
placeholder="${ parent.decodeEntities(`Set Date`) } "
options=${{"minDate":"no","maxDate":"","dateFormat":"m-d-Y","enableTime":"","disable":[],"mode":"single","static":true,"disableMobile":true,"time_24hr":false}}
value=${parent.getValue('mf-date')}
onInput=${parent.handleDateTime}
aria-invalid=${validation.errors['mf-date'] ? 'true' : 'false'}
ref=${el => props.DateWidget(
	el, 
	'', 
	{"message":"This field is required.","required":false},  
	register, 
	parent 
)}
/>

	<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-date"
as=${html`<span className="mf-error-message"></span>`}
/>

</div>


</div>
</div>
</div>
</div>
	</div>
</section>
</div>
</div>
	</div>
</section>
<section className="elementor-section elementor-top-section elementor-element elementor-element-62efbce elementor-section-full_width elementor-hidden-desktop elementor-section-height-default elementor-section-height-default" data-id="62efbce" data-element_type="section">
<div className="elementor-container elementor-column-gap-default">
<div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-629cff0" data-id="629cff0" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<section className="elementor-section elementor-inner-section elementor-element elementor-element-ef8c43d elementor-section-full_width elementor-section-height-default elementor-section-height-default" data-id="ef8c43d" data-element_type="section">
<div className="elementor-container elementor-column-gap-default">
<div className="elementor-column elementor-col-16 elementor-inner-column elementor-element elementor-element-4d223b8" data-id="4d223b8" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-160c296 elementor-widget elementor-widget-mf-select" data-id="160c296" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-select-from&quot;}" data-widget_type="mf-select.default">
<div className="elementor-widget-container">


<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-select-160c296">
${ parent.decodeEntities(`From`) } 					<span className="mf-input-required-indicator"></span>
</label>

<${props.Select}
   className=${"mf-input mf-input-select  " + ( validation.errors['mf-select-from'] ? 'mf-invalid' : '' )}
   classNamePrefix="mf_select"
   name="mf-select-from"
   placeholder="${ parent.decodeEntities(`Select Destination`) } "
   isSearchable=${false}
   options=${[{"label":"Bali","value":"value-1","isDisabled":false},{"label":"Jakarta","value":"value-2","isDisabled":false},{"label":"Bandung","value":"value-3","isDisabled":false},{"label":"Surabaya","value":"value-4","isDisabled":false},{"label":"Yogyakarta","value":"value-5","isDisabled":false}]}
   value=${parent.getValue("mf-select-from") ? [{"label":"Bali","value":"value-1","isDisabled":false},{"label":"Jakarta","value":"value-2","isDisabled":false},{"label":"Bandung","value":"value-3","isDisabled":false},{"label":"Surabaya","value":"value-4","isDisabled":false},{"label":"Yogyakarta","value":"value-5","isDisabled":false}].filter(item => item.value === parent.getValue("mf-select-from"))[0] : []}
   onChange=${parent.handleSelect}
   ref=${() => {
	   register({ name: "mf-select-from" }, parent.activateValidation({"message":"This field is required.","minLength":1,"maxLength":"","type":"none","required":false}));
	   if ( parent.getValue("mf-select-from") === '' && false ) {
		   parent.handleChange({
			   target: {
				   name: 'mf-select-from',
				   value: ''
			   }
		   });
		   parent.setValue( 'mf-select-from', '', true );
	   }
   }}
   />

			<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-select-from"
as=${html`<span className="mf-error-message"></span>`}
/>

	</div>


</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-16 elementor-inner-column elementor-element elementor-element-ccc7a52" data-id="ccc7a52" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-19a18b8 elementor-widget elementor-widget-mf-select" data-id="19a18b8" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-select-to&quot;}" data-widget_type="mf-select.default">
<div className="elementor-widget-container">


<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-select-19a18b8">
${ parent.decodeEntities(`To`) } 					<span className="mf-input-required-indicator"></span>
</label>

<${props.Select}
   className=${"mf-input mf-input-select  " + ( validation.errors['mf-select-to'] ? 'mf-invalid' : '' )}
   classNamePrefix="mf_select"
   name="mf-select-to"
   placeholder="${ parent.decodeEntities(`Select Destination`) } "
   isSearchable=${false}
   options=${[{"label":"Bali","value":"value-1","isDisabled":false},{"label":"Jakarta","value":"value-2","isDisabled":false},{"label":"Bandung","value":"value-3","isDisabled":false},{"label":"Surabaya","value":"value-4","isDisabled":false},{"label":"Yogyakarta","value":"value-5","isDisabled":false}]}
   value=${parent.getValue("mf-select-to") ? [{"label":"Bali","value":"value-1","isDisabled":false},{"label":"Jakarta","value":"value-2","isDisabled":false},{"label":"Bandung","value":"value-3","isDisabled":false},{"label":"Surabaya","value":"value-4","isDisabled":false},{"label":"Yogyakarta","value":"value-5","isDisabled":false}].filter(item => item.value === parent.getValue("mf-select-to"))[0] : []}
   onChange=${parent.handleSelect}
   ref=${() => {
	   register({ name: "mf-select-to" }, parent.activateValidation({"message":"This field is required.","minLength":1,"maxLength":"","type":"none","required":false}));
	   if ( parent.getValue("mf-select-to") === '' && false ) {
		   parent.handleChange({
			   target: {
				   name: 'mf-select-to',
				   value: ''
			   }
		   });
		   parent.setValue( 'mf-select-to', '', true );
	   }
   }}
   />

			<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-select-to"
as=${html`<span className="mf-error-message"></span>`}
/>

	</div>


</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-16 elementor-inner-column elementor-element elementor-element-8bea02b" data-id="8bea02b" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-26c2236 elementor-widget elementor-widget-mf-date" data-id="26c2236" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-date&quot;}" data-widget_type="mf-date.default">
<div className="elementor-widget-container">


<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-date-26c2236">
${ parent.decodeEntities(`When`) } 					<span className="mf-input-required-indicator"></span>
</label>

<${props.Flatpickr}
name="mf-date"
className="mf-input mf-date-input mf-left-parent "
placeholder="${ parent.decodeEntities(`Set Date`) } "
options=${{"minDate":"no","maxDate":"","dateFormat":"m-d-Y","enableTime":"","disable":[],"mode":"single","static":true,"disableMobile":true,"time_24hr":false}}
value=${parent.getValue('mf-date')}
onInput=${parent.handleDateTime}
aria-invalid=${validation.errors['mf-date'] ? 'true' : 'false'}
ref=${el => props.DateWidget(
	el, 
	'', 
	{"message":"This field is required.","required":false},  
	register, 
	parent 
)}
/>

	<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-date"
as=${html`<span className="mf-error-message"></span>`}
/>

</div>


</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-16 elementor-inner-column elementor-element elementor-element-de74515" data-id="de74515" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-a71ca7a elementor-widget elementor-widget-mf-select" data-id="a71ca7a" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-select&quot;}" data-widget_type="mf-select.default">
<div className="elementor-widget-container">


<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-select-a71ca7a">
${ parent.decodeEntities(`Time`) } 					<span className="mf-input-required-indicator"></span>
</label>

<${props.Select}
   className=${"mf-input mf-input-select  " + ( validation.errors['mf-select'] ? 'mf-invalid' : '' )}
   classNamePrefix="mf_select"
   name="mf-select"
   placeholder="${ parent.decodeEntities(`Select Time`) } "
   isSearchable=${false}
   options=${[{"label":"08.00 AM","value":"value-1","isDisabled":false},{"label":"10.00 AM","value":"value-2","isDisabled":false},{"label":"01.00 PM","value":"value-3","isDisabled":false},{"label":"03.00 PM","value":"value-4","isDisabled":false},{"label":"05.00 PM","value":"value-5","isDisabled":false},{"label":"07.00 PM","value":"value-6","isDisabled":false},{"label":"09.00 PM","value":"value-7","isDisabled":false}]}
   value=${parent.getValue("mf-select") ? [{"label":"08.00 AM","value":"value-1","isDisabled":false},{"label":"10.00 AM","value":"value-2","isDisabled":false},{"label":"01.00 PM","value":"value-3","isDisabled":false},{"label":"03.00 PM","value":"value-4","isDisabled":false},{"label":"05.00 PM","value":"value-5","isDisabled":false},{"label":"07.00 PM","value":"value-6","isDisabled":false},{"label":"09.00 PM","value":"value-7","isDisabled":false}].filter(item => item.value === parent.getValue("mf-select"))[0] : []}
   onChange=${parent.handleSelect}
   ref=${() => {
	   register({ name: "mf-select" }, parent.activateValidation({"message":"This field is required.","minLength":1,"maxLength":"","type":"none","required":false}));
	   if ( parent.getValue("mf-select") === '' && false ) {
		   parent.handleChange({
			   target: {
				   name: 'mf-select',
				   value: ''
			   }
		   });
		   parent.setValue( 'mf-select', '', true );
	   }
   }}
   />

			<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-select"
as=${html`<span className="mf-error-message"></span>`}
/>

	</div>


</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-16 elementor-inner-column elementor-element elementor-element-225346b" data-id="225346b" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-b0114c6 elementor-widget elementor-widget-mf-number" data-id="b0114c6" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-number&quot;}" data-widget_type="mf-number.default">
<div className="elementor-widget-container">

<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-number-b0114c6">
${ parent.decodeEntities(`Seat`) } 					<span className="mf-input-required-indicator"></span>
</label>

<input
type="number"
className="mf-input "
id="mf-input-mobile-b0114c6"
name="mf-number"
placeholder="${ parent.decodeEntities(`Set Seat`) } "
			onInput=${parent.handleChange}
aria-invalid=${validation.errors['mf-number'] ? 'true' : 'false'}
ref=${el => parent.activateValidation({"message":"This field is required.","minLength":1,"maxLength":"","type":"none","required":false,"expression":"null"}, el)}
		/>

	<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-number"
as=${html`<span className="mf-error-message"></span>`}
/>

</div>

</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-16 elementor-inner-column elementor-element elementor-element-01517d2" data-id="01517d2" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-9dbdec5 mf-btn--justify mf-btn--mobile-justify mf-btn--tablet-justify elementor-widget elementor-widget-mf-button" data-id="9dbdec5" data-element_type="widget" data-widget_type="mf-button.default">
<div className="elementor-widget-container">
<div className="mf-btn-wraper " data-mf-form-conditional-logic-requirement="">
	<button type="submit" className="metform-btn metform-submit-btn " id="">
<span>${ parent.decodeEntities(`Submit Button`) } </span>
</button>
</div>
</div>
</div>
</div>
</div>
	</div>
</section>
</div>
</div>
	</div>
</section>
<section className="elementor-section elementor-top-section elementor-element elementor-element-5fa3f1b elementor-section-full_width elementor-section-height-default elementor-section-height-default" data-id="5fa3f1b" data-element_type="section">
<div className="elementor-container elementor-column-gap-default">
<div className="elementor-column elementor-col-100 elementor-top-column elementor-element elementor-element-04f52bc" data-id="04f52bc" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<section className="elementor-section elementor-inner-section elementor-element elementor-element-2f3f7cf elementor-section-full_width elementor-hidden-tablet elementor-hidden-mobile elementor-section-height-default elementor-section-height-default" data-id="2f3f7cf" data-element_type="section">
<div className="elementor-container elementor-column-gap-default">
<div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-29dfa39" data-id="29dfa39" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-a2edb14 elementor-widget elementor-widget-mf-select" data-id="a2edb14" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-select&quot;}" data-widget_type="mf-select.default">
<div className="elementor-widget-container">


<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-select-a2edb14">
${ parent.decodeEntities(`Time`) } 					<span className="mf-input-required-indicator"></span>
</label>

<${props.Select}
   className=${"mf-input mf-input-select  " + ( validation.errors['mf-select'] ? 'mf-invalid' : '' )}
   classNamePrefix="mf_select"
   name="mf-select"
   placeholder="${ parent.decodeEntities(`Select Time`) } "
   isSearchable=${false}
   options=${[{"label":"08.00 AM","value":"value-1","isDisabled":false},{"label":"10.00 AM","value":"value-2","isDisabled":false},{"label":"01.00 PM","value":"value-3","isDisabled":false},{"label":"03.00 PM","value":"value-4","isDisabled":false},{"label":"05.00 PM","value":"value-5","isDisabled":false},{"label":"07.00 PM","value":"value-6","isDisabled":false},{"label":"09.00 PM","value":"value-7","isDisabled":false}]}
   value=${parent.getValue("mf-select") ? [{"label":"08.00 AM","value":"value-1","isDisabled":false},{"label":"10.00 AM","value":"value-2","isDisabled":false},{"label":"01.00 PM","value":"value-3","isDisabled":false},{"label":"03.00 PM","value":"value-4","isDisabled":false},{"label":"05.00 PM","value":"value-5","isDisabled":false},{"label":"07.00 PM","value":"value-6","isDisabled":false},{"label":"09.00 PM","value":"value-7","isDisabled":false}].filter(item => item.value === parent.getValue("mf-select"))[0] : []}
   onChange=${parent.handleSelect}
   ref=${() => {
	   register({ name: "mf-select" }, parent.activateValidation({"message":"This field is required.","minLength":1,"maxLength":"","type":"none","required":false}));
	   if ( parent.getValue("mf-select") === '' && false ) {
		   parent.handleChange({
			   target: {
				   name: 'mf-select',
				   value: ''
			   }
		   });
		   parent.setValue( 'mf-select', '', true );
	   }
   }}
   />

			<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-select"
as=${html`<span className="mf-error-message"></span>`}
/>

	</div>


</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-28e348d" data-id="28e348d" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-8e6ec3d elementor-widget elementor-widget-mf-number" data-id="8e6ec3d" data-element_type="widget" data-settings="{&quot;mf_input_name&quot;:&quot;mf-number&quot;}" data-widget_type="mf-number.default">
<div className="elementor-widget-container">

<div className="mf-input-wrapper">
	<label className="mf-input-label" htmlFor="mf-input-number-8e6ec3d">
${ parent.decodeEntities(`Seat`) } 					<span className="mf-input-required-indicator"></span>
</label>

<input
type="number"
className="mf-input "
id="mf-input-mobile-8e6ec3d"
name="mf-number"
placeholder="${ parent.decodeEntities(`Set Seat`) } "
			onInput=${parent.handleChange}
aria-invalid=${validation.errors['mf-number'] ? 'true' : 'false'}
ref=${el => parent.activateValidation({"message":"This field is required.","minLength":1,"maxLength":"","type":"none","required":false,"expression":"null"}, el)}
		/>

	<${validation.ErrorMessage}
errors=${validation.errors}
name="mf-number"
as=${html`<span className="mf-error-message"></span>`}
/>

</div>

</div>
</div>
</div>
</div>
<div className="elementor-column elementor-col-33 elementor-inner-column elementor-element elementor-element-11836d6" data-id="11836d6" data-element_type="column">
<div className="elementor-widget-wrap elementor-element-populated">
		<div className="elementor-element elementor-element-e96198e mf-btn--justify mf-btn--mobile-left elementor-widget elementor-widget-mf-button" data-id="e96198e" data-element_type="widget" data-widget_type="mf-button.default">
<div className="elementor-widget-container">
<div className="mf-btn-wraper " data-mf-form-conditional-logic-requirement="">
	<button type="submit" className="metform-btn metform-submit-btn " id="">
<span>${ parent.decodeEntities(`Submit Button`) } </span>
</button>
</div>
</div>
</div>
</div>
</div>
	</div>
</section>
</div>
</div>
	</div>
</section>
	</div>
	`}
</div>

${is_dummy_markup ? message_position === 'bottom' ? props.ResponseDummyMarkup(message_successIcon, message_proClass) : '' : ''}
${is_dummy_markup ? ' ' : message_position === 'bottom' ? props.SubmitResponseMarkup`${parent}${state}${message_successIcon}${message_errorIcon}${message_proClass}` : ''}

</form>
`
</script>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</div>
</section>
