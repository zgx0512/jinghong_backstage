<template>
  <div class="container">
    <el-card v-if="showSkuData">
      <el-table border v-loading="loading" :data="skuList" style="margin-bottom: 10px">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column
          prop="skuName"
          label="名称"
          width="120"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="skuDesc"
          label="描述"
          width="200"
          :show-overflow-tooltip="true"
          align="center"
        ></el-table-column>
        <el-table-column prop="skuDefaultImg" label="默认图片" width="120" align="center">
          <template #default="{ row }">
            <img :src="row.skuDefaultImg" alt="" style="display: inline-block; width: 50px" />
          </template>
        </el-table-column>
        <el-table-column prop="price" label="价格(元)" width="80" align="center"></el-table-column>
        <el-table-column prop="weight" label="重量(g)" width="80" align="center"></el-table-column>
        <el-table-column label="操作" fixed="right" align="center">
          <template #default="{ row }">
            <el-button
              size="small"
              icon="SortUp"
              v-if="row.isSale === 0"
              title="上架sku"
              @click="onSale(row.id)"
            ></el-button>
            <el-button
              size="small"
              icon="SortDown"
              v-else
              title="下架sku"
              @click="cancelSale(row.id)"
            ></el-button>
            <el-button
              size="small"
              type="primary"
              icon="Edit"
              title="编辑sku"
              @click="open(row.spuId, row.id, row.category3Id)"
            ></el-button>
            <el-button
              size="small"
              type="info"
              icon="InfoFilled"
              title="查看sku"
              @click="openSkuDetail(row.id)"
            ></el-button>
            <el-popconfirm
              :title="`确定删除${row.skuName}?`"
              @confirm="removeSku(row.id)"
              width="180"
            >
              <template #reference>
                <el-button size="small" type="danger" icon="Delete" title="删除sku"></el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        v-model:current-page="page"
        v-model:page-size="limit"
        :page-sizes="[3, 5, 10, 20]"
        size="small"
        :background="true"
        layout="prev, pager, next, jumper, ->, sizes, total"
        :total="total"
        @size-change="getSkuList()"
        @current-change="getSkuList()"
      />
    </el-card>
    <!-- 修改sku的卡片 -->
    <addOrUpdateSku ref="addOrUpdateSkuRef" v-else @cancel="cancel" @submit="submit"></addOrUpdateSku>
    <!-- 商品详情抽屉 -->
    <skuDetail ref="skuDetailRef"></skuDetail>
  </div>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, onMounted, nextTick } from 'vue'
// 引入接口函数
import { reqSkuList, reqOnSaleSku, reqCancelSaleSku, reqRemoveSku } from '~/api/product/sku'
// 引入ts类型
import { skuListResponseType } from '~/api/product/sku/type'
import { skuResponseType } from '~/api/product/spu/type'
// 引入子组件
import skuDetail from './components/skuDetail.vue'
// 引入子组件
import addOrUpdateSku from './components/addOrUpdateSku.vue'
// sku列表
const skuList = ref<skuResponseType[]>([])
// 当前页
const page = ref<number>(1)
// 每页条数
const limit = ref<number>(5)
// 总数
const total = ref<number>(0)
// 表格加载效果
const loading = ref<boolean>(false)
// 商品详情抽屉的ref对象
const skuDetailRef = ref()
// 修改sku卡片的ref对象
const addOrUpdateSkuRef = ref()
// 控制显示哪个卡片
const showSkuData = ref<boolean>(true)
// 获取sku列表的函数
const getSkuList = async () => {
  // 开启加载效果
  loading.value = true
  // 调用接口
  const res: skuListResponseType = await reqSkuList(page.value, limit.value)
  if (res.code === 200) {
    skuList.value = res.data.records
    total.value = res.data.total
    // 关闭加载效果
    loading.value = false
  }
}
// 上架sku按钮的回调
const onSale = async (id: number | string) => {
  // 调用接口
  const result = await reqOnSaleSku(id)
  if (result.code === 200) {
    // 成功的提示信息
    ElMessage.success('上架成功')
    // 重新获取sku列表
    getSkuList()
  } else {
    // 失败的提示信息
    ElMessage.success('上架失败')
  }
}
// 下架sku按钮的回调
const cancelSale = async (id: number | string) => {
  const result = await reqCancelSaleSku(id)
  if (result.code === 200) {
    // 成功的提示信息
    ElMessage.success('下架成功')
    // 重新获取sku列表
    getSkuList()
  } else {
    // 失败的提示信息
    ElMessage.success('下架失败')
  }
}
// 查看sku按钮的回调
const openSkuDetail = (id: number | string) => {
  skuDetailRef.value?.open(id)
}
// 删除按钮的回调
const removeSku = async (id: number | string) => {
  // 调用接口
  const result = await reqRemoveSku(id)
  if (result.code === 200) {
    // 删除成功的提示
    ElMessage.success('删除成功')
    // 判断删除的是否是最后一条
    if (skuList.value.length <= 1) {
      // 回到上一页
      page.value = page.value - 1
    }
    // 重新获取sku列表
    getSkuList()
  } else {
    // 删除失败的提示
    ElMessage.error('删除失败')
  }
}
// 编辑sku按钮的回调
const open = (spuId: number | string, skuId: number | string, category3Id: number | string) => {
  showSkuData.value = false
  nextTick(() => {
    addOrUpdateSkuRef.value.open(spuId, 0, 0, category3Id, skuId)
  })
}
// 子组件取消按钮的回调
const cancel = () => {
  showSkuData.value = true
}
// 子组件保存按钮的回调
const submit = () => {
  // 切换卡片
  showSkuData.value = true
  // 重新获取sku列表
  getSkuList()
}
// 组件挂载完毕
onMounted(() => {
  getSkuList()
})
</script>

<style lang="" scoped></style>
