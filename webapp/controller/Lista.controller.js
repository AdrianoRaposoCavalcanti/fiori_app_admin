sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageBox",
    "sap/m/MessageToast",
    "br/com/gestao/fioriappadmin238/util/Formatter",
    "sap/ui/core/Fragment",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/ValueState",
    "br/com/gestao/fioriappadmin238/util/Validator",
    "sap/m/BusyDialog",
    "sap/ui/model/odata/ODataModel",
    "sap/ui/core/mvc/JSONView",
    'sap/m/Dialog',
    'sap/m/Image',
    'sap/m/Button',
    "sap/makit/Category"

],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller,
        Filter,
        FilterOperator,
        MessageBox,
        MessageToast,
        Formatter,
        Fragment,
        JSONModel,
        ValueState,
        Validator,
        BusyDialog,
        ODataModel,
        JSONView,
        Dialog,
        Image,
        Button,
        Category) {
        "use strict";

        return Controller.extend("br.com.gestao.fioriappadmin238.controller.Lista", {

            objFormatter: Formatter,

            onInit: function () {


                sap.ui.getCore().attachValidationError(function (oEvent) {
                    //   
                    oEvent.getParameter("element").setValueState(ValueState.Error);

                });
                sap.ui.getCore().attachValidationSuccess(function (oEvent) {
                    //     
                    oEvent.getParameter("element").setValueState(ValueState.Success);
                });


                var oConfiguration = sap.ui.getCore().getConfiguration();
                //   oConfiguration.setFormatLocale("pt_BR");

                //   oConfiguration.setLanguage("pt_BR"); //


            },

            criarModel: function () {
                // Model Produto
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "MDL_Produto");
            },

            onSearch: function (evt) {


                //Capturando individualmente cada objeto Filter Bar
                //    
                var oProdutoInput = this.getView().byId("productIdInput");
                var oProdutoNomeInput = this.getView().byId("productNameInput");
                var oProdutoCategoriaInput = this.getView().byId("productCartegoryInput");


                var objFilter = { filters: [], and: true };
                objFilter.filters.push(new Filter("Productid", FilterOperator.Contains, oProdutoInput.getValue()));
                objFilter.filters.push(new Filter("Name", FilterOperator.Contains, oProdutoNomeInput.getValue()));
                objFilter.filters.push(new Filter("Category", FilterOperator.Contains, oProdutoCategoriaInput.getValue()));

                var oFilter = new Filter(objFilter);

                // var oFilter = new Filter({
                //     filters: [

                //         new Filter("Productid", FilterOperator.Contains, oProdutoInput.getValue()),
                //         new Filter("Name", FilterOperator.Contains, oProdutoNomeInput.getValue()),
                //         new Filter("Category", FilterOperator.Contains, oProdutoCategoriaInput.getValue())

                //     ],
                //     and: true
                // })


                //Criação do objeto Table e acesso e agregação items onde sabemos qual a entidade onde será aplicado o filtro
                var oTable = this.getView().byId("tableProdutos");
                var binding = oTable.getBinding("items");

                //É aplicado o filtro para oDatabinding
                binding.filter(oFilter);
            },
            onFilterChange: function (evt) {

            },

            onAfterVariantLoad: function (evt) {

            },
            oRouting: function (oEvent) {
                //   
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                oRouter.navTo("Detalhes");
            },
            onSelectedItem: function (oEvent) {


                //  


                // Acessamos um contexto de model com nome  
                //var oProdutoId = oEvent.getSource().getBindingContext("Nome do Model").getProperty("Productid"); 



                //getSource() -> Objeto Clicado. No caso aqui  ColumnListItem                    
                //getBindingContext() - É a linha da tabela(registro) que esta sendo acessada para o click
                //getProperty() Acessa a propriendade da tabela ou seja. o campo que será passado como parametro

                //Passo 1 - Captura do valor do produto
                var oProdutoId = oEvent.getSource().getBindingContext().getProperty("Productid");

                //Passo 2 - Captura do valor do produto
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                //  MessageToast.show("Entrei aqui");


                //  this.getView().setBusy(true);

                oRouter.navTo("Detalhes", {
                    productId: oProdutoId
                });

                // setTimeout(() => {
                //     this.getView().setBusy(false);

                // }, "3000")




            },
            //Nova função para enviarmos para o Git

            onFuncaoGit: function () {

            },

            onCategoria: function (oEvent) {
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
                    //Limpando o filtro de categorias na abertura do fragment
                    oDialog.getBinding("items").filter([]);

                    //Abertura do fragment
                    oDialog.open();

                });

            },

            onCancelarFragCategory: function () {

                // Funciona
                //  oEvent.getSource().getParent().close();
                // Funciona
                // this.getView().byId("_IDGenDialog1").close();
                this._CategoriaSearchHelp.then(function (oDialog) {

                    //Fechamento do fragment
                    oDialog.close();
                });

            },


            onNovoProduto: function (oEvent) {
                //      
                //  this._oInput = oEvent.getSource().getId();

                debugger;

                if (this.getView().getModel("MDL_Produto")) {

                    if (this.getView().getModel("MDL_Produto").bDestroyed == true) {
                        //Criar o Model Produto
                        this.criarModel();
                    }
                } else {

                    this.criarModel();

                }

                var t = this;

                var oView = this.getView();

                //Verifico se o objeto fragment existe. Se não, crio e adiciono na view 
                if (!this._Produto) {
                    this._Produto = Fragment.load({
                        id: oView.getId(),
                        name: "br.com.gestao.fioriappadmin238.frags.Insert",
                        controller: this
                    }).then(function (oDialog) {
                        oView.addDependent(oDialog);
                        return oDialog;
                    });

                }

                this._Produto.then(function (oDialog) {

                    //Limpando o filtro de categorias na abertura do fragment

                    // Nesse caso terá utilidade
                    // oDialog.getBinding("items").filter([]);

                    //Abertura do fragment
                    oDialog.open();

                    //-------------Inseri data
                    var vDataAtual = t.objFormatter.formatDate(new Date());
                    oView.byId("inputData").setValue(vDataAtual);

                    t.onGetUsuarios();
                    t.getReadOpcoes();

                });

            },






            onValueHelpSearch: function (oEvent) {

                //Opção 1 - Crio um único objeto filtro
                //Criando um objeto do tipo Filter que ira receber o valor e associar na propriedade Description
                var sValue = oEvent.getParameter("value");
                // var oFilter = new Filter("Description", FilterOperator.Contains, sValue);
                // oEvent.getSource().getBinding("items").filter([oFilter]);

                //Opção 2 - Podemos criar um objeto (dinamico) onde adiciono várias propriedades 
                var objFilter = { filters: [], and: false };
                objFilter.filters.push(new Filter("Description", FilterOperator.Contains, sValue));
                objFilter.filters.push(new Filter("Category", FilterOperator.Contains, sValue));

                var oFilter = new Filter(objFilter);

                oEvent.getSource().getBinding("items").filter([oFilter]);
            },

            onValueHelpClose: function (oEvent) {
                var oSelectedItem = oEvent.getParameter("selectedItem");
                //    var oSelectedItem = oEvent.getParameter("selectedItem").getBindingContext().getObject();
                var oImput = null;

                if (this.byId(this._oInput)) {
                    oImput = this.byId(this._oInput);

                } else {
                    oImput = sap.ui.getCore().byId(this._oInput);
                }

                if (!oSelectedItem) {
                    oImput.resetProperty("value");
                    return;
                }

                oImput.setValue(oSelectedItem.getTitle());
                //  oImput.setValue(oSelectedItem.Category);


            },

            handleSelectChange: function (oEvent) {
                var type = oEvent.getParameter("selectedItem").getKey();
                this.byId("ProductList").getItems().forEach(function (item) {
                    item.setType(type);
                });
            },

            handlePress2: function (oEvent) {
                MessageToast.show("'press' event fired!");
            },

            handleDetailPress: function (oEvent) {
                MessageToast.show("'detailPress' event fired!");
            },


            handlePress: function (evt) {
                debugger;
                var sSrc = evt.getSource().getTarget();
                var oDialog = new Dialog({
                    content: new Image({
                        src: sSrc
                    }),
                    beginButton: new Button({
                        text: 'Close',
                        press: function () {
                            oDialog.close();
                        }
                    }),
                    afterClose: function () {
                        oDialog.destroy();
                    }
                });
                oDialog.open();
            },

            onCancelar: function (oEvent) {

                // Funciona
                //  oEvent.getSource().getParent().close();
                // Funciona
                // this.getView().byId("_IDGenDialog1").close();

                var oView = this.getView();

                this._Produto.then(function (oDialog) {

                    //-------------------------------------
                    // var vname = oView.byId("_IDGenInput4");

                    //---------------Guardar dados no Model
                    //     var voModel = oView.getModel("MDL_Produto");
                    //    oView.setModel(voModel);

                    //Fechamento do fragment
                    oDialog.close();
                });

            },

            onValida: function (oEvent) {

                debugger;
                //Criação do objeto validador
                var validator = new Validator();

                //Checar validação
                if (validator.validate(this.byId("_IDGenDialog1")) || 1 == 1) {

                    this.onInsert();
                    // console.log("Tudo ok!");

                }
                // else{
                //     console.log("Erro na validação");
                // } 


                // Poderia validar campo a campo também
                // var oImputName = this.byId("_IDGenInput4");

                // if (oImputName.getValue() === "") {
                //     console.log("Preenchimento Obrigatório");
                // }
            },
            onInsert: function () {


                //1 - criando uma referencia do objeto model que está recebendo as inforamações do
                //fragment 
                var oModel = this.getView().getModel("MDL_Produto");
                var objNovo = oModel.getData();

                //2 - Manipular propriedades 
                objNovo.Productid = this.geraID();
                objNovo.Price = objNovo.Price[0].toString();
                objNovo.Weightmeasure = objNovo.Weightmeasure.toString();
                objNovo.Width = objNovo.Width.toString();
                objNovo.Depth = objNovo.Depth.toString();
                objNovo.Height = objNovo.Height.toString();
                objNovo.Createdat = this.objFormatter.dateSAP(objNovo.Createdat);
                objNovo.Currencycode = "BRL";
                objNovo.Userupdate = "";
                


                //Criando uma referencia do arquivo i18n
                var bundle = this.getView().getModel("i18n").getResourceBundle();

                //Variavel contexto da View
                var t = this;


                // 4 - Criar um objeto model referencia do model default (OData)

                // Dentro do manifest -- mainService - que é a  "uri": "/sap/opu/odata/sap/ZSB_PRODUCAO_238/",
                var oModelProduto = this.getView().getModel();

                MessageBox.confirm(
                    bundle.getText("insertDialogMsg"),
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

                                oModelSend.create("Produtos", objNovo, null,
                                    function (d, r) { //Função retorno Sucesso
                                        if (r.statusCode === 201) {

                                            MessageToast.show(bundle.getText("insertDialogSucess", [objNovo.Productid]), {
                                                duration: 4000
                                            });

                                            //iremos fechar o objeto dialog do fragment
                                            t.onCancelar();

                                            //Dar um refresh no model default
                                            t.getView().getModel().refresh();

                                            debugger;
                                            t.getView().getModel("MDL_Produto").destroy();

                                            //  t.getView().getModel("MDL_Produto").setData(null);
                                            //  t.getView().getModel("MDL_Produto").refresh();
                                            //  this.criarModel();
                                            //sap.ui.getCore().getModel("MDL_Produto").refresh(true);

                                            //Fechar o BusyDialog

                                            t._oBusyDialog.close();

                                        }

                                    }, function (e) {  //Função retorno Erro

                                        //Fechar o BusyDialog
                                        t._oBusyDialog.close();

                                        var oRet = JSON.parse(e.response.body);
                                        //  var test = JSON.parse(e.response.body);

                                        MessageToast.show(oRet.error.message.value, {
                                            duration: 4000

                                        });


                                    });



                            }, 2000);
                        }
                    },
                    //   bundle.getText("insertDialogTitle") //exibe o titulo do Dialog
                );


            },

            //Geramos um ID de Produto Dinamico
            geraID: function () {

                return 'xxxxxxxxxx'.replace(/[xy]/g, function (c) {

                    var r = Math.random() * 16 | 0,

                        v = c == 'x' ? r : (r & 0x3 | 0x8);

                    return v.toString(16).toUpperCase();

                });

            },

            OncliAgora: function (oEvent) {
                //    MessageBox.information("Estou aqui");
                debugger;
                //  var oSelectedItem = oEvent.getParameter("selectedItem");
                var oSelectedItem = oEvent.getParameter("selectedItem").getBindingContext().getObject();
                var oImput = null;

                if (this.byId(this._oInput)) {
                    oImput = this.byId(this._oInput);

                } else {
                    oImput = sap.ui.getCore().byId(this._oInput);
                }

                if (!oSelectedItem) {
                    oImput.resetProperty("value");
                    return;
                }

                //  oImput.setValue(oSelectedItem.getTitle());
                oImput.setValue(oSelectedItem.Category);
            },

            //Capturar a coleção de usuarios de um novo serviço oData 
            onGetUsuarios: function () {
                var t = this;
                var strEntity = "/sap/opu/odata/sap/ZSB_USERS_238";

                var oModelSend = new ODataModel(strEntity, true);

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
                        MessageToast.show(oRet.error.message.value, {
                            duration: 4000

                        });
                    }

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
            getReadOpcoes: function () {

                // Item 1 - Chamada via URL

                var sElement = "/Produtos";

                //var sElement = "/Produtos('322E3BBF5A')";

                //var sElement = "/Produtos('322E3BBF5A')/to_cat";

                var afilters = [];

                // afilters.push(new Filter("Status", FilterOperator.EQ, 'E'));

                afilters.push(new Filter("Category", FilterOperator.EQ, 'CPDA'));

                // Cria o objeto model default 

                var oModel = this.getView().getModel();

                // Realizar a chamada para o SAP

                var oModelSend = new ODataModel(oModel.sServiceUrl, true);

                oModelSend.read(sElement, {

                    filters: afilters,

                    urlParameters: {

                        $expand: "to_cat"
                    },

                    success: function (oData, results) {

                        if (results.statusCode === 200) { // Sucesso do Get

                        }

                    },

                    error: function (e) {

                        var oRet = JSON.parse(e.response.body);

                        MessageToast.show(oRet.error.message.value, {

                            duration: 4000

                        });

                    }

                });

            },

            dataAtual: function (oEvent) {
                debugger;
                var vDataAtual = new Date();
                //      this.getView().byId("inputData").setValue(vDataAtual);
                var oModel = new JSONModel();
                this.getView().setModel(oModel, "MDL_Produto");
                oModel.setData({
                    Createdat: new Date()
                });
            },

            upperCaseA: function (oEvent) {
                debugger;
                var oValue = oEvent.getParameter("value"),
                    oValueUpper = oEvent.getParameter("value").toUpperCase();
                if (oValue != oValueUpper) {
                    oEvent.getSource().setValue(oValueUpper);
                }
            },
        });
    });
