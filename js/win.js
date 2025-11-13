let zIndexCounter = 1;
let windowCounter = 0;
const winMap = new Map();

function closeWindow(winId) {
	const entry = winMap.get(winId);
	if (entry) {
		entry.win.remove();
		if (entry.taskBtn) entry.taskBtn.remove();
		winMap.delete(winId);
	}
}

function minimizeWindow(winId) {
	const entry = winMap.get(winId);
	if (entry) {
		entry.win.classList.add('minimized');
		setTimeout(() => {
			entry.win.style.display = 'none';
		}, 300);
	}
}

function maximizeWindow(winId) {
	const entry = winMap.get(winId);
	if (!entry) return;
	const win = entry.win;
	if (!entry.isMax) {
		entry.prev = {
			left: win.style.left,
			top: win.style.top,
			width: win.style.width,
			height: win.style.height,
			borderRadius: win.style.borderRadius,
			titleBarRadius: win.querySelector('.titlebar')?.style.borderRadius
		};
		win.style.left = '0';
		win.style.top = '0';
		win.style.width = window.innerWidth + 'px';
		win.style.height = (window.innerHeight - 40) + 'px';
		win.style.borderRadius = '0';
		const titleBar = win.querySelector('.titlebar');
		if (titleBar) titleBar.style.borderRadius = '0';
		entry.isMax = true;
	} else {
		win.style.left = entry.prev.left;
		win.style.top = entry.prev.top;
		win.style.width = entry.prev.width;
		win.style.height = entry.prev.height;
		win.style.borderRadius = entry.prev.borderRadius;
		const titleBar = win.querySelector('.titlebar');
		if (titleBar) titleBar.style.borderRadius = entry.prev.titleBarRadius;
		entry.isMax = false;
	}
}

function makeDraggable(win, handle) {
	let isDragging = false;
	let startX, startY, origX, origY;

	handle.addEventListener('mousedown', (e) => {
		isDragging = true;
		startX = e.clientX;
		startY = e.clientY;
		origX = parseInt(win.style.left);
		origY = parseInt(win.style.top);
		win.style.zIndex = zIndexCounter++;
		win.classList.remove('minimized');
		win.style.display = 'block';
	});

	document.addEventListener('mousemove', (e) => {
		if (!isDragging) return;
		const dx = e.clientX - startX;
		const dy = e.clientY - startY;
		win.style.left = origX + dx + 'px';
		win.style.top = origY + dy + 'px';
	});

	document.addEventListener('mouseup', (e) => {
		isDragging = false;
	});
}

function makeResizable(win) {
	const edges = ['top', 'right', 'bottom', 'left', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
	edges.forEach(edge => {
		const resizer = document.createElement('div');
		resizer.className = 'resizer ' + edge;
		win.appendChild(resizer);

		let isResizing = false;
		let startX, startY, startWidth, startHeight, startLeft, startTop;

		resizer.addEventListener('mousedown', e => {
			e.preventDefault();
			e.stopPropagation();
			isResizing = true;
			startX = e.clientX;
			startY = e.clientY;
			startWidth = parseInt(window.getComputedStyle(win).width);
			startHeight = parseInt(window.getComputedStyle(win).height);
			startLeft = parseInt(win.style.left);
			startTop = parseInt(win.style.top);
			win.style.zIndex = zIndexCounter++;

			const iframe = win.querySelector('iframe');
			if (iframe) iframe.style.pointerEvents = 'none';
		});

		document.addEventListener('mousemove', e => {
			if (!isResizing) return;
			const dx = e.clientX - startX;
			const dy = e.clientY - startY;

			if (edge.includes('right')) win.style.width = startWidth + dx + 'px';
			if (edge.includes('bottom')) win.style.height = startHeight + dy + 'px';
			if (edge.includes('left')) {
				win.style.width = startWidth - dx + 'px';
				win.style.left = startLeft + dx + 'px';
			}
			if (edge.includes('top')) {
				win.style.height = startHeight - dy + 'px';
				win.style.top = startTop + dy + 'px';
			}

			if (parseInt(win.style.width) < 250) win.style.width = '250px';
			if (parseInt(win.style.height) < 150) win.style.height = '150px';

		});

		document.addEventListener('mouseup', () => {
			isResizing = false;

			const iframe = win.querySelector('iframe');
			if (iframe) iframe.style.pointerEvents = 'auto';
		});
	});
}
