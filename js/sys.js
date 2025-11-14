document.getElementById('startButton').addEventListener('click', () => {
	const ss = document.getElementById('startScreen');
	if (ss.classList.contains('show')) {
		ss.classList.remove('show');
		ss.classList.add('hidden');
	} else {
		ss.classList.add('show');
		ss.classList.remove('hidden');
	}
});

function closeStartScreen() {
	document.getElementById('startScreen').classList.remove('show');
}

/*****ICONMENU*****/

function showIconMenu(event) {
	event.preventDefault();
	const menu = document.getElementById('iconContextMenu');
	document.getElementById("desktopmenu").style.display = "none";
	document.getElementById("taskbarmenu").style.display = "none";
	menu.style.left = event.pageX + 'px';
	menu.style.top = event.pageY + 'px';
	menu.style.display = 'block';
	document.addEventListener('click', hideIconMenu);
}

function hideIconMenu() {
	const menu = document.getElementById('iconContextMenu');
	menu.style.display = 'none';
	document.removeEventListener('click', hideIconMenu);
}

function renameApp() {
	hideIconMenu();
	alertError();
}

function deleteApp() {
	hideIconMenu();
	alertError();
}

/*****DESKTOPMENU*****/

const desktop = document.getElementById("desktop");
const menu = document.getElementById("desktopmenu");
let folderCount = 0;
let fileCount = 0;

desktop.addEventListener("contextmenu", function(e) {
	if (e.target.id === "desktop") {
		e.preventDefault();
		document.getElementById("iconContextMenu").style.display = "none";
		document.getElementById("taskbarmenu").style.display = "none";
		menu.style.display = "block";
		menu.style.left = e.pageX + "px";
		menu.style.top = e.pageY + "px";
	}
});

document.addEventListener("click", function() {
	menu.style.display = "none";
});

function createFolder() {
	folderCount++;
	const btn = document.createElement("button");
	btn.className = "icon";
	btn.onclick = () => alertWarning();
	btn.oncontextmenu = (e) => showIconMenu(event);
	btn.innerHTML = `
		<div class="emoji">📂</div>
		<span>Folder ${folderCount}</span>
	`;

	desktop.appendChild(btn);
	menu.style.display = "none";
}

function createFile() {
	fileCount++;
	const btn = document.createElement("button");
	btn.className = "icon";
	btn.onclick = () => alertWarning();
	btn.oncontextmenu = (e) => showIconMenu(event);
	btn.innerHTML = `
		<div class="emoji">📄</div>
		<span>File ${fileCount}</span>
	`;

	desktop.appendChild(btn);
	menu.style.display = "none";
}

/*****TASKBARMENU*****/

const taskbar = document.getElementById("taskbar");
const taskbarmenu = document.getElementById("taskbarmenu");

taskbar.addEventListener("contextmenu", function(e) {
	e.preventDefault();
	document.getElementById("desktopmenu").style.display = "none";
	document.getElementById("iconContextMenu").style.display = "none";
	const menu = taskbarmenu;
	menu.style.display = "block";
	const menuHeight = menu.offsetHeight || 120;
	const menuWidth = menu.offsetWidth || 140;
	let left = e.pageX;
	let top = e.pageY;
	if (e.pageY + menuHeight > window.innerHeight) {
		top = e.pageY - menuHeight - 5;
	}
	if (e.pageX + menuWidth > window.innerWidth) {
		left = window.innerWidth - menuWidth - 5;
	}
	menu.style.left = left + "px";
	menu.style.top = top + "px";
});

document.addEventListener("click", function() {
	taskbarmenu.style.display = "none";
});

/*****ALERT,WARNING*****/

function alertError() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '400px';
	win.style.height = '200px';
	win.style.left = (window.innerWidth - 400) / 2 + 'px';
	win.style.top = (window.innerHeight - 200) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `ERROR`;
	const controls = document.createElement('div');
	controls.className = 'controls';
	controls.innerHTML = `
        <button onclick="closeWindow('${winId}')">&times;</button>
    `;
	titlebar.appendChild(controls);
	win.appendChild(titlebar);
	const content = document.createElement('div');
	content.className = 'content';
	content.innerHTML = `<b style="color:#ff0000;">Something's wrong!</b>`;
	win.appendChild(content);
	document.body.appendChild(win);
	winMap.set(winId, {
		win: win,
		isMax: false,
		prev: null
	});
	makeDraggable(win, titlebar);
	makeResizable(win);
}

function alertWarning() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '400px';
	win.style.height = '200px';
	win.style.left = (window.innerWidth - 400) / 2 + 'px';
	win.style.top = (window.innerHeight - 200) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `⚠Warning`;
	const controls = document.createElement('div');
	controls.className = 'controls';
	controls.innerHTML = `
        <button onclick="closeWindow('${winId}')">×</button>
    `;
	titlebar.appendChild(controls);
	win.appendChild(titlebar);
	const content = document.createElement('div');
	content.className = 'content';
	content.innerHTML = `<b style="color:#ffaa00;">Unable to operate!</b>`;
	win.appendChild(content);
	document.body.appendChild(win);
	winMap.set(winId, {
		win: win,
		isMax: false,
		prev: null
	});
	makeDraggable(win, titlebar);
	makeResizable(win);
}

document.getElementById('showDesktopBtn').addEventListener('click', () => {
	winMap.forEach(entry => {
		if (entry.win.style.display !== 'none') {
			entry.win.style.display = 'none';
			entry.win.classList.add('minimized');
		}
	});
});

