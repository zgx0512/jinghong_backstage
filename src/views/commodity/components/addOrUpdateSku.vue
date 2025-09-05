<template>
  <el-card>
    <el-form label-width="80" :model="skuInfoForm" :rules="rules" ref="skuInfoFormRef">
      <el-form-item label="SKU名称" prop="skuName">
        <el-input placeholder="SKU名称" v-model="skuInfoForm.skuName"></el-input>
      </el-form-item>
      <el-form-item label="价格(元)" prop="price">
        <el-input placeholder="价格(元)" v-model="skuInfoForm.price" type="number"></el-input>
      </el-form-item>
      <el-form-item label="重量(g)" prop="weight">
        <el-input placeholder="重量(g)" v-model="skuInfoForm.weight"></el-input>
      </el-form-item>
      <el-form-item label="SKU描述" prop="skuDesc">
        <el-input
          placeholder="SKU描述"
          :rows="3"
          type="textarea"
          v-model="skuInfoForm.skuDesc"
        ></el-input>
      </el-form-item>
      <el-form-item label="平台属性">
        <el-form label-width="80" :inline="true">
          <el-form-item
            :label="attrInfo.attrName"
            v-for="(attrInfo, index) in attrInfoList"
            :key="attrInfo.id"
            style="margin-bottom: 10px"
          >
            <el-select v-model="selAttrInfoList[index].valueId" clearable>
              <el-option
                v-for="attrValue in attrInfo.attrValueList"
                :key="attrValue.id"
                :label="attrValue.valueName"
                :value="attrValue.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-form label-width="80" :inline="true">
          <el-form-item
            :label="spuSaleAttr.saleAttrName"
            v-for="(spuSaleAttr, index) in spuSaleAttrList"
            :key="spuSaleAttr.id"
            style="margin-bottom: 10px"
          >
            <el-select clearable v-model="selSaleAttrInfoList[index].saleAttrValueId">
              <el-option
                v-for="spuSaleAttrValue in spuSaleAttr.spuSaleAttrValueList"
                :key="spuSaleAttrValue.id"
                :label="spuSaleAttrValue.saleAttrValueName"
                :value="spuSaleAttrValue.id"
              />
            </el-select>
          </el-form-item>
        </el-form>
      </el-form-item>
      <el-form-item label="图片名称">
        <el-table
          :data="spuImageList"
          border
          @selection-change="handleSelectionChange"
          ref="skuImageRef"
        >
          <el-table-column type="selection" width="80" align="center"></el-table-column>
          <el-table-column label="图片">
            <template #default="{ row }">
              <img :src="row.imgUrl" alt="" style="width: 50px" />
            </template>
          </el-table-column>
          <el-table-column prop="imgName" label="名称"></el-table-column>
          <el-table-column label="操作">
            <template #default="{ row }">
              <el-button type="primary" size="small" @click="setDefault(row)" v-if="!row.default"
                >设为默认</el-button
              >
              <el-button size="small" v-else>默认</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading">保存</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import { ref, defineExpose, defineEmits, nextTick } from 'vue'
