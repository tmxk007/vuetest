<template>
    <div class="ep-tree">
        <el-container>
            <el-aside width="auto">
                <el-button @click="expandCollapseAll">{{ expandCollapseText() }}</el-button>
            </el-aside>
            <el-main class="ep-tree-main">
                <el-input @keydown.native="filterKeydown" :placeholder="placeholder" v-model="filterText">
                </el-input>
            </el-main>
            <el-button class="ep-tree-search-button" type="primary" icon="el-icon-search" @click="searchClick">搜索</el-button>
        </el-container>
        <el-tree class="filter-tree" node-key="key" check-strictly :show-checkbox="options.showCheckbox" :default-expand-all="defaultExpandAll" :default-checked-keys="defaultCheckedKeys" :data="data" @check-change="checkChange" ref="tree">
        </el-tree>
    </div>
</template>

<script>
import TreeSearch from "./search";
export default {
  props: {
    options: {
      type: Object,
      default: {}
    }
  },
  data() {
    return {
      placeholder: "",
      filterText: "",
      treeSearch: null,
      defaultExpandAll: false,
      defaultCheckedKeys: [],
      data: [],
      ...this.options
    };
  },
  mounted() {
    this.treeSearch = new TreeSearch(
      this.$refs.tree,
      this.getDescendantNodes()
    );
  },
  methods: {
    // 获取后代节点
    getDescendantNodes(currentNode) {
      var nodes = [];
      var tree = this.$refs.tree;
      var children = currentNode
        ? currentNode.childNodes
        : tree.root.childNodes;
      var key = currentNode ? currentNode.data.key + "-" : "";
      if (!children) return nodes;
      for (var i = 0; i < children.length; i++) {
        var node = children[i];
        node.data.defaultLabel = node.data.label;
        node.data.key = key + (i + 1);
        nodes.push(node);
        nodes.push(...this.getDescendantNodes(node));
      }
      return nodes;
    },
    // 折叠闭合所有
    expandCollapseAll() {
      // 根节点
      var nodes = this.$refs.tree.store.root.childNodes;
      this.defaultExpandAll = !this.defaultExpandAll;
      setExpandAll(nodes, this.defaultExpandAll);
    },
    expandCollapseText() {
      return this.defaultExpandAll ? "全部折叠" : "全部展开";
    },
    filterKeydown(ev) {
      if (ev.key == "Enter" || ev.key == "ArrowDown") {
        var node = this.treeSearch.searchNode(this.filterText);
        this.$refs.tree.store.setCurrentNode(node);
      } else if (ev.key == "ArrowUp") {
        var node = this.treeSearch.searchNode(this.filterText,true);
        this.$refs.tree.store.setCurrentNode(node);
      }
    },
    searchClick() {
      var node = this.treeSearch.searchNode(this.filterText);
      this.$refs.tree.store.setCurrentNode(node);
    },
    checkChange() {},
    getCurrentNode() {
      var node = this.$refs.tree.getCurrentNode();
      var result = copyData(node);
      return getNodeData(result);
    },
    getCheckedNodes() {
      var nodes = this.$refs.tree.getCheckedNodes();
      var results = copyData(nodes);
      for (var i = 0; i < results.length; i++) {
        results[i] = getNodeData(results[i]);
      }
      return results;
    }
  }
};

//设置所有节点展开状态
function setExpandAll(nodes, expanded) {
  if (!nodes) return;
  for (var i = 0; i < nodes.length; i++) {
    var node = nodes[i];
    node.expanded = expanded;
    setExpandAll(node.childNodes, expanded);
  }
}

// 拷贝数据
function copyData(data) {
  return JSON.parse(JSON.stringify(data));
}

// 获取节点数据
function getNodeData(node) {
  if (node.defaultLabel) node.label = node.defaultLabel;
  delete node.defaultLabel;
  delete node.children;
  return node;
}
</script>

<style>
.ep-tree .is-current > .el-tree-node__content {
  background-color: #428bca;
  color: #FFFF;
}
.ep-tree .el-tree-node__content {
  height: 32px;
}
</style>

<style lang="scss" scoped>
.ep-tree-main {
  padding: 0;
  margin-left: 2px;
}
.ep-tree-search-button {
  margin-left: 3px;
}
</style>