
<template>
  <el-container class="ep-table-search-ordinary">
    <el-aside width="auto">
      <el-menu @select="menuClick">
        <el-menu-item v-for="(item, index) in columns" :index="item.field" v-if="item.visible">
          <i class="el-icon-menu"></i>
          <span slot="title">{{item.title}}</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <el-table :data="data" fit stripe class="table">
          <el-table-column label="字段" width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.field" @change="fieldChange(scope.row)">
                <el-option v-for="item in columns" :label="item.title" :value="item.field" v-if="item.visible"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="运算符" width="125">
            <template slot-scope="scope">
              <el-select v-model="scope.row.operator">
                <el-option v-for="item in operatorData" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="value" label="值">
            <template slot-scope="scope">
              <el-date-picker v-if="scope.row.search.type=='date'" v-model="scope.row.value" type="date" placeholder="选择日期" align="left" style="width:100%">
              </el-date-picker>
              <el-select v-else-if="scope.row.search.type=='combo'" v-model="scope.row.value" placeholder="请选择" style="width:100%">
                <el-option v-for="item in scope.row.search.data" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-input v-else v-model="scope.row.value" style="width:100%"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="operation" label="操作" width="100">
            <template slot-scope="scope">
              <el-button type="text" @click="deleteRow(scope.row)">删除条件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-main>
      <el-footer class="dialog-footer">
        <el-button type="primary" @click="handleConfirm">确 定</el-button>
        <el-button @click="handleCencel">取 消</el-button>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
export default {
  props: {
    columns:Array,
    operatorData: Array,
    cancel: Function,
    confirm: Function
  },
  data() {
    return {
      search: {},
      // 默认列
      defaultColumn: {},
      // 默认运算符
      defaultOperator: "=",
      data: []
    };
  },
  mounted() {
    this.setSearch(this.columns);
    this.initData();
  },
  methods: {
    initData() {
      this.data = [];
      this.defaultColumn = this.getDefaultColumn();
      this.defaultOperator = this.getDefaultOperator();
      this.addCondition(this.defaultColumn ? this.defaultColumn.field : "");
    },
    setSearch(columns) {
      for (var i = 0; i < columns.length; i++) {
        var column = columns[i];
        var search = column.search;
        this.search[column.field] = search;
      }
    },
    // 设置默认列
    getDefaultColumn() {
      for (var i = 0; i < this.columns.length; i++) {
        var column = this.columns[i];
        if (!column.visible) continue;
        return column;
      }
    },
    // 设置默认运算符
    getDefaultOperator() {
      return this.operatorData[0] ? this.operatorData[0].value : "=";
    },
    addCondition(field) {
      this.data.push({
        field: field,
        operator: this.defaultOperator,
        value: "",
        search: this.search[field] ? this.search[field] : {}
      });
    },
    menuClick(field) {
      this.addCondition(field);
    },
    deleteRow(row) {
      this.data.remove(row);
    },
    handleConfirm() {
      this.confirm(1, this.data);
    },
    handleCencel() {
      this.cancel();
    },
    fieldChange(row) {
      row.value = "";
      row.search = this.search[row.field];
    }
  }
};
</script>

<style>
.ep-table-search-ordinary .el-main {
  padding: 0;
  padding-left: 5px;
}
</style>

<style lang="scss" scoped>
.ep-table-search-ordinary {
  height: 350px;
}
.dialog-footer {
  padding-top: 18px;
  padding-left: 350px;
}
.el-main {
  padding-left: 10px;
}
</style>