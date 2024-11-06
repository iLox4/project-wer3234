/** UPDATE WORKBOOK TEST CONSTANTS:START */
export const updateWbHappyDayConst = {
    conf: {
        sheet_name: 'Test Sheet',
        table_header: 'Test Table Header',
        table_header_styles: ['headerStyle'],
        columns: [
          {
            column_header: 'Header1',
            column_subheader: 'Subheader1',
            column_header_styles: ['headerStyle'],
            column_subheader_styles: ['subheaderStyle'],
            data_source_column: 'dataField1',
            data_source_column_alt: 'dataFieldAlt1',
            data_source_mapping: [
              { source: 'A', target: 'Alpha' },
              { source: 'B', target: 'Beta' },
            ],
            column_hidden: false,
          },
          {
            column_header: 'Header2',
            column_subheader: 'Subheader2',
            column_header_styles: ['headerStyle'],
            column_subheader_styles: ['subheaderStyle'],
            translation_source_column: 'transField1',
            sf_mapping: [{ group: 'group1', key: 'key1' }],
            column_hidden: true,
          },
        ],
    },
    data:  [
        {
          dataField1: 'A',
          dataFieldAlt1: 'AltA',
          transField1: 'Value1',
          'transField1.en': 'Value1 EN',
        },
        {
          dataField1: 'B',
          dataFieldAlt1: 'AltB',
          transField1: 'Value2',
          'transField1.en': 'Value2 EN',
        },
    ]
};

export const updateWbNoHeaderConst = {
    conf: {
        sheet_name: 'No Header Sheet',
        columns: [
          {
            column_header: 'Header1',
            column_subheader: 'Subheader1',
            data_source_column: 'dataField1',
          },
        ],
    },
    data: [{ dataField1: 'Test Data' }]
};

export const updateWbNoTranslSrcColConst = {
    conf: {
        sheet_name: 'Translation Sheet',
        columns: [
          {
            column_header: 'Translated Header',
            column_subheader: 'Translated Subheader',
            translation_source_column: 'transField1',
          },
        ],
    },
    data: [
        { transField1: 'greeting', 'transField1.en': 'Hello' },
        { transField1: 'farewell', 'transField1.en': 'Goodbye' },
    ]
};

export const updateWbHiddenColumnConst = {
    conf: {
        sheet_name: 'Column Hidden Sheet',
        columns: [
          {
            column_header: 'Visible Column',
            data_source_column: 'dataField1',
            column_hidden: false,
          },
          {
            column_header: 'Hidden Column',
            data_source_column: 'dataField2',
            column_hidden: true,
          },
        ],
    },
    data: [{ dataField1: 'Visible Data', dataField2: 'Hidden Data' }]
}
/** UPDATE WORKBOOK TEST CONSTANTS:END */

/** ADD SHEET TO WORKBOOK TEST CONSTANTS:START */
export const addSheetToWbHappyDayConst = {
  conf: {
    sheet_name: 'Test Sheet',
    table_header: 'Test Table Header',
    table_header_styles: ['headerStyle'],
    columns: [
      {
        column_header: 'Header1',
        column_subheader: 'Subheader1',
        column_header_styles: ['headerStyle'],
        column_subheader_styles: ['subheaderStyle'],
        column_hidden: false,
      },
      {
        column_header: 'Header2',
        column_subheader: 'Subheader2',
        column_header_styles: ['headerStyle'],
        column_subheader_styles: ['subheaderStyle'],
        column_hidden: true,
      },
    ],
  },
  styles: {
    headerStyle: { font: { bold: true } },
    subheaderStyle: { font: { italic: true } },
  }
};

export const addSheetToWbNoTbHeaderConst = {
  conf: {
    sheet_name: 'No Header Sheet',
    columns: [
      {
        column_header: 'Header1',
        column_subheader: 'Subheader1',
        column_header_styles: ['headerStyle'],
        column_subheader_styles: ['subheaderStyle'],
        column_hidden: false,
      },
      {
        column_header: 'Header2',
        column_subheader: 'Subheader2',
        column_header_styles: ['headerStyle'],
        column_subheader_styles: ['subheaderStyle'],
        column_hidden: false,
      },
    ],
  },
  styles: {
    headerStyle: { font: { bold: true } },
    subheaderStyle: { font: { italic: true } },
  }
}
/** ADD SHEET TO WORKBOOK TEST CONSTANTS:END */