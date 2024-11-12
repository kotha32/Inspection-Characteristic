using { API_INSPECTIONLOT_SRV as inspectionLots } from './external/API_INSPECTIONLOT_SRV';
using {com.satinfotech.inspection as inspection} from '../db/schema';
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
            Language,
    }actions{
        action printForm() returns String
    };


    entity InspectionCharacteristic as projection on inspectionLots.A_InspectionCharacteristic {
            key InspectionLot,	
            InspPlanOperationInternalID,
            InspectionCharacteristic,
            InspectionSpecificationText,
            QuantityUnit,
            InspectionMethod,
            InspectionSpecification,
            InspectorQualification,
    }

    entity InspectionOperation as projection on inspectionLots.A_InspectionOperation {
            key InspectionLot,
            InspPlanOperationInternalID,
            OrderInternalBillOfOperations,
            InspectionOperation
    }

    entity InspectionResult as projection on inspectionLots.A_InspectionResult{
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
            CharacteristicAttributeCodeGrp,
    }
    entity InspectionResultValue as projection on inspectionLots.A_InspectionResultValue{
            key InspectionLot,
            InspPlanOperationInternalID,
            InspectionCharacteristic,
            Inspector,
            InspectionStartDate,
            InspectionEndDate,
            InspectionResultAttribute,
            InspectionResultMeasuredValue
    };
}


