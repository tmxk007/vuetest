/*
    创建人：姚小强
    创建日期：2018.01.19
    说明：
        1、修改NodeContent渲染方法，允许节点文本插入html标签，把源码中innerText修改为innerHTML,用于支持高亮显示标签
*/
export default {
    mixins: [$ElTree.components.ElTreeNode.components.NodeContent],
    render(h){
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
}