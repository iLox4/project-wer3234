import path from "path";

/** LOAD CONFIG CONSTANTS: START */
export const configPath = path.join(__dirname, '../../src/config.json');

export const preselectedObjects = [
    "CustomPayType",
    "CustomPayTypeAssignment",
    "EmpCostDistribution",
    "EmpCostDistributionItem",
    "EmployeeTime",
    "PaymentInformationV3",
    "PaymentInformationDetailV3([A-Z]{3})?",
    "PaymentMethodV3",
    "PaymentMethodAssignmentV3",
    "Position",
    "PositionMatrixRelationship",
    "WorkOrder",
    "cust_.+"
].join("|");
/** LOAD CONFIG CONSTANTS: END */

export const csvList = [
    "Alert Message.csv", "FoTranslation.csv", "HRIS Element.csv", "HRIS Element-HRIS Fields.csv",
    "Localized HRIS Element.csv", "Localized HRIS Element-Localized HRIS Fields.csv",
    "Message Definition.csv", "Object Definition.csv", "Picklist-Values.csv"
];

export const csvForMatching = csvList.map(csvFile => {
    return csvFile.replace(/ /g, '').toLowerCase();
});

/** CSV GET EVENT REASONS CONSTANTS: START */
export const csvGetEventReasonsCfg = {
    files: [
        {
            source_file: "FoTranslation.csv",
            source_filters: [
                {
                    column_name: "foType",
                    filter: "^eventReason$"
                },
                {
                    column_name: "value.defaultValue",
                    filter: "^.+$"
                }
            ]
        },
        {
            source_file: "Picklist-Values.csv",
            source_filters: [
                {
                    column_name: "id",
                    filter: "^event$"
                },
                {
                    column_name: "values.label.en_US",
                    filter: "^.+$"
                }
            ]
        }
    ],
    join_source_1: "FoTranslation.csv",
    joins: [
        {
            source_1_key: "value.defaultValue",
            source_2: "Picklist-Values.csv",
            source_2_key: "values.label.en_US",
            inner: false
        }
    ]
};
/** CSV GET EVENT REASONS CONSTANTS: START */

export const importPropsContent = `encoding=UTF-8
#purgeType should be one of 'incremental' or 'fullPurge'
purgeType=incremental
#suppressData takes effect only when purgeType=incremental, it should be either 'true' or 'false'.
suppressData=true
#keyPreference should be one of 'ExternalCode' or 'BusinessKey'
keyPreference=BusinessKey
#ignoreSecurity indicates whether we ignore the RBP checks during the import process, it should be either 'true' or 'false'.
ignoreSecurity=false
#if you need to import zip with specific locale, remember to set \`formatLocale\`.
#formatLocale=en_US
#if you need enable the roundingMode: half_up for decimal values, remember to set \`roundDecimal\` as \`true\`.
roundDecimal=false
#identityType should be one of 'AssignmentID' or 'UserID'
identityType=UserID
rootFileName=Localized HRIS Element.csv`;

export const importSeqContent = `"File Name","Object Type","Import Order","Path"
"Alert Message.csv","AlertMessage","1","AlertMessage"
"Message Definition.csv","MessageDefinition","2","MessageDefinition"
"FoTranslation.csv","FoTranslation","3","FoTranslation"
"HRIS Element.csv","ECElementConfig","4","ECElementConfig"
"HRIS Element-HRIS Fields.csv","ECElementConfig","5","ECElementConfig-ecField"
"Localized HRIS Element.csv","ECLocalElementConfig","6","ECLocalElementConfig"
"Localized HRIS Element-Localized HRIS Fields.csv","ECLocalElementConfig","7","ECLocalElementConfig-ecField"
"Object Definition.csv","GOObjectDefinition","8","GOObjectDefinition"
"Picklist-Values.csv","PickList","9","PickList-values"`;

/** CREATE WB CONSTANTS:START */
export const createWbWhiteFillCols = [
    "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N",
    "O", "P", "Q", "R", "S", "T", "U"
];

export const createWbPrimaryFillCols = [
    "A", "B", "C", "D", "E", "F", "G",
    "H", "I", "J", "K", "L", "M", "N"
];

export const initInstructSheetRules = [
    ["SAP offers standard translations which will be used where possible.", 15],
    ["Translations are in responsibility of the country.", 15],
    ["Be consistent in word choice - use just one term to identify a single concept, even if it appears several times across the system.", 30],
    ["Choose the words according to their primary dictionary meaning.", 15],
    ["Choose words and phrases that are most universally understood among all dialects of your language.", 15],
    ["A request of changing the standard translation is possible but a global approval is needed for every case.", 15],
    ["In case you are not sure about the meaning of the field, please check with the EC Core Team what is the purpose to provide correct translation.", 30],
    ["Local fields/objects will only be translated into the local language of the requesting country and the US English default.", 15]
];

export const initInstructSheetInstructions = [
    ["General", "Hidden tabs are needed for technical configuration of the translations and cannot be changed.\nFields marked in grey cannot be changed since this only for information or standard translations.\nIn case of numbers included in the label, keep the numbers also in your language for corrrect sorting."],
    ["Position Object", "Provide translations of custom fields or standard fields with customized names."],
    ["Global Template Fields", "Provide translations of custom fields or standard fields with customized names."],
    ["Local Fields", "Provide translations of custom fields or standard fields with customized names."],
    ["Picklist values", "Provide translations of custom values or standard values with customized names."],
    ["Event Reasons", "Provide translations of all Event Reasons and standard Events with customized names."],
    ["Frequency", "Provide translations of all Frequencies."],
    ["Email Notifications", "Provide translations of all email notifications (subject and text)."],
    ["Warning&Error Messages", "Provide translation of all Warning and Error Messages."],
    ["Alert Messages", "Provide translations of all Alert Messages."]
];
/** CREATE WB CONSTANTS:END */