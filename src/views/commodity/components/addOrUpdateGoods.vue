<template>
  <el-card>
    <el-form :label-width="100" :model="goodsInfoForm" :rules="rules" ref="goodsInfoFormRef">
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="goodsInfoForm.goods_name" class="w500"></el-input>
      </el-form-item>
      <el-form-item label="品牌" prop="tm_id">
        <el-select placeholder="请选择品牌" v-model="goodsInfoForm.tm_id" class="w260">
          <el-option v-for="tm in tmList" :key="tm.id" :label="tm.tmName" :value="tm.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="note">
        <el-input :rows="2" type="textarea" v-model="goodsInfoForm.note" class="w500" />
      </el-form-item>
      <el-form-item label="上架状态" prop="is_onsale">
        <el-select v-model="goodsInfoForm.is_onsale" class="w260">
          <el-option
            v-for="onsale in onsaleList"
            :key="onsale.value"
            :label="onsale.label"
            :value="onsale.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="商品图片" prop="imageList">
        <el-upload
          v-model:file-list="fileList"
          :headers="uploadHeaders"
          :action="`${env.VITE_BASE_URL}/upload`"
          list-type="picture-card"
          multiple
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
      <el-form-item label="规格与价格" required>
        <div style="width: 100%">
          <div style="display: flex; gap: 20px; align-items: flex-start">
            <table v-for="(group, index) in skuGroups" :key="group.uid" class="sku-table">
              <thead>
                <tr>
                  <th>
                    <el-tooltip
                      :content="index === 0 ? '规格类型位置后移' : '规格类型位置前移'"
                      placement="top"
                    >
                      <template #content
                        >{{ index === 0 ? '规格类型位置后移' : '规格类型位置前移' }}<br />{{
                          canMoveSpec && '请先选择规格类型'
                        }}</template
                      >
                      <div>
                        <el-icon
                          v-if="index === 1 && skuGroups.length > 1"
                          :class="['btn-move', { disabled: canMoveSpec }]"
                          @click="moveSpec"
                          ><CaretLeft
                        /></el-icon>
                        <el-icon
                          v-else-if="index === 0 && skuGroups.length > 1"
                          :class="['btn-move', { disabled: canMoveSpec }]"
                          @click="moveSpec"
                          ><CaretRight
                        /></el-icon>
                      </div>
                    </el-tooltip>
                  </th>
                  <th>
                    <div class="sku-type">
                      <div><span class="span-required">*</span>规格类型:</div>
                      <div class="sku-type-select">
                        <el-select
                          :model-value="group.spec_id"
                          placeholder="请选择"
                          style="width: 180px"
                          class="sku-select"
                          @change="handleChangeSpec($event, index)"
                        >
                          <el-option
                            v-for="item in specList"
                            :key="item.spec_id"
                            :label="item.spec_name"
                            :value="item.spec_id"
                          />
                        </el-select>
                        <!-- <el-checkbox label="添加规格图片" class="sku-checkbox" /> -->
                      </div>
                      <el-popover
                        :visible="addCustomSpecVisible"
                        title="添加自定义规格类型"
                        placement="top"
                        popper-class="custom-spec-popover"
                      >
                        <template #reference>
                          <div
                            style="color: #2e71ea; cursor: pointer"
                            class="add-custom-spec"
                            @click="addCustomSpecVisible = true"
                          >
                            自定义规格
                          </div>
                        </template>
                        <el-input placeholder="请输入规格类型" v-model="customSpecName"></el-input>
                        <div style="text-align: right; margin: 0; margin-top: 10px">
                          <el-button size="small" text @click="cancelCustomSpec">取消</el-button>
                          <el-button
                            size="small"
                            type="primary"
                            :loading="addSpecLoading"
                            @click="addSpec"
                          >
                            确定
                          </el-button>
                        </div>
                      </el-popover>
                    </div>
                  </th>
                  <th>
                    <el-popconfirm
                      class="box-item"
                      width="220"
                      title="确定删除此规格类型吗?"
                      placement="top"
                      confirm-button-text="确定"
                      cancel-button-text="取消"
                      @confirm="handleRemoveSkuGroup(index)"
                    >
                      <template #reference>
                        <el-button :disabled="skuGroups.length <= 1" type="danger" text class="btn"
                          >删除</el-button
                        >
                      </template>
                    </el-popconfirm>
                  </th>
                </tr>
              </thead>
              <!-- 
                 v-model: 绑定要拖拽的数据
                 tag: 渲染的容器标签，默认div​
                 handle: 拖拽手柄选择器
                 item-key: 每个拖拽项的唯一标识
               -->
              <draggable
                v-model="group.list"
                tag="tbody"
                item-key="uid"
                handle=".move"
                @end="onDragEnd"
              >
                <template #item="{ element, index: skuIndex }">
                  <tr :key="element.uid">
                    <td class="move"><span>::</span></td>
                    <td>
                      <div class="sku-content-cell">
                        <el-input
                          v-model="element.spec_value"
                          placeholder="请输入规格值"
                          @blur="handleBlur(index)"
                        ></el-input>
                      </div>
                    </td>
                    <td>
                      <el-popconfirm
                        class="box-item"
                        width="220"
                        title="确定删除此规格值吗?"
                        placement="top"
                        confirm-button-text="确定"
                        cancel-button-text="取消"
                        @confirm="handleRemoveSkuValue(index, skuIndex)"
                      >
                        <template #reference>
                          <el-button type="primary" text class="btn">删除</el-button>
                        </template>
                      </el-popconfirm>
                    </td>
                  </tr>
                </template>
              </draggable>
              <tr>
                <td style="width: 28px"></td>
                <td colspan="2" style="padding: 4px 0">
                  <el-button
                    icon="Plus"
                    type="primary"
                    text
                    class="btn"
                    :disabled="!group.spec_id"
                    @click="handleAddSkuValue(group.spec_id, index)"
                    >添加规格值</el-button
                  >
                </td>
              </tr>
            </table>
          </div>
          <el-button
            icon="Plus"
            type="primary"
            plain
            class="add-sku-btn"
            :disabled="skuGroups.length >= 2"
            @click="handleAddSku"
            >{{ `添加规格(${skuGroups.length}/2)` }}</el-button
          >
          <el-table
            :data="skuTableList"
            :span-method="objectSpanMethod"
            border
            class="sku-res-table"
          >
            <el-table-column
              v-for="group in spec_list"
              :key="group.id"
              :prop="group.spec_value"
              :label="group.spec_name"
            >
            </el-table-column>
            <el-table-column prop="min_group_price" min-width="200">
              <template #header>
                <div class="sku-table-header">
                  <div><span class="span-required">*</span>售价(元)</div>
                  <el-button type="primary" text class="btn">批量修改</el-button>
                </div>
              </template>
              <template #default="{ row }">
                <el-input
                  :value="row.min_group_price"
                  placeholder="请输入售价"
                  @input="handleInput(row, 'min_group_price', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="min_normal_price" min-width="200">
              <template #header>
                <div class="sku-table-header">
                  <div><span class="span-required">*</span>划线价(元)</div>
                  <el-button type="primary" text class="btn">批量修改</el-button>
                </div>
              </template>
              <template #default="{ row }">
                <el-input
                  :value="row.min_normal_price"
                  placeholder="请输入划线价"
                  @input="handleInput(row, 'min_group_price', $event)"
                ></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="out_sku_sn" label="规格编码" min-width="200">
              <template #default="{ row }">
                <el-input v-model="row.out_sku_sn" placeholder="请输入规格编码"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="is_default" label="是否是默认规格" min-width="130">
              <template #default="{ row }">
                <el-switch
                  v-model="row.is_default"
                  :active-value="1"
                  :inactive-value="0"
                  size="small"
                  @change="toggleDefaultSpec(row)"
                />
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>
      <el-form-item label="服务">
        <el-checkbox-group v-model="goodsInfoForm.service_labels">
          <el-checkbox label="极速售后" :value="1" />
          <el-checkbox label="七天无理由退款" :value="2" />
          <el-checkbox label="损坏包退" :value="3" />
          <el-checkbox label="正品保证" :value="4" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="已售件数" prop="sales_num">
        <el-input v-model="goodsInfoForm.sales_num" placeholder="请输入整数" class="w260">
          <template #suffix><span>件</span></template>
        </el-input>
      </el-form-item>
      <el-form-item label="商品标签">
        <el-checkbox-group v-model="goodsInfoForm.goods_labels">
          <el-checkbox :value="1">
            <template #default>
              <span class="goods-tag brown">精选</span>
            </template>
          </el-checkbox>
          <el-checkbox :value="2">
            <template #default>
              <span class="goods-tag red">热卖</span>
            </template>
          </el-checkbox>
          <el-checkbox :value="3">
            <template #default>
              <span class="goods-tag green">新品</span>
            </template>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="发货承诺" prop="delivery_promise_type">
        <el-radio-group v-model="goodsInfoForm.delivery_promise_type">
          <el-radio :value="1">当日发货</el-radio>
          <el-radio :value="2">24小时发货</el-radio>
          <el-radio :value="3">48小时发货</el-radio>
          <el-radio :value="4">72小时发货</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading">提交</el-button>
        <el-button @click="cancel">取消</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script lang="ts" setup>
