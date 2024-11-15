const cds = require('@sap/cds');
const { create } = require('xmlbuilder2');
const axios = require('axios');

module.exports = cds.service.impl(async function () {
    const inspectionLots = await cds.connect.to('API_INSPECTIONLOT_SRV');
    const external = await cds.connect.to('USAGEDECISIONSELDCODESET_0001');
    const products = await cds.connect.to('API_PRODUCT_SRV');

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
            console.log(`Fetching data for InspectionLot: ${inspectionLotId}`);
    
            // Fetch data for the Inspection Lot and related entities
            const lotData = await inspectionLots.run(SELECT.from(InspectionLot).where({ InspectionLot: inspectionLotId }));
            if (!lotData.length) {
                req.error(404, `InspectionLot ${inspectionLotId} not found.`);
                return;
            }
    
            const charData = await inspectionLots.run(SELECT.from(this.entities.InspectionCharacteristic).where({ InspectionLot: inspectionLotId }));
            const opData = await inspectionLots.run(SELECT.from(this.entities.InspectionOperation).where({ InspectionLot: inspectionLotId }));
            const resData = await inspectionLots.run(SELECT.from(this.entities.InspectionResult).where({ InspectionLot: inspectionLotId }));
            const resValueData = await inspectionLots.run(SELECT.from(this.entities.InspectionResultValue).where({ InspectionLot: inspectionLotId }));
            const usagevalData = await inspectionLots.run(SELECT.from(this.entities.InspectionUsageValue).where({ InspectionLot: inspectionLotId }));
    
            // Fetch ProductDescription for the Material
            const materials = [...new Set(lotData.map(lot => lot.Material))];
            let materialDescriptions = [];
    
            if (materials.length > 0) {
                materialDescriptions = await products.run(
                    SELECT.from(this.entities.material).where({
                        Product: { in: materials },
                        Language: 'EN'
                    })
                );
            }
    
            // Fetch SelectedCodeSetText for Usage Decision
            const selectedCodeSets = usagevalData.map(val => val.InspLotUsgeDcsnSelectedSet).filter(Boolean);
            let selectedCodeTexts = [];
    
            if (selectedCodeSets.length > 0) {
                selectedCodeTexts = await external.run(
                    SELECT.from(this.entities.codeset).where({
                        SelectedCodeSet: { in: selectedCodeSets },
                        Language: 'EN'
                    })
                );
            }
    
            // Construct structured data for XML generation
            const structuredData = {
                InspectionLotNode: {
                    ...lotData[0],
                    MaterialDescription: materialDescriptions.find(desc => desc.Product === lotData[0].Material)?.ProductDescription || '',
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
    
            function ensureNonEmptyFields(obj) {
                if (Array.isArray(obj)) {
                    return obj.filter(item => item && Object.keys(item).length > 0).map(ensureNonEmptyFields);
                } else if (typeof obj === 'object' && obj !== null) {
                    return Object.fromEntries(
                        Object.entries(obj)
                            .filter(([_, value]) => value !== undefined && value !== null && !(Array.isArray(value) && value.length === 0))
                            .map(([key, value]) => [key, ensureNonEmptyFields(value)])
                    );
                }
                return obj;
            }
    
            const cleanedData = ensureNonEmptyFields(structuredData);
            const xml = create(cleanedData).end({ prettyPrint: true });
            console.log("Generated XML:", xml);
    
            return xml;
    
        } catch (error) {
            console.error(`Error generating XML for InspectionLot ${req.params[0].InspectionLot}:`, error);
            req.error(500, `Error generating XML for InspectionLot ${req.params[0].InspectionLot}: ${error.message}`);
        }
    });
    
    
    
});
