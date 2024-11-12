const cds = require('@sap/cds');
const { create } = require('xmlbuilder2');
const axios = require('axios');

module.exports = cds.service.impl(async function () {
    const inspectionLots = await cds.connect.to('API_INSPECTIONLOT_SRV');

    this.on('READ', 'InspectionLot', async (req) => {
        return await inspectionLots.run(req.query);
    });

    this.on('READ', 'InspectionCharacteristic', async (req) => {
        return await inspectionLots.run(req.query);
    });

    this.on('READ', 'InspectionOperation', async (req) => {
        return await inspectionLots.run(req.query);
    });

    this.on('READ', 'InspectionResult', async (req) => {
        return await inspectionLots.run(req.query);
    });

    this.on('READ', 'InspectionResultValue', async (req) => {
        return await inspectionLots.run(req.query);
    });

    const { InspectionLot } = this.entities;
    this.on('printForm', 'InspectionLot', async (req) => {
        const {
            InspectionLot, InspectionCharacteristic, InspectionOperation,
            InspectionResult, InspectionResultValue
        } = this.entities;

        const inspectionLotId = req.params[0].InspectionLot;

        const lotData = await inspectionLots.run(SELECT.from(InspectionLot).where({ InspectionLot: inspectionLotId }));
        const charData = await inspectionLots.run(SELECT.from(InspectionCharacteristic).where({ InspectionLot: inspectionLotId }));
        const opData = await inspectionLots.run(SELECT.from(InspectionOperation).where({ InspectionLot: inspectionLotId }));
        const resData = await inspectionLots.run(SELECT.from(InspectionResult).where({ InspectionLot: inspectionLotId }));
        const resValueData = await inspectionLots.run(SELECT.from(InspectionResultValue).where({ InspectionLot: inspectionLotId }));

        const structuredData = {
            InspectionLotNode: {
                ...lotData[0],
                InspectionOperations: opData.map(item => ({
                    ...item,
                    InspectionCharacteristics: charData.filter(char => char.InspPlanOperationInternalID === item.InspPlanOperationInternalID),
                    InspectionResults: resData.filter(res => res.InspPlanOperationInternalID === item.InspPlanOperationInternalID),
                    InspectionResultValues: resValueData.filter(val => val.InspPlanOperationInternalID === item.InspPlanOperationInternalID)
                }))
            }
        };

        function ensureEmptyTags(obj) {
            if (Array.isArray(obj)) {
                return obj.length === 0 ? {} : obj.map(ensureEmptyTags);
            } else if (typeof obj === 'object' && obj !== null) {
                return Object.fromEntries(
                    Object.entries(obj).map(([key, value]) => [key, ensureEmptyTags(value)])
                );
            }
            return obj;
        }

        const updatedJsonData = ensureEmptyTags(structuredData);
        const xml = create(updatedJsonData).end({ prettyPrint: true });
        console.log("Generated XML:", xml);

        return xml;
    });
});
