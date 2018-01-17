<template>
   <el-tabs type="card" v-model="activeName">
    <el-tab-pane label="树组件" name="tree">
      <tree-test></tree-test>
    </el-tab-pane>
    <el-tab-pane label="表格组件" name="table">
      <table-test></table-test>
    </el-tab-pane>
  </el-tabs>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      activeName:'tree'
    };
  },
  components: {
    treeTest: resolve => require(["./test/tree"], resolve),
    tableTest: resolve => require(["./test/table"], resolve)
  }
};
</script>

<style>

</style>
