<template>
  <div class='property-manager-container' v-if='hasActiveMod'>
    <div class="delete-mod" @click.stop.prevent='toDeleteMod'>
      <i class="iconfont icon-bianjiqi-shanchu"></i>
      删除模块
    </div>
    <el-tabs v-model='activeTab' @tab-click='tabClickHandle'>
      <el-tab-pane label='属性' name='attr'>
        <PropTypeCard v-for="(prop, key) in editingProps" :prop='BaseCompProptypes[prop]' :key='key' :cardKey='key' :cardValue='cardValues[key]' :isCardActive='key === activeProperty'></PropTypeCard>
      </el-tab-pane>
      <el-tab-pane label='样式' name='style' v-if="activeMod.cmd !== 'Markdown'">
        <div class='styles-container'>
          <style-selector :mod='activeMod' />
        </div>
      </el-tab-pane>
      <!-- <el-tab-pane label='Theme'>
        <div class='styles-container'>
          <theme-selector />
        </div>
      </el-tab-pane> -->
    </el-tabs>
  </div>
</template>

<script>
import _ from 'lodash'
import { mapGetters, mapActions } from 'vuex'
import { StyleSelector, ThemeSelector } from '@/components/adi/selector'
import mods from '@/components/adi/mod'
import BaseCompProptypes from '@/components/adi/common/comp.proptypes'
import PropTypeCard from '@/components/editor/PropTypeCard'

export default {
  name: 'ModPropertyManager',
  data: () => ({
    editable: true,
    mods,
    BaseCompProptypes
  }),
  methods: {
    ...mapActions({
      setActivePropertyData: 'setActivePropertyData',
      deleteMod: 'deleteMod',
      setActivePropertyTabType: 'setActivePropertyTabType'
    }),
    updateActiveProperData() {
      // the data of the json_editor is in ini_data of the component
      let data = _.cloneDeep(_.get(this, ['$refs', 'editor', 'ini_data'], {}))
      this.setActivePropertyData({ data })
    },
    toDeleteMod() {
      this.$confirm('确定删除这个模块？', '删除提示', {
        type: 'error'
      })
        .then(() => {
          this.deleteMod(this.activeMod.key)
        })
        .catch(() => {})
    },
    tabClickHandle(tabItem) {
      let activeName = tabItem.name
      this.setActivePropertyTabType(activeName)
    }
  },
  computed: {
    activePropertyDataCopy() {
      return _.cloneDeep(this.activePropertyData)
    },
    ...mapGetters({
      activeMod: 'activeMod',
      activeProperty: 'activeProperty',
      activePropertyData: 'activePropertyData',
      hasActiveMod: 'hasActiveMod',
      hasActiveProperty: 'hasActiveProperty',
      activePropertyTabType: 'activePropertyTabType'
    }),
    editingProps() {
      var modType = 'Mod' + this.activeMod.cmd
      var modComponents = this.mods[modType].components
      return modComponents
    },
    cardValues() {
      var modType = 'Mod' + this.activeMod.cmd
      var activeModDafaultDatas = mods[modType].properties
      var activeModDatas = { ...activeModDafaultDatas, ...this.activeMod.data }
      return activeModDatas
    },
    activeTab: {
      get() {
        return this.activePropertyTabType || 'attr'
      },
      set() {}
    }
  },
  components: {
    StyleSelector,
    ThemeSelector,
    PropTypeCard
  }
}
</script>
<style>
.property-manager-container {
  min-height: 100%;
  background-color: #ebeef5;
  padding: 0 18px;
  position: relative;
}
.property-manager-container .delete-mod {
  position: absolute;
  right: 18px;
  top: 10px;
  cursor: pointer;
  z-index: 1;
}
.property-manager-container .el-tabs__item {
  padding: 0 20px;
  font-size: 16px;
}
</style>
