sap.ui.define([
    'sap/ui/core/message/Message',
    'sap/ui/core/MessageType'
], function (Message,
    MessageType) {
    "use strict";

    var Validator = function () {
        this._isValid = true;
        this._isValidationPerformed = false;
    };

    Validator.prototype.isValid = function () {
        return this._isValidationPerformed && this._isValid;
    };

    Validator.prototype.validate = function (oControl) {
        this._isValid = true;
        sap.ui.getCore().getMessageManager().removeAllMessages();
        this._validate(oControl);
        return this.isValid();
    };

    Validator.prototype._validate = function (oControl) {
        var aPossibleAggregations = ["items", "content", "form", "formContainers", "formElements", "fields", "headerContent", "sections", "ObjectPageSection"],
            aControlAggregation = null,
            oControlBinding = null,
            aValidateProperties = ["value", "selectedKey", "text"],
            isValidatedControl = false,
            oExternalValue, oInternalValue,
            i, j;

        if (oControl instanceof sap.ui.core.Control ||
            oControl instanceof sap.ui.layout.form.FormContainer ||
            oControl instanceof sap.ui.layout.form.FormElement) {

            if (oControl.getVisible()) {

                for (i = 0; i < aValidateProperties.length; i += 1) {
                    if (oControl.getBinding(aValidateProperties[i])) {
                        if (oControl.getBinding(aValidateProperties[i]).getType()) {
                            try {
                                oControlBinding = oControl.getBinding(aValidateProperties[i]);
                                oExternalValue = oControl.getProperty(aValidateProperties[i]);
                                oInternalValue = oControlBinding.getType().parseValue(oExternalValue, oControlBinding.sInternalType);
                                oControlBinding.getType().validateValue(oInternalValue);
                            }
                            catch (ex) {
                                this._isValid = false;
                                oControlBinding = oControl.getBinding(aValidateProperties[i]);
                                sap.ui.getCore().getMessageManager().addMessages(
                                    new Message({
                                        message: ex.message,
                                        type: MessageType.Error,
                                        target: (oControlBinding.getContext() ? oControlBinding.getContext().getPath() + "/" : "") +
                                            oControlBinding.getPath(),
                                        processor: oControl.getBinding(aValidateProperties[i]).getModel()
                                    })
                                );
                            }

                            isValidatedControl = true;
                        }
                    }
                }

                if (!isValidatedControl) {
                    for (i = 0; i < aPossibleAggregations.length; i += 1) {
                        aControlAggregation = oControl.getAggregation(aPossibleAggregations[i]);

                        if (aControlAggregation) {
                            if (aControlAggregation instanceof Array) {
                                for (j = 0; j < aControlAggregation.length; j += 1) {
                                    this._validate(aControlAggregation[j]);
                                }
                            }
                            else {
                                this._validate(aControlAggregation);
                            }
                        }
                    }
                }
            }
        }
        this._isValidationPerformed = true;
    };

    return Validator;
});