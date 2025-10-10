<template>
  <el-dialog v-model="dialogVisible" :title="`SKU列表`" width="50%" :before-close="beforClose">
    <tph-table :tableData="skuList" :tableHeadList="tableHeadList" v-loading="loading">
      <template #default="{ row }">
        <img style="width: 50px; display: inline-block" :src="row.skuDefaultImg" alt="" />
      </template>
    </tph-table>
  </el-dialog>
</template>

<script lang="tsx" setup>
import { ref } from 'vue'
// 引入接口函数
import { reqSkuListByGoodsId } from '~/api/commodity/commodity-list'
const dialogVisible = ref<boolean>(false)
// sku列表
const skuList = ref<skuTableResponseType[]>([])
// sku列表表格的表头
const tableHeadList = ref<any[]>([])
// 表格加载效果
const loading = ref<boolean>(false)
// 打开对话框的回调
const open = (row: GoodsResponseType) => {
  // 调用函数，获取数据
  getSkuList(row.goods_id as number)
  // 打开对话框
  dialogVisible.value = true
}
const spec_list = ref<skuTableGroupResponseType[]>([])

// 仅构建 spec_list（最多两个规格类型），不修改 skuGroups
const handleSkuSpec = (skuListParam: ISku[]) => {
  // 保留首次出现顺序的规格类型去重映射：spec_id -> spec_name
  const specMap = new Map<number, string>()
  for (const sku of skuListParam || []) {
    const specArr = Array.isArray(sku?.spec) ? sku.spec : []
    for (const item of specArr) {
      const id = Number(item?.spec_id)
      if (!Number.isFinite(id)) continue
      if (!specMap.has(id)) {
        specMap.set(id, item?.spec_name || '')
      }
      // 如需后者覆盖，把上面改成：specMap.set(id, item?.spec_name || '')
    }
  }

  // 取前两个规格类型，生成 spec_list
  const specs = Array.from(specMap.entries()).slice(0, 2)
  spec_list.value = specs.map(([id, name], index) => ({
    id: Date.now() + index,
    spec_id: id,
    spec_name: name,
    spec_value: `spec_name${index + 1}`
  }))
  tableHeadList.value = spec_list.value.map((item) => {
    return {
      label: item.spec_name,
      property: item.spec_value,
      width: '100px',
      fit: true,
      align: 'center'
    }
  })
  tableHeadList.value.push(
    {
      label: '售价',
      property: 'min_group_price',
      width: '100px',
      fit: true,
      align: 'center',
      component: {
        render(h: any, row: any) {
          return <div style="color: #F56C6C">{row.min_group_price}</div>
        }
      }
    },
    {
      label: '划线价',
      property: 'min_normal_price',
      width: '100px',
      fit: true,
      align: 'center'
    },
    {
      label: '规格编码',
      property: 'out_sku_sn',
      width: '100px',
      fit: true,
      align: 'center',
      component: {
        render(h: any, row: any) {
          return <div>{row.out_sku_sn || '--'}</div>
        }
      }
    },
    {
      label: '是否是默认规格',
      property: 'is_default',
      width: '100px',
      fit: true,
      align: 'center',
      component: {
        render(h: any, row: any) {
          return (
            <div style={{ color: row.is_default ? '#67C23A' : '#F56C6C' }}>
              {row.is_default ? '是' : '否'}
            </div>
          )
        }
      }
    }
    // {
    //   label: '创建时间',
    //   property: 'create_time',
    //   width: '100px',
    //   fit: true,
    //   align: 'center'
    // },
    // {
    //   label: '更新时间',
    //   property: 'update_time',
    //   width: '100px',
    //   fit: true,
    //   align: 'center'
    // }
  )
}

// 处理表格数据
const handleSkuTableData = (skuListParam: ISku[]) => {
  const skuTableData: skuTableResponseType[] = skuListParam.map((item) => {
    return {
      sku_id: item.sku_id,
      uid: Date.now(),
      min_group_price: item.min_group_price,
      min_normal_price: item.min_normal_price,
      is_default: item.is_default,
      out_sku_sn: item.out_sku_sn || '',
      spec_name1: item.spec[0] ? item.spec[0].spec_value : '',
      spec_name2: item.spec[1] ? item.spec[1].spec_value : '',
      create_time: item.create_time,
      update_time: item.update_time
    }
  })
  skuList.value = skuTableData
}

// 获取sku列表的函数
const getSkuList = async (id: number | string) => {
  try {
    // 开启加载效果
    loading.value = true
    const result: skuListResponseType = await reqSkuListByGoodsId(id)
    if (result.code === 200) {
      handleSkuSpec(result.data)
      handleSkuTableData(result.data)
      // 关闭加载效果
      loading.value = false
    }
  } catch (error) {
    console.log(error)
  } finally {
    // 关闭加载效果
    loading.value = false
  }
}
// 对话框关闭前的回调
const beforClose = (done: () => void) => {
  // 清空表格数据
  skuList.value = []
  done()
}
defineExpose({
  open
})
</script>

<style lang="" scoped></style>
