const cds = require('@sap/cds');
const { create } = require('xmlbuilder2');
const axios = require('axios');

module.exports = cds.service.impl(async function () {
    const inspectionLots = await cds.connect.to('API_INSPECTIONLOT_SRV');
    const external = await cds.connect.to('USAGEDECISIONSELDCODESET_0001');

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

    this.on('READ', 'InspectionUsageValue', async (req) => {
        return await inspectionLots.run(req.query);
    });

    this.on('READ', 'UsageDecisionSet', async (req) => {
        return await external.run(req.query);
    });

    const { InspectionLot, codeset } = this.entities;

    this.on('printForm', 'InspectionLot', async (req) => {
        try {
            const inspectionLotId = req.params[0].InspectionLot;
    
            const lotData = await inspectionLots.run(SELECT.from(InspectionLot).where({ InspectionLot: inspectionLotId }));
            const charData = await inspectionLots.run(SELECT.from(this.entities.InspectionCharacteristic).where({ InspectionLot: inspectionLotId }));
            const opData = await inspectionLots.run(SELECT.from(this.entities.InspectionOperation).where({ InspectionLot: inspectionLotId }));
            const resData = await inspectionLots.run(SELECT.from(this.entities.InspectionResult).where({ InspectionLot: inspectionLotId }));
            const resValueData = await inspectionLots.run(SELECT.from(this.entities.InspectionResultValue).where({ InspectionLot: inspectionLotId }));
            const usagevalData = await inspectionLots.run(SELECT.from(this.entities.InspectionUsageValue).where({ InspectionLot: inspectionLotId }));

            // Fetch SelectedCodeSetText based on InspLotUsgeDcsnSelectedSet and Language
            const selectedCodeTexts = await external.run(
                SELECT.from(codeset).where({
                    SelectedCodeSet: { in: usagevalData.map(val => val.InspLotUsgeDcsnSelectedSet) },
                    Language: 'EN'
                })
            );

            const structuredData = {
                InspectionLotNode: {
                    ...lotData[0],
                    InspectionOperations: opData.map(item => ({
                        ...item,
                        InspectionCharacteristics: charData.filter(char => char.InspPlanOperationInternalID === item.InspPlanOperationInternalID),
                        InspectionResults: resData.filter(res => res.InspPlanOperationInternalID === item.InspPlanOperationInternalID),
                        InspectionResultValues: resValueData.filter(val => val.InspPlanOperationInternalID === item.InspPlanOperationInternalID),
                        InspectionUsageValues: usagevalData
                            .filter(val => val.InspectionLot === item.InspectionLot)
                            .map(val => ({
                                ...val,
                                SelectedCodeSetText: selectedCodeTexts.find(
                                    code => code.SelectedCodeSet === val.InspLotUsgeDcsnSelectedSet
                                )?.SelectedCodeSetText || ''
                            }))
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
    
        } catch (error) {
            console.error("Error generating XML:", error);
            req.error(500, "Error generating XML document.");
        }
    });
});
