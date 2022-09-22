sap.ui.define([
	"sap/ui/core/format/NumberFormat"
], function (NumberFormat) {
	"use strict";
	return {
		stringToFloat: function (amount, currency) {
			var oCurrencyFormat = NumberFormat.getCurrencyInstance({ "currencyCode": false });
			//Move negative sign to left and cast to float
			var fAmount = parseFloat(amount.replace(/([\d\.]*)-/, "-$1"));
			return oCurrencyFormat.format(fAmount);
		},
		statusColor: function (sStatus) {
			switch (sStatus) {
				case "1":
					return "Information"
				case "2":
					return "Success"
				case "3":
					return "Warning"
					case "4":
					return "Error"
				default:
					return sStatus;
			}
		},statusText: function (sStatus) {
			var resourceBundle = this.getView().getModel("i18n").getResourceBundle();
			switch (sStatus) {
				case "1":
					return resourceBundle.getText("Status1");
				case "2":
					return resourceBundle.getText("Status2");
				case "3":
					return resourceBundle.getText("Status3");
					case "4":
					return resourceBundle.getText("Status4");
				default:
					return sStatus;
			}
		}
		
	}
})