import { FileProps, SourceFilter, UnzippedFileMap } from '../types';
import fs from 'fs';
import { configPath, csvGetEventReasonsCfg, preselectedObjects } from '../constants';
import color from 'color';
import { parse } from 'csv-parse';
import { stringify } from 'csv-stringify/sync';

/** LOAD CONFIG FUNCTION */
export function loadConfig(fileProps: FileProps) {
    let config = fs.readFileSync(configPath).toString();

    switch (fileProps.otherProps.objects) {
        case 'onlyPosition':
            config = config.replace(/\$\{objFilter\}/gm, "^(Position|PositionMatrixRelationship)$");
            config = config.replace(/\$\{objSheet\}/gm, "Position Object");
            break;
        case 'preselected':
            config = config.replace(/\$\{objFilter\}/gm, `^(${preselectedObjects})$`);
            config = config.replace(/\$\{objSheet\}/gm, "Objects");
            break;
        default:
            config = config.replace(/\$\{objFilter\}/gm, "^.+$");
            config = config.replace(/\$\{objSheet\}/gm, "Objects");
            break;
    }

    config = config.replace(/\$\{colorPrimary\}/gm, color(fileProps.colors.primary).hex().replace("#", "").toUpperCase());
    config = config.replace(/\$\{colorSecondary\}/gm, color(fileProps.colors.secondary).hex().replace("#", "").toUpperCase());
    config = config.replace(/\$\{colorFontPrimary\}/gm, color(fileProps.colors.primaryText).hex().replace("#", "").toUpperCase());
    config = config.replace(/\$\{colorFontSecondary\}/gm, color(fileProps.colors.secondaryText).hex().replace("#", "").toUpperCase());

    return JSON.parse(config);
}

/** GET EVENT REASONS FUNCTION */
export async function csvGetEventReasons(csvs: UnzippedFileMap) {
    
    const data = await loadSourceData(csvGetEventReasonsCfg, csvs);

    const eventReasons: Record<string, any> = {};

    for (const row of data) {
        const eventReason: Record<string, any> = {
            externalCode: row["values.externalCode"]
        };
        Object.keys(row).forEach((key) => {
            const matcher = key.match(/^values.label.(.._..)$/);
            if (matcher && matcher.length && matcher.length > 1) {
                eventReason["event." + matcher[matcher.length - 1]] = row["values.label." + matcher[matcher.length - 1]];
            }
        });
        eventReasons[row.externalCode] = eventReason;
    }

    return eventReasons;
}

/** PREPROCESS CSV FUNCTIONS:START */
export async function preprocessFiles(csvs: UnzippedFileMap) {
    await _mergeFo(csvs);
    await _mergeHris(csvs);
}

async function _mergeFo(csvs: UnzippedFileMap) {
    const fo = csvs["FoTranslation.csv"].toString();

    const foNames = [];
    const foDescs = [];

    for await (const record of parse(fo, { columns: true, from: 2 })) {
        if (record.externalCode.match(/_description/)) {
            foDescs.push(record);
        } else {
            foNames.push(record);
        }
    }

    for (const name of foNames) {
        const [ _, obj, code ] = name.externalCode.match(/^(.+)_name_(\d+)$/);
        const descCode = obj + "_description_" + code;

        for (const desc of foDescs) {
            if (desc.externalCode == descCode) {
                name.externalCodeDesc = descCode;
                for (const descKey of Object.keys(desc)) {
                    const descMatch = descKey.match(/^value\.(.+)$/);
                    if (descMatch && descMatch.length > 1) {
                        name["valueDesc." + descMatch[1]] = desc[descKey];
                    }
                }
                break;
            }
        }
    }

    csvs["FoTranslation.csv"] = Buffer.from(stringify(foNames, { header: true }));
}

