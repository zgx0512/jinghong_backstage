import request from '~/utils/http/axios'

// 数据概览
export const reqDataOverview = (params: { start_date: string; end_date: string }) => {
  return request.get<OverviewDataResponseType, any>('/getDataOverview', { params })
}

// 趋势分析
export const reqTrendAnalysis = (params: { start_date: string; end_date: string }) => {
  return request.get<TrendAnalysisResponseType, any>('/getTrendAnalysis', { params })
}

// 商品类目销售分布
export const reqCategorySales = (params: { start_date: string; end_date: string }) => {
  return request.get<CategorySalesResponseType, any>('/getCategorySales', { params })
}