import draggable from 'vuedraggable'
import { ref, onMounted, defineEmits, defineExpose, computed } from 'vue'
// 引入接口函数
import { reqAddOrUpdateSPU, reqSpecList, reqAddSpec } from '~/api/commodity/commodity_list'
// 引入接口函数
import { reqTmList } from '~/api/commodity/trademark'
// 引入ts类型
import { tmResponseType, tmListResponseType } from '~/api/commodity/trademark/type'
import { ElMessage } from 'element-plus'
import type { TableColumnCtx } from 'element-plus'
// 引入自定义校验规则
import { imageListValidatePass } from '~/utils/validate'
import { getToken } from '~/utils/token'
// 引入环境变量
const env = import.meta.env
const uploadHeaders = {
  Authorization: `Bearer ${getToken()}`
}
const emits = defineEmits(['cancel', 'submit'])
const specList = ref<specResponseType[]>([])
// 照片墙列表
const fileList = ref([])
// 品牌列表
const tmList = ref<tmResponseType[]>([])
// spu表单的ref对象
const goodsInfoFormRef = ref()
// spu表单
const goodsInfoForm = ref<GoodsResponseType>({
  category_id: '',
  goods_id: '',
  goods_name: '',
  note: '',
  sales_num: '',
  is_onsale: 1,
  tm_id: '',
  sku_list: [],
  image_list: [],
  service_labels: [],
  goods_labels: [],
  delivery_promise_type: 3
})
const skuGroups = ref<skuGroupResponseType[]>([])
const handleAddSku = () => {
  if (skuGroups.value.length >= 2) {
    return
  }
  skuGroups.value.push(getEmptySkuGroup())
}
// sku表格列表
const skuTableList = ref<skuTableResponseType[]>([])
const spec_list = ref<skuTableGroupResponseType[]>([])
const handleAddSkuValue = (id: any, index: number) => {
  skuGroups.value[index].list.push({
    uid: Date.now(),
    spec_id: id as number,
    spec_value: '',
    sku_thumb_url: ''
  })
}
const handleChangeSpec = (id: number | string, index: number) => {
  const spec_name = specList.value.find((item1) => item1.spec_id === id)?.spec_name || ''
  if (skuGroups.value.length > 1) {
    // 有两个规格组，判断是否重复规格名
    if (index === 0) {
      // 修改第一个规格组，判断第二个规格组是否有重复的规格名
      if (skuGroups.value[1].spec_name === spec_name) {
        ElMessage.warning('此规格已存在!')
        return
      }
    } else {
      // 修改第二个规格组，判断第一个规格组是否有重复的规格名
      if (skuGroups.value[0].spec_name === spec_name) {
        ElMessage.warning('此规格已存在!')
        return
      }
    }
  }
  skuGroups.value[index].spec_name = spec_name
  skuGroups.value[index].spec_id = id as number
  if (spec_list.value[index]) {
    spec_list.value[index].spec_name = spec_name
  } else {
    if (index === 1) {
      // 判断skuGroups[0]的list长度是否大于0
      if (skuGroups.value[0].list.length > 0) {
        // 大于0，则先不往spec_list.value添加数据
        return
      }
    }
    spec_list.value.push({
      id: id as number,
      spec_name: spec_name,
      spec_value: `spec_name${index + 1}`
    })
  }
}

