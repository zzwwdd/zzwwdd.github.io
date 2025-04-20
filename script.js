document.addEventListener('DOMContentLoaded', function() {
    // 获取DOM元素
    const timerDisplay = document.getElementById('timer');
    const startBtn = document.getElementById('startBtn');
    const pauseBtn = document.getElementById('pauseBtn');
    const resetBtn = document.getElementById('resetBtn');
    const autoLoop = document.getElementById('autoLoop');
    const workTimeInput = document.getElementById('workTime');
    const breakTimeInput = document.getElementById('breakTime');
    const soundSelect = document.getElementById('soundSelect');
    const statusDisplay = document.getElementById('status');
    const bellSound = document.getElementById('bellSound');
    const dingSound = document.getElementById('dingSound');
    const chimeSound = document.getElementById('chimeSound');
    const favicon = document.getElementById('favicon');
	const workEndSound = document.getElementById('workEndSound');
    const breakEndSound = document.getElementById('breakEndSound');
    const workSoundSelect = document.getElementById('workSoundSelect'); // 新增工作铃声选择
    const breakSoundSelect = document.getElementById('breakSoundSelect'); // 新增休息铃声选择
    
    // 计时器变量
    let timer;
    let timeLeft;
    let isRunning = false;
    let isWorkTime = true;
    let totalPomodoros = 0;
    
    // 初始化计时器
    function initTimer() {
        const minutes = isWorkTime ? parseInt(workTimeInput.value) : parseInt(breakTimeInput.value);
        timeLeft = minutes * 60;
        updateDisplay();
        updateStatus();
        updateFavicon();
        updateTitle();
        
        // 根据模式改变背景
        document.body.className = isWorkTime ? 'work-mode' : 'break-mode';
    }
    
    // 更新时间显示
    function updateDisplay() {
        timerDisplay.textContent = formatTime(timeLeft);
    }
    
    // 格式化时间为MM:SS
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    // 更新状态显示
    function updateStatus() {
        statusDisplay.textContent = isWorkTime 
            ? `工作时间 #${totalPomodoros + 1}` 
            : `休息时间`;
    }
    
    // 更新favicon
    function updateFavicon() {
        // 使用SVG数据URL创建动态favicon
        favicon.href = isWorkTime
            ? 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%23e74c3c"/><circle cx="30" cy="40" r="5" fill="%23c0392b"/><circle cx="70" cy="40" r="5" fill="%23c0392b"/><path d="M30,70 Q50,85 70,70" stroke="%23c0392b" stroke-width="3" fill="none"/></svg>'
            : 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="%232ecc71"/><path d="M30,30 L70,70 M70,30 L30,70" stroke="white" stroke-width="8"/></svg>';
    }
    
    // 更新标题
    function updateTitle() {
        const status = isWorkTime ? `工作时间 #${totalPomodoros + 1}` : "休息时间";
        document.title = `${formatTime(timeLeft)} - ${status} - 番茄计时器`;
    }
    
    // 播放提示音
  function playSound() {
        let soundElement;
        
        if (isWorkTime) {
            // 工作时间结束铃声
            switch(workSoundSelect.value) {
                case 'bell': soundElement = bellSound; break;
                case 'ding': soundElement = dingSound; break;
                case 'chime': soundElement = chimeSound; break;
                default: soundElement = workEndSound;
            }
        } else {
            // 休息时间结束铃声
            switch(breakSoundSelect.value) {
                case 'bell': soundElement = bellSound; break;
                case 'ding': soundElement = dingSound; break;
                case 'chime': soundElement = chimeSound; break;
                default: soundElement = breakEndSound;
            }
        }
        
        soundElement.currentTime = 0;
        soundElement.play();
    }
    
   // 修改后的switchMode函数
function switchMode() {
    // 停止当前计时器
    clearInterval(timer);
    isRunning = false;
    
    // 切换模式
    isWorkTime = !isWorkTime;
    if (isWorkTime) {
        totalPomodoros++;
    }
    
    // 重置按钮状态
    startBtn.disabled = false;
    pauseBtn.disabled = true;
    resetBtn.disabled = true;
    
    // 初始化新模式的计时器
    initTimer();
    
    // 如果开启了自动循环，则自动开始计时
    if (autoLoop.checked) {
        startTimer();
    }
}

// 修改后的startTimer函数
function startTimer() {
    if (!isRunning) {
        isRunning = true;
        startBtn.disabled = true;
        pauseBtn.disabled = false;
        resetBtn.disabled = false;
        
        const startTime = Date.now();
        const endTime = startTime + timeLeft * 1000;
        
        timer = setInterval(() => {
            const now = Date.now();
            timeLeft = Math.round((endTime - now) / 1000);
            
            if (timeLeft <= 0) {
                timeLeft = 0;
                clearInterval(timer);
                playSound();
                switchMode();
            }
            
            updateDisplay();
            updateTitle();
        }, 200); // 可以设置为更短的间隔（如200ms）以获得更流畅的更新
    }
}
    
    // 暂停计时
    function pauseTimer() {
        if (!isRunning) return;
        
        clearInterval(timer);
        isRunning = false;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
    }
    
    // 重置计时
    function resetTimer() {
        clearInterval(timer);
        isRunning = false;
        isWorkTime = true;
        totalPomodoros = 0;
        startBtn.disabled = false;
        pauseBtn.disabled = true;
        resetBtn.disabled = true;
        initTimer();
    }
    
    // 事件监听
    startBtn.addEventListener('click', startTimer);
    pauseBtn.addEventListener('click', pauseTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    // 设置变化时重置计时器
    workTimeInput.addEventListener('change', function() {
        if (!isRunning && isWorkTime) {
            initTimer();
        }
    });
    
    breakTimeInput.addEventListener('change', function() {
        if (!isRunning && !isWorkTime) {
            initTimer();
        }
    });
    
    // 初始化
    initTimer();
});