import Vue from 'vue'

import nodeContent from './extends/el-node-content.js'
$ElTree.components.ElTreeNode.components.NodeContent = nodeContent

import elTreeNode from './extends/el-node.vue'
$ElTree.components.ElTreeNode = elTreeNode

import eptree from './tree'
Vue.component('ep-tree', eptree)