// 删除规格类型
const handleRemoveSkuGroup = (index: number) => {
  // 直接删除规格组和对应的spec_list项
  skuGroups.value.splice(index, 1)
  spec_list.value.splice(index, 1)

  // 如果删除的是第一个规格组，需要更新剩余的规格组名称
  if (index === 0 && spec_list.value.length > 0) {
    spec_list.value[0].spec_value = 'spec_name1'
  }

  // 重新生成所有规格组合
  const { allCombinations } = generateCombinations()

  // 创建现有数据的映射，用于保留已有数据
  const existingDataMap = new Map<string, any>()
  skuTableList.value.forEach((item) => {
    const key = `${item.spec_name1}-${item.spec_name2}`
    existingDataMap.set(key, item)
  })

  // 创建新的表格数据，基于重新生成的组合
  const newTableData: skuTableResponseType[] = []

  allCombinations.forEach((combination) => {
    const key = `${combination.spec_name1}-${combination.spec_name2}`
    if (existingDataMap.has(key)) {
      // 保留现有数据
      newTableData.push(existingDataMap.get(key))
    } else {
      // 创建新数据行
      newTableData.push({
        uid: Date.now() + Math.random(),
        min_group_price: '',
        min_normal_price: '',
        out_sku_sn: '',
        is_default: 0,
        spec_name1: combination.spec_name1,
        spec_name2: combination.spec_name2
      })
    }
  })

  // 更新表格数据
  skuTableList.value = newTableData

  // 确保至少有一个默认规格
  ensureDefaultSpec()
}