// 引入接口函数
import { reqAttrInfo } from '~/api/commodity/attr'
import { reqSpuImageList, reqSpuSaleAttrList, reqAddSkuInfo } from '~/api/commodity/commodity_list'
import { reqSkuInfo } from '~/api/commodity/sku'
// 引入ts类型
import { attrInfoResponse, attrReponseType } from '~/api/commodity/attr/type'
import { ElMessage } from 'element-plus'
const emits = defineEmits(['cancel', 'submit'])
// 一级分类id
const category1Id = ref<number | string>('')
// 二级分类id
const category2Id = ref<number | string>('')
// 三级分类id
const category3Id = ref<number | string>('')
// 表单数据对象
const skuInfoForm = ref<skuResponseType>({
  spuId: '', // spuId
  category3Id: '', // 三级分类id
  skuName: '', // sku名称
  price: '', // 价格
  weight: '', // 重量
  skuDesc: '', // 描述
  skuDefaultImg: '', // 默认图片
  skuImageList: [], // 图片列表
  skuAttrValueList: [],
  skuSaleAttrValueList: []
})
// 表单的ref对象
const skuInfoFormRef = ref()
// 表单校验规则
const rules = ref({
  skuName: { required: true, message: 'SKU名称不能为空', trigger: 'blur' },
  skuDesc: { required: true, message: 'SKU描述不能为空', trigger: 'blur' },
  price: { required: true, message: '价格不能为空', trigger: 'blur' },
  weight: { required: true, message: '重量不能为空', trigger: 'blur' }
})
// 商品属性列表
const attrInfoList = ref<attrReponseType[]>([])
// spu图片列表
const spuImageList = ref<imageResponseType[]>([])
// spu已有销售属性列表
const spuSaleAttrList = ref<saleAttrResponseType[]>([])
// 选出来的商品属性列表的ts类型
interface selAttrInfoType {
  attrId: string | number
  valueId: string | number
}
// 选出来的销售属性列表的ts类型
interface selSaleAttrInfoType {
  saleAttrId: number | string
  saleAttrValueId: number | string
}
// 选出来的商品属性列表
const selAttrInfoList = ref<selAttrInfoType[]>([])
// 选出来的销售属性列表
const selSaleAttrInfoList = ref<selSaleAttrInfoType[]>([])
// 选出来的图片列表
const selImageList = ref<imageResponseType[]>([])
// 按钮加载效果
const loading = ref<boolean>(false)
// sku图片表格的ref对象
const skuImageRef = ref()
// 打开卡片的回调
const open = async (
  id: number | string,
  c1Id: number | string,
  c2Id: number | string,
  c3Id: number | string,
  skuId: number | string = ''
) => {
  // 赋值
  category1Id.value = c1Id
  category2Id.value = c2Id
  category3Id.value = c3Id
  // 调用函数
  let p2 = await getAttrInfoList()
  let p3 = await getSpuSaleAttrList(id)
  let p4 = await getSpuImageList(id)
  if (!skuId) {
    // 新增sku，每次都清空上一次的数据
    skuInfoForm.value = {
      spuId: id,
      category3Id: '', // 三级分类id
      skuName: '', // sku名称
      price: '', // 价格
      weight: '', // 重量
      skuDesc: '', // 描述
      skuDefaultImg: '', // 默认图片
      skuImageList: [], // 图片列表
      skuAttrValueList: [],
      skuSaleAttrValueList: []
    }
  } else {
    // 编辑sku，调用函数，获取数据
    let p1 = await getSkuList(skuId)
    Promise.all([p1, p2, p3, p4]).then((result) => {
      spuImageList.value?.forEach((item) => {
        const res = selImageList.value.some((item1) => item1.imgName === item.imgName)
        // 设置默认选中的图片
        skuImageRef.value.toggleRowSelection(item, res)
        if (item.imgUrl === skuInfoForm.value.skuDefaultImg) {
          // 将当前行的按钮设为默认
          item.default = true
        }
      })
      selAttrInfoList.value = selAttrInfoList.value.map((item) => {
        const data = skuInfoForm.value.skuAttrValueList?.find(
          (item1) => item1.attrId === item.attrId
        )
        return {
          attrId: item.attrId,
          valueId: data?.valueId || item.valueId
        }
      })
      selSaleAttrInfoList.value = selSaleAttrInfoList.value.map((item) => {
        const data = skuInfoForm.value.skuSaleAttrValueList?.find((item1) => {
          return item1.saleAttrId === item.saleAttrId
        })
        return {
          saleAttrId: item.saleAttrId,
          saleAttrValueId: data?.saleAttrValueId || item.saleAttrValueId
        }
      })
    })
  }
}
// 获取基础属性列表的函数
const getAttrInfoList = async () => {
  const result: attrInfoResponse = await reqAttrInfo(
    category1Id.value,
    category2Id.value,
    category3Id.value
  )
  if (result.code === 200) {
    attrInfoList.value = result.data
    selAttrInfoList.value = attrInfoList.value.map((item) => {
      return {
        attrId: item.id as string,
        valueId: ''
      }
    })
    return 'ok'
  }
  return Promise.reject(new Error(''))
}
// 获取spu图片的函数
const getSpuImageList = async (id: number | string) => {
  const result: spuImageListResponseType = await reqSpuImageList(id)
  if (result.code === 200) {
    spuImageList.value = result.data
    spuImageList.value.forEach((item) => (item['default'] = false))
    return 'ok'
  }
  return Promise.reject(new Error(''))
}
// 获取spu已有销售属性的函数
const getSpuSaleAttrList = async (id: number | string) => {
  const result: saleAttrInfoResponseType = await reqSpuSaleAttrList(id)
  if (result.code === 200) {
    spuSaleAttrList.value = result.data
    selSaleAttrInfoList.value = result.data.map((item) => {
      return {
        saleAttrId: item.baseSaleAttrId as string,
        saleAttrValueId: ''
      }
    })
    return 'ok'
  }
  return Promise.reject(new Error(''))
}
// 获取sku详情的函数
const getSkuList = async (id: number | string) => {
  // 调用接口
  const result = await reqSkuInfo(id)
  if (result.code === 200) {
    skuInfoForm.value = result.data
    selImageList.value = result.data.skuImageList
    return 'ok'
  }
  return Promise.reject(new Error(''))
}
// 取消按钮的回调
const cancel = () => {
  emits('cancel')
}
// 复选框发生改变的回调
const handleSelectionChange = (imgList: imageResponseType[]) => {
  selImageList.value = imgList
}
// 设为默认按钮的回调
const setDefault = (row: imageResponseType) => {
  // 排他思想，将所有的default到置为false
  spuImageList.value.forEach((item) => (item.default = false))
  // 当前的行设为true
  row.default = true
  // 将默认图片路径存入到对象中
  skuInfoForm.value.skuDefaultImg = row.imgUrl as string
}
// 保存按钮的回调
const submit = () => {
  if (!skuInfoFormRef.value) return
  skuInfoFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 验证通过，开启加载效果
      loading.value = true
      // 整合要发给后台的参数
      skuInfoForm.value.category3Id = category3Id.value as string
      skuInfoForm.value.skuImageList = selImageList.value as never[]
      skuInfoForm.value.skuAttrValueList = selAttrInfoList.value.filter(
        (item) => item.valueId
      ) as []
      skuInfoForm.value.skuSaleAttrValueList = selSaleAttrInfoList.value.filter(
        (item) => item.saleAttrValueId
      ) as []
      // 调用函数，发送请求
      const result = await reqAddSkuInfo(skuInfoForm.value)
      if (result.code === 200) {
        // 成功，提示用户
        ElMessage.success('保存成功')
        // 关闭加载小姑
        loading.value = false
        // 通知父组件切换卡片
        emits('submit', 1)
      } else {
        // 失败，提示用户
        ElMessage.error('保存失败')
        // 关闭加载小姑
        loading.value = false
      }
    } else {
      console.log('error submit')
    }
  })
}
defineExpose({
  open
})
</script>

<style lang="" scoped></style>
