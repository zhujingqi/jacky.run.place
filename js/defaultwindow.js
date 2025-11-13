function openApp() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '500px';
	win.style.height = '300px';
	win.style.left = (window.innerWidth - 500) / 2 + 'px';
	win.style.top = (window.innerHeight - 300) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `<span>TITLEBAR_APPNAME</span>`;
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
	content.className = '';
	content.innerHTML = `
		
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
	taskBtn.textContent = 'TASK_BTN_TEXT_CONTENT';
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
