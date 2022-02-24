import { CellValue, Workbook } from 'exceljs';
import _ from 'lodash';

interface Yarn {
  name: CellValue;
  batch: CellValue;
  warehouseName: CellValue;
  pieces: CellValue;
  kg: CellValue;
}

export const getInventory = async (workbook: Workbook) => {
  const worksheet = workbook.getWorksheet(1);

  const yarnTitle = worksheet.getCell('A2');
  if (yarnTitle.value !== '存货编号') {
    throw new Error('识别文件非《库存表》，请选择正确文件');
  }

  const yarnBranch = worksheet.getCell('B2');
  if (yarnBranch.value !== '支数') {
    throw new Error('请不要编辑《库存表》文件');
  }

  const yarns: {
    name: CellValue;
    batch: CellValue;
    warehouse: { name: CellValue; pieces: CellValue; kg: CellValue }[];
  }[] = [];

  const yarnList: Yarn[] = [];

  const titles = worksheet.getRow(2).values as CellValue[];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 2) {
      const values = row.values as CellValue[];
      yarnList.push({
        name: values[titles.indexOf('存货编号')],
        batch: values[titles.indexOf('批号')],
        warehouseName: values[titles.indexOf('仓位')],
        pieces: values[titles.indexOf('件数')],
        kg: values[titles.indexOf('码数')]
      });
    }
  });

  const arrYarnList = _.uniqWith(yarnList, (arrVal: Yarn, othVal: Yarn) => {
    return arrVal.name === othVal.name && arrVal.batch === othVal.batch;
  });

  for (const listName of arrYarnList) {
    const barNum = yarnList.filter(yarn => {
      return yarn.name === listName.name && yarn.batch === listName.batch;
    });
    const warehouse = barNum.map(bar => {
      return { name: bar.warehouseName, pieces: bar.pieces, kg: bar.kg };
    });
    yarns.push({
      name: barNum[0].name,
      batch: barNum[0].batch,
      warehouse: warehouse
    });
  }

  return yarns;
};
