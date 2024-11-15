using { API_INSPECTIONLOT_SRV as inspectionLots } from './external/API_INSPECTIONLOT_SRV';
using { USAGEDECISIONSELDCODESET_0001 as external } from './external/USAGEDECISIONSELDCODESET_0001';
using { API_PRODUCT_SRV as products } from './external/API_PRODUCT_SRV';
service InspectionService {
    entity InspectionLot as projection on inspectionLots.A_InspectionLot {
        key InspectionLot,	
        Material,
        Batch,
        Plant,
        InspectionLotOrigin,
        GoodsMovementType,
        SalesOrder,
        SalesOrderItem,
        Language
    } actions {
        action printForm() returns String;
    };

    entity codeset as projection on external.UsgeDcsnSeldCodeSetText {
        SelectedCodeSetPlant,
        SelectedCodeSet,
        Language,
        SelectedCodeSetText
    };

    entity decisioncodeset as projection on external.UsgeDcsnSeldCodeText{
        SelectedCodeSetPlant,
        SelectedCodeSet,
        UsageDecisionCodeGroup,
        UsageDecisionCode,
        Language,
        UsageDecisionCodeText
    }

    entity material as projection on products.A_ProductDescription{
        Product,
        Language,
        ProductDescription
    }

    entity InspectionCharacteristic as projection on inspectionLots.A_InspectionCharacteristic {
        key InspectionLot,	
        InspPlanOperationInternalID,
        InspectionCharacteristic,
        InspectionSpecificationText,
        QuantityUnit,
        InspectionMethod,
        InspectionSpecification,
        InspectorQualification
    };

    entity InspectionOperation as projection on inspectionLots.A_InspectionOperation {
        key InspectionLot,
        InspPlanOperationInternalID,
        OrderInternalBillOfOperations,
        InspectionOperation,
        OperationText
    };

    entity InspectionResult as projection on inspectionLots.A_InspectionResult {
        key InspectionLot,
        InspPlanOperationInternalID,
        InspectionCharacteristic,
        InspectionResultAttribute,
        InspectionValuationResult,
        InspectionResultMeanValue,
        CharacteristicAttributeCode,
        InspectionStartDate,
        InspectionEndDate,
        CreatedByUser,
        CreationDate,
        CharacteristicAttributeCodeGrp
    };

    entity InspectionResultValue as projection on inspectionLots.A_InspectionResultValue {
        key InspectionLot,
        InspPlanOperationInternalID,
        InspectionCharacteristic,
        Inspector,
        InspectionStartDate,
        InspectionEndDate,
        InspectionResultAttribute,
        InspectionResultMeasuredValue
    };

    entity InspectionUsageValue as projection on inspectionLots.A_InspLotUsageDecision {
        key InspectionLot,
        InspLotUsageDecisionLevel,
        InspectionLotQualityScore,
        InspLotUsageDecisionCatalog,
        SelectedCodeSetPlant,
        InspLotUsgeDcsnSelectedSet,
        InspLotUsageDecisionCodeGroup,
        InspectionLotUsageDecisionCode,
        InspLotUsgeDcsnDynValuation,
        InspLotUsageDecisionValuation,
        InspLotUsgeDcsnFollowUpAction,
        InspectionLotUsageDecidedBy,
        InspectionLotUsageDecidedOn,
        InspLotUsageDecisionTime,
        InspLotUsageDecisionChangedBy,
        InspLotUsageDecisionChangedOn,
        InspLotUsgeDcsnChangedTime,
        InspLotUsgeDcsnHasLongText,
        ChangedDateTime,
    };
}
