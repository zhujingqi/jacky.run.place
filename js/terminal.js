function openTerminalApp() {
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
	titlebar.innerHTML = `<span>JackyOS Terminal - HackyOS</span>`;
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
	content.style.cssText = `
		background: black;
		color: #00ff00;
		font-family: 'Courier New', monospace;
		font-size: 16px;
		height: calc(100% - 30px);
		padding: 10px;
		border-radius: 0 0 20px 20px;
		overflow: hidden;
	`;
	const terminal = document.createElement('div');
	terminal.id = `terminal-${winId}`;
	terminal.innerHTML = `
Welcome to JackyOS kernel - HackyOS v1.0<br>
Type 'help' for a list of commands.<br>
	`;
	content.appendChild(terminal);
	win.appendChild(content);
	document.body.appendChild(win);

	initHackyTerminal(`terminal-${winId}`);

	function initHackyTerminal(termId) {
		const terminal = document.getElementById(termId);
		const responses = {
			help: `
	Available commands:\n
	- help: Show available commands\n
	- hack: Start hacking sequence\n
	- stat: Show system status\n
	- cls: Clear the terminal\n
	- exit: Exit HackyOS\n
	- sd: Self-destruction\n
			`,
			stat: `
	System Status:\n
	- CPU Temp: 8192°C\n
	- Memory Usage: 128%\n
	- Battery Usage: 4096%\n
	- Firewall: Non-existent\n
	- Access Level: ADMIN_ROOT\n
			`,
			hack: `
	Initializing hack protocol...\n
	Bypassing security...\n
	Accessing classified data...\n
	Decrypting files...\n
	Hack Successful!\n
			`,
			sd: `
	Preparing to self destruction...\n
	..........\n
	3...\n
	2...\n
	1...\n
	\n
	ERROR!\n
	\n
	The self destruct function has been destroyed!\n
			`
		};

		createInputLine();

		function createInputLine() {
			const inputLine = document.createElement('div');
			inputLine.style.display = 'flex';

			const prompt = document.createElement('div');
			prompt.textContent = '>';
			prompt.style.marginRight = '5px';

			const input = document.createElement('input');
			Object.assign(input.style, {
				backgroundColor: 'black',
				color: '#00ff00',
				border: 'none',
				outline: 'none',
				fontFamily: 'Courier New, monospace',
				fontSize: '16px',
				flexGrow: '1'
			});

			inputLine.appendChild(prompt);
			inputLine.appendChild(input);
			terminal.appendChild(inputLine);
			input.focus();

			input.addEventListener('keydown', (event) => {
				if (event.key === 'Enter') {
					const cmd = input.value.trim();
					processCommand(cmd, inputLine);
				}
			});
		}

		function processCommand(cmd, inputLine) {
			const input = inputLine.querySelector('input');
			input.disabled = true;

			if (cmd === 'cls') {
				terminal.innerHTML = '';
				createInputLine();
			} else if (cmd === 'exit') {
				typeText(`Exiting...\nERROR\nYou cannot exit!`, createInputLine);
			} else if (responses[cmd]) {
				typeText(responses[cmd], createInputLine);
			} else {
				typeText(`Unknown command: ${cmd}`, createInputLine);
			}
		}

		function typeText(text, callback) {
			const output = document.createElement('div');
			terminal.appendChild(output);
			let i = 0;
			const speed = 10;
			(function type() {
				if (i < text.length) {
					output.textContent += text[i++];
					terminal.scrollTop = terminal.scrollHeight;
					setTimeout(type, speed);
				} else callback && callback();
			})();
		}
	}


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
	taskBtn.textContent = 'Terminal';
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

	setTimeout(() => {
		const firstInput = win.querySelector('input');
		if (firstInput) firstInput.focus();
	}, 100);
}
