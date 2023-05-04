sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/format/NumberFormat",
    "br/com/gestao/fioriappadmin238/util/Formatter",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/odata/ODataModel",
    "sap/m/MessageToast",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "br/com/gestao/fioriappadmin238/util/Validator",
    "sap/ui/core/ValueState",
    "sap/m/MessageBox",
    "sap/m/BusyDialog"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        NumberFormat, Formatter, Fragment, JSONModel, ODataModel, MessageToast, Filter, FilterOperator, Validator, ValueState, MessageBox, BusyDialog) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappadmin238.controller.Detalhes", {

            objFormatter: Formatter,

            //Criar o meu objeto Route e acoplando a função que fará o bindingElement
            onInit: function () {


                sap.ui.getCore().attachValidationError(function (oEvent) {
                    //   
                    oEvent.getParameter("element").setValueState(ValueState.Error);
                });
                sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                    //     
                    oEvent.getParameter("element").setValueState(ValueState.Success);
                });

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("Detalhes").attachMatched(this.onBindingProdutoDetalhes, this);

                debugger;
                // 1 - Chamar a função onde irá fazer o carregamento dos fragments iniciais
                this._formFragments = {};

                this._showFormFragments("DisplayBasicInfo", "vboxViewBasicInfo");
                this._showFormFragments("DisplayTechInfo", "vboxViewTechInfo");


            },

            //2- Recebe como parametro o nome do fragment e o nome do Vbox de destino
            _showFormFragments: function (sFragmentName, sVBoxName) {
                var objVBox = this.byId(sVBoxName);
                objVBox.removeAllItems();

                this._getFormAllItems(sFragmentName).then(function (oVBox) {
                    objVBox.insertItem(oVBox);
                });
            },

            //3- Cria um objeto fragmet baseado no nome e adiciona em um objeto fragment com uma coleção de fragments
            _getFormAllItems: function (sFragmentName) {
                var oFormFragment = this._formFragments[sFragmentName];
                var oView = this.getView();

                if (!oFormFragment) {
                    oFormFragment = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappadmin238.frags." + sFragmentName,
                        controller: this
                    });

                    this._formFragments[sFragmentName] = oFormFragment;

                }

                return oFormFragment;
            },

            onBindingProdutoDetalhes: function (oEvent) {
                //capiturando o parametro route detalhes (productId)
                var oProduto = oEvent.getParameter("arguments").productId;
                //   debugger;
                //Objeto referente a view Detalhes
                var oView = this.getView();

                //Criar um parametro de controle para redirecionamento da view após o Delete
                this._bDelete = false;

                var sURL = "/Produtos('" + oProduto + "')";

                oView.bindElement({
                    path: sURL,
                    parameters: {
                        expand: 'to_cat,to_user_update'
                      //  expand: 'to_cat,to_user_create,to_user_update'
                    },
                    events: {
                        change: this.onBindingChange.bind(this),
                        dataRequested: function () {
                            //      debugger;
                            oView.setBusy(true);
                        },
                        dataReceived: function (data) {
                            //    debugger;
                            oView.setBusy(false);
                        }
                    }
                });
            },
            onBindingChange: function (oEvent) {

                debugger;
                var oView = this.getView();
                var oElementBinding = oView.getElementBinding();

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                //se não existir um elemento(registro) válido eu farei uma ação que é redirecionar para uma nova view.
                if (!oElementBinding.getBoundContext()) {

                    if (!this._bDelete){
                        oRouter.getTargets().display("objNotFound");
                        return;
                    }

                } else {
                    this._oProduto = Object.assign({}, oElementBinding.getBoundContext().getObject()); this._oProduto = Object.assign({}, oElementBinding.getBoundContext().getObject());
                }

            },
            criarModel: function () {
                // Model Produto
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "MDL_Produto");
            },

            handleEditBtnPress: function (oEvent) {

                this.criarModel();

                // Atribui no objeto o registro clonado
                var oModelProduto = this.getView().getModel("MDL_Produto");
                oModelProduto.setData(this._oProduto);

                //Recupera usuários
                this.onGetUsuarios();

                //Habilita a edição
                this._HabilitaEdicao(true);


            },
            handleCancelPress: function () {
                //Restore do registro atual do model
                debugger;
                var oModel = this.getView().getModel();
                oModel.refresh(true);

                //Habilita a edição
                this._HabilitaEdicao(false);

            },

            _HabilitaEdicao: function (bEdit) {
                debugger;

                var oView = this.getView();

                //Botões de ações
                oView.byId("btnEdit").setVisible(!bEdit);
                oView.byId("btnDelete").setVisible(!bEdit);
                oView.byId("btnSave").setVisible(bEdit);
                oView.byId("btnCancel").setVisible(bEdit);

                // Habilitar/Desabilitar Abas (seções) das páginas               
                oView.byId("Section1").setVisible(!bEdit);
                oView.byId("Section2").setVisible(!bEdit);
                oView.byId("Section3").setVisible(bEdit);

                if (bEdit) {
                    this._showFormFragments("Change", "vboxChangeProduct");
                } else {
                    this._showFormFragments("DisplayBasicInfo", "vboxViewBasicInfo");
                    this._showFormFragments("DisplayTechInfo", "vboxViewTechInfo");
                }

              
            },

            onNavBack: function (oEvent) {

                //Desabilitar a edição. Deixar somente leitura.
                this._HabilitaEdicao(false);

                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("Lista");

                //oRouter.getTargets().display("lista");
            },

            handleEditPress: function (oEvent) {
                debugger;

                //Criamos noss Model de produto
                this.criarModel();
             
                //Atribui no objeto model o resgistro clonado
                var oModelProduto = this.getView().getModel("MDL_Produto");
                oModelProduto.setData(this._oProduto);
          
                //-------------Atualiza Changedat para data atual
                var vDataAtual = this.objFormatter.formatDate(new Date()); 
                oModelProduto.setProperty("/Changedat",vDataAtual);

                //Recupera os usuários
                this.onGetUsuarios();

                //Habilita a edição
                this._HabilitaEdicao(true);

              

            },

            /*
                       onValida: function (oEvent) {
           
                       },
             */
            onGetUsuarios: function () {

                var t = this;
                var strEntity = "/sap/opu/odata/sap/ZSB_USERS_238";

                var oModelSend = new ODataModel(strEntity, true);

                //Entidade Usuarioss  
                oModelSend.read("/Usuarios", {

                    success: function (oData, results) {

                        if (results.statusCode === 200) {
                            var oModelUsers = new JSONModel();
                            oModelUsers.setData(oData.results);
                            t.getView().setModel(oModelUsers, "MDL_Users");

                        }

                    },
                    error: function (e) {
                        var oRet = JSON.parse(e.response.body);
                        Toast.show(oRet.error.message.value, {
                            duration: 4000

                        });
                    }

                });


            },
            onCategoria: function (oEvent) {
                debugger;
                this._oInput = oEvent.getSource().getId();
                var oView = this.getView();

                //Verifico se o objeto fragment existe. Se não, crio e adiciono na view 
                if (!this._CategoriaSearchHelp) {
                    this._CategoriaSearchHelp = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappadmin238.frags.SH_Categorias",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });
                }

                this._CategoriaSearchHelp.then(function (oDialog) {
                    debugger;
                    //Limpando o filtro de categorias na abertura do fragment
                    //   oDialog.getBinding("items").filter([]);

                    //Abertura do fragment
                    oDialog.open();

                });

            },
            getSupplier: function (oEvent) {

                this._oInput = oEvent.getSource().getId();
                var oValue = oEvent.getSource().getValue();

                // URL de chamada de um fornecedor
                var sElement = "/Fornecedores('" + oValue + "')";

                //Cria o objeto model default
                var oModel = this.getView().getModel();

                //Model onde o usuário realiza o preenchimento das informações de produto
                var oModelProduto = this.getView().getModel("MDL_Produto");


                //Realizar a chamada para o SAP
                var oModelSend = new ODataModel(oModel.sServiceUrl, true);

                oModelSend.read(sElement, {

                    success: function (oData, results) {

                        if (results.statusCode === 200) {
                            oModelProduto.setProperty("/Supplierid", oData.Lifnr);
                            oModelProduto.setProperty("/Suppliername", oData.Name1);

                        }

                    },
                    error: function (e) {

                        oModelProduto.setProperty("/Supplierid", "");
                        oModelProduto.setProperty("/Suppliername", "");

                        var oRet = JSON.parse(e.response.body);
                        MessageToast.show(oRet.error.message.value, {
                            duration: 4000

                        });
                    }

                });


            },
            onSuggest: function (oEvent) {

                var sText = oEvent.getParameter("suggestValue");
                var aFilters = [];

                if (sText) {
                    aFilters.push(new Filter("Lifnr", FilterOperator.Contains, sText));

                }

                oEvent.getSource().getBinding("suggestionItems").filter(aFilters);

            },
            onValida: function (oEvent) {


                //Criação do objeto validador
                var validator = new Validator();

                //Checar validação
                if (validator.validate(this.byId("vboxChangeProduct"))) {
                    this.onUpdate();
                }


                // Poderia validar campo a campo também
                // var oImputName = this.byId("_IDGenInput4");

                // if (oImputName.getValue() === "") {
                //     console.log("Preenchimento Obrigatório");
                // }
            },
            onUpdate: function () {


                //1 - criando uma referencia do objeto model que está recebendo as inforamações do
                //fragment 
                var oModel = this.getView().getModel("MDL_Produto");
                var objUpdate = oModel.getData();
                var sPath = this.getView().getElementBinding().getPath();

                //2 - Manipular propriedades 
                //  objUpdate.Productid = this.geraID();
                //objUpdate.Price = objUpdate.Price[0].toString();
                objUpdate.Price = objUpdate.Price.toString();
                objUpdate.Weightmeasure = objUpdate.Weightmeasure.toString();
                objUpdate.Width = objUpdate.Width.toString();
                objUpdate.Depth = objUpdate.Depth.toString();
                objUpdate.Height = objUpdate.Height.toString();
                //   objUpdate.Createdat = this.objFormatter.dateSAP(objUpdate.Createdat);
                //  objUpdate.Currencycode = "BRL";
                //  objUpdate.Userupdate = "";
                objUpdate.Changedat = new Date().toISOString().substring(0, 19);

                debugger;
                delete objUpdate.to_cat;
                delete objUpdate.__metadata;
                delete objUpdate.to_user_create;
                delete objUpdate.to_user_update;


                //Criando uma referencia do arquivo i18n
                var bundle = this.getView().getModel("i18n").getResourceBundle();

                //Variavel contexto da View
                var t = this;

                // 4 - Criar um objeto model referencia do model default (OData)
                // Dentro do manifest -- mainService - que é a  "uri": "/sap/opu/odata/sap/ZSB_PRODUCAO_238/",
                var oModelProduto = this.getView().getModel();

                debugger;

                MessageBox.confirm(
                    bundle.getText("updateDialogMsg", [objUpdate.Productid]),
                    function (oAction) { //função de disparo do insert

                        //Verificando se o usuário confirmou ou não a operação
                        if (MessageBox.Action.OK === oAction) {

                            //Criamos um BusyDialog
                            t._oBusyDialog = new BusyDialog({
                                text: bundle.getText("Sendind")
                            });

                            t._oBusyDialog.open();

                            setTimeout(function () {

                                //Realizar a chamda para o SAP    
                                var oModelSend = new ODataModel(oModelProduto.sServiceUrl, true);
                                debugger;
                                oModelSend.update(sPath, objUpdate, null,
                                    function (d, r) { //Função retorno Sucesso

                                        debugger;

                                        if (r.statusCode === 204) {

                                            //Fechar o BusyDialog
                                            t._oBusyDialog.close();

                                            MessageBox.success(bundle.getText("updateDialogSucess", [objUpdate.Productid]));

                                            //iremos fechar o objeto dialog do fragment
                                            //Dar um refresh no model default
                                            //  t.getView().getModel().refresh();

                                            //Voltar para somente leitura
                                            t.handleCancelPress();

                                        }

                                    }, function (e) {  //Função retorno Erro

                                        //Fechar o BusyDialog
                                        t._oBusyDialog.close();
                                        var oRet = JSON.parse(e.response.body);
                                        MessageToast.show(oRet.error.message.value, {
                                            duration: 4000

                                        });

                                    });



                            }, 2000);
                        }
                    },
                    bundle.getText("updateDialogTitle") //exibe o titulo do Dialog
                );


            },
            onDelete: function () {
                debugger;
                //Acessando o registro.
                var objDelete = this.getView().getElementBinding().getBoundContext().getObject();
                var sPath = this.getView().getElementBinding().getPath();

                //Criando uma referencia do arquivo i18n
                var bundle = this.getView().getModel("i18n").getResourceBundle();

                //Variavel contexto da View
                var t = this;

                // 4 - Criar um objeto model referencia do model default (OData)
                // Dentro do manifest -- mainService - que é a  "uri": "/sap/opu/odata/sap/ZSB_PRODUCAO_238/",
                var oModelProduto = this.getView().getModel();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                debugger;

                MessageBox.confirm(
                    bundle.getText("deleteDialogMsg", [objDelete.Productid]),
                    function (oAction) { //função de disparo do insert

                        //Verificando se o usuário confirmou ou não a operação
                        if (MessageBox.Action.OK === oAction) {

                            //Criamos um BusyDialog
                            t._oBusyDialog = new BusyDialog({
                                text: bundle.getText("Sendind")
                            });

                            t._oBusyDialog.open();

                            setTimeout(function () {

                                //Realizar a chamda para o SAP    
                                var oModelSend = new ODataModel(oModelProduto.sServiceUrl, true);
                                debugger;
                                oModelSend.remove(sPath, {
                                    success: function (d, r) { //Função retorno Sucesso

                                        debugger;

                                        if (r.statusCode === 204) {

                                            //Fechar o BusyDialog
                                            t._oBusyDialog.close();


                                            //setar o parâmetro de Delete

                                            t._bDelete = true;

                                            MessageBox["information"](bundle.getText("deleteDialogSucess", [objDelete.Productid]), {
                                                actions: [MessageBox.Action.OK],
                                                onClose: function (oAction) {
                                                    if (oAction === MessageBox.Action.OK) {
                                                        t.getView().getModel().refresh();
                                                        oRouter.navTo("Lista");
                                                    }
                                                }.bind(this)

                                            });
                                        }

                                    },
                                    erro: function (e) {  //Função retorno Erro

                                        //Fechar o BusyDialog
                                        t._oBusyDialog.close();
                                        var oRet = JSON.parse(e.response.body);
                                        MessageToast.show(oRet.error.message.value, {
                                            duration: 4000

                                        });

                                    }

                                });


                            }, 2000);
                        }
                    },
                    bundle.getText("deleteDialogTitle") //exibe o titulo do Dialog
                );


            }

        });
    });
