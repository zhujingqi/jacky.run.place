function openChatApp() {
	closeStartScreen();
	const winId = `window-${++windowCounter}`;
	const win = document.createElement('div');
	win.className = 'window';
	win.id = winId;
	win.style.width = '800px';
	win.style.height = '700px';
	win.style.left = (window.innerWidth - 800) / 2 + 'px';
	win.style.top = (window.innerHeight - 700) / 2 + 'px';
	win.style.zIndex = zIndexCounter++;
	const titlebar = document.createElement('div');
	titlebar.className = 'titlebar';
	titlebar.innerHTML = `<span>💬Chat</span>`;
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
	content.className = 'content';
	content.style.height = 'calc(100% - 30px)';
	content.style.overflow = 'auto';
	content.innerHTML = `
		<style>
			body, h1, p { margin:0; padding:0; }
			.container {
				width: 100%;
				max-width: 600px;
				background-color: white;
				border-radius: 20px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
				padding: 20px;
				margin: 20px auto;
			}
			h1 { text-align:center; color:#333; margin-bottom:20px; }
			.key-input, .chat-container {
				width: 100%;
				max-width: 600px;
				margin: 20px auto;
				border-radius: 20px;
				box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
				padding: 20px;
				background-color: white;
			}
			input, button {
				padding: 10px; margin: 5px; border-radius: 20px; border: 1px solid #ddd;
			}
			button { background-color: #b7f1d9; cursor: pointer; transition: 0.2s; }
			button:hover { background-color: #aaffff; }
			.chat-box {
				height: 350px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;
				margin-bottom: 20px; background-color: #f9f9f9; border-radius: 20px;
			}
			.message { margin-bottom: 15px; padding: 10px; border-radius: 20px; background-color: #e9e9e9; }
			.message-header { font-weight: bold; margin-bottom: 5px; color: #555; }
			.message-time { font-size: 0.8em; color: #888; }
			.input-area { display: flex; flex-wrap: wrap; gap: 10px; }
			.name-input { flex: 1; min-width: 150px; }
			.message-input { flex: 2; min-width: 200px; }
			a { color:#888; transition:0.2s; text-decoration:none; }
			a:hover { color:#333; }
			.bottom { color:#888; text-align:center; margin-top:10px; font-size:0.9em; }
		</style>

		<div id="keyInput" class="key-input">
			<h1>JackyOS Chat</h1>
			<p>Input your textdb.online key to continue</p>
			<p>( Just input a string. See <a href="https://textdb.online/" target="_blank">Here</a> )</p>
			<p>Input 'jackyoschat' to chat with us!</p>
			<br>
			<input type="text" id="${winId}-apiKey" placeholder="Key (6-60 characters)">
			<button id="${winId}-saveKey">Save</button>
			<p class="bottom">Powered by <a href="https://textdb.online/">textdb.online</a><br>
			By <a href="https://github.com/zhujingqi" target="_blank">zhujingqi</a></p>
		</div>

		<div id="${winId}-chatContainer" class="chat-container" style="display:none;">
			<h1>JackyOS Chat</h1>
			<button id="${winId}-newKeyBtn">New Key</button>
			<button id="${winId}-reloadBtn">Reload</button>
			<div class="chat-box" id="${winId}-chatBox"></div>
			<div class="input-area">
				<input type="text" class="name-input" id="${winId}-nameInput" placeholder="Name">
				<input type="text" class="message-input" id="${winId}-messageInput" placeholder="Message">
				<button class="send-btn" id="${winId}-sendBtn">Send</button>
			</div>
			<p class="bottom">
				Powered by <a href="https://textdb.online/">textdb.online</a><br>
				By <a href="https://github.com/zhujingqi" target="_blank">zhujingqi</a>
			</p>
		</div>
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
	taskBtn.textContent = 'Chat';
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

	const keyInputDiv = content.querySelector('#keyInput');
	const chatContainerDiv = content.querySelector(`#${winId}-chatContainer`);
	const apiKeyInput = content.querySelector(`#${winId}-apiKey`);
	const saveKeyBtn = content.querySelector(`#${winId}-saveKey`);
	const chatBox = content.querySelector(`#${winId}-chatBox`);
	const nameInput = content.querySelector(`#${winId}-nameInput`);
	const messageInput = content.querySelector(`#${winId}-messageInput`);
	const sendBtn = content.querySelector(`#${winId}-sendBtn`);
	const newKeyBtn = content.querySelector(`#${winId}-newKeyBtn`);

	let currentKey = '';
	const API_BASE = 'https://textdb.online/';
	
	const reloadBtn = content.querySelector(`#${winId}-reloadBtn`);
	reloadBtn.addEventListener('click', () => {
		loadChats();
	});

	const savedKey = localStorage.getItem('textdbKey');
	if (savedKey) {
		currentKey = savedKey;
		apiKeyInput.value = savedKey;
		showChatInterface();
		loadChats();
	}

	saveKeyBtn.addEventListener('click', () => {
		const key = apiKeyInput.value.trim();
		if (/^[0-9a-zA-Z\-_]{6,60}$/.test(key)) {
			currentKey = key;
			localStorage.setItem('textdbKey', key);
			showChatInterface();
			loadChats();
		} else alert('Key error! ( 6-60 chars, only 0-9, a-z, A-Z, -, _ )');
	});

	newKeyBtn.addEventListener('click', () => {
		keyInputDiv.style.display = 'block';
		chatContainerDiv.style.display = 'none';
	});

	function showChatInterface() {
		keyInputDiv.style.display = 'none';
		chatContainerDiv.style.display = 'block';
	}

	async function loadChats() {
		try {
			const res = await fetch(`${API_BASE}${currentKey}`);
			const txt = await res.text();
			if (txt) displayChats(JSON.parse(txt));
			else chatBox.innerHTML = '<div class="message">No messages</div>';
		} catch {
			chatBox.innerHTML = '<div class="message">Loading error</div>';
		}
	}

	function displayChats(chats) {
		chatBox.innerHTML = '';
		if (!chats.length) {
			chatBox.innerHTML = '<div class="message">No messages</div>';
			return;
		}
		chats.forEach(chat => {
			const div = document.createElement('div');
			div.className = 'message';
			div.innerHTML = `
				<div class="message-header">${escapeHtml(chat.name)}</div>
				<div>${escapeHtml(chat.message)}</div>
				<div class="message-time">${chat.timestamp}</div>
			`;
			chatBox.appendChild(div);
		});
		chatBox.scrollTop = chatBox.scrollHeight;
	}

	sendBtn.addEventListener('click', sendMessage);
	messageInput.addEventListener('keypress', e => {
		if (e.key === 'Enter') sendMessage();
	});

	async function sendMessage() {
		const name = nameInput.value.trim();
		const message = messageInput.value.trim();
		if (!name || !message) return alert('Please input your name and message');
		let chats = [];
		try {
			const res = await fetch(`${API_BASE}${currentKey}`);
			const txt = await res.text();
			if (txt) chats = JSON.parse(txt);
		} catch {}
		const timestamp = new Date().toLocaleString();
		chats.push({
			name,
			message,
			timestamp
		});

		try {
			const res = await fetch(
				`https://api.textdb.online/update/?key=${currentKey}&value=${encodeURIComponent(JSON.stringify(chats))}`
				);
			const result = await res.json();
			if (result.status === 1) {
				messageInput.value = '';
				displayChats(chats);
			} else alert('Error');
		} catch {
			alert('Error');
		}
	}

	function escapeHtml(text) {
		const div = document.createElement('div');
		div.textContent = text;
		return div.innerHTML;
	}
}
