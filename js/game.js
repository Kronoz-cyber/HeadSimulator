// 游戏主系统
const Game = {
    // 初始化游戏
    init() {
        // 显示加载界面
        this.showLoading();
        
        // 直接测试base.json加载
        console.log('开始测试base.json加载...');
        const xhr = new XMLHttpRequest();
        xhr.open('GET', 'data/cards/base.json', true);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                console.log('base.json加载状态:', xhr.readyState);
                console.log('base.json HTTP状态:', xhr.status);
                if (xhr.status === 200) {
                    try {
                        const data = JSON.parse(xhr.responseText);
                        console.log('base.json加载成功:', data.length, '张卡牌');
                        console.log('base.json内容:', data);
                    } catch (e) {
                        console.error('base.json解析失败:', e);
                    }
                } else {
                    console.error('base.json加载失败:', xhr.status);
                }
            }
        };
        xhr.onerror = (error) => {
            console.error('base.json网络错误:', error);
        };
        xhr.send();
        
        // 延迟初始化，模拟加载过程
        setTimeout(() => {
            // 初始化属性系统
            Attribute.init();
            
            // 初始化结局系统
            Ending.init(
                '#ending-modal',
                '.ending-title',
                '.ending-description',
                '.restart-button'
            );
            
            // 初始化卡牌系统
            console.log('开始初始化卡牌系统...');
            Card.init(
                '.card-container',
                '#current-card'
            );
            console.log('卡牌系统初始化完成');
            
            // 隐藏加载界面
            this.hideLoading();
        }, 1000);
    },
    
    // 重置游戏
    reset() {
        // 显示加载界面
        this.showLoading();
        
        // 延迟重置，模拟加载过程
        setTimeout(() => {
            // 重置属性系统
            Attribute.init();
            
            // 重置卡牌系统
            Card.reset();
            
            // 隐藏加载界面
            this.hideLoading();
        }, 1000);
    },
    
    // 显示加载界面
    showLoading() {
        const loadingModal = document.getElementById('loading-modal');
        if (loadingModal) {
            loadingModal.classList.remove('hidden');
        }
    },
    
    // 隐藏加载界面
    hideLoading() {
        const loadingModal = document.getElementById('loading-modal');
        if (loadingModal) {
            loadingModal.classList.add('hidden');
        }
    }
};