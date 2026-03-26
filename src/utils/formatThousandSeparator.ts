export function formatThousandSeparator(num: number | string): string {
  // 处理非数字情况
  if (num === null || num === undefined || num === '') {
    return '';
  }

  // 转换为字符串并处理负数
  const str = String(num);
  const minusSign = str.startsWith('-') ? '-' : '';
  const absStr = str.replace(/^-/, ''); // 移除负号

  // 分离整数部分和小数部分
  const [integerPart, decimalPart] = absStr.split('.');

  // 验证是否为有效数字
  if (!/^\d+$/.test(integerPart)) {
    return str; // 如果不是有效数字，直接返回原字符串
  }

  // 对整数部分添加千分位分隔符
  const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // 拼接结果
  let result = minusSign + formattedInteger;
  if (decimalPart !== undefined) {
    result += '.' + decimalPart;
  }

  return result;
}