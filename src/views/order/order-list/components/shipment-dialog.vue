<template>
  <el-dialog v-model="dialogVisible" title="发货" width="500" @close="handleClose">
    <el-form ref="formRef" :model="formData" label-width="100px" :rules="rules">
      <el-form-item label="物流公司" prop="express_code">
        <el-select v-model="formData.express_code" placeholder="请选择物流公司">
          <el-option
            v-for="item in logisticsCompany"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号" prop="express_sn">
        <el-input v-model="formData.express_sn"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button size="small" @click="handleClose()">取消</el-button>
        <el-button type="primary" size="small" :loading="btnLoading" @click="handleConfirm"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { LOGISTICS_COMPANY } from '~/views/order/order-list/const'
import { reqSendExpress } from '~/api/order/order-list'
import { ElMessage } from 'element-plus'

const emits = defineEmits(['refresh'])

const dialogVisible = ref(false)

let order_id = ''
const open = (row: OrderResponse) => {
  dialogVisible.value = true
  order_id = row.order_id
}

const formData = ref({
  express_sn: '',
  express_code: ''
})
const rules = ref({
  express_code: [{ required: true, message: '请选择物流公司', trigger: 'change' }],
  express_sn: [{ required: true, message: '请输入物流单号', trigger: 'blur' }]
})
const logisticsCompany = ref([...LOGISTICS_COMPANY])

const handleClose = () => {
  dialogVisible.value = false
}

const btnLoading = ref(false)
const formRef = ref()
const handleConfirm = () => {
  if (!formRef.value) return
  formRef.value.validate(async (valid: boolean) => {
    if (!valid) return
    try {
      btnLoading.value = true
      const data = {
        ...formData.value,
        order_id
      }
      await reqSendExpress(data)
      ElMessage.success('发货成功')
      handleClose()
      //   通知父组件，刷新列表
      emits('refresh')
    } catch (error) {
      console.log(error)
    } finally {
      btnLoading.value = false
    }
  })
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.dialog-footer {
  .el-button {
    padding: 12px 20px;
  }
}
</style>
