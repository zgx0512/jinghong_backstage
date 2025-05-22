<template>
  <el-drawer v-model="drawer" title="商品详情" :before-close="beforeClose">
    <el-row class="row">
      <el-col :span="6" class="title"><div>名称</div></el-col>
      <el-col :span="18"
        ><div>{{ skuInfo?.skuName }}</div></el-col
      >
    </el-row>
    <el-row class="row">
      <el-col :span="6" class="title"><div>描述</div></el-col>
      <el-col :span="18"
        ><div>{{ skuInfo?.skuDesc }}</div></el-col
      >
    </el-row>
    <el-row class="row">
      <el-col :span="6" class="title"><div>价格(元)</div></el-col>
      <el-col :span="18"
        ><div>{{ skuInfo?.price }}</div></el-col
      >
    </el-row>
    <el-row class="row">
      <el-col :span="6"><div>重量(g)</div></el-col>
      <el-col :span="18"
        ><div>{{ skuInfo?.weight }}</div></el-col
      >
    </el-row>
    <el-row class="row">
      <el-col :span="6" class="title"><div>平台属性</div></el-col>
      <el-col :span="18">
        <el-tag
          v-for="skuAttrValue in skuInfo?.skuAttrValueList"
          :keu="skuAttrValue.id"
          size="small"
          type="primary"
          style="margin: 0 10px 10px 0"
          >{{ skuAttrValue.attrName }}</el-tag
        >
      </el-col>
    </el-row>
    <el-row class="row">
      <el-col :span="6" class="title"><div>销售属性</div></el-col>
      <el-col :span="18">
        <el-tag
          v-for="skuSaleAttrValue in skuInfo?.skuSaleAttrValueList"
          :keu="skuSaleAttrValue.id"
          size="small"
          type="warning"
          style="margin: 0 10px 10px 0"
          >{{ skuSaleAttrValue.saleAttrValueName }}</el-tag
        ></el-col
      >
    </el-row>
    <el-row class="row">
      <el-col :span="6" class="title"><div>商品图片</div></el-col>
      <el-col :span="18">
        <el-carousel :interval="4000" type="card" height="180px" class="carousel">
          <el-carousel-item v-for="item in skuInfo?.skuImageList" :key="item.id">
            <img :src="item.imgUrl" alt="" style="height: 100%; width: 100%" />
          </el-carousel-item>
        </el-carousel>
      </el-col>
    </el-row>
  </el-drawer>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
// 引入接口函数
import { reqSkuInfo } from '~/api/commodity/sku'
// 引入ts类型
import { skuInfoResponseType } from '~/api/commodity/sku/type'
import { skuResponseType } from '~/api/commodity/commodity_list/type'
// 控制抽屉的显示与隐藏
const drawer = ref<boolean>(false)
// sku详情
const skuInfo = ref<skuResponseType>()
// 抽屉打开的回调
const open = (id: number | string) => {
  // 调用函数, 获取商品详情
  getSkuInfo(id)
  drawer.value = true
}
// 获取商品详情的函数
const getSkuInfo = async (id: number | string) => {
  // 调用接口
  const result: skuInfoResponseType = await reqSkuInfo(id)
  if (result.code === 200) {
    skuInfo.value = result.data
  }
}
// 抽屉关闭前的回调
const beforeClose = (done: () => void) => {
  // 清空数据
  skuInfo.value = {
    spuId: '',
    skuName: '',
    skuDesc: '',
    price: '',
    weight: '',
    skuAttrValueList: [],
    skuSaleAttrValueList: [],
    skuImageList: []
  }
  done()

}
// 将方法暴露出去
defineExpose({
  open
})
</script>

<style lang="scss" scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 200px;
  margin: 0;
  text-align: center;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n + 1) {
  background-color: #d3dce6;
}
.row {
  margin-bottom: 10px;
  .title {
    display: flex;
    align-items: center;
  }
}
</style>
<style lang="scss">
.carousel {
  .el-carousel__button {
    width: 8px !important;
    height: 8px !important;
    border-radius: 50% !important;
    background-color: orange;
  }
}
</style>
