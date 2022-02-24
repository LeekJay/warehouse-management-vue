import { Workbook } from 'exceljs';

/**
 * 解析 Excel 文件
 * @param file 文件
 * @returns {Promise<Workbook>} workbook 可操作工作簿
 */
export const parseExcel = async (
  file: ArrayBuffer | string
): Promise<Workbook> => {
  let workbook;
  if (typeof file === 'string') {
    workbook = new Workbook().xlsx.readFile(file);
  } else {
    workbook = new Workbook().xlsx.load(file);
  }
  return workbook;
};
