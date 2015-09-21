
/*global hasUserFormRWAccess : true*/

/*global define, dojo, dojox, dijit, console, alert, setTimeout, confirm : true*/

define(["dojo/_base/lang","dijit/form/Form","dojox/mvc/at","dojox/mvc/Output",
		"dijit/form/DateTextBox","dijit/form/Textarea","/common/widgets/ValidationTextArea.js",
		"dijit/form/RadioButton","dijit/form/CheckBox","dojo/dom-class","dojo/on",
		"controllers/widgets/recordsSearch.js",
		"models/records/recordsModel.js",
		"dojo/domReady!"],
    function (lang,Form,at,Output,Textarea,ValidationTextArea,DateTextBox,RadioButton,CheckBox,domClass,on,RecordsSearchWidget,recordsModel) {
        "use strict";
		var _self;
		var formModel;
		var recordsFieldsConfig = recordsModel.getFormFieldConfig();
		var recordsSearchWidget;
        return {
			
            init: function () {
				_self=this;
				_self.initializeView();
				recordsSearchWidget = new RecordsSearchWidget();
				recordsSearchWidget.setCallbackFunction(_self.updateModel);
            },
			
			//initialize field and page actions
			initializeView:function(){
				FRMS.FrmsUtils.initializeFields(recordsFieldsConfig,_self);
				// map page actions
				//this.validateRecords_btn.on('click',_self.promoteForm);
				this.btnSave_recordsCreate.on('click',_self.saveForm );
				this.btnCancel_recordsCreate.on('click',_self.cancelForm);
			},

			//before Activate
			beforeActivate: function (previousView, data) {
                console.debug('Forms:Entering into beforeActivate method..');
                
				_self.resetView();
				if(data && data.displaySearch){
					recordsSearchWidget.placeAt(_self.recordsSearchContainer);
					_self.viewTitle.innerHTML =FRMS.FrmsConstants.constants.MODIFY_FORM_TITLE;
				}else{
					_self.viewTitle.innerHTML =FRMS.FrmsConstants.constants.CREATE_FORM_TITLE;
				}
				var document = null;
				//set document obj if passed from another view
				if(data && data.document){
					document = data.document;
				}
				formModel = recordsModel.createFormModel(document);
				_self.loadViewWithModel(formModel);
            },
            // Reset view
			resetView:function(){
				_self.documentForm.reset();
				_self.formsSearchContainer.innerHTML='';
			},
			//call back function on search
			updateModel:function(documentInstance){
				console.log('UpdateModel');
				console.log(documentInstance);
				console.log(formModel);
				formModel.document = documentInstance;
				_self.loadViewWithModel(formModel);
			},
			// TODO - move to FRMSUtil
			loadViewWithModel:function(modelObj){
				for(var field in recordsFieldsConfig){
					//set value from model to all form Fields
					var fld=_self[field];
					if(fld){
						// map fields with modal data
						if(modelObj){
							var customMapping =recordsFieldsConfig[field].customMapping;
							var doc =modelObj.document;
							if(customMapping){
								fld.set(customMapping.mappingAttr,at(doc,field).transform(customMapping.converter),false);
							}else {
								fld.set('value',at(doc,field),false);
							}
						}else{
							console.log('Model is null. Nothing to map');
						}						
					}
				}
			},
			
			setMandatoryAttrs:function(action){
				for(var field in recordsFieldsConfig){
					var wdg =_self[field];
					if(wdg){
						var isMandatory=(action==FRMS.FrmsConstants.constants.PROMOTN_VALIDTN)?recordsFieldsConfig[field].reqForPromotion:recordsFieldsConfig[field].reqForShell;
						wdg.set('required',isMandatory,false);//set mandatory fields based on action
					}
				}
			},
			validateFields:function(){
				var inValidFlds=[];
				for(var field in recordsFieldsConfig){
					var wdg =_self[field];
					if(wdg){
						console.log("Field:"+ field);
						if(wdg.validate){
							console.log(wdg.validate());
						}
						var isValidInd = (wdg.validate && wdg.validate()) ||  wdg.isValid();
						if(!isValidInd){
							inValidFlds.push(field);
						}
					}
				}
				return inValidFlds;
			},
			validateForm:function(action){
				var form =_self.documentForm;
				console.log(formModel);
				form.connectChildren();
				_self.setMandatoryAttrs(action);
				var validationReslt;
				// general validate
				validationReslt=form.validate();
				// custom validate
				//validationReslt=_self.validateFields();
				return validationReslt;
			},
			
			highlightFields:function(invalidFlds){
				dojo.forEach(invalidFlds , function(field){
					var wdg=_self[field];
					if(wdg){
						wdg.set('state','Error');
					}
				});		
			},
			
			promoteForm:function(){
				console.log("Promotion");
				var validationReslt=_self.validateForm(FRMS.FrmsConstants.constants.PROMOTN_VALIDTN);
				console.log(validationReslt);
				_self.highlightFields(validationReslt);
			},
			saveForm:function(){
				console.log("Promotion");				
				var validationReslt=_self.validateForm(FRMS.FrmsConstants.constants.SAVE);
				console.log(validationReslt);	
				_self.highlightFields(validationReslt);				
			},
			cancelForm:function(){
				console.log(formModel);
			}


        };

    });