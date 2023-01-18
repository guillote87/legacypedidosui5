sap.ui.define([
    'sap/m/library',
    "sap/ui/core/mvc/Controller",
    'sap/m/MessageToast',
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Sorter",
    "legacy/pedidosUI5/utils/formatter",
    "sap/m/MessageBox",
    'sap/ui/export/library',
    'sap/ui/export/Spreadsheet',
    'sap/m/TablePersoController',
    "sap/ui/table/library",
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (mlibrary, Controller, MessageToast, Filter, FilterOperator, JSONModel, Fragment, Sorter, formatter, MessageBox, exportLibrary, Spreadsheet, TablePersoController,library) {
        "use strict";
        var EdmType = exportLibrary.EdmType
        var ResetAllMode = mlibrary.ResetAllMode;
        var SortOrder = library.SortOrder;

        return Controller.extend("legacy.pedidosUI5.controller.View1", {

            formatter: formatter,
            onInit: function () {
                this.bDescending = true;
            },
            onSearch: function () {
                //Validate required fields	          

			if (!this._requiredFieldsCompleted()){
				MessageBox.error("Debe completar todos los filtros");
				return;
			} 
                var that = this
                var oModel = this.oView.getModel()
                console.log(oModel)
                var oDataFilter = new Array()
               that.getView().byId("idTablaPedidos").setBusy(true)

                // Format the date
                var dateFormat = sap.ui.core.format.DateFormat.getDateInstance({ pattern: "YYYYMMdd" });
                var fromDate= dateFormat.format(this.getView().byId("fecha").getDateValue());
                var toDate = dateFormat.format(this.getView().byId("fecha").getSecondDateValue());

                oDataFilter.push(
                    new Filter("OrgVentas", FilterOperator.EQ, this.getView().byId("orgventa").getValue()),
                    new Filter("StatusPedido", FilterOperator.EQ, this.getView().byId("status").getValue())
                )

                if (fromDate && toDate) {
                    oDataFilter.push(
                        new Filter("FechaCreacion", FilterOperator.BT, fromDate, toDate)
                    )}


                let queryFilter = new Array(
                    new Filter({filters: oDataFilter, and: true})
                )
              
                oModel.read("/SetPedidos", {
                    filters: queryFilter,
                    success: function (data) {
                        if (data.results.length) { 
                            that.oView.setModel(new JSONModel({
                                count: data.results.length,
                                datos: data.results
                            }), "datosVarios")
                         
                        } else {
                            MessageToast.show("No hay datos para esta organizacion con este estado")
                            that.oView.setModel(new JSONModel({
                                count: data.results.length,
                                datos: data.results
                            }), "datosVarios")
                           
                        }
                      that.getView().byId("idTablaPedidos").setBusy(false)
                    },
                    error: function () {
                        MessageToast.show("No hay datos")
                     that.getView().byId("idTablaPedidos").setBusy(false)
                    }
                }    
                )
            },
            onCleanFilters: function () {
                this.getView().byId("fecha").setValue(null);
                this.getView().byId("status").setValue(null);
                this.getView().byId("orgventa").setValue(null);
            },
            _requiredFieldsCompleted: function () {

                return (
                    this.byId("orgventa").getValue().length &&		//Validate client entry
                    this.byId("status").getValue().length 		//Validate range of dates
                );
            },
            createColumnConfig: function () {
                var aCols = [];
var columns = this.getView().byId("idTablaPedidos").getColumns()
var items = this.getView().byId("idTablaPedidos").getVisibleItems()[0].mAggregations.cells
console.log(items)

                for (var i=0; i <columns.length; i++){
                    aCols.push({
                        label: columns[i].mAggregations.header.mProperties.text,
                        property : items[i].mBindingInfos.text.binding.sPath,
                        type: EdmType + items[i].mBindingInfos.text.binding.sInternalType,
                    })
                }
           /*     aCols.push({
                    label: 'Usuario',
                    property: 'Usuario',
                    type: EdmType.String,
                    template: '{0}'
                });

                aCols.push({
                    label: 'Fecha',
                    type: EdmType.Number,
                    property: 'FechaDoc',
                    scale: 0
                });
                aCols.push({
                    label: 'Org Ventas',
                    type: EdmType.String,
                    property: 'OrgVentas',
                    scale: 0
                });
                aCols.push({
                    label: 'Status Pedido',
                    type: EdmType.String,
                    property: 'StatusPedido',
                    scale: 0
                });
                aCols.push({
                    label: 'Valor Neto',
                    type: EdmType.Number,
                    property: 'ValorNeto',
                    scale: 0
                });
                   */ 
                return aCols;
             
            },

            onExport: function () {
                var aCols, oRowBinding, oSettings, oSheet, oTable;

                if (!this._oTable) {
                    this._oTable = this.byId('idTablaPedidos');
                }

                oTable = this._oTable;
                oRowBinding = oTable.getBinding('items');
                aCols = this.createColumnConfig();

                oSettings = {
                    workbook: {
                        columns: aCols,
                        hierarchyLevel: 'Level'
                    },
                    dataSource: oRowBinding,
                    fileName: 'Table export sample.xlsx',
                    worker: false // We need to disable worker because we are using a MockServer as OData Service
                };

                oSheet = new Spreadsheet(oSettings);
                oSheet.build().finally(function () {
                    oSheet.destroy();
                });
            },
            onPersoButtonPressed: function (oEvent) {
                this._oTPC.openDialog();
            },
      
    onSort:function(){
                var oTable=this.byId("idTablaPedidos"), 
                    oBinding = oTable.getBinding("items");
    
                var sSortKey = "DocVentas";
                this.bDescending= !this.bDescending; //switches the boolean back and forth from ascending to descending
                var bGroup = false;
                var aSorter = [];
    
                aSorter.push(new sap.ui.model.Sorter(sSortKey, this.bDescending, bGroup));
                oBinding.sort(aSorter);
    }
        });
    });

