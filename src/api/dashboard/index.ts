import request from '~/utils/http/axios'

// 数据概览
export const reqDataOverview = (params: { start_date: string; end_date: string }) => {
  return request.get<OverviewDataResponseType, any>('/getDataOverview', { params })
}
