sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/ValueState",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller, ValueState, JSONModel) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappadmin238.controller.Validacao", {
            onInit: function () {

                sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                    //     debugger;
                    oEvent.getParameter("element").setValueState(ValueState.Success);
                });
                sap.ui.getCore().attachValidationError(function (oEvent) {
                    //   debugger;
                    oEvent.getParameter("element").setValueState(ValueState.Error);

                });


                //    debugger;   
                //    var xx = this.getView().byId("_IDGenInput2");
                //     var xx2 = this.getView().byId("_IDGenInput2");

                // Model de apoio

                var oModel = new JSONModel();
                this.getView().setModel(oModel, "MDL_Produto");

            },


            verModel: function(){
                debugger;
                var oModel = this.getView().getModel("MDL_Produto");
                console.log(oModel.getData());

            }

        });
    });