// 确保至少有一个默认规格
const ensureDefaultSpec = () => {
  const hasDefault = skuTableList.value.some((item) => item.is_default === 1)
  if (!hasDefault && skuTableList.value.length > 0) {
    skuTableList.value[0].is_default = 1
  }
}

type specNameType = { spec_name1: string; spec_name2: string }

// 辅助函数 1: 处理规格值检查与插入
const handleSpecValueCheck = (index: number) => {
  if (spec_list.value[index]?.spec_value !== `spec_name${index + 1}`) {
    const newSpec = {
      id: skuGroups.value[index].spec_id as number,
      spec_name: skuGroups.value[index].spec_name as string,
      spec_value: `spec_name${index + 1}`
    }
    spec_list.value.splice(index, 0, newSpec)
  }
}

// 辅助函数 2: 过滤空值并处理规格组
const filterAndHandleGroups = (index: number) => {
  // 过滤掉规格组中的空值
  const validGroups = skuGroups.value.map((group) => ({
    ...group,
    list: group.list.filter((item) => item.spec_value && item.spec_value.trim() !== '')
  }))

  // 处理空规格组
  if (validGroups[index].list.length <= 0) {
    spec_list.value.splice(index, 1)
  }

  // 处理相邻规格组
  if (spec_list.value.length >= 2) {
    if (index === 0 && validGroups[1].list.length <= 0) {
      spec_list.value.splice(1, 1)
    } else if (index === 1 && validGroups[0].list.length <= 0) {
      spec_list.value.splice(0, 1)
    }
  }
  // 返回过滤后的规格组
  return validGroups.filter((group) => group.list.length > 0)
}

// 辅助函数 3: 生成规格组合
const generateCombinations = (groups?: skuGroupResponseType[]) => {
  // 如果没有传入参数，使用全局的skuGroups
  const validGroups = groups || skuGroups.value

  // 计算有效组合总数
  let total = 0
  if (validGroups.length === 1) {
    total = validGroups[0].list.length
  } else if (validGroups.length === 2) {
    total = validGroups[0].list.length * validGroups[1].list.length
  }

  // 生成所有有效的规格组合
  const allCombinations: specNameType[] = []

  if (validGroups.length === 2) {
    // 有两个规格组
    for (let i = 0; i < validGroups[0].list.length; i++) {
      for (let j = 0; j < validGroups[1].list.length; j++) {
        allCombinations.push({
          spec_name1: validGroups[0].list[i].spec_value,
          spec_name2: validGroups[1].list[j].spec_value
        })
      }
    }
  } else if (validGroups.length === 1) {
    // 一个规格组
    const isFirstSpec = spec_list.value[0]?.spec_value === 'spec_name1'
    for (let i = 0; i < validGroups[0].list.length; i++) {
      allCombinations.push({
        spec_name1: isFirstSpec ? validGroups[0].list[i].spec_value : '',
        spec_name2: isFirstSpec ? '' : validGroups[0].list[i].spec_value
      })
    }
  }

  return { total, allCombinations }
}

