interface JHTableColumnType {
  label: string
  property?: string
  width?: string
  fixed?: boolean | string
  fit?: boolean
  align?: string
  resizable?: boolean
  sortable?: boolean | 'custom'
  component?: {
    render?: Function
  }
}

interface JHTablePropType {
  isSelect?: boolean
  index?: boolean
  isZh?: boolean
  title?: string
}

interface JHTablePageInfoType {
  total: number
  limit: number
  page: number
  page_sizes: number[]
}

interface JHTableOptionsType {
  height?: string
  'max-height'?: string
  'row-class-name'?: string
  'show-summary'?: boolean
  'summary-method'?: Function
  'tree-props'?: {
    hasChildren?: string
    children?: string
    checkStrictly?: boolean
  }
  'span-method'?: Function
  'row-key'?: string
}

interface JHTableSelctPropsType {
  selectable: Function
  reserveSelection: boolean
}
