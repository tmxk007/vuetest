<template>
  <div class="ep-table">

    <div class="ep-table-tbar">
      <div>
        <el-input size="mini" placeholder="请输入内容" v-model="searchInput" @keyup.enter.native="search">
          <el-button size="mini" slot="append" icon="el-icon-search" @click="search"></el-button>
        </el-input>
      </div>
      <div>
        <el-button class="ep-table-tbar-button button-dropdown-search" size="mini" type="primary" @click="advancedSearch">高级搜索</el-button>
      </div>
      <div>
        <el-button class="ep-table-tbar-button button-dropdown-search" size="mini" type="primary" @click="cancelSearch">撤销搜索</el-button>
      </div>
      <div>
        <el-button class="ep-table-tbar-button button-dropdown-setting" size="mini" type="primary" @click="setColumns">调整列</el-button>
      </div>
    </div>
    <el-table :data="data" style="width: 100%" :border="border" :size="size" :fit="fit" @sort-change="sortChange" :showHeader="showHeader" :width="width" :height="height">
      <el-table-column v-for="item in columns" :prop="item.field" :label="item.title" :width="item.width" :sortable="item.sortable" v-if="item.visible">
      </el-table-column>
    </el-table>
    <el-pagination v-if="hasPagination()" @size-change="onSizeChange" @current-change="onPageNumberChange" :page-sizes="pagination.pageSizes" :page-size="pagination.pageSize" :current-page="pagination.pageNumber" :layout="pagination.layout" :total="pagination.total">
    </el-pagination>

    <column-config ref="columnConfig" :columns="columns" @update:columns="val=>columns=val"></column-config>

    <table-search ref="tableSearch" :columns="columns" :searchConfrim="searchConfrim"></table-search>

  </div>
</template>

<script>
export default {
  props: {
    options: Object
  },
  data() {
    return {
      searchInput: "",
      sortColumn: "",
      order: "",
      border: false,
      size: "medium",
      showHeader: true,
      width: "auto",
      height: "500",
      fit: true,
      searchType: -1,
      searchContent: "1",
      pagination: {
        layout: "total, sizes, prev, pager, next, jumper",
        total: 0,
        pageSizes: [10, 25, 50, 100, 150, 200, 500],
        pageSize: 10,
        pageNumber: 1
      },
      // 列
      columns: [],
      // 数据
      data: [],
      ...this.options
    };
  },
  mounted() {
    this.loadData();
  },
  components: {
    columnConfig: resolve => require(["./column-config"], resolve),
    tableSearch: resolve => require(["./search/index"], resolve)
  },
  methods: {
    loadData() {
      var params = {
        // 排序列
        sortColumn: this.sortColumn,
        // 排序方式
        order: this.order,
        // 搜索类型
        searchType: this.searchType,
        // 搜索条件
        searchContent: this.searchContent
      };
      if (this.hasPagination()) {
        Object.assign(params, {
          // 页大小
          pageSize: this.pagination.pageSize,
          // 页码
          pageNumber: this.pagination.pageNumber
        });
      }
      this.triggerEvent("onLoadData", this, params);
    },
    // 是否有分页
    hasPagination() {
      return this.pagination != false;
    },
    setColumns() {
      this.$refs.columnConfig.show();
    },
    setData(data) {
      if (data.count !== undefined) {
        this.pagination.total = data.count;
        this.data = data.data;
      } else {
        this.data = data;
      }
    },
    search() {
      this.searchConfrim(0, this.searchInput);
    },
    // 高级搜索
    advancedSearch() {
      this.$refs.tableSearch.show();
    },
    cancelSearch() {
      this.$refs.tableSearch.initData();
      this.searchInput = "";
      this.searchConfrim(-1, this.searchInput);
    },
    // 搜索确认
    searchConfrim(searchType, searchContent) {
      this.searchType = searchType;
      this.searchContent = searchContent;
      this.loadData();
    },
    moveUp(data, row, index) {
      var temp = data[index - 1];
      if (!temp) return;
      data[index - 1] = row;
      data[index] = temp;
      this.$refs.FieldConfig.doLayout();
    },
    moveDown(data, row, index) {
      var temp = data[index + 1];
      if (!temp) return;
      data[index + 1] = row;
      data[index] = temp;
      this.$refs.FieldConfig.doLayout();
    },
    // 页大小改变事件
    onSizeChange(pageSize) {
      this.pagination.pageSize = pageSize;
      this.loadData();
    },
    // 页码改变事件
    onPageNumberChange(pageNumber) {
      this.pagination.pageNumber = pageNumber;
      this.loadData();
    },
    // 触发事件
    triggerEvent(name) {
      if (!this.events) return;
      var method = this.events[name];
      if (!method || typeof method != "function") return;
      var params = [...arguments];
      params.removeByIndex(0);
      this.events[name](...params);
    },
    sortChange({ column, prop, order }) {
      this.sortColumn = prop;
      this.order = order;
      this.loadData();
    }
  }
};
</script>

<style>
.ep-table .el-card__body {
  margin: 0px;
  padding: 0px;
}
</style>

<style lang="scss" scoped>
.ep-table-tbar {
  float: right;
  margin-right: 20px;
}
.ep-table-tbar > div {
  float: left;
  margin-left: 5px;
}
</style>