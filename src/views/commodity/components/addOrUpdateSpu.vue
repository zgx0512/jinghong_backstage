<template>
  <el-card>
    <el-form :label-width="80" :model="spuInfoForm" :rules="rules" ref="spuInfoFormRef">
      <el-form-item label="SPU名称" prop="spuName">
        <el-input v-model="spuInfoForm.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spuInfoForm.tmId">
          <el-option v-for="tm in tmList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="SPU描述" prop="description">
        <el-input :rows="4" type="textarea" v-model="spuInfoForm.description" />
      </el-form-item>
      <el-form-item label="SPU图片" prop="imageList">
        <el-upload
          v-model:file-list="fileList"
          action="/api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :before-upload="beforeAvatarUpload"
        >
          <el-icon>
            <Plus />
          </el-icon>
        </el-upload>
        <el-dialog v-model="dialogVisible" style="width: 400px; height: 440px">
          <img w-full :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          v-model="saleAttr"
          :placeholder="placeholder"
          :disabled="saleAttrList.length === 0"
        >
          <el-option
            v-for="saleAttr in saleAttrList"
            :key="saleAttr.id"
            :label="saleAttr.name"
            :value="`${saleAttr.name}+${saleAttr.id}`"
          />
        </el-select>
        <el-button
          type="primary"
          icon="Plus"
          style="margin-left: 10px"
          :disabled="!saleAttr"
          @click="addSaleAttr"
          >添加销售属性</el-button
        >
        <el-table border style="margin-top: 10px; width: 100%" :data="spuInfoForm.spuSaleAttrList">
          <el-table-column type="index" label="序号" width="80"></el-table-column>
          <el-table-column prop="saleAttrName" label="属性名"></el-table-column>
          <el-table-column label="属性值名称列表">
            <template #default="{ row }">
              <el-tag
                class="mx-1"
                closable
                v-for="(spuSaleAttrValue, index) in row.spuSaleAttrValueList"
                :key="spuSaleAttrValue.saleAttrValueName"
                @close="handleClose(row.spuSaleAttrValueList, index)"
                >{{ spuSaleAttrValue.saleAttrValueName }}</el-tag
              >
              <el-input
                v-if="row.inputVisible"
                ref="InputRef"
                v-model="row.inputValue"
                class="ml-1 w-20"
                size="small"
                @keyup.enter="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              />
              <el-button v-else class="button-new-tag ml-1" size="small" @click="showInput(row)"
                >添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template #default="{ row, $index }">
              <el-button
                icon="Delete"
                type="danger"
                size="small"
                @click="removeSaleAttr(row, $index)"
              ></el-button>
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
import { ref, onMounted, defineEmits, nextTick, defineExpose } from 'vue'
// 引入接口函数
import { reqSaleAttrInfo, reqAddOrUpdateSPU, reqSpuFormId } from '~/api/commodity/commodity_list'
// 引入ts类型
import {
  spuResponseType,
  saleAttrResponseType,
  saleAttrValueResponseType,
  imageResponseType
} from '~/api/commodity/commodity_list/type'
// 引入接口函数
import { reqTmList } from '~/api/commodity/trademark'
// 引入ts类型
import { tmResponseType, tmListResponseType } from '~/api/commodity/trademark/type'
import { ElMessage } from 'element-plus'
// 引入自定义校验规则
import { imageListValidatePass } from '~/utils/validate'
const emits = defineEmits(['cancel', 'submit'])
// 照片墙列表
const fileList = ref([])
// 品牌列表
const tmList = ref<tmResponseType[]>([])
// 基础销售属性列表
const saleAttrList = ref<saleAttrResponseType[]>([])
// 销售属性(名字+id)
const saleAttr = ref<string>('')
// spu表单的ref对象
const spuInfoFormRef = ref()
// spu表单
const spuInfoForm = ref<spuResponseType>({
  category3Id: '',
  id: '',
  spuName: '',
  description: '',
  tmId: '',
  spuImageList: [],
  spuSaleAttrList: [],
  spuPosterList: []
})
// 控制放大图片对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 放大图片
const dialogImageUrl = ref('')
// 保存按钮加载效果
const loading = ref<boolean>(false)
// 打开卡片的回调
const open = async (row: spuResponseType, category3Id: number | string) => {
  if (row.id) {
    // 有id，是修改
    // 调用接口，获取当前spu的全部数据
    const result = await reqSpuFormId(row.id)
    if (result.code === 200) {
      // 赋值
      spuInfoForm.value = result.data
      // 照片墙数据
      fileList.value = result.data.spuImageList.map((item: imageResponseType) => {
        return {
          url: item.imgUrl,
          name: item.imgName
        }
      })
      console.log(fileList.value)
      // 剩余销售属性列表
      saleAttrList.value = saleAttrList.value.filter((item) => {
        // 判断当前销售属性是否已经被选中了
        return !result.data.spuSaleAttrList.some((item1: any) => item.name === item1.saleAttrName)
      })
    }
  } else {
    // 是添加，每次打开都清空上一次的文本框
    spuInfoForm.value = {
      category3Id: '',
      id: '',
      spuName: '',
      description: '',
      tmId: '',
      spuImageList: [],
      spuSaleAttrList: [],
      spuPosterList: []
    }
  }
  // 提示语的动态变化
  placeholder.value =
    saleAttrList.value.length > 0 ? `还有${saleAttrList.value.length}未选择` : '已选完'
  spuInfoForm.value.category3Id = category3Id
}
// 表单校验规则
const rules = ref({
  spuName: { required: true, message: 'SPU名称不能为空', trigger: 'blur' },
  description: { required: true, message: 'SPU描述不能为空', trigger: 'blur' },
  imageList: {
    required: true,
    validator: (e1: any, e2: any, e3: any) =>
      imageListValidatePass(e1, e2, e3, fileList.value.length),
    trigger: 'blur'
  }
})
// 获取品牌数据的接口
const getTmList = async () => {
  // 调用接口
  const result: tmListResponseType = await reqTmList()
  if (result.code === 200) {
    tmList.value = result.data
  }
}
// 获取基础销售属性
const getSaleAttrList = async () => {
  // 调用接口
  const result = await reqSaleAttrInfo()
  if (result.code === 200) {
    saleAttrList.value = result.data
    placeholder.value =
      saleAttrList.value.length > 0 ? `还有${saleAttrList.value.length}未选择` : '已选完'
  }
}
// 取消按钮的回调
const cancel = () => {
  emits('cancel')
}
// 点击已上传图片放大icon的回调
const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
// 图片上传前的回调
const beforeAvatarUpload = (rawFile: any) => {
  if (
    rawFile.type !== 'image/jpeg' &&
    rawFile.type !== 'image/jpg' &&
    rawFile.type !== 'image/png' &&
    rawFile.type !== 'image/gif'
  ) {
    ElMessage.error('图片只能是jpg、png、jpeg、gif格式')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 3) {
    ElMessage.error('图片大小不能超过3M')
    return false
  }
  return true
}
const placeholder = ref<string>('')
// 添加销售属性按钮的回调
const addSaleAttr = () => {
  // 将销售属性切成数组
  const arr = saleAttr.value.split('+')
  // 将当前销售属性添加到表格列表中
  spuInfoForm.value.spuSaleAttrList?.push({
    baseSaleAttrId: Number(arr[1]),
    saleAttrName: arr[0],
    spuSaleAttrValueList: [],
    inputVisible: false,
    inputValue: '',
    name: ''
  })
  // 从销售属性列表中移除掉要添加的那一项
  saleAttrList.value = saleAttrList.value.filter((item) => item.name !== arr[0])
  // 清空saleAttrName
  saleAttr.value = ''
  // 动态判断下选择框要展示什么默认信息
  placeholder.value =
    saleAttrList.value.length > 0 ? `还有${saleAttrList.value.length}未选择` : '已选完'
}
// 文本框ref对象
const InputRef = ref()
// 添加属性值按钮的回调
const showInput = (row: saleAttrResponseType) => {
  row.inputVisible = true
  nextTick(() => {
    InputRef.value?.focus()
  })
}
// 文本框失去焦点的回调
const handleInputConfirm = (row: saleAttrResponseType) => {
  if (!row.inputValue) {
    // 提示用户属性值不能为空
    ElMessage({
      type: 'warning',
      message: '属性值不能为空'
    })
    return
  }
  // 判断当前的属性值是否已经存在
  const res = row.spuSaleAttrValueList?.some((item) => item.saleAttrValueName === row.inputValue)
  if (res) {
    // 存在，提示用户
    ElMessage.warning('属性值已经存在')
    return
  }
  row.spuSaleAttrValueList?.push({
    baseSaleAttrId: row.baseSaleAttrId,
    saleAttrName: row.saleAttrName,
    saleAttrValueName: row.inputValue
  })
  row.inputVisible = false
  row.inputValue = ''
}
// 删除属性值按钮的回调
const handleClose = (row: saleAttrValueResponseType[], index: number) => {
  // 删除对应的数据
  row.splice(index, 1)
}
// 删除销售属性的回调
const removeSaleAttr = (row: saleAttrResponseType, index: number) => {
  spuInfoForm.value.spuSaleAttrList?.splice(index, 1)
  saleAttrList.value.push({
    name: row.saleAttrName as string
  })
  placeholder.value =
    saleAttrList.value.length > 0 ? `还有${saleAttrList.value.length}未选择` : '已选完'
}
// 保存按钮的回调
const submit = () => {
  // 表单校验
  if (!spuInfoFormRef.value) return
  spuInfoFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      // 表单校验通过, 开启加载效果
      loading.value = true
      // 整合要传给后台的数据
      spuInfoForm.value.spuImageList = fileList.value.map((item: any) => {
        return {
          imgUrl: item.response ? item.response.data : item.url,
          imgName: item.name
        }
      })
      // 移除掉 inputValue 跟 inputVisible 跟 name
      spuInfoForm.value.spuSaleAttrList = spuInfoForm.value.spuSaleAttrList?.map((item) => {
        return {
          baseSaleAttrId: item.baseSaleAttrId,
          saleAttrName: item.saleAttrName,
          spuSaleAttrValueList: item.spuSaleAttrValueList
        }
      })
      const result = await reqAddOrUpdateSPU(spuInfoForm.value)
      if (result.code === 200) {
        // 添加|修改成功
        ElMessage.success('保存成功')
        // 通知父组件切换卡片
        emits('submit', spuInfoForm.value.id)
        // 关闭加载效果
        loading.value = false
      } else {
        // 保存失败
        ElMessage.error(result.data)
        // 关闭加载效果
        loading.value = false
      }
    } else {
      console.log('error submit')
      return false
    }
  })
}
onMounted(() => {
  getTmList()
  getSaleAttrList()
})
defineExpose({
  open
})
</script>

<style lang="" scoped></style>
