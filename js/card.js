// 卡牌系统
const Card = {
    // 卡牌数据
    cards: [],
    // 当前卡牌
    currentCard: null,
    // 卡牌容器
    container: null,
    // 卡牌元素
    element: null,
    // 触摸起始位置
    touchStartX: 0,
    // 触摸当前位置
    touchCurrentX: 0,
    // 是否正在拖动
    isDragging: false,
    // 下一张卡牌ID
    nextCardID: null,
    
    // 初始化卡牌系统
    init(containerSelector, elementSelector) {
        this.container = document.querySelector(containerSelector);
        this.element = document.querySelector(elementSelector);
        
        // 绑定事件
        this.bindEvents();
        
        // 从JSON文件加载卡牌数据
        this.loadCardsFromJson();
    },
    
    // 从JSON文件加载卡牌数据
    loadCardsFromJson() {
        console.log('开始加载卡牌数据...');
        // 使用相对路径加载base.json文件
        const jsonUrl = 'data/cards/base.json';
        console.log('加载URL:', jsonUrl);
        
        // 尝试使用XMLHttpRequest加载，以便更好地处理错误
        const xhr = new XMLHttpRequest();
        xhr.open('GET', jsonUrl, true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log('XMLHttpRequest状态:', xhr.readyState);
                console.log('HTTP状态:', xhr.status);
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('卡牌数据加载成功:', data.length, '张卡牌');
                        console.log('加载的卡牌数据:', data);
                        this.cards = data;
                        // 生成第一张卡牌
                        console.log('使用base.json中的数据生成卡牌');
                        this.generateCard();
                    } catch (e) {
                        console.error('JSON解析失败:', e);
                        // 加载失败时使用默认卡牌数据
                        this.cards = this.getDefaultCards();
                        console.log('使用默认卡牌数据:', this.cards.length, '张卡牌');
                        // 生成第一张卡牌
                        this.generateCard();
                    }
                } else {
                    console.error('HTTP请求失败:', xhr.status);
                    // 加载失败时使用默认卡牌数据
                    this.cards = this.getDefaultCards();
                    console.log('使用默认卡牌数据:', this.cards.length, '张卡牌');
                    // 生成第一张卡牌
                    this.generateCard();
                }
            }
        };
        xhr.onerror = (error) => {
            console.error('网络错误:', error);
            // 加载失败时使用默认卡牌数据
            this.cards = this.getDefaultCards();
            console.log('使用默认卡牌数据:', this.cards.length, '张卡牌');
            // 生成第一张卡牌
            this.generateCard();
        };
        xhr.send();
    },
    
    // 默认卡牌数据
    getDefaultCards() {
        return [
            {
                id: 999,
                name: "默认卡牌 (非Base JSON)",
                dialogue: "这是一张默认卡牌，不是来自base.json文件！",
                image: "assets/images/cards/Nobody.png",
                startDate: {"year": 0, "month": 1, "mustAppear": 0},
                left: {
                    text: "拒绝",
                    effects: {
                        "green": 5,
                        "gold": -10
                    }
                },
                right: {
                    text: "接受",
                    effects: {
                        "green": -15,
                        "gold": 10,
                        "blood": 5
                    }
                }
            }
        ];
    },
    
    // 游戏日期
    gameDate: {
        year: 0,
        month: 1
    },
    
    // 绑定事件
    bindEvents() {
        // 绑定拒绝按钮事件
        const rejectButton = document.querySelector('.reject-button');
        if (rejectButton) {
            rejectButton.addEventListener('click', () => this.handleDecision('left'));
        }
        
        // 绑定接受按钮事件
        const acceptButton = document.querySelector('.accept-button');
        if (acceptButton) {
            acceptButton.addEventListener('click', () => this.handleDecision('right'));
        }
        
        // 初始化游戏日期显示
        const dateElement = document.getElementById('game-date');
        if (dateElement) {
            dateElement.textContent = `第${this.gameDate.year}年，第${this.gameDate.month}月`;
        }
    },
    
    // 处理决策
    handleDecision(side) {
        // 确保currentCard不为空
        if (!this.currentCard) {
            console.error('当前卡牌为空，重新生成卡牌');
            this.generateCard();
            return;
        }
        
        // 添加掉落动画
        this.element.classList.add('fall');
        
        // 触发决策效果
        const effects = this.currentCard[side].effects;
        if (effects) {
            const ending = Attribute.update(effects);
            // 检查是否触发结局
            if (ending) {
                Ending.showEnding(ending);
                return; // 不再继续执行后续逻辑
            }
        }
        
        // 检查是否有nextCardID
        this.nextCardID = this.currentCard[side].nextCardID || null;
        
        // 检查选项是否有nextCardID属性，如果没有则更新游戏日期
        if (!this.nextCardID) {
            this.updateGameDate();
        }
        
        // 延迟生成新卡牌
        setTimeout(() => {
            // 移除动画类
            this.element.classList.remove('fall');
            // 生成新卡牌
            this.generateCard();
        }, 500);
    },
    
    // 更新游戏日期
    updateGameDate() {
        this.gameDate.month++;
        if (this.gameDate.month > 12) {
            this.gameDate.month = 1;
            this.gameDate.year++;
        }
        
        const dateElement = document.getElementById('game-date');
        if (dateElement) {
            dateElement.textContent = `第${this.gameDate.year}年，第${this.gameDate.month}月`;
        }
    },
    
    // 生成新卡牌
    generateCard() {
        // 确保cards数组不为空
        if (this.cards.length === 0) {
            console.error('卡牌数组为空，使用默认卡牌数据');
            this.cards = this.getDefaultCards();
        }
        
        // 输出当前卡牌数据
        console.log('当前卡牌数据:', this.cards);
        
        // 检查是否有指定的下一张卡牌（优先处理）
        if (this.nextCardID) {
            const specifiedCard = this.cards.find(card => card.id === this.nextCardID);
            if (specifiedCard) {
                this.currentCard = specifiedCard;
                // 重置nextCardID
                this.nextCardID = null;
                console.log('选择指定的下一张卡牌:', this.currentCard);
                // 更新卡牌UI
                this.updateCardUI();
                return;
            }
        }
        
        // 获取符合当前日期条件的卡牌
        const { mustAppearCards, regularCards } = this.getEligibleCards();
        
        // 输出符合条件的卡牌
        console.log('必定出现的卡牌:', mustAppearCards);
        console.log('普通卡牌:', regularCards);
        
        // 检查是否有必定出现的卡牌
        if (mustAppearCards.length > 0) {
            // 如果有必定出现的卡牌，优先选择
            const randomIndex = Math.floor(Math.random() * mustAppearCards.length);
            this.currentCard = mustAppearCards[randomIndex];
            console.log('选择必定出现的卡牌:', this.currentCard);
        } else if (regularCards.length > 0) {
            // 如果没有必定出现的卡牌，从普通卡牌中选择
            const randomIndex = Math.floor(Math.random() * regularCards.length);
            this.currentCard = regularCards[randomIndex];
            console.log('选择普通卡牌:', this.currentCard);
        } else {
            // 如果没有符合条件的卡牌，随机选择一张
            const randomIndex = Math.floor(Math.random() * this.cards.length);
            this.currentCard = this.cards[randomIndex];
            console.log('随机选择卡牌:', this.currentCard);
        }
        
        // 更新卡牌UI
        this.updateCardUI();
    },
    
    // 获取符合当前日期条件的卡牌
    getEligibleCards() {
        const currentYear = this.gameDate.year;
        const currentMonth = this.gameDate.month;
        
        const mustAppearCards = [];
        const regularCards = [];
        
        this.cards.forEach(card => {
            // 检查卡牌是否有startDate属性，没有startDate的卡牌不应该被随机出来
            if (!card.startDate) {
                return; // 跳过没有startDate的卡牌
            }
            
            const { year, month, mustAppear } = card.startDate;
            
            if (mustAppear === 1) {
                // 必须在指定年月出现
                if (currentYear === year && currentMonth === month) {
                    mustAppearCards.push(card);
                }
            } else {
                // 检查年份和月份
                const isYearMatch = currentYear > year || (currentYear === year && currentMonth >= month);
                if (isYearMatch) {
                    regularCards.push(card);
                }
            }
        });
        
        return { mustAppearCards, regularCards };
    },
    
    // 更新卡牌UI
    updateCardUI() {
        // 更新卡牌图片
        const imageElement = this.element.querySelector('.card-image');
        if (imageElement && this.currentCard && this.currentCard.image) {
            // 添加时间戳避免缓存问题
            const imagePath = this.currentCard.image + '?t=' + new Date().getTime();
            imageElement.src = imagePath;
            // 添加图片加载错误处理
            imageElement.onerror = function() {
                console.error('图片加载失败:', this.src);
                // 尝试使用绝对路径
                this.src = '/assets/images/cards/Nobody.png?t=' + new Date().getTime();
            };
        }
        
        // 更新卡牌名称（独立元素）
        const nameElement = document.getElementById('card-name');
        if (nameElement && this.currentCard) {
            nameElement.textContent = this.currentCard.name;
        }
        
        // 更新卡牌对话（独立元素）
        const dialogueElement = document.getElementById('card-dialogue');
        if (dialogueElement && this.currentCard) {
            dialogueElement.textContent = this.currentCard.dialogue;
        }
        
        // 更新左侧决策文本
        const leftTextElement = document.getElementById('left-text');
        if (leftTextElement && this.currentCard && this.currentCard.left) {
            leftTextElement.textContent = this.currentCard.left.text;
        }
        
        // 更新右侧决策文本
        const rightTextElement = document.getElementById('right-text');
        if (rightTextElement && this.currentCard && this.currentCard.right) {
            rightTextElement.textContent = this.currentCard.right.text;
        }
        
        // 更新效果指示器
        this.updateEffectIndicators();
        
        // 重置卡牌样式
        this.element.style.transition = 'none';
    },
    
    // 重置卡牌系统
    reset() {
        // 重置游戏日期
        this.gameDate.year = 0;
        this.gameDate.month = 1;
        // 重置nextCardID
        this.nextCardID = null;
        // 初始化游戏日期显示
        const dateElement = document.getElementById('game-date');
        if (dateElement) {
            dateElement.textContent = `第${this.gameDate.year}年，第${this.gameDate.month}月`;
        }
        // 重新从JSON文件加载卡牌数据
        this.loadCardsFromJson();
    },
    
    // 更新效果指示器
    updateEffectIndicators() {
        // 颜色映射（英文到中文）
        const colorMap = {
            "green": "绿色",
            "blood": "血色",
            "orange": "橙色",
            "blue": "蓝色",
            "purple": "紫色",
            "white": "白色",
            "black": "黑色",
            "gold": "金色"
        };
        
        // 更新左侧效果指示器
        const leftIndicators = document.getElementById('left-indicators');
        if (leftIndicators) {
            leftIndicators.innerHTML = '';
            const leftEffects = this.currentCard.left.effects;
            if (leftEffects) {
                for (const [attr, value] of Object.entries(leftEffects)) {
                    if (value !== 0) {
                        const indicator = document.createElement('div');
                        const attrName = colorMap[attr] || attr;
                        indicator.className = `effect-indicator ${attrName}`;
                        leftIndicators.appendChild(indicator);
                    }
                }
            }
        }
        
        // 更新右侧效果指示器
        const rightIndicators = document.getElementById('right-indicators');
        if (rightIndicators) {
            rightIndicators.innerHTML = '';
            const rightEffects = this.currentCard.right.effects;
            if (rightEffects) {
                for (const [attr, value] of Object.entries(rightEffects)) {
                    if (value !== 0) {
                        const indicator = document.createElement('div');
                        const attrName = colorMap[attr] || attr;
                        indicator.className = `effect-indicator ${attrName}`;
                        rightIndicators.appendChild(indicator);
                    }
                }
            }
        }
    },
    
    // 添加新卡牌
    addCard(card) {
        if (card && card.id && card.name && card.dialogue && card.image && card.left && card.right) {
            this.cards.push(card);
            console.log('添加新卡牌成功:', card.name);
        } else {
            console.error('添加卡牌失败: 卡牌数据不完整');
        }
    }
};