function updateClock() {
	const now = new Date();
	const h = String(now.getHours()).padStart(2, '0');
	const m = String(now.getMinutes()).padStart(2, '0');
	const s = String(now.getSeconds()).padStart(2, '0');
	const y = now.getFullYear();
	const mo = String(now.getMonth() + 1).padStart(2, '0');
	const d = String(now.getDate()).padStart(2, '0');
	document.getElementById('clock').textContent = `${y}/${mo}/${d} ${h}:${m}:${s}`;
}
setInterval(updateClock, 1000);
updateClock();

document.getElementById('volumeBtn').addEventListener('click', () => {
	alertError();
});

/*****START*****/

window.onload = () => {
	const bootScreen = document.getElementById('boot-screen');
	const bootText = document.getElementById('boot-text');
	const loginScreen = document.getElementById('login-screen');
	const loginBtn = document.getElementById('loginBtn');

	document.body.style.cursor = 'none';

	loginScreen.style.opacity = '1';

	setTimeout(() => {
		bootText.style.opacity = '0';
		bootScreen.style.opacity = '0';
		setTimeout(() => {
			bootScreen.style.display = 'none';
			loginScreen.style.display = 'flex';
			requestAnimationFrame(() => {
				loginScreen.style.opacity = '1';
				document.body.style.cursor = 'default';
			});
		}, 500);
	}, 3000);

	const savedName = localStorage.getItem('jackyos_user');
	if (savedName) {
		document.getElementById('username').value = savedName;
	}

};

function login() {
	const username = document.getElementById('jackyosusername').value.trim();
	const error = document.getElementById('login-error');
	const loginScreen = document.getElementById('login-screen');

	if (username === '') {
		error.textContent = 'Username is required.';
		return;
	}
	error.textContent = '';
	loginScreen.style.opacity = '0';
	localStorage.setItem('jackyos_user', username);
	setTimeout(() => {
		loginScreen.style.display = 'none';
		desktop.style.display = 'block';
		openWelcomeWindow(username);
	}, 1000);
}

document.addEventListener('keydown', function(event) {
	if (event.key === 'Enter') {
		const loginBtn = document.getElementById('login-btn');
		const loginScreen = document.getElementById('login-screen');
		if (loginBtn && loginScreen && loginScreen.style.display !== 'none') {
			loginBtn.click();
		}
	}
});

function openWelcomeWindow(username) {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;

	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '300px';
	win.style.height = '200px';
	win.style.left = (window.innerWidth - 300) / 2 + 'px';
	win.style.top = (window.innerHeight - 200) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;

	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `😄Welcome`;
	const controls = document.createElement('div');
	controls.className = 'controls';
	controls.innerHTML = `
	        <button onclick="closeWindow('${winId}')">×</button>
	    `;
	titlebar.appendChild(controls);
	win.appendChild(titlebar);

	const content = document.createElement('div');
	content.className = 'content';
	content.innerHTML = `Welcome to JackyOS, ${username}!\nPress F11 to Fullscreen Mode!`;
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
	taskBtn.textContent = 'Welcome';
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

/*****SHUTDOWN*****/

function shutdown() {
	const screen = document.getElementById('shutdown-screen');
	const text = document.getElementById('shutdown-text');

	screen.classList.remove('hidden');
	requestAnimationFrame(() => {
		screen.classList.add('show');
	});

	text.style.animation = 'fadeOut 2s ease 1s forwards';

	setTimeout(() => {
		text.style.display = 'none';
	}, 3000);

	document.body.style.cursor = 'none';
}

/*****SHARE*****/

function share() {
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
	titlebar.innerHTML = `<span>Share</span>`;
	const controls = document.createElement('div');
	controls.className = 'controls';
	controls.innerHTML = `
        <button onclick="closeWindow('${winId}')">&times;</button>
    `;
	titlebar.appendChild(controls);
	win.appendChild(titlebar);
	const content = document.createElement('div');
	content.className = 'window-content';
	content.style.padding = '10px';
	content.innerHTML = `
		<h1>Share JackyOS!</h1>
		<p>Link: <span id="${winId}-link">https://jacky.run.place</span></p><br>
		<button class="sharebtn" id="${winId}-copy">Copy to Clipboard</button><br>
		<img src="/breaking-news-jackyos.jpg" style="height: 100px; width: auto; border-radius: 20px; " /><br>
		<button class="sharebtn" id="${winId}-download">Download 'Breaking News' Image</button>
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
	taskBtn.textContent = 'Share';
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

	document.getElementById(`${winId}-copy`).onclick = () => {
		const linkText = document.getElementById(`${winId}-link`).textContent;
		navigator.clipboard.writeText(linkText).then(() => {
			console.log('Copied.');
		});
	};
	document.getElementById(`${winId}-download`).onclick = () => {
		const imgUrl = '/breaking-news-jackyos.jpg';
		const a = document.createElement('a');
		a.href = imgUrl;
		a.download = 'breaking-news-jackyos.jpg';
		a.click();
	};
}

/*****PREVENTDEFAULTMENU*****/

document.addEventListener("contextmenu", function(e) {
	e.preventDefault();
});

iframe.addEventListener("contextmenu", e => e.stopPropagation());

/*****NOTI*****/

document.getElementById('notification-btn').addEventListener('click', (e) => {
	e.stopPropagation();
	document.getElementById('notification-panel').classList.toggle('active');
});

document.getElementById('notification-list').addEventListener('click', (e) => {
	if (e.target.classList.contains('delete-btn')) {
		e.stopPropagation();
		e.target.closest('.notification-item').remove();
	}
});

document.addEventListener('click', (e) => {
	if (!document.getElementById('notification-panel').contains(e.target) && e.target !== document
		.getElementById('notification-btn')) {
		document.getElementById('notification-panel').classList.remove('active');
	}

});
