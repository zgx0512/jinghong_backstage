interface filterConfigType {
  type: string;
  options?: Array; // 选项
  label?: string;
  value: string;
  placeholder?: string; // 占位符
  clearable?: boolean; // 是否可清除
  disabled?: boolean; // 是否禁用
  multiple?: boolean; // 是否多选
  compound_key?: string; // 如果头部是可以切换的话，需要给每个组件一个唯一的key
  default_value?: string | number | Array<string | number>; // 默认值
  children?: Array<filterConfigType>;
  other_config?: Record<
    string,
    string | number | boolean | string[] | number[]
  >; // 其他不常用的配置，可以通过这个来扩展
  props?: Record<string, any>; // 级联选择器特有的配置
  filterable?: boolean; // 是否可搜索
  isSlot?: boolean; // 是否插槽
  slotName?: string; // 插槽名称
}
