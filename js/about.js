function openAboutApp() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '700px';
	win.style.height = '800px';
	win.style.left = (window.innerWidth - 700) / 2 + 'px';
	win.style.top = (window.innerHeight - 800) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `<span>About</span>`;
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
	content.className = '';
	content.style = `
		font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial;
		padding: 0 20px;
		max-width: 900px;
		line-height: 1.6;
		color: #222;
		background: #fff;
	`;
	content.innerHTML = `
		<style>
		h1, h2, h3 { border-bottom: 1px solid #eee; padding-bottom: 4px; }
		a { color: #0366d6; text-decoration: none; }
		a:hover { text-decoration: underline; }
		ul { margin-left: 20px; }
		</style>
		<h1 id="jackyos">JackyOS</h1>
		<h2 id="about">About</h2>
		<ul>
		<li>JackyOS is an <em>online operate system</em> made with pure HTML, CSS, and JavaScript (No external libraries).</li>
		</ul>
		<h2 id="main-functions">Main Functions</h2>
		<ul>
			<li>About: Information of JackyOS</li>
			<li>Alert: Error and warning</li>
			<li>Browser: Enjoy the internet</li>
			<li>Chat: Chat for free</li>
			<li>Context Menus: Some functions</li>
			<li>Files: View folders and files</li>
			<li>Notification: Show messages and control center</li>
			<li>Settings: Costomize JackyOS</li>
			<li>Shutdown</li>
			<li>Start Screen: View apps and shutdown</li>
			<li>Startup</li>
			<li>Terminal: Be a hacker</li>
			<li>Wallpaper: Change wallpaper</li>
			<li>Window: Open, close, fullscreen, hide, resize, move</li>
			<li>More features waiting for you to discover...</li>
		</ul>
		<h2 id="contact">Contact</h2>
		<ul>
		<li>Made by Jacky</li>
		<li>Report Bugs: <a href="mailto:jacky@zhujingqi.com">jacky@zhujingqi.com</a> or just open an issue!</li>
		<li>GitHub: <a href="https://github.com/zhujingqi/">zhujingqi</a></li>
		<li>Repository: <a href="https://github.com/zhujingqi/JackyOS">JackyOS</a></li>
		<li>Visit my personal website: <a href="https://zhujingqi.com">zhujingqi.com</a></li>
		</ul>
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
	taskBtn.textContent = 'About';
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