// 定义现有数据的接口
interface ExistingData {
  min_group_price: string | number
  min_normal_price: string | number
  out_sku_sn: string
  is_default: number
}

// 辅助函数 4: 保存现有数据
const saveExistingData = () => {
  const existingDataMap = new Map<string, ExistingData>()
  let hasDefaultSpec = false

  skuTableList.value.forEach((item) => {
    const key = `${item.spec_name1}-${item.spec_name2}`
    existingDataMap.set(key, {
      min_group_price: item.min_group_price,
      min_normal_price: item.min_normal_price,
      out_sku_sn: item.out_sku_sn,
      is_default: item.is_default
    })

    if (item.is_default === 1) {
      hasDefaultSpec = true
    }
  })

  return { existingDataMap, hasDefaultSpec }
}
// 辅助函数 5: 调整表格行数
const adjustTableRows = (total: number) => {
  const currentLength = skuTableList.value.length

  if (currentLength < total) {
    // 需要添加行
    const needAdd = total - currentLength
    for (let i = 0; i < needAdd; i++) {
      skuTableList.value.push({
        uid: Date.now() + i,
        min_group_price: '',
        min_normal_price: '',
        out_sku_sn: '',
        is_default: 0,
        spec_name1: '',
        spec_name2: ''
      })
    }
  } else if (currentLength > total) {
    // 需要删除行
    skuTableList.value = skuTableList.value.slice(0, total)
  }
}

// 辅助函数 6: 更新表格数据
const updateTableData = (
  allCombinations: specNameType[],
  existingDataMap: Map<string, ExistingData>,
  hasDefaultSpec: boolean
) => {
  skuTableList.value = skuTableList.value.map((item, idx) => {
    if (idx < allCombinations.length) {
      const combination = allCombinations[idx]
      const key = `${combination.spec_name1}-${combination.spec_name2}`
      const existingData = existingDataMap.get(key)

      // 如果是第一条数据且没有默认规格，设置为默认规格
      let is_default = existingData ? existingData.is_default : 0
      if (idx === 0 && !hasDefaultSpec) {
        is_default = 1
      }

      return {
        ...item,
        spec_name1: combination.spec_name1,
        spec_name2: combination.spec_name2,
        min_group_price: existingData ? existingData.min_group_price : '',
        min_normal_price: existingData ? existingData.min_normal_price : '',
        out_sku_sn: existingData ? existingData.out_sku_sn : '',
        is_default
      }
    }
    return item
  })
}

