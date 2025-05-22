<!--
 * @Author: zgx 2324461523@qq.com
 * @Date: 2024-01-07 12:38:09
 * @LastEditors: zgx 2324461523@qq.com
 * @LastEditTime: 2024-01-10 22:21:26
 * @FilePath: \taopinhui_vue3\src\views\product\spu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="container">
    <!-- 分类选择卡片 -->
    <el-card style="margin-bottom: 10px">
      <category @initCategory="initCategory" :disabled="showSpuData !== 0"></category>
    </el-card>
    <!-- 展示商品数据卡片 -->
    <el-card v-if="showSpuData === 0">
      <el-button type="primary" icon="Plus" :disabled="!category3Id" @click="open"
        >添加商品</el-button
      >
      <tph-table :tableData="spuList" :tableHeadList="tableHeadList" :tableProp="tableProp" v-loading="loading">
        <template #default="{ row }">
          <el-button
            type="success"
            icon="Plus"
            size="small"
            title="添加sku"
            @click="addSkuBtn(row.id)"
          ></el-button>
          <el-button
            type="warning"
            icon="EditPen"
            size="small"
            title="修改spu"
            @click="open(row)"
          ></el-button>
          <el-button
            type="info"
            icon="InfoFilled"
            size="small"
            title="查看sku"
            @click="openSku(row)"
          ></el-button>
          <el-popconfirm
            :title="`确定删除${row.spuName}?`"
            width="180"
            @confirm="removeSpu(row.id)"
          >
            <template #reference>
              <el-button type="danger" icon="Delete" size="small" title="删除spu"></el-button>
            </template>
          </el-popconfirm>
        </template>
      </tph-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 10, 20]"
        size="small"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="getSpuList()"
        @current-change="getSpuList()"
      />
    </el-card>
    <!-- 添加|修改SPU卡片 -->
    <addOrUpdateSpu
      v-if="showSpuData === 1"
      @cancel="cancel"
      @submit="submit"
      ref="addOrUpdateSpuRef"
    ></addOrUpdateSpu>
    <!-- 添加Sku卡片 -->
    <addOrUpdateSku v-if="showSpuData === 2" ref="addOrUpdateSkuRef" @cancel="cancel" @submit="submit"></addOrUpdateSku>
    <!-- 查看sku对话框 -->
    <skuInfo ref="skuInfoRef"></skuInfo>
  </div>
</template>

<script lang="ts" setup>
// 引入分类选择组件
import category from '~/components/category.vue'
import { ref, nextTick } from 'vue'
// 引入接口函数
import { reqSpuInfo, reqRemoveSpu } from '~/api/commodity/commodity_list'
// 引入子组件
import addOrUpdateSpu from './components/addOrUpdateSpu.vue'
import addOrUpdateSku from './components/addOrUpdateSku.vue'
import skuInfo from './components/skuInfo.vue'
// 引入ts类型
import { spuResponseType } from '~/api/commodity/commodity_list/type'
import { ElMessage } from 'element-plus'
// spu数据列表
const spuList = ref<spuResponseType[]>([])
// 一级分类id
const category1Id = ref<number | string>('')
// 二级分类id
const category2Id = ref<number | string>('')
// 三级分类id
const category3Id = ref<number | string>('')
// spu表格基本属性
const tableProp = {
  index: true,
  isZh: true
}
// spu表格的表头列表
const tableHeadList = [
  {
    label: '商品',
    property: 'goods_name',
    width: '200'
  },
  {
    label: '售价(元)',
    property: 'min_group_price',
    width: '180'
  },
  {
    label: '销量',
    property: 'sales_num',
    width: '180'
  },
  {
    label: '上架状态',
    property: 'is_onsale',
    width: '180'
  },
  {
    label: '操作'
  }
]
// 表格加载效果
const loading = ref<boolean>(false)
// 当前页
const page = ref<number>(1)
// 每页条数
const limit = ref<number>(5)
// 总数
const total = ref<number>(0)
// 控制显示哪个卡片
const showSpuData = ref<number>(0) // 0: 展示数据卡片   1: 添加|编辑卡片  2: 添加sku卡片
// 添加|编辑卡片的ref对象
const addOrUpdateSpuRef = ref()
// 获取spu数据的函数
const getSpuList = async () => {
  // 开启加载效果
  loading.value = true
  const result = await reqSpuInfo(page.value, limit.value, category3Id.value)
  if (result.code === 200) {
    spuList.value = result.data.records
    total.value = result.data.total
    // 关闭加载效果
    loading.value = false
  }
}
// 获取子组件传递过来的分类id
const initCategory = (ids: any) => {
  // 赋值
  category1Id.value = ids.category1Id
  category2Id.value = ids.category2Id
  category3Id.value = ids.category3Id
  // 判断三级分类id是否为空
  if (category3Id.value) {
    // 不为空，调用接口函数，发送请求
    getSpuList()
  } else {
    // 为空，清空spu列表
    spuList.value = []
  }
}
// 子组件的取消按钮的回调
const cancel = () => {
  showSpuData.value = 0
}
// 添加|修改spu按钮的回调
const open = (row: spuResponseType) => {
  showSpuData.value = 1
  nextTick(() => {
    addOrUpdateSpuRef.value?.open(row, category3Id.value)
  })
}
// 子组件保存成功的回调
const submit = (id: number | string) => {
  if (!id) {
    // id不存在，是新增，回到第一页
    page.value = 1
  }
  // 重新获取数据
  getSpuList()
  // 切换卡片
  showSpuData.value = 0
}
// 添加sku组件的ref对象
const addOrUpdateSkuRef = ref()
// 添加sku按钮的回调
const addSkuBtn = (id: number | string) => {
  showSpuData.value = 2
  nextTick(() => {
    addOrUpdateSkuRef.value?.open(id, category1Id.value, category2Id.value, category3Id.value)
  })
}
// sku对话框的ref对象
const skuInfoRef = ref()
// 查看sku按钮的回调
const openSku = (row: spuResponseType) => {
  // 调用子组件暴露的函数
  nextTick(() => {
    skuInfoRef.value.open(row)
  })
}
// 删除spu按钮的回调
const removeSpu = async (id: number | string) => {
  //  调用接口
  const result = await reqRemoveSpu(id)
  if (result.code === 200) {
    // 删除成功，提示用户
    ElMessage.success('删除成功')
    // 判断删除的是否是当前页的最后一项
    if (spuList.value.length <= 1) {
      // 是，删除后要往前一页
      page.value = page.value - 1
    }
    // 重新获取spu列表
    getSpuList()
  } else {
    // 删除失败
    ElMessage.error('删除失败')
  }
}
</script>

<style lang="" scoped></style>
