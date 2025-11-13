# JackyOS
## About
* Website: [jacky.run.place](https://jacky.run.place)
* JackyOS is an _online operate system_ made with pure HTML, CSS, and JavaScript (No external libraries) .
## Main Functions
* About: Information of JackyOS
* Alert: Error and warning
* Browser: Enjoy the internet
* Chat: Chat for free
* Context Menus: Some functions
* Files: View folders and files
* Notification: Show messages and control center
* Settings: Costomize JackyOS
* Shutdown
* Start Screen: View apps and shutdown
* Startup
* Terminal: Be a hacker
* Wallpaper: Change wallpaper
* Window: Open, close, fullscreen, hide, resize, move
* More features waiting for you to discover...
## Add Your App
* If you want, feel free to add apps for JackyOS!
* Open an issue with `app.js`.

Your `app.js` should look like this:
```javascript
function openApp() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '500px'; /* You can change your window's width and height */
	win.style.height = '300px';
	win.style.left = (window.innerWidth - 500) / 2 + 'px';
	win.style.top = (window.innerHeight - 300) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `<span>TITLEBAR_APPNAME</span>`; /*Add titlebar name here*/
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
	content.innerHTML = `
		/* Your Window's HTML*/
    `;
	win.appendChild(content);
	document.body.appendChild(win);
	winMap.set(winId, {
		win: win,
		isMax: false,
		prev: null
	});
	/* Some Functions */
	makeDraggable(win, titlebar);
	makeResizable(win);
	const taskbarTray = document.getElementById('taskbar-tray');
	const taskBtn = document.createElement('button');
	taskBtn.className = 'taskbar-button';
	taskBtn.textContent = 'TASK_BTN_TEXT_CONTENT'; /*Taskbar Button Content*/
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
```
Also add CSS or any files if necessary.
* I'm glad to see issues

## Contact
* Report Bugs: jacky@zhujingqi.com or just open an issue!
* Visit my personal website: [zhujingqi.com](https://zhujingqi.com)
---
* Made by Jacky
