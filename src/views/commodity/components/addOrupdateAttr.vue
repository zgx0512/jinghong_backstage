<template>
  <el-card>
    <el-form :inline="true">
      <el-form-item label="属性名称">
        <el-input
          placeholder="请输入属性名称"
          v-model="baseAttrInfo.attrName"
          :disabled="baseAttrInfo.attrValueList.length > 0"
        ></el-input>
      </el-form-item>
    </el-form>
    <el-button type="primary" icon="Plus" :disabled="!baseAttrInfo.attrName" @click="addAttrValue"
      >添加属性值</el-button
    >
    <el-table border style="margin: 10px 0" :data="baseAttrInfo.attrValueList">
      <el-table-column type="index" label="序号" width="80" align="center"></el-table-column>
      <el-table-column prop="valueName" label="属性值名称">
        <template #default="{ row, $index }">
          <el-input
            v-model="row.valueName"
            v-if="row.isEdit"
            ref="valueNameInputRef"
            @blur="blur(row, $index)"
          ></el-input>
          <span style="display: block; width: 100%" v-else @click="edit(row)">{{
            row.valueName
          }}</span>
        </template>
      </el-table-column>
      <el-table-column label="属性值操作">
        <template #default="{ $index }">
          <el-button
            type="danger"
            size="small"
            icon="Delete"
            @click="removeAttrValue($index)"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button
      type="primary"
      :disabled="baseAttrInfo.attrValueList.length === 0"
      @click="submit"
      :loading="loading"
      >保存</el-button
    >
    <el-button type="danger" @click="cancel">取消</el-button>
  </el-card>
</template>

<script lang="ts" setup>
import { ElMessage } from 'element-plus'
import { ref, nextTick, defineEmits, defineExpose } from 'vue'
// 引入接口函数
import { reqSaveAttrInfo } from '~/api/commodity/attr'
// 引入ts类型
import type { attrValueResponseType, attrReponseType } from '~/api/commodity/attr/type'
const emits = defineEmits(['cancel', 'submit'])
const baseAttrInfo = ref<attrReponseType>({
  attrName: '', // 属性名称
  attrValueList: [], // 属性值列表
  categoryId: 0,
  categoryLevel: 3
})
// 属性值文本框的ref对象
const valueNameInputRef = ref()
// 提交按钮加载效果
const loading = ref<boolean>(false)
// 添加属性值按钮的回调
const addAttrValue = () => {
  baseAttrInfo.value.attrValueList.push({
    valueName: '',
    isEdit: true
  })
  nextTick(() => {
    // 最后一个输入框获得焦点
    valueNameInputRef.value.focus()
  })
}
// 属性值文本框失去焦点的回调
const blur = (row: attrValueResponseType, index: number) => {
  if (!row.valueName) {
    // 提示用户属性值不能为空
    ElMessage({
      type: 'warning',
      message: '属性值不能为空'
    })
    return
  }
  // 从列表中先去除当前的值
  const arr = baseAttrInfo.value.attrValueList.filter((item, index1) => index1 !== index)
  // 循环，判断当前属性值是否已存在
  const result = arr.some((item) => item.valueName === row.valueName)
  if (result) {
    // 存在，提示用户
    ElMessage({
      type: 'warning',
      message: '属性值不能相同'
    })
    return
  }
  row.isEdit = false
}
// 点击文本的回调
const edit = (row: attrValueResponseType) => {
  row.isEdit = true
  nextTick(() => {
    // 当前文本框获取焦点
    valueNameInputRef.value.focus()
  })
}
const open = (row: attrReponseType, id: number | string) => {
  baseAttrInfo.value.categoryId = id
  if (row.id) {
    // 是编辑
    baseAttrInfo.value = JSON.parse(JSON.stringify(row))
  }
}
// 取消按钮的回调
const cancel = () => {
  // 清空当前的数据
  baseAttrInfo.value.attrValueList = []
  baseAttrInfo.value.attrName = ''
  // 调用父组件方法
  emits('cancel')
}
// 删除按钮的回调
const removeAttrValue = (index: number) => {
  baseAttrInfo.value.attrValueList.splice(index, 1)
}
// 保存按钮的回调
const submit = async () => {
  // 判断是否还有编辑状态的属性值
  const res = baseAttrInfo.value.attrValueList.some((item: attrValueResponseType) => item.isEdit)
  if (res) {
    // 有，提示用户属性值不符合规范
    ElMessage({
      type: 'warning',
      message: '属性值不符合规范！'
    })
    return
  }
  // 去掉isEdit
  baseAttrInfo.value.attrValueList.forEach((item: attrValueResponseType) => delete item.isEdit)
  // 开启加载效果
  loading.value = true
  try {
    await reqSaveAttrInfo(baseAttrInfo.value)
    // 成功提示信息
    ElMessage({
      type: 'success',
      message: '保存成功'
    })
    // 关闭加载效果
    loading.value = false
    // 通知父组件
    emits('submit')
  } catch (error) {
    // 失败提示信息
    ElMessage({
      type: 'error',
      message: '保存失败'
    })
    // 关闭加载效果
    loading.value = false
  }
}
// 将open函数暴露出去
defineExpose({
  open
})
</script>

<style lang="" scoped></style>
