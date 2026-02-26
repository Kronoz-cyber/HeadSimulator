// 结局系统
const Ending = {
    // 结局数据
    endings: [],
    // 结局模态框
    modal: null,
    // 结局标题元素
    titleElement: null,
    // 结局描述元素
    descriptionElement: null,
    // 重新开始按钮
    restartButton: null,
    
    // 初始化结局系统
    init(modalSelector, titleSelector, descriptionSelector, restartSelector) {
        this.modal = document.querySelector(modalSelector);
        this.titleElement = document.querySelector(titleSelector);
        this.descriptionElement = document.querySelector(descriptionSelector);
        this.restartButton = document.querySelector(restartSelector);
        
        // 加载结局数据
        this.loadEndings();
        
        // 绑定事件
        this.bindEvents();
    },
    
    // 加载结局数据
    loadEndings() {
        // 这里使用硬编码的结局数据，实际项目中可以从JSON文件加载
        this.endings = [
            {
                id: "ending-001",
                condition: {
                    attribute: "绿色",
                    operator: ">=",
                    value: 100
                },
                title: "终末螺旋",
                description: "高塔直破苍穹，大地荡然无存。人类终究是退出了历史舞台，幸存者躲藏在无尽的硅基丛林里，瑟瑟发抖着。"
            },
            {
                id: "ending-002",
                condition: {
                    attribute: "绿色",
                    operator: "<=",
                    value: 0
                },
                title: "黑暗时代",
                description: "在砖瓦堆砌的阴暗古堡里，人们将这一天称作科技倒退的起点。"
            },
            {
                id: "ending-003",
                condition: {
                    attribute: "血色",
                    operator: ">=",
                    value: 100
                },
                title: "终末狂欢",
                description: "在城市存在的最后一天，所有的人都在无休止地狂欢，一场大火将整个都市燃烧殆尽。"
            },
            {
                id: "ending-004",
                condition: {
                    attribute: "血色",
                    operator: "<=",
                    value: 0
                },
                title: "褪色都市",
                description: "都市人彻底失去了欲望，他们的生活变得单调乏味，不再有什么可以做的。"
            },
            {
                id: "ending-005",
                condition: {
                    attribute: "金色",
                    operator: ">=",
                    value: 100
                },
                title: "变革",
                description: "A公司最终被取代，那一天，无数个爪牙被派往另一个公司。"
            },
            {
                id: "ending-006",
                condition: {
                    attribute: "金色",
                    operator: "<=",
                    value: 0
                },
                title: "经济崩溃",
                description: "都市经济陷入绝境，人们生活在贫困和绝望之中，至少你无需担心郊区的入侵了。"
            },
            {
                id: "ending-007",
                condition: {
                    attribute: "蓝色",
                    operator: ">=",
                    value: 100
                },
                title: "大扫除",
                description: "巨量的清道夫倾巢而出，城市被彻底打扫干净，成为了一个没有任何纷争的干净城市。"
            },
            {
                id: "ending-008",
                condition: {
                    attribute: "蓝色",
                    operator: "<=",
                    value: 0
                },
                title: "黑色微笑",
                description: "无人清扫的尸体堆积成山，它们逐渐融合成了一个可怖的怪物..."
            },
            {
                id: "ending-009",
                condition: {
                    attribute: "白色",
                    operator: ">=",
                    value: 100
                },
                title: "最终秩序",
                description: "Hana协会接管了都市，你的统治到此为止了。"
            },
            {
                id: "ending-010",
                condition: {
                    attribute: "白色",
                    operator: "<=",
                    value: 0
                },
                title: "混乱",
                description: "收尾人协会不复存在，城市陷入了绝望和混乱之中。"
            },
            {
                id: "ending-011",
                condition: {
                    attribute: "黑色",
                    operator: ">=",
                    value: 100
                },
                title: "暗影帝国",
                description: "帮派势力控制了都市，黑市和犯罪网络成为都市的实际统治者。"
            },
            {
                id: "ending-012",
                condition: {
                    attribute: "黑色",
                    operator: "<=",
                    value: 0
                },
                title: "鼠患",
                description: "一个失去了丛林法则的世界，一切都在无尽的耗子蚕食中腐烂。"
            },
            {
                id: "ending-013",
                condition: {
                    attribute: "橙色",
                    operator: ">=",
                    value: 100
                },
                title: "永恒的盛宴",
                description: "—撕扯—我。我—吃掉—你。弱者—被吃。永远—不变。。"
            },
            {
                id: "ending-014",
                condition: {
                    attribute: "橙色",
                    operator: "<=",
                    value: 0
                },
                title: "饥荒",
                description: "城市的食物资源匮乏，市民们生活在饥饿和死亡之中。"
            },
            {
                id: "ending-015",
                condition: {
                    attribute: "紫色",
                    operator: ">=",
                    value: 100
                },
                title: "降临",
                description: "理解的代价。"
            },
            {
                id: "ending-016",
                condition: {
                    attribute: "紫色",
                    operator: "<=",
                    value: 0
                },
                title: "湮灭",
                description: "一切都将不复存在，或者说，一切都从未真正存在过。"
            }
        ];
    },
    
    // 绑定事件
    bindEvents() {
        if (this.restartButton) {
            this.restartButton.addEventListener('click', this.restartGame.bind(this));
        }
    },
    
    // 显示结局
    showEnding(endingData) {
        const { attribute, value } = endingData;
        
        // 查找匹配的结局
        let matchedEnding = null;
        
        for (const ending of this.endings) {
            const { condition } = ending;
            if (condition.attribute === attribute) {
                if ((condition.operator === ">=" && value >= condition.value) ||
                    (condition.operator === "<=" && value <= condition.value)) {
                    matchedEnding = ending;
                    break;
                }
            }
        }
        
        if (matchedEnding) {
            // 更新结局UI
            if (this.titleElement) {
                this.titleElement.textContent = matchedEnding.title;
            }
            
            if (this.descriptionElement) {
                this.descriptionElement.textContent = matchedEnding.description;
            }
            
            // 显示结局模态框
            if (this.modal) {
                this.modal.classList.add('active');
            }
        }
    },
    
    // 重新开始游戏
    restartGame() {
        // 直接刷新页面，确保所有资源重新加载
        location.reload();
    }
};