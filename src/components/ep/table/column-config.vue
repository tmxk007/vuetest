<template>
  <el-dialog title="列调整" :visible.sync="showDialog" width="650px">
    <el-table :data="dataColumns" :highlight-current-row="true" ref="table">
      <el-table-column property="title" label="字段名"></el-table-column>
      <el-table-column property="sortable" label="可排序">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.sortable"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column property="visible" label="可显示">
        <template slot-scope="scope">
          <el-checkbox v-model="scope.row.visible"></el-checkbox>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作">
        <template slot-scope="scope">
          <el-button @click="moveUp(dataColumns,scope.row,scope.$index)" type="text" size="small">上移</el-button>
          <el-button @click="moveDown(dataColumns,scope.row,scope.$index)" type="text" size="small">下移</el-button>
        </template>
      </el-table-column>
    </el-table>
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancel">取 消</el-button>
      <el-button type="primary" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  props: {
    columns: Array
  },
  data() {
    return {
      showDialog: false,
      dataColumns: []
    };
  },
  methods: {
    show() {
      this.dataColumns = copy(this.columns);
      this.showDialog = true;
    },
    hide() {
      this.showDialog = false;
    },
    // 向上移动
    moveUp(columns, column, index) {
      var nextIndex = index - 1;
      nextIndex = nextIndex > -1 ? nextIndex : columns.length - 1;
      change(columns, index, nextIndex);
      this.$refs.table.doLayout();
    },
    // 向下移动列
    moveDown(columns, column, index) {
      var nextIndex = index + 1;
      nextIndex = nextIndex < columns.length ? nextIndex : 0;
      change(columns, index, nextIndex);
      this.$refs.table.doLayout();
    },
    cancel() {
      this.showDialog = false;
      this.dataColumns = copy(this.columns);
      this.$refs.table.doLayout();
    },
    confirm() {
      this.showDialog = false;
      this.$emit("update:columns", this.dataColumns);
      this.$refs.table.doLayout();
    }
  }
};
// 拷贝数据
function copy(data) {
  return JSON.parse(JSON.stringify(data));
}
// 调整数组元素顺序
function change(array, i, j) {
  if (array[i] && array[j]) {
    var item = array[i];
    array[i] = array[j];
    array[j] = item;
  }
}
</script>
