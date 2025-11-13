function openSettingsApp() {
    closeStartScreen();
    const winId = `window-${++windowCounter}`;
    const win = document.createElement('div');
    win.className = 'window';
    win.id = winId;
    win.style.width = '800px';
    win.style.height = '600px';
    win.style.left = (window.innerWidth - 800) / 2 + 'px';
    win.style.top = (window.innerHeight - 600) / 2 + 'px';
    win.style.zIndex = zIndexCounter++;
    const titlebar = document.createElement('div');
    titlebar.className = 'titlebar';
    titlebar.innerHTML = `<span>🔧Settings</span>`;
    const controls = document.createElement('div');
    controls.className = 'controls';
    controls.innerHTML = `
        <button onclick="minimizeWindow('${winId}')">_</button>
        <button onclick="maximizeWindow('${winId}')">□</button>
        <button onclick="closeWindow('${winId}')">×</button>
    `;
    titlebar.appendChild(controls);
    win.appendChild(titlebar);
    const content = document.createElement('div');
    content.className = 'settings-content';
    content.innerHTML = `
        <h2>Settings</h2>
		<h4>System</h4>
			<label for="volumeRange">Volume</label>
			<input type="range" id="volumeRange" min="0" max="100" value="50"><br>
			<button onclick="alertError()">More</button>
		<h4>Internet</h4>
			Since you visited JackyOS online, you must have connected to the internet, haven't you?<br>
			<button onclick="alertError()">Disconnect</button>
			<button onclick="alertError()">Destroy the internet of your house</button>
		<h4>Custom</h4>
			<button onclick="openBgApp()">Wallpaper Settings</button>
		<h4>Save Changes</h4>
			<button onclick="alertError()">Return to Default</button>
			<button onclick="alertError()">Apply</button>
    `;
    win.appendChild(content);
    document.body.appendChild(win);
    winMap.set(winId, { win: win, isMax: false, prev: null });
    makeDraggable(win, titlebar);
	makeResizable(win);
    const taskbarTray = document.getElementById('taskbar-tray');
    const taskBtn = document.createElement('button');
    taskBtn.className = 'taskbar-button';
    taskBtn.textContent = 'Settings';
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
}