const handleBlur = (index: number) => {
  // 1. 处理规格值检查与插入
  handleSpecValueCheck(index)
  // 2. 过滤空值并处理规格组
  const validGroups = filterAndHandleGroups(index)
  // 3. 生成规格组合
  const { total, allCombinations } = generateCombinations(validGroups)
  // 4. 保存现有数据
  const { existingDataMap, hasDefaultSpec } = saveExistingData()
  // 5. 调整表格行数
  adjustTableRows(total)
  // 6. 更新表格数据
  updateTableData(allCombinations, existingDataMap, hasDefaultSpec)
}
const handleRemoveSkuValue = (index: number, skuIndex: number) => {
  // 获取要删除的规格值
  const removedValue = skuGroups.value[index].list[skuIndex]
  // 从规格组中删除该值
  skuGroups.value[index].list.splice(skuIndex, 1)
  // 检查规格组中是否还有其他值
  if (skuGroups.value[index].list.length > 0) {
    // 过滤掉包含被删除规格值的行
    skuTableList.value = skuTableList.value.filter(
      (row) => row[`spec_name${index + 1}` as keyof typeof row] !== removedValue.spec_value
    )
  } else {
    skuTableList.value = skuTableList.value.map((row) => {
      delete row[`spec_name${index + 1}` as keyof typeof row]
      return row
    })
    spec_list.value.splice(index, 1)
  }
}
const onsaleList = [
  {
    value: 1,
    label: '上架中'
  },
  {
    value: 0,
    label: '已下架'
  }
]
// 控制放大图片对话框的显示与隐藏
const dialogVisible = ref<boolean>(false)
// 放大图片
const dialogImageUrl = ref('')
// 保存按钮加载效果
const loading = ref<boolean>(false)
// 获取一个空的规格组
const getEmptySkuGroup = () => {
  return {
    uid: Date.now(),
    spec_name: '',
    useSpecThumb: false,
    customVisible: false,
    list: []
  }
}
// 打开卡片的回调
const open = async (row: GoodsResponseType, category3Id: number | string) => {
  getSpecList()
  goodsInfoForm.value.category_id = category3Id
  if (row) {
    goodsInfoForm.value.goods_id = row.goods_id
    goodsInfoForm.value.goods_name = row.goods_name
    goodsInfoForm.value.tm_id = row.tm_id
    goodsInfoForm.value.is_onsale = row.is_onsale
  }
}
// 表单校验规则
const rules = ref({
  goods_name: { required: true, message: '商品名称不能为空', trigger: 'blur' },
  tm_id: { required: true, message: '商品品牌不能为空', trigger: 'change' },
  is_onsale: { required: true, message: '商品上架状态不能为空', trigger: 'change' },
  description: { required: true, message: 'SPU描述不能为空', trigger: 'blur' },
  // imageList: {
  //   required: true,
  //   validator: (e1: any, e2: any, e3: any) =>
  //     imageListValidatePass(e1, e2, e3, fileList.value.length),
  //   trigger: 'blur'
  // },
  sales_num: [
    { required: true, message: '商品销量不能为空', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        const reg = /^(0|[1-9]\d*)$/ // 正则表达式：匹配非负整数（0 或正整数）
        if (!value || reg.test(value)) {
          callback() // 校验通过
        } else {
          callback(new Error('商品销量只能是非负整数')) // 校验失败
        }
      },
      trigger: 'blur'
    }
  ],
  delivery_promise_type: { required: true, message: '发货承诺不能为空', trigger: 'change' }
})
// 获取品牌数据的接口
const getTmList = async () => {
  try {
    // 调用接口
    const result: tmListResponseType = await reqTmList()
    if (result.code === 200) {
      tmList.value = result.data
    }
  } catch (error) {
    console.log(error)
  }
}
// 取消按钮的回调
const cancel = () => {
  // goodsInfoFormRef.value.resetFields()
  emits('cancel')
}
// 点击已上传图片放大icon的回调
const handlePictureCardPreview = (uploadFile: any) => {
  dialogImageUrl.value = uploadFile.url
  dialogVisible.value = true
}
// 图片上传前的回调
const beforeAvatarUpload = (rawFile: any) => {
  const validImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif']
  if (!validImageTypes.includes(rawFile.type)) {
    ElMessage.error('图片只能是jpg、png、jpeg、gif格式')
    return false
  }
  if (rawFile.size / 1024 / 1024 > 3) {
    ElMessage.error('图片大小不能超过3M')
    return false
  }
  return true
}
// 保存按钮的回调
const submit = () => {
  // 表单校验
  if (!goodsInfoFormRef.value) return
  goodsInfoFormRef.value.validate(async (valid: boolean) => {
    if (valid) {
      try {
        // 表单校验通过, 开启加载效果
        loading.value = true
        // 整合提交参数
        const data: GoodsResponseType = { ...goodsInfoForm.value }
        if (data.service_labels && data.service_labels.length > 0) {
          data.service_labels = (data.service_labels as number[]).join(',')
        }
        if (data.goods_labels && data.goods_labels.length > 0) {
          data.goods_labels = (data.goods_labels as number[]).join(',')
        }
        data.sku_list = skuTableList.value.map((item) => {
          const spec_list: skuTableGroupResponseType[] = []
          spec_list.push({
            spec_id: skuGroups.value[0].spec_id as number,
            spec_name: skuGroups.value[0].spec_name as string,
            spec_value: item.spec_name1
          })
          if (skuGroups.value.length > 1) {
            spec_list.push({
              spec_id: skuGroups.value[1].spec_id as number,
              spec_name: skuGroups.value[1].spec_name as string,
              spec_value: item.spec_name2
            })
          }
          return {
            is_default: item.is_default,
            min_group_price: item.min_group_price,
            min_normal_price: item.min_normal_price,
            out_sku_sn: item.out_sku_sn, // 规格编码
            spec: spec_list
          }
        })
        return
        const result = await reqAddOrUpdateSPU(goodsInfoForm.value)
        if (result.code === 200) {
          // 添加|修改成功
          ElMessage.success('保存成功')
          // 通知父组件切换卡片
          emits('submit', goodsInfoForm.value.goods_id)
          // 关闭加载效果
          loading.value = false
        } else {
          // 保存失败
          ElMessage.error(result.data)
          // 关闭加载效果
          loading.value = false
        }
      } catch (error) {
        console.log(error)
      } finally {
        // 关闭加载效果
        loading.value = false
      }
    } else {
      console.log('error submit')
      return false
    }
  })
}

