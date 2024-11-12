sap.ui.define([
    "sap/m/MessageToast",
    "sap/m/Dialog",
    "sap/m/Text",
    "sap/m/TextArea",
    "sap/m/Button"
], function (MessageToast, Dialog, Text, TextArea, Button) {
    'use strict';

    return {
        printForm: function (oBindingContext, aSelectedContexts) {
            MessageToast.show("Custom handler invoked.");
            console.log(aSelectedContexts);

            if (!aSelectedContexts || aSelectedContexts.length === 0) {
                MessageToast.show("No items selected.");
                return;
            }

            let mParameters = {
                contexts: aSelectedContexts[0],
                label: 'Confirm',
                invocationGrouping: true    
            };

            // Create status text and TextArea for XML data
            var oStatusText = new Text({ text: "Fetching XML Data..." });
            var oXMLDataTextArea = new TextArea({
                width: "100%",
                rows: 20,
                editable: false,
                value: ""
            });

            // Create dialog to display XML data
            var oDialog = new Dialog({
                title: "Inspection Lot XML Data",
                content: [oStatusText, oXMLDataTextArea],
                beginButton: new Button({
                    text: "Close",
                    press: function () {
                        oDialog.close();
                    }
                })
            });

            // Open the dialog
            oDialog.open();

            // Fetch and display XML data
            this.editFlow.invokeAction('InspectionService.printForm', mParameters)
                .then(function (result) {
                    const xmlData = result.getObject().value; // Assume the XML data is returned as plain text
                    oXMLDataTextArea.setValue(xmlData); // Set the fetched XML data in TextArea
                    oStatusText.setText("XML Data fetched successfully."); // Update status text
                })
                .catch(function (error) {
                    console.error("Error fetching XML data:", error);
                    oStatusText.setText("Error fetching XML data."); // Update status on error
                    MessageToast.show("Failed to fetch XML data.");
                });
        }
    };
});
