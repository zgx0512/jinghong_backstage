import request from '~/utils/http/axios'
enum API {
  CATEGORY1_URL = '/admin/product/getCategory1',
  CATEGORY2_URL = '/admin/product/getCategory2/',
  CATEGORY3_URL = '/admin/product/getCategory3/'
}

// 获取全部分类列表的接口
export const reqAllCategoryList = () => {
  return request.get<categoryInfoResponseType, any>('/getAllClassify')
}

// 根据分类等级获取分类数据的接口
export const reqClassifyByLevel = (level: number) => {
  return request.get<categoryInfoResponseType, any>(`/getClassifyByLevel/${level}`)
}

// 根据分类等级获取分类数据的接口——编辑
export const reqEditClassifyByLevel = (params: {level: number | string, id: number | string}) => {
  return request.get<categoryInfoResponseType, any>(`/getClassifyByLevelForEdit`, { params })
}

// 获取一级分类数据的接口
export const reqCategory1Info = () => {
  return request.get<categoryInfoResponseType, any>(API.CATEGORY1_URL)
}

// 获取二级分类数据的接口
export const reqCategory2Info = (category1Id: number | string) => {
  return request.get<categoryInfoResponseType, any>(API.CATEGORY2_URL + category1Id)
}

// 获取三级分类数据的接口
export const reqCategory3Info = (category2Id: number | string) => {
  return request.get<categoryInfoResponseType, any>(API.CATEGORY3_URL + category2Id)
}

// 新增分类
export const reqAddCategory = (data: categoryResponseType) => {
  return request.post<categoryAddParamsType, any>('/addClassify', data)
}

// 修改分类
export const reqUpdateCategory = (data: categoryResponseType) => {
  return request.put<categoryAddParamsType, any>('/updateClassify', data)
}

// 删除分类
export const reqDeleteCategory = (id: number | string) => {
  return request.delete<categoryAddParamsType, any>(`/deleteClassify/${id}`)
}