async function _mergeHris(csvs: UnzippedFileMap) {
    const hrisElement = csvs["HRIS Element.csv"].toString();
    const hrisFields = csvs["HRIS Element-HRIS Fields.csv"].toString();
    const locHrisElement = csvs["Localized HRIS Element.csv"].toString();
    const locHrisFields = csvs["Localized HRIS Element-Localized HRIS Fields.csv"].toString();

    const picklistElement = [["country.externalCode", "externalCode", "externalName.en_US"]];
    const picklistFields = [["externalCode", "ecField.externalName.en_US", "ecField.enabled", "ecField.picklist"]];

    for await (const record of parse(hrisElement, { columns: true, from: 2 })) {
        picklistElement.push(["", record.externalCode, record["externalName.en_US"]]);
    }
    for await (const record of parse(locHrisElement, { columns: true, from: 2 })) {
        picklistElement.push([record["country.externalCode"], record.externalCode, record["externalName.en_US"]]);
    }
    for await (const record of parse(hrisFields, { columns: true, from: 2 })) {
        picklistFields.push([record.externalCode, record["ecField.externalName.en_US"], record["ecField.enabled"], record["ecField.picklist"]]);
    }
    for await (const record of parse(locHrisFields, { columns: true, from: 2 })) {
        picklistFields.push([record.externalCode, record["ecField.externalName.en_US"], record["ecField.enabled"], record["ecField.picklist"]]);
    }

    csvs["Picklist HRIS Element.csv"] = Buffer.from(stringify(picklistElement));
    csvs["Picklist HRIS Fields.csv"] = Buffer.from(stringify(picklistFields));
}
/** PREPROCESS CSV FUNCTIONS:END */

/** LOAD SOURCE DATA FUNCTIONS:START */
export async function loadSourceData(srcConf: Record<string, any>, csvs: UnzippedFileMap) {
    let headers: Record<string, any> = {};
    let files: Record<string, any> = {};
    let data = [];

    for (const file of srcConf.files) {
        [headers[file.source_file], files[file.source_file]] = await loadAndFilterImport(
          file.source_file,
          csvs,
          file.source_filters
        );
    }

    if (srcConf.join_source_1) {
        data = files[srcConf.join_source_1];
        for (const join of srcConf.joins) {
            let newData: Record<string, any>[] = [];

            const source2DataMap = new Map();
            for (const row of files[join.source_2]) {
                const valueKey = row[join.source_2_key];
                if (!source2DataMap.has(valueKey)) {
                    source2DataMap.set(valueKey, []);
                }

                source2DataMap.get(valueKey).push(row);
            }

            for (const dataRow of data) {
                const matchingRows = source2DataMap.get(dataRow[join.source_1_key]);
                if (matchingRows) {
                    matchingRows.forEach((matchingRow: Record<string, any>) => {
                        newData.push({ ...dataRow, ...matchingRow });
                    });
                } else if (!join.inner) {
                    const emptyRow: Record<string, string> = {};
                    for (const header of headers[join.source_2]) {
                        emptyRow[header] = "";
                    }
                    newData.push({ ...dataRow, ...emptyRow });
                }
            }
            data = newData;
        }
    } else {
        Object.keys(files).forEach(file => {
            files[file].forEach((row: Record<string, any>) => data.push({ ...row }));
        });
    }

    if (srcConf.files.length > 0 && srcConf.files[0].source_file === "Picklist HRIS Fields.csv") {
        if (srcConf.join_source_1) {
            files[srcConf.join_source_1].forEach((row: Record<string, any>) => {
                if (row.id === "event") {
                    data.push({ ...row });
                }
            });
        }
    }

    return data;
}

export async function loadAndFilterImport(
    name: string,
    csvs: UnzippedFileMap,
    filters: SourceFilter[]
  ): Promise<[string[], Record<string, any>[]]> {
    const csv = csvs[name];
  
    let headers: string[] = [];
    const rows: Record<string, any>[] = [];
  
    const parser = parse(csv, { columns: true });
    
    for await (const record of parser) {
      if (!headers.length) {
        headers = parser.options.columns as string[];
      }
  
      // Apply filters
      const include = filters.every(filter =>
        record[filter.column_name]?.match(filter.filter)
      );
  
      if (include) {
        rows.push(record);
      }
    }
  
    return [headers, rows];
}
/** LOAD SOURCE DATA FUNCTIONS:END */