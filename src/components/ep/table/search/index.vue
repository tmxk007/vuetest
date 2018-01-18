<template>
  <el-dialog :visible.sync="showDialog" width="650px">
    <div class="ep-table-search">
      <el-tabs v-model="activeName">
        <el-tab-pane label="普通搜索" name="ordinary">
          <ordinary ref="ordinary" :columns="columns" :cancel="cancel" :confirm="confirm" :operatorData="operatorData"></ordinary>
        </el-tab-pane>
        <el-tab-pane label="高级搜索" name="advanced">
          <advanced ref="advanced" :columns="columns" :cancel="cancel" :confirm="confirm" :operatorData="operatorData"></advanced>
        </el-tab-pane>
      </el-tabs>
    </div>
  </el-dialog>
</template>
<script>
export default {
  props: {
    columns: Array,
    searchConfrim: Function
  },
  data() {
    return {
      activeName: "ordinary",
      showDialog: false,
      // 运算符数据源
      operatorData: [
        {
          value: "=",
          label: "相等"
        },
        {
          value: "<>",
          label: "不相等"
        },
        {
          value: "exists",
          label: "包含"
        },
        {
          value: ">",
          label: "大于"
        },
        {
          value: ">=",
          label: "大于等于"
        },
        {
          value: "<",
          label: "小于"
        },
        {
          value: "<=",
          label: "小于等于"
        }
      ]
    };
  },
  components: {
    ordinary: resolve => require(["./children/ordinary"], resolve),
    advanced: resolve => require(["./children/advanced"], resolve)
  },
  methods: {
    initData() {
      if (this.$refs.ordinary) this.$refs.ordinary.initData();
      if (this.$refs.advanced) this.$refs.advanced.initData();
    },
    show() {
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
    cancel() {
      this.hide();
    },
    confirm(type, data) {
      if (typeof this.searchConfrim == "function") {
        this.searchConfrim(type, data);
      }
      this.hide();
    }
  }
};
</script>

<style>
.ep-table-search .el-dialog__body {
  padding: 15px;
  padding-top: 0;
}
</style>


<style lang="scss" scoped>
.ep-table-search {
  height: 400px;
}
</style>

