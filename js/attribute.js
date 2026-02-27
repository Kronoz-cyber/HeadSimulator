// 属性系统
const Attribute = {
    // 属性初始值
    initialValues: {
        绿色: 50,
        血色: 50,
        橙色: 50,
        蓝色: 50,
        紫色: 50,
        白色: 50
    },
    
    // 颜色映射（英文到中文）
    colorMap: {
        "green": "绿色",
        "blood": "血色",
        "orange": "橙色",
        "blue": "蓝色",
        "purple": "紫色",
        "white": "白色"
    },
    
    // 当前属性值
    currentValues: {},
    
    // 初始化属性
    init() {
        // 复制初始值到当前值
        this.currentValues = { ...this.initialValues };
        // 更新UI显示
        this.updateUI();
    },
    
    // 更新属性值
    update(updates) {
        for (const [attr, value] of Object.entries(updates)) {
            // 检查是否是英文颜色名称
            let attrName = attr;
            if (this.colorMap.hasOwnProperty(attr)) {
                attrName = this.colorMap[attr];
            }
            
            if (this.currentValues.hasOwnProperty(attrName)) {
                // 更新属性值，确保在0-100之间
                this.currentValues[attrName] = Math.max(0, Math.min(100, this.currentValues[attrName] + value));
            }
        }
        // 更新UI显示
        this.updateUI();
        // 检查是否触发结局
        return this.checkEnding();
    },
    
    // 更新UI显示
    updateUI() {
        for (const [attr, value] of Object.entries(this.currentValues)) {
            const attributeElement = document.querySelector(`.attribute[data-attr="${attr}"]`);
            if (attributeElement) {
                // 获取属性条元素
                const barElement = attributeElement.querySelector('.attribute-bar');
                if (barElement) {
                    // 直接修改伪元素的宽度
                    const styleId = `attribute-style-${attr}`;
                    let style = document.getElementById(styleId);
                    if (!style) {
                        style = document.createElement('style');
                        style.id = styleId;
                        document.head.appendChild(style);
                    }
                    style.textContent = `.attribute[data-attr="${attr}"] .attribute-bar::after { width: ${value}%; }`;
                }
                
                // 添加或更新属性值显示
                let valueElement = attributeElement.querySelector('.attribute-value');
                if (!valueElement) {
                    valueElement = document.createElement('div');
                    valueElement.className = 'attribute-value';
                    attributeElement.appendChild(valueElement);
                }
                valueElement.textContent = value;
            }
        }
    },
    
    // 高亮显示属性条
    highlightAttributes(attributes) {
        // 先移除所有高亮
        document.querySelectorAll('.attribute-bar').forEach(el => {
            el.classList.remove('highlighted');
        });
        
        // 高亮指定的属性
        if (attributes && attributes.length > 0) {
            attributes.forEach(attr => {
                const element = document.querySelector(`.attribute[data-attr="${attr}"] .attribute-bar`);
                if (element) {
                    element.classList.add('highlighted');
                }
            });
        }
    },
    
    // 检查是否触发结局
    checkEnding() {
        for (const [attr, value] of Object.entries(this.currentValues)) {
            if (value >= 100 || value <= 0) {
                return {
                    attribute: attr,
                    value: value
                };
            }
        }
        return null;
    },
    
    // 获取当前属性值
    getValues() {
        return { ...this.currentValues };
    }
};