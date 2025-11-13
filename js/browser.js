function openBrowserApp() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '900px';
	win.style.height = '600px';
	win.style.left = (window.innerWidth - 900) / 2 + 'px';
	win.style.top = (window.innerHeight - 600) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `<span>🌏Browser</span>`;
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
	content.className = 'window-content';
	content.style.height = 'calc(100% - 30px)';
	content.innerHTML = `
        <div class="browserbar">
            <button id="${winId}-back">←</button>
            <button id="${winId}-forward">→</button>
            <button id="${winId}-refresh">⟳</button>
            <input id="${winId}-url" id="urlInputBox" type="text" style="flex:1;" placeholder="Enter URL" autofocus />
            <button id="${winId}-go">Go</button>
        </div>
        <iframe id="${winId}-iframe" src="homepage.html"></iframe>
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
	taskBtn.textContent = 'Browser';
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
	const urlInput = document.getElementById(`${winId}-url`);
	const iframe = document.getElementById(`${winId}-iframe`);
	const goBtn = document.getElementById(`${winId}-go`);
	const backBtn = document.getElementById(`${winId}-back`);
	const forwardBtn = document.getElementById(`${winId}-forward`);
	const refreshBtn = document.getElementById(`${winId}-refresh`);
	let historyStack = ['homepage.html'];
	let currentIndex = 0;
	
	function navigate(url) {
		if (!url) return;
		if (!/^https?:\/\//i.test(url)) url = 'https://' + url;
		if (currentIndex < historyStack.length - 1) {
			historyStack = historyStack.slice(0, currentIndex + 1);
		}
		historyStack.push(url);
		currentIndex++;
		iframe.src = url;
		urlInput.value = url;
		updateButtons();
	}

	function goBack() {
		if (currentIndex > 0) {
			currentIndex--;
			iframe.src = historyStack[currentIndex];
			urlInput.value = historyStack[currentIndex];
			updateButtons();
		}
	}

	function goForward() {
		if (currentIndex < historyStack.length - 1) {
			currentIndex++;
			iframe.src = historyStack[currentIndex];
			urlInput.value = historyStack[currentIndex];
			updateButtons();
		}
	}

	function refresh() {
		iframe.src = historyStack[currentIndex];
	}

	function updateButtons() {
		backBtn.disabled = currentIndex === 0;
		forwardBtn.disabled = currentIndex === historyStack.length - 1;
	}

	urlInput.addEventListener('keydown', (e) => {
		if (e.key === 'Enter') navigate(urlInput.value);
	});
	goBtn.addEventListener('click', () => navigate(urlInput.value));
	backBtn.addEventListener('click', goBack);
	forwardBtn.addEventListener('click', goForward);
	refreshBtn.addEventListener('click', refresh);
	updateButtons();
}
