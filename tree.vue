<!--
  author: wanghui
  props: {
    nodeList: 必传，Array
    {
      label: 显示文字
      id: 节点唯一标识
      children: 子节点（有则传，无则没有此参数）
    }
    showCheckbox: 可选，Boolean
    isDrag: 可选, Boolean
    @activeIndex: 当前处于 active 状态的节点，传入值为节点的id
  }
-->
<template lang="html">
  <div class="tree">
    <div v-for="(item,index) in nodeData">
      <div class="node-content" 
           :class="{'cursor-move': item.isLeaf, 'is-active': item.isActive}"
           :draggable="isDrag && item.isLeaf"
           @click.stop="handleClick(item,index)"
           @dragstart="handleDragStart(item.id, $event)">
        <span class="tree-node_expand-icon" 
              :class="{'expanded': item.isExpanded,
                       'is-leaf': item.isLeaf}"></span>
        <input type="checkbox" 
               class="node-checkbox" 
               v-if="showCheckbox"
               v-model="item.checked" />
        <span class="tree-node_label">{{item.label}}</span>
        <span>{{item.isActive}}</span>
      </div>
      <div v-if="!item.isLeaf "
           class="node-children" 
           :class="{'hide': !item.isExpanded}"
           style="padding-left: 16px;">
        <!-- 组件递归调用 -->
        <Tree :nodeList="item.children" @activeIndex="activeIndex"></Tree>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Tree',
  componentName: 'Tree',
  data () {
    return {
      nodeData: [],
      isRoot: false, // 标识该节点是否为树的根节点
      data: [{
        label: '一级 1',
        children: [{
          label: '二级 1-1',
          children: [{
            label: '三级 1-1-1'
          }]
        }]
      }, {
        label: '一级 2',
        children: [{
          label: '二级 2-1',
          children: [{
            label: '三级 2-1-1'
          }]
        }, {
          label: '二级 2-2',
          children: [{
            label: '三级 2-2-1'
          }]
        }]
      }, {
        label: '一级 3',
        children: [{
          label: '二级 3-1',
          children: [{
            label: '三级 3-1-1'
          }]
        }, {
          label: '二级 3-2',
          children: [{
            label: '三级 3-2-1'
          }]
        }]
      }],
    }
  },
  props: {
    nodeList: {
      require: true,
      type: Array
    },
    showCheckbox: {
      type: Boolean,
      default: false
    },
    isDrag: {
      type: Boolean,
      default: true
    }
  },
  created () {
    this.nodeData = [].concat(this.nodeList)
    if (this.$parent.treeData) {
      this.isRoot = true
    }
    this.attachProps(this.nodeList)
  },
  methods: {
    // 循环数据，fn对迭代项进行操作，返回结果是操作之后的迭代项
    loopData (list, fn) {
      list.forEach(item => {
        const ret = fn(item)
        if (ret.next !== null) {
          this.loopData(ret.next, fn)
        }
      })
    },
    // 查找到父节点
    findParentNode () {
      if (this.isRoot) return this
      let parent = this.$parent
      while (parent.isRoot === false) {
        parent = parent.$parent
      }
      return parent
    },
    findUp () {

    },
    // 更新组件树
    updateTree () {
      const rootNode = this.findParentNode()
      this.loopData(rootNode.$children, (item) => {
        item.$forceUpdate()
        return {
          next: item.$children.length ? item.$children : null
        }
      })
    },
    // 给初始数据增加一些附加属性
    attachProps (data) {
      this.loopData(this.nodeData, (item) => {
        item.children = item.children || []
        // 有是false 没有就是true
        item.isLeaf = !item.children.length
        item.isExpanded = false
        item.isActive = false
        if (this.showCheckbox) {
          item.checked = false
        }
        return {
          next: item.isLeaf ? null : item.children
        }
      })
    },
    // 处理节点的点击事件
    handleClick (node, index) {

      // console.log( this.nodeDate[index].label)
      node.isExpanded = !node.isExpanded
      // 将当前节点active置为true
      if (node.isLeaf) {
        // 将所有节点active置为false
        const rootData = this.findParentNode().nodeData
        this.loopData(rootData, (item) => {
          item.isActive = false
          return {
            next: item.isLeaf ? null : item.children
          }
        })
        // 更新组件树
        this.updateTree()
        node.isActive = true
        // 向上层组件抛出 activeIndex 事件
        this.$nextTick(() => {
          this.$emit('activeIndex', node.id)
        })
      }
      // 强制刷新vue实例
      this.$forceUpdate()
    },
    // 处理拖放开始事件
    handleDragStart (id, event) {
      console.log('开始拖动')
      // 定义拖动数据
      event.dataTransfer.setData('text/plain', id)
    },
    // 监听下层组件的active事件
    activeIndex (id) {
      this.$emit('activeIndex', id)
    }
  }
}
</script>

<style scoped>
.tree {
  background: transparent;
}

.tree-node {
  white-space: nowrap;
}

.tree-node_expand-icon {
  display: inline-block;
  cursor: pointer;
  width: 0;
  height: 0;
  vertical-align: middle;
  margin-left: 10px;
  border: 6px solid transparent;
  border-right-width: 0;
  border-left-color: #97a8be;
  border-left-width: 7px;
  transform: rotate(0deg);
}

.tree-node_expand-icon.expanded {
  transform: rotate(90deg);
}

.tree-node_expand-icon.is-leaf {
  border-color: transparent;
  cursor: default;
}

.node-content {
  height: 36px;
  line-height: 36px;
  cursor: pointer;
}

.node-content:hover {
  background: rgba(171, 179, 188, 0.5);
}

.node-content .tree-node_expand-icon {
  margin-right: 8px;
}

.node-content.cursor-move {
  cursor: move;
}

.node-content.is-active {
  background: rgba(171, 179, 188, 1);
  color: blue;
}

.tree-node_label {
  font-size: 14px;
  vertical-align: middle;
  display: inline-block;
}

.node-children {
  overflow: hidden;
  background: transparent;
  opacity: 1;
}

.node-children.hide {
  opacity: 0;
}

.node-checkbox {
  vertical-align: middle;
  margin: 0;
}
</style>