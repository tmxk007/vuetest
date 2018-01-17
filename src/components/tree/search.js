export default class TreeSearch {
    // tree
    _tree = null;

    set tree(value) {
        this._tree = value;
    }

    // 所有节点
    _allNodes = [];

    get allNodes() {
        return this._allNodes;
    }

    // 搜索文本
    _searchText = null;

    // 搜索索引
    _searchIndex = -1;

    // 匹配的节点
    _matchedNodes = [];

    // 构造方法
    constructor(tree,allNodes) {
        this._tree = tree;
        // this._roots = data;
        this._allNodes = allNodes;
    }

    // 搜索节点
    searchNode(searchText,isMoveUp) {
        
        // 下一个节点索引
        var nextIndex = isMoveUp ? this._searchIndex - 1 : this._searchIndex + 1;
        if(nextIndex < 0) nextIndex = this._matchedNodes.length - 1;
        if(nextIndex >= this._matchedNodes.length) nextIndex = 0;

        if(this._searchText == searchText){
            this._searchIndex = nextIndex;
        }
        else{
            this._searchIndex = 0;
            this._matchedNodes = this.getMatchedNodes(searchText);
        }
        
        var node = this._matchedNodes[this._searchIndex];
        if (!node) return;
        
        node.expand(null, true);
        this._searchText = searchText;
        
        return node;
    }

    // 获取匹配的节点
    getMatchedNodes(searchText) {
        var _this = this;
        var nodes = [];
        
        let reg = new RegExp(searchText, "gi");
        _this._allNodes.forEach(function (node) {
            node.data.label = node.data.defaultLabel;
            if (!reg.test(node.data.label)) return;
            nodes.push(node);
            _this.setColorMatchedText(reg, node);
        });
        return nodes;
    }

    // 设置匹配文本颜色
    setColorMatchedText(reg, node) {
        let dataText = node.data.label
        dataText = dataText.replace(reg, function ($1) {
            return "<span style='background:yellow;color:black'>" + $1 + "</span>";
        });
        node.data.label = dataText;
    }
}