// 获取规格类型列表
const getSpecList = async () => {
  try {
    const res = await reqSpecList()
    specList.value = res.data
  } catch (error) {
    console.log(error)
  }
}
// 添加自定义规格弹出框控制
const addCustomSpecVisible = ref<boolean>(false)
// 规格类型文本框绑定值
const customSpecName = ref<string>('')
const addSpecLoading = ref(false)
// 取消按钮点击
const cancelCustomSpec = () => {
  customSpecName.value = ''
  addCustomSpecVisible.value = false
}
// 新增规格类型
const addSpec = async () => {
  try {
    addSpecLoading.value = true
    const data = {
      spec_name: customSpecName.value
    }
    await reqAddSpec(data)
    ElMessage.success('添加成功')
  } catch (error) {
    console.log(error)
  } finally {
    addSpecLoading.value = false
    cancelCustomSpec()
  }
}

interface SpanMethodProps {
  row: skuTableResponseType
  column: TableColumnCtx<skuTableResponseType>
  rowIndex: number
  columnIndex: number
}

const objectSpanMethod = ({ row, column, rowIndex, columnIndex }: SpanMethodProps) => {
  // 只对第一列（尺码列）进行合并处理
  if (columnIndex === 0) {
    // 使用类型断言确保属性访问的安全性
    const property = column.property as keyof typeof row
    const currentRowValue = row[property]
    const prevRowValue = skuTableList.value[rowIndex - 1]?.[property]

    // 如果当前行与上一行的值相同，则隐藏当前单元格
    if (rowIndex > 0 && currentRowValue === prevRowValue) {
      return {
        rowspan: 0,
        colspan: 0
      }
    }

    // 计算需要合并的行数
    let rowspan = 1
    for (let i = rowIndex + 1; i < skuTableList.value.length; i++) {
      if (skuTableList.value[i][property] === currentRowValue) {
        rowspan++
      } else {
        break
      }
    }

    return {
      rowspan: rowspan,
      colspan: 1
    }
  }

  // 其他列保持默认
  return {
    rowspan: 1,
    colspan: 1
  }
}

// 判断左右调换规格组的按钮是否可用
const canMoveSpec = computed(() => {
  return skuGroups.value.find((item) => !item.spec_name)
})

// 调换规格组位置
const moveSpec = () => {
  if (canMoveSpec.value) return
  // 调换规格组位置
  skuGroups.value.reverse()
  spec_list.value = skuGroups.value.map((item, index) => {
    return {
      id: item.spec_id as number,
      spec_name: item.spec_name as string,
      spec_value: `spec_name${index + 1}`
    }
  })
  // 创建映射以保存现有数据
  const existingDataMap = new Map()
  skuTableList.value.forEach((item) => {
    const key = `${item.spec_name1}-${item.spec_name2}`
    existingDataMap.set(key, {
      min_group_price: item.min_group_price,
      min_normal_price: item.min_normal_price,
      out_sku_sn: item.out_sku_sn,
      is_default: item.is_default
    })
  })
  // 生成新的规格组合
  const newCombinations = []
  if (skuGroups.value.length === 2) {
    for (let i = 0; i < skuGroups.value[0].list.length; i++) {
      for (let j = 0; j < skuGroups.value[1].list.length; j++) {
        newCombinations.push({
          spec_name1: skuGroups.value[0].list[i].spec_value,
          spec_name2: skuGroups.value[1].list[j].spec_value
        })
      }
    }
  }
  // 创建新的表格数据
  const newTableData = []
  for (const combination of newCombinations) {
    const key = `${combination.spec_name1}-${combination.spec_name2}`
    const reverseKey = `${combination.spec_name2}-${combination.spec_name1}`

    // 尝试获取现有数据
    let existingData = existingDataMap.get(key)
    if (!existingData) {
      // 如果直接键找不到，尝试反向键（处理位置调换后的数据映射）
      existingData = existingDataMap.get(reverseKey)
    }
    newTableData.push({
      uid: Date.now() + Math.random(),
      spec_name1: combination.spec_name1,
      spec_name2: combination.spec_name2,
      min_group_price: existingData?.min_group_price || '',
      min_normal_price: existingData?.min_normal_price || '',
      out_sku_sn: existingData?.out_sku_sn || '',
      is_default: existingData?.is_default || 0
    })
  }
  // 更新表格数据
  skuTableList.value = newTableData
  // 确保至少有一个默认规格
  ensureDefaultSpec()
}

// 拖拽结束后的回调
const onDragEnd = () => {
  // 3. 生成规格组合
  const { total, allCombinations } = generateCombinations(skuGroups.value)
  // 4. 保存现有数据
  const { existingDataMap, hasDefaultSpec } = saveExistingData()
  // 5. 调整表格行数
  adjustTableRows(total)
  // 6. 更新表格数据
  updateTableData(allCombinations, existingDataMap, hasDefaultSpec)
}

// 切换默认规格
const toggleDefaultSpec = (row: skuTableResponseType) => {
  // 排他思想，将所有的default到置为false
  skuTableList.value.forEach((item) => {
    item.is_default = 0
  })
  row.is_default = 1
}

type PriceType = 'min_group_price' | 'min_normal_price'
const handleInput = (row: skuTableResponseType, type: PriceType, value: string) => {
  const reg = /^(0|[1-9]\d*)(\.\d{1,2})?$/ // 匹配正整数或最多两位小数
  if (reg.test(value)) {
    // 如果输入值合法
    const numValue = parseFloat(value)
    if (numValue >= 0.01) {
      row[type] = value // 更新到行数据
      if (type === 'min_normal_price' && row.min_group_price) {
        if (row.min_normal_price < row.min_group_price) {
          ElMessage.warning('划线价不能小于售价') // 提示用户
          row.min_normal_price = ''
        }
      }
    } else {
      ElMessage.warning('输入值不能小于0.01') // 提示用户
      row.min_group_price = '' // 清空非法值
      return
    }
  } else {
    ElMessage.warning('请输入正数，最多两位小数') // 提示用户
    row.min_group_price = '' // 清空非法值
    return
  }
}

onMounted(() => {
  getTmList()
})
defineExpose({
  open
})
</script>

<style lang="scss">
.custom-spec-popover {
  width: 210px !important;
  .el-popover__title {
    --el-popover-title-font-size: 14px;
  }
  .el-input__inner {
    font-size: 13px;
  }
}
</style>

<style lang="scss" scoped>
.sku-table {
  margin-bottom: 15px;
  font-size: 13px;
  tr,
  th,
  td {
    border: 1px solid #e8eaec;
  }
  thead {
    th {
      background-color: #fafafa;
    }
  }
  .move {
    text-align: center;
    padding: 0 10px;
    cursor: move;
  }
  .btn-move {
    cursor: pointer;
    color: #999;
    &.disabled {
      cursor: not-allowed;
      color: #ddd;
    }
  }
  .sku-type {
    display: flex;
    padding: 10px;
    gap: 6px;
    .sku-type-select {
      display: flex;
      flex-direction: column;
      gap: 6px;
      .sku-select {
        :deep(.el-tooltip__trigger) {
          font-size: 13px !important;
        }
      }
      .sku-checkbox {
        --el-checkbox-font-size: 13px;
        // font-size: 13px
      }
    }
    .add-custom-spec {
      height: fit-content;
    }
  }
  .sku-content-cell {
    padding: 10px;
  }
}

.add-sku-btn {
  margin-bottom: 10px;
}

.span-required {
  color: red;
  margin-right: 4px;
}

.sku-table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .el-button {
    padding: 0;
  }
}

.goods-tag {
  padding: 0 8px;
  height: 22px;
  line-height: 23px;
  background-color: #888;
  color: white;
  border-radius: 4px;
  display: inline-block;
  &.brown {
    background-image: linear-gradient(45deg, #a14c2d, #461f0f);
  }
  &.red {
    background-image: linear-gradient(45deg, #ff4a33, #d71616);
  }
  &.green {
    background-image: linear-gradient(45deg, #41e04f, #05a208);
  }
}

.btn {
  &:hover {
    background-color: transparent !important;
  }
}
.sku-res-table {
  width: 100%;
  --el-font-size-base: 13px;
}
</style>
