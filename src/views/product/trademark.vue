<template>
  <div class="container">
    <el-card>
      <el-button type="primary" icon="Plus" @click="open">添加品牌</el-button>
      <el-table border :data="tmList" style="margin: 10px 0" v-loading="loading">
        <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
        <el-table-column
          prop="tmName"
          label="品牌名称"
          width="150"
          align="center"
        ></el-table-column>
        <el-table-column prop="logoUrl" label="品牌LOGO" width="150" align="center">
          <template #default="{ row }">
            <img :src="row.logoUrl" alt="" style="width: 40px; display: inline-block" />
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          label="创建时间"
          align="center"
        ></el-table-column>
        <el-table-column
          prop="updateTime"
          label="更新时间"
          align="center"
        ></el-table-column>
        <el-table-column label="操作" align="center">
          <template #default="{ row }">
            <el-button type="primary" icon="Edit" size="small" @click="open(row)"></el-button>
            <el-popconfirm :title="`确定删除${row.tmName}?`" @confirm="remove(row.id)" width="180">
              <template #reference>
                <el-button type="danger" icon="Delete" size="small"></el-button>
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
        @size-change="getTmList()"
        @current-change="getTmList()"
      />
    </el-card>
    <!-- 添加|修改品牌对话框 -->
    <addOrUpdateTm ref="addOrUpdateTmRef" @submit="submit"></addOrUpdateTm>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
// 引入接口函数
import { reqTrademarkInfo, reqRemoveTm } from '~/api/product/trademark'
// 引入ts类型
import type { tmResponseType } from '~/api/product/trademark/type'
// 引入子组件
import addOrUpdateTm from './components/addOrUpdateTm.vue'
import { ElMessage } from 'element-plus'
// 品牌列表
const tmList = ref<tmResponseType[]>([])
// 当前页
const page = ref<number>(1)
// 每页大小
const limit = ref<number>(5)
// 总数
const total = ref<number>(0)
// 添加|修改品牌对话框的ref对象
const addOrUpdateTmRef = ref()
// 表格数据加载效果
const loading = ref<boolean>(false)
// 获取品牌列表的函数
const getTmList = async () => {
  loading.value = true
  // 调用接口
  const result = await reqTrademarkInfo(page.value, limit.value)
  if (result.code === 200) {
    // 赋值
    tmList.value = result.data.trademarkList
    total.value = result.data.total
    // 关闭加载效果
    loading.value = false
  }
}
// 页面挂载完毕
onMounted(() => {
  getTmList()
})
// 添加|修改按钮的回调
const open = (row: tmResponseType = {}) => {
  addOrUpdateTmRef.value.open(row)
}
const submit = (id: number| string) => {
  if (!id) {
    // id不存在，是添加，回到第一页
    page.value = 1
  }
  // 重新获取数据
  getTmList()
}
// 删除按钮的回调
const remove = async (id: number| string) => {
  // 调用接口
  const result = await reqRemoveTm(id)
  if (result.code === 200) {
    // 删除成功，提示用户
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
    // 判断删除的是否是当前页的最后一条
    if (tmList.value.length <= 1) {
      // 回到上一页
      page.value = page.value - 1
    } 
    // 重新获取品牌数据
    getTmList()
  } else {
    // 删除失败，提示用户
    ElMessage({
      type: 'error',
      message: result.data
    })
  }
}
</script>

<style lang="" scoped></style>
