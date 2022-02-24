import { CellValue, Workbook } from 'exceljs';
import _ from 'lodash';

export enum TableType {
  shiftProgress = 1,
  workshopYarn = 3
}

export interface OutgoingYarn {
  key: number;
  invoice: CellValue;
  frequency: CellValue;
  name: CellValue;
  batch: CellValue;
  quantity: CellValue;
  difference: CellValue;
  workshop: '绳染' | '片染' | '倒筒';
  sort: '主纱' | '边纱' | '其它';
}

export const getShipment = (workbook: Workbook) => {
  const worksheet = workbook.getWorksheet(1);
  // 识别文件
  const title = worksheet.getCell('A1').value as String;
  const yarnList: OutgoingYarn[] = [];

  let type: TableType;
  switch (true) {
    case title === '车间用纱':
      type = TableType.workshopYarn;
      break;
    case title === '整经经次':
      type = TableType.shiftProgress;
      break;
    default:
      throw new Error(
        '识别文件非《车间用纱表》或《排纱进度表》，请选择正确文件'
      );
  }

  const titles = worksheet.getRow(type).values as CellValue[];

  worksheet.eachRow((row, rowNumber) => {
    const values = row.values as CellValue[];
    if (rowNumber > type) {
      yarnList.push({
        key: yarnList.length,
        invoice: values[titles.indexOf('内部单据号')],
        frequency: values[titles.indexOf('整经经次')],
        workshop: values[titles.indexOf('整经经次')]?.toString().includes('S')
          ? '绳染'
          : '片染',
        sort: values[titles.indexOf('头份')] ? '主纱' : '边纱',
        name: values[titles.indexOf('存货编号')],
        batch: values[titles.indexOf('批号')],
        quantity:
          values[
            type === 1 ? titles.indexOf('公式用量') : titles.indexOf('数量')
          ],
        difference: values[titles.indexOf('备注1')]
      });
    }
  });
  return yarnList;
};

export const getVarietry = (yarnList: OutgoingYarn[]) => {
  // 用纱品种
  const varietry = _.uniqWith(
    yarnList,
    (arrVal: OutgoingYarn, othVal: OutgoingYarn) => {
      return (
        arrVal.name === othVal.name &&
        arrVal.batch === othVal.batch &&
        arrVal.sort === othVal.sort &&
        arrVal.workshop === othVal.workshop
      );
    }
  );

  return varietry;
};

// 单个品种用纱量

export const getConsumption = (
  shipment: OutgoingYarn[],
  varietry: OutgoingYarn[]
) => {
  // 用纱品种
  const consumption = varietry.map(singleYarn => {
    const eachVarietries = shipment.filter(
      yarn => yarn.name === singleYarn.name && yarn.batch === singleYarn.batch
    );
    // 减底纱后用量
    const totalUsage = _.sum(
      eachVarietries.map(
        varietry =>
          Number(varietry.quantity) +
          Number(varietry.difference ? varietry.difference : 0)
      )
    );
    const { name, batch, workshop } = singleYarn;
    return { workshop, name, batch, totalUsage };
  });

  return consumption;
};
