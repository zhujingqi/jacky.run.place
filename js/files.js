function openFilesApp() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '600px';
	win.style.height = '400px';
	win.style.left = (window.innerWidth - 600) / 2 + 'px';
	win.style.top = (window.innerHeight - 400) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `<span>📂Files</span>`;
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
	content.className = 'files-content';
	content.style.display = 'flex';
	content.style.flexDirection = 'column';
	content.style.height = 'calc(100% - 30px)';
	content.innerHTML = `
		<div class="files-addressbar" style="background:#f2f2f2;border-bottom:1px solid #ccc;padding:4px 6px;display:flex;align-items:center;gap:6px;">
			<button id="${winId}-back" style="padding:2px 6px; border-radius: 10px; border: 1px solid #222;">◀</button>
			<input id="${winId}-path" type="text" value="/" style="flex:1;padding:3px;border:1px solid #aaa;border-radius:10px;">
		</div>
		<div id="${winId}-view" class="files-view" style="
			flex:1;
			overflow:auto;
			padding:10px;
			display:grid;
			grid-template-columns:repeat(auto-fill, minmax(90px, 1fr));
			gap:10px;
			align-content:start;
			background:white;
			border-radius:20px;
		"></div>
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
	taskBtn.textContent = 'Files';
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
	const fs = {
		'/': ['user', 'docs', 'pictures', 'music', 'video'],
			'/user': ['admin', 'JackyOS User'],
				'/user/admin': ['important_information'],
					'/user/admin/important_information': [],
				'/user/JackyOS User': [],
		'/docs': ['New Folder', 'Homework.docx', 'Notes.txt', 'deber_de_física.pdf'],
			'/docs/New Folder': [],
		'/pictures': ['jackyos.ico', 'photo1.png', 'test.jpg'],
		'/music': ['music1.mp3', 'music2.mp3'],
		'/video': ['The Legend of Lishu (External link, unrelated to this website!).mp4'],
	};

	const fileLinks = {
		'/video/The Legend of Lishu (External link, unrelated to this website!).mp4': 'https://www.bilibili.com/video/BV1mv411c7VE/?spm_id_from=333.337.search-card.all.click',
	};

	let currentPath = '/';
	const pathInput = document.getElementById(`${winId}-path`);
	const view = document.getElementById(`${winId}-view`);
	const backBtn = document.getElementById(`${winId}-back`);
	let historyStack = ['/'];

	function renderPath(path) {
		view.innerHTML = '';
		const items = fs[path] || [];

		if (!items.length) {
			const emptyMsg = document.createElement('div');
			emptyMsg.textContent = '📂 Empty.';
			emptyMsg.style.textAlign = 'center';
			emptyMsg.style.color = '#666';
			emptyMsg.style.marginTop = '30px';
			view.appendChild(emptyMsg);
			return;
		}

		items.forEach(item => {
			const isFolder = fs[path + (path === '/' ? '' : '/') + item] !== undefined;

			const el = document.createElement('div');
			el.style.display = 'flex';
			el.style.flexDirection = 'column';
			el.style.alignItems = 'center';
			el.style.justifyContent = 'center';
			el.style.borderRadius = '8px';
			el.style.cursor = 'pointer';
			el.style.padding = '8px';
			el.style.userSelect = 'none';
			el.style.transition = '0.2s';
			el.onmouseenter = () => el.style.background = '#e0e0e0';
			el.onmouseleave = () => el.style.background = '';

			el.innerHTML = `
				<div style="font-size:32px;">${isFolder ? '📁' : '📄'}</div>
				<div style="font-size:13px;margin-top:4px;text-align:center;word-break:break-all;">${item}</div>
			`;

			el.onclick = () => {
				if (isFolder) {
					const newPath = path === '/' ? '/' + item : path + '/' + item;
					historyStack.push(newPath);
					currentPath = newPath;
					pathInput.value = newPath;
					renderPath(newPath);
				} else {
					const fullPath = path === '/' ? '/' + item : path + '/' + item;
					const link = fileLinks[fullPath];
					if (link) {
						window.open(link, '_blank');
					} else {
						alertWarning();
					}
				}
			};
			view.appendChild(el);
		});
	}

	backBtn.onclick = () => {
		if (historyStack.length > 1) {
			historyStack.pop();
			currentPath = historyStack[historyStack.length - 1];
			pathInput.value = currentPath;
			renderPath(currentPath);
		}
	};

	pathInput.addEventListener('change', () => {
		const newPath = pathInput.value.trim();
		if (fs[newPath]) {
			currentPath = newPath;
			historyStack.push(newPath);
			renderPath(newPath);
		} else {
			alertWarning();
			pathInput.value = currentPath;
		}
	});

	renderPath(currentPath);
}
