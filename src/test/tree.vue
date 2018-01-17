<template>
  <div>
    <ep-tree :options="options" ref="eptree"></ep-tree>
    <div class="test-buttons">
      <el-checkbox v-model="options.showCheckbox">允许多选</el-checkbox>
      <el-button @click="getSelected">获取焦点节点</el-button>
      <el-button @click="getChecked">获取勾选节点</el-button>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      options: {
        placeholder: "输入关键字进行查询…",
        defaultExpandAll: false,
        showCheckbox: true,
        data: [
          {
            id: 1,
            label: "一级 1",
            children: [
              {
                id: 4,
                label: "二级 1-1",
                children: [
                  {
                    id: 9,
                    label: "三级 1-1-1"
                  },
                  {
                    id: 10,
                    label: "三级 1-1-2"
                  }
                ]
              }
            ]
          },
          {
            id: 2,
            label: "一级 2",
            children: [
              {
                id: 5,
                label: "二级 2-1"
              },
              {
                id: 6,
                label: "二级 2-2"
              }
            ]
          },
          {
            id: 3,
            label: "一级 3",
            children: [
              {
                id: 7,
                label: "二级 3-1"
              },
              {
                id: 8,
                label: "二级 3-2"
              }
            ]
          }
        ]
      }
    };
  },
  methods: {
    getSelected() {
      var node = this.$refs.eptree.getCurrentNode();
      alert(JSON.stringify(node));
    },
    getChecked() {
      var nodes = this.$refs.eptree.getCheckedNodes();
      alert(JSON.stringify(nodes));
    }
  }
};
</script>

<style>
.ep-tree .is-current > .el-tree-node__content {
  background-color: #428bca;
  color: #FFFF;
}
</style>

<style lang="scss" scoped>
.test-buttons {
  float: right;
  margin: 10px;
  margin-top: 50px;
}
</style>