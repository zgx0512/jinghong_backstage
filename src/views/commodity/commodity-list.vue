<template>
  <div class="container">
    <!-- 分类选择卡片 -->
    <el-card style="margin-bottom: 10px">
      <category @initCategory="initCategory" :disabled="showCommodityData !== 0"></category>
    </el-card>
    <!-- 展示商品数据卡片 -->
    <el-card v-if="showCommodityData === 0">
      <el-button type="primary" icon="Plus" :disabled="!category3Id" @click="open"
        >添加商品</el-button
      >
      <tph-table
        :tableData="commodityList"
        :tableHeadList="tableHeadList"
        :tableProp="tableProp"
        v-loading="loading"
      >
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
        @size-change="getCommodityList()"
        @current-change="getCommodityList()"
      />
    </el-card>
    <!-- 添加|修改商品卡片 -->
    <addOrUpdateGoods
      v-if="showCommodityData === 1"
      @cancel="cancel"
      @submit="submit"
      ref="addOrUpdateCommodityRef"
    ></addOrUpdateGoods>
    <!-- 查看sku对话框 -->
    <skuInfo ref="skuInfoRef"></skuInfo>
    <!-- 修改商品归属的分类 -->
    <updateCategory ref="updateCategoryRef" @refresh="refresh" />
  </div>
</template>

<!-- 使用tsx语法的话，这里的lang要改为tsx -->
<script lang="tsx" setup>
// 引入分类选择组件
import category from '~/components/category.vue'
import { ref, nextTick } from 'vue'
// 引入接口函数
import { reqCommodityList, reqRemoveCommodity } from '~/api/commodity/commodity-list'
// 引入子组件
import addOrUpdateGoods from './components/addOrUpdateGoods.vue'
import skuInfo from './components/skuInfo.vue'
import updateCategory from './components/updateCategory.vue'
import { ElMessage } from 'element-plus'
// commodity数据列表
const commodityList = ref<GoodsResponseType[]>([])
// 一级分类id
const category1Id = ref<number | string>('')
// 二级分类id
const category2Id = ref<number | string>('')
// 三级分类id
const category3Id = ref<number | string>('')
// commodity表格基本属性
const tableProp = {
  index: false,
  isZh: true
}
const onsaleMap = { 1: '上架中', 0: '已下架' }
// commodity表格的表头列表
const tableHeadList = [
  {
    label: '商品',
    property: 'goods_name',
    width: '300px',
    fit: true,
    align: 'left',
    component: {
      render(h: any, row: GoodsResponseType) {
        return (
          <div class="goods-info">
            {row.image_list && <el-image class="goods-img" src={row.image_list[0]} />}
            <div class="goods-name">
              <span>{row.goods_name || '--'}</span>
              <span>{row.goods_id || '--'}</span>
            </div>
          </div>
        )
      }
    }
  },
  {
    label: '售价(元)',
    property: 'min_group_price',
    width: '50px',
    fit: true
  },
  {
    label: '销量',
    property: 'sales_num',
    width: '50px',
    fit: true
  },
  {
    label: '上架状态',
    property: 'is_onsale',
    width: '60px',
    fit: true,
    component: {
      render(h: any, row: GoodsResponseType) {
        if (!row.is_onsale) {
          return <div>--</div>
        }
        return (
          <div class="onsale-status">
            <span class={`icon ${row.is_onsale === 1 ? 'icon-success' : 'icon-error'}`}></span>
            <span>{onsaleMap[row.is_onsale as keyof typeof onsaleMap]}</span>
          </div>
        )
      }
    }
  },
  {
    label: '添加时间',
    property: 'create_time',
    width: '80px',
    fit: true
  },
  {
    label: '操作',
    property: 'action',
    width: '120px',
    fit: true,
    component: {
      render(h: any, row: GoodsResponseType) {
        return (
          <div>
            <el-button
              type="warning"
              icon="EditPen"
              size="small"
              title="修改商品"
              onClick={() => open(row)}
            />
            <el-button
              type="info"
              icon="InfoFilled"
              size="small"
              title="查看sku"
              onClick={() => openSku(row)}
            />
            <el-button
              type="primary"
              icon="edit"
              size="small"
              title="修改分类"
              onClick={() => changeCategory(row)}
            />
            <el-popconfirm
              title={`确定要删除当前商品?`}
              width={180}
              onConfirm={() => removeCommodity(row.goods_id)}
            >
              {{
                reference: () => (
                  <el-button type="danger" icon="Delete" size="small" title="删除商品" />
                )
              }}
            </el-popconfirm>
          </div>
        )
      }
    }
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
const showCommodityData = ref<number>(0) // 0: 展示数据卡片   1: 添加|编辑卡片  2: 添加sku卡片
// 添加|编辑卡片的ref对象
const addOrUpdateCommodityRef = ref()
// 获取商品列表
const getCommodityList = async () => {
  // 开启加载效果
  loading.value = true
  const result: GoodsInfoResponseType = await reqCommodityList(
    page.value,
    limit.value,
    category3Id.value
  )
  if (result.code === 200) {
    commodityList.value = result.data.goods_list
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
    getCommodityList()
  } else {
    // 为空，清空商品列表
    commodityList.value = []
  }
}
// 子组件的取消按钮的回调
const cancel = () => {
  showCommodityData.value = 0
}
// 添加|修改商品按钮的回调
const open = (row: GoodsResponseType) => {
  showCommodityData.value = 1
  nextTick(() => {
    addOrUpdateCommodityRef.value?.open(row, category3Id.value)
  })
}
// 子组件保存成功的回调
const submit = (id: number | string) => {
  if (!id) {
    // id不存在，是新增，回到第一页
    page.value = 1
  }
  // 重新获取数据
  getCommodityList()
  // 切换卡片
  showCommodityData.value = 0
}
// sku对话框的ref对象
const skuInfoRef = ref()
// 查看sku按钮的回调
const openSku = (row: GoodsResponseType) => {
  // 调用子组件暴露的函数
  nextTick(() => {
    skuInfoRef.value.open(row)
  })
}
// 删除按钮的回调
const removeCommodity = async (id: number | string) => {
  //  调用接口
  const result = await reqRemoveCommodity(id)
  if (result.code === 200) {
    // 删除成功，提示用户
    ElMessage.success('删除成功')
    // 判断删除的是否是当前页的最后一项
    if (commodityList.value.length <= 1) {
      // 是，删除后要往前一页
      page.value = page.value - 1
    }
    // 重新获取商品列表
    getCommodityList()
  } else {
    // 删除失败
    ElMessage.error('删除失败')
  }
}

const updateCategoryRef = ref()
// 修改分类的回调
const changeCategory = (row: GoodsResponseType) => {
  // 打开对话框
  updateCategoryRef.value.open(row)
}
const refresh = () => {
  // 重新获取数据
  getCommodityList()
}
</script>

<style lang="scss" scoped>
:deep(.el-table) {
  .goods-info {
    display: flex;
    align-items: center;
    gap: 8px;
    min-width: 280px;
    .goods-img {
      width: 50px;
      height: 50px;
      flex-shrink: 0;
    }
    .goods-name {
      flex: 1;
      display: flex;
      flex-direction: column;
      min-width: 0;
      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
  .onsale-status {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    .icon {
      display: inline-block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
    }
    .icon-success {
      background-color: #00c853;
    }
    .icon-error {
      background-color: #f44336;
    }
  }
}
</style>
