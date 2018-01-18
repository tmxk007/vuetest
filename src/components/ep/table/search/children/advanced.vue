<template>
  <el-container class="ep-table-search-advanced">
    <el-main>
      <div v-for="(groupItem,index) in groupTableData">
        <div class="group-bar">
          <el-radio class="radio" v-model="groupItem.connector" label="and">并且</el-radio>
          <el-radio class="radio" v-model="groupItem.connector" label="or">或者</el-radio>
          <el-button type="text" class="add-condition-button" @click="addCondition(groupItem.items)">增加条件</el-button>
          <el-button type="text" @click="addGroup(index)">增加分组</el-button>
          <el-button type="text" v-if="index > 0" @click="removeGroup(index)">删除分组</el-button>
        </div>
        <el-table :data="groupItem.items" width="100%" fit border :show-header="false">
          <el-table-column prop="field" label="字段" width="100">
            <template slot-scope="scope">
              <el-select v-model="scope.row.field" @change="fieldChange(scope.row)">
                <el-option v-for="item in columns" :label="item.title" :value="item.field" v-if="item.visible"></el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="operator" label="运算符" width="125">
            <template slot-scope="scope">
              <el-select v-model="scope.row.operator">
                <el-option v-for="operatorItem in operatorData" :label="operatorItem.label" :value="operatorItem.value"></el-option>
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
          <el-table-column label="操作" width="80">
            <template slot-scope="scope">
              <el-button type="text" @click="removeCondition(groupItem.items,scope.$index)">删除条件</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-footer class="dialog-footer" height="auto">
      <el-button type="primary" @click="handleConfirm">确 定</el-button>
      <el-button @click="handleCencel">取 消</el-button>
    </el-footer>
  </el-container>
</template>
<script>
export default {
  props: {
    columns: Array,
    operatorData: Array,
    cancel: Function,
    confirm: Function
  },
  data() {
    return {
      search: {},
      // 默认连接符
      defaultConnector: "and",
      // 默认列
      defaultColumn: {},
      // 默认运算符
      defaultOperator: "=",
      // 分组表格数据
      groupTableData: []
    };
  },
  mounted() {
    this.setSearch(this.columns);
    this.initData();
  },
  methods: {
    initData() {
      this.groupTableData = [];
      this.defaultColumn = this.getDefaultColumn();
      this.defaultOperator = this.getDefaultOperator();
      // 添加一个默认分组
      var group = this.addGroup(0);
      // 添加一个默认条件
      this.addCondition(group.items);
    },
    setSearch(columns) {
      for (var i = 0; i < columns.length; i++) {
        var column = columns[i];
        var search = column.search;
        this.search[column.field] = search;
      }
    },
    // 获取默认列
    getDefaultColumn() {
      for (var i = 0; i < this.columns.length; i++) {
        var column = this.columns[i];
        if (!column.visible) continue;
        return column;
      }
    },
    // 获取默认运算符
    getDefaultOperator() {
      return this.operatorData[0] ? this.operatorData[0].value : "=";
    },
    addGroup(index) {
      var group = {
        connector: this.defaultConnector,
        items: []
      };
      this.groupTableData.add(group, index);
      return group;
    },
    removeGroup(index) {
      this.groupTableData.removeByIndex(index);
    },
    addCondition(data) {
      data.push({
        field: this.defaultColumn.field,
        operator: this.defaultOperator,
        value: "",
        search: this.search[this.defaultColumn.field]
          ? this.search[this.defaultColumn.field]
          : {}
      });
    },
    removeCondition(data, index) {
      data.removeByIndex(index);
    },
    handleConfirm() {
      this.confirm(2, this.groupTableData);
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

<style lang="scss" scoped>
.ep-table-search-advanced {
  height: 340px;
}
.dialog-footer {
  padding-top: 15px;
  padding-left: 455px;
}
.el-main {
  padding: 0;
}
.el-main > div {
  margin-bottom: 22px;
}
.group-bar {
  float: right;
  padding-right: 21px;
  margin-bottom: 5px;
}
.add-condition-button {
  margin-left: 22px;
}
.el-radio {
  margin-left: 5px;
}
</style>