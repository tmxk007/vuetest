<template>
  <ep-table :options="options"></ep-table>
</template>

<script>
var allData = getAllData();
export default {
  data() {
    return {
      options: {
        height: 300,
        showHeader: true,
        columns: [
          {
            field: "code",
            title: "编码",
            visible: true,
            sortable: true,
            search: {
              type: "input"
            }
          },
          {
            field: "name",
            title: "名称",
            visible: true,
            sortable: true,
            search: {
              type: "input"
            }
          },
          {
            field: "depart",
            title: "部门",
            visible: true,
            sortable: true,
            search: {
              type: "combo",
              data: [
                { label: "市场部", value: "市场部" },
                { label: "开发部", value: "开发部" },
                { label: "实施部", value: "实施部" },
                { label: "行政部", value: "行政部" },
                { label: "运维部", value: "运维部" }
              ]
            }
          },
          {
            field: "date",
            title: "日期",
            visible: true,
            sortable: true,
            search: {
              type: "date"
            }
          }
        ],
        // 事件
        events: {
          // 加载数据
          onLoadData($table, params) {
            var columns = $table.columns;
            $table.setData(getData(params, columns));
          }
        }
      }
    };
  }
};

function getAllData() {
  var data = [];
  var departs = ["市场部", "开发部", "实施部", "行政部", "运维部"];
  for (var i = 1; i <= 1000; i++) {
    data.push({
      code: i,
      name: "张" + i,
      depart: departs[getRandomNum(0, departs.length - 1)],
      date: new Date().format("yyyy-MM-dd")
    });
  }
  return data;
}

function getData(params, columns) {
  var query = $Linq(allData);
  // 排序
  if (params.sortColumn) {
    if (params.order == "descending") {
      query = query.OrderByDescending(function(r) {
        return r[params.sortColumn];
      });
    } else {
      query = query.OrderBy(function(r) {
        return r[params.sortColumn];
      });
    }
  }
  // 搜索数据
  query = searchData(query, columns, params.searchType, params.searchContent);
  // var count = allData.length;
  var data = query.ToArray();
  // 分页
  var result = {
    count: data.length,
    data: data.getPageData(params.pageNumber, params.pageSize)
  };
  return result;
}

// 搜索数据
function searchData(query, columns, searchType, searchContent) {
  if (searchType == -1 || !searchContent) return query;

  if (searchType == 0) {
    // 默认筛选【仅一个搜索文本框，输入的搜索内容，对所有字段进行模糊匹配】
    query = query.Where(function(r) {
      for (var i = 0; i < columns.length; i++) {
        var c = columns[i];
        var value = String(r[c.field]);
        var isContain = value.indexOf(searchContent) > -1;
        if (isContain) return true;
      }
      return false;
    });
  } else if (searchType == 1) {
    // 普通筛选【筛选条件之间的关系是and】
    query = ordinarySearchData(query, searchContent);
  } else if (searchType == 2) {
    // 高级筛选【组与组之间的关系是and；组内关系可能是and或or，由用户指定连接符】
    query = advancedSearchData(query, searchContent);
  }
  return query;
}

// 普通筛选
function ordinarySearchData(query, searchContent) {
  query = query.Where(function(r) {
    for (var i = 0; i < searchContent.length; i++) {
      var item = searchContent[i];
      var isTrue = checkItemFilter(r, item);
      if (!isTrue) return false;
    }
    return true;
  });
  return query;
}

// 高级筛选
function advancedSearchData(query, searchContent) {
  query = query.Where(function(r) {
    for (var i = 0; i < searchContent.length; i++) {
      var groupFilter = searchContent[i];
      if (!groupFilter.items || groupFilter.items.length == 0) continue;

      var isTrue = checkGroupFilter(r, groupFilter);
      if (!isTrue) return false;
    }
    return true;
  });
  return query;
}

// 判断组条件
function checkGroupFilter(row, groupFilter) {
  // 连接符【and or】
  var connector = groupFilter.connector;
  var items = groupFilter.items;
  for (var i = 0; i < items.length; i++) {
    var item = items[i];
    var isTrue = checkItemFilter(row, item);
    if (connector == "and" && !isTrue) {
      return false;
    }
    if (connector == "or" && isTrue) {
      return true;
    }
  }
  return connector == "and";
}

// 判断条件项
function checkItemFilter(row, item) {
  var fieldValue = row[item.field];
  var searchValue = item.value;
  if (item.search.type == "date") {
    if (typeof fieldValue == "string") fieldValue = new Date(fieldValue);
    fieldValue = parseInt(fieldValue.format("yyyyMMdd"));
    searchValue = parseInt(searchValue.format("yyyyMMdd"));
  }
  // 运算符运算
  return operatorOperation(item.operator, fieldValue, searchValue);
}

// 运算符运算
function operatorOperation(operator, value, searchValue) {
  if (operator == "=") {
    return value == searchValue;
  } else if (operator == "<>") {
    return value != searchValue;
  } else if (operator == "exists") {
    return String(value).indexOf(searchValue) > -1;
  } else if (operator == ">") {
    return value > searchValue;
  } else if (operator == ">=") {
    return value >= searchValue;
  } else if (operator == "<") {
    return value < searchValue;
  } else if (operator == "<=") {
    return value <= searchValue;
  }
}

function getRandomNum(min, max) {
  var range = max - min;
  var rand = Math.random();
  return min + Math.round(rand * range);
}
</script>