function openBgApp() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '1000px';
	win.style.height = '300px';
	win.style.left = (window.innerWidth - 1000) / 2 + 'px';
	win.style.top = (window.innerHeight - 300) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `<span>Wallpaper</span>`;
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
	content.className = 'content bg-selector';
	content.innerHTML = `
		<img src="bg/default.jpg" onclick="setDesktopBg('bg/default.jpg')" alt="Default"><span>Default</span>
        <img src="bg/jackyos.jpg" onclick="setDesktopBg('bg/jackyos.jpg')" alt="JackyOS"><span>JackyOS</span>
        <img src="bg/violet.jpg" onclick="setDesktopBg('bg/violet.jpg')" alt="Violet"><span>Violet</span>
		<img src="bg/pl.jpg" onclick="setDesktopBg('bg/pl.jpg')" alt="Black"><span>Purple Laser</span>
        <img src="bg/black.jpg" onclick="setDesktopBg('bg/black.jpg')" alt="Black"><span>Black</span>
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
	taskBtn.textContent = 'Wallpaper Settings';
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

function setDesktopBg(path) {
	const desktop = document.getElementById('desktop');
	desktop.style.background = `url('${path}') center/cover no-repeat`;
}
