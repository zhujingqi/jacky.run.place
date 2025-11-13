function openApp(appName) {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;

	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '400px';
	win.style.height = '300px';
	win.style.left = '100px';
	win.style.top = '100px';
	win.style.zIndex = zIndexCounter++;

	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `<span>${appName}</span>`;
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
	content.className = 'content';
	content.innerHTML = `<p>This is content of <strong>${appName}</strong>.</p>`;
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
	taskBtn.textContent = appName;
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
