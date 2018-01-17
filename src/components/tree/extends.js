import Vue from 'vue'

// 修改人：姚小强
// 修改日期：20180117

// 说明：树节点源码重写
// 支持动态显示隐藏复选框  v-if="showCheckbox" 修改为 v-if="tree.showCheckbox"
// 支持双击事件  添加 @dblclick.stop="handleDbClick"
// 修改NodeContent渲染方法，允许节点文本插入html标签，把源码中innerText修改为innerHTML,用于支持高亮显示标签
(function (Vue) {

    const template = `
        <div
            class="el-tree-node"
            @click.stop="handleClick"
            @dblclick.stop="handleDbClick"
            v-show="node.visible"
            :class="{
                'is-expanded': expanded,
                'is-current': tree.store.currentNode === node,
                'is-hidden': !node.visible,
                'is-focusable': !node.disabled,
                'is-checked': !node.disabled && node.checked
            }"
            role="treeitem"
            tabindex="-1"
            :aria-expanded="expanded"
            :aria-disabled="node.disabled"
            :aria-checked="node.checked"
            >
            <div class="el-tree-node__content"
                :style="{ 'padding-left': (node.level - 1) * tree.indent + 'px' }">
                <span
                class="el-tree-node__expand-icon el-icon-caret-right"
                @click.stop="handleExpandIconClick"
                :class="{ 'is-leaf': node.isLeaf, expanded: !node.isLeaf && expanded }">
                </span>
                <el-checkbox
                    v-if="tree.showCheckbox"
                    v-model="node.checked"
                    :indeterminate="node.indeterminate"
                    :disabled="!!node.disabled"
                    @click.native.stop
                    @change="handleCheckChange"
                    >
                </el-checkbox>
                <span
                v-if="node.loading"
                class="el-tree-node__loading-icon el-icon-loading">
                </span>
                <node-content :node="node"></node-content>
            </div>
            <el-collapse-transition>
                <div
                class="el-tree-node__children"
                v-if="!renderAfterExpand || childNodeRendered"
                v-show="expanded"
                role="group"
                :aria-expanded="expanded"
                >
                <el-tree-node
                    :render-content="renderContent"
                    v-for="child in node.childNodes"
                    :render-after-expand="renderAfterExpand"
                    :key="getNodeKey(child)"
                    :node="child"
                    @node-expand="handleChildNodeExpand">
                </el-tree-node>
                </div>
            </el-collapse-transition>
        </div>`;

    const ElTreeNode = Vue.Tree.components.ElTreeNode;

    ElTreeNode.render = Vue.compile(template).render;

    ElTreeNode.methods.handleDbClick = function () {
        this.node.expanded = true;
        this.node.checked = !this.node.checked;
        setCheckedChildNodes(this.node, this.node.checked);
    }

    ElTreeNode.components.NodeContent.render = function(h){
        const parent = this.$parent;
        const node = this.node;
        const data = node.data;
        const store = node.store;
        if(parent.renderContent){
            return parent.renderContent.call(parent._renderProxy, h, { _self: parent.tree.$vnode.context, node, data, store });
        }
        else{
            return h('span',{
                attr: {
                    class: 'el-tree-node__label'
                },
                domProps: {
                    // 把源码中innerText重写为innerHTML,用于支持高亮显示标签
                    innerHTML: this.node.label
                }
            })
        }
    }

    // 设置子节点选中状态
    function setCheckedChildNodes(currentNode, checked) {
        if (!currentNode || !currentNode.childNodes) return;
        var childNodes = currentNode.childNodes;
        for (var i = 0; i < childNodes.length; i++) {
            var node = childNodes[i];
            node.expanded = true;
            node.checked = checked;
            setCheckedChildNodes(node, checked);
        }
    }

})(Vue);
