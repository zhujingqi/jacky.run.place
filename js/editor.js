function openEditorApp() {
    closeStartScreen();
    const winId = `window-${++windowCounter}`;
    const win = document.createElement('div');
    win.className = 'window';
    win.id = winId;
    win.style.width = '700px';
    win.style.height = '450px';
    win.style.left = (window.innerWidth - 700) / 2 + 'px';
    win.style.top = (window.innerHeight - 450) / 2 + 'px';
    win.style.zIndex = zIndexCounter++;
    const titlebar = document.createElement('div');
    titlebar.className = 'titlebar';
    titlebar.innerHTML = `<span>💻JavaScript Editor</span>`;
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <button onclick="minimizeWindow('${winId}')">_</button>
        <button onclick="maximizeWindow('${winId}')">&square;</button>
        <button onclick="closeWindow('${winId}')">&times;</button>
    `;
    titlebar.appendChild(controls);
    win.appendChild(titlebar);
    const content = document.createElement('div');
    content.className = 'js-sandbox';
    content.style.cssText = `
        height: calc(100% - 30px);
        display: flex;
        flex-direction: column;
        background: #fafafa;
        border-top: 1px solid #ddd;
    `;
    content.innerHTML = `
        <div style="padding:8px; background:#eee; border-bottom:1px solid #ccc; display:flex; gap:8px;">
            <button id="${winId}-run"
                style="padding:6px 12px; background:#4caf50; color:white; border:none; border-radius:4px; cursor:pointer;">
                ▶ Run
            </button>
            <button id="${winId}-clear"
                style="padding:6px 12px; background:#e53935; color:white; border:none; border-radius:4px; cursor:pointer;">
                Clear
            </button>
        </div>

        <textarea id="${winId}-code" style="
            flex:1;
            width:100%;
            padding:12px;
            border:none;
            outline:none;
            font-family:Consolas, monospace;
            font-size:15px;
            resize:none;
            background:white;
        ">
console.log("Hello World!");
</textarea>

        <div id="${winId}-output" style="
            height:120px;
            background:black;
            color:#0f0;
            font-family:Consolas;
            overflow-y:auto;
            padding:8px;
            font-size:14px;
        ">/* Output will appear here */</div>
    `;
    win.appendChild(content);
    document.body.appendChild(win);
    winMap.set(winId, {
        win: win,
        isMax: false,
        prev: null
    });
    makeDraggable(win, titlebar);
    makeResizable(win);
    const taskbarTray = document.getElementById('taskbar-tray');
    const taskBtn = document.createElement('button');
    taskBtn.className = 'taskbar-button';
    taskBtn.textContent = 'JS Editor';
    taskBtn.onclick = () => {
        if (win.style.display === 'none' || win.classList.contains('minimized')) {
            win.style.display = 'block';
            win.classList.remove('minimized');
            win.style.zIndex = zIndexCounter++;
        } else {
            win.style.display = 'none';
            win.classList.add('minimized');
        }
    };
    taskbarTray.appendChild(taskBtn);
    winMap.get(winId).taskBtn = taskBtn;
    const runBtn = document.getElementById(`${winId}-run`);
    const clearBtn = document.getElementById(`${winId}-clear`);
    const codeArea = document.getElementById(`${winId}-code`);
    const output = document.getElementById(`${winId}-output`);
    const originalLog = console.log;
    console.log = (...msg) => {
        output.innerHTML += msg.join(" ") + "<br>";
        originalLog(...msg);
    };
    runBtn.onclick = () => {
        output.innerHTML = "";
        try {
            eval(codeArea.value);
        } catch (err) {
            output.innerHTML += `<span style="color:red;">${err}</span><br>`;
        }
    };
    clearBtn.onclick = () => {
        codeArea.value = "";
    };
}

