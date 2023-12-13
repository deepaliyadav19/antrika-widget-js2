// import { api } from '../../api';

window.antrika = function (params, data) {
	// console.log({ params, data });
	// Destructure parameters
	// const { boardToken, basePath, ssoToken, theme } = data;
	if (params === 'render') render(data);
	else if (params === 'initChangelog') changelog(data);
};

function getCoordinates(button, coordinates) {
	let obj = {};
	if ((window.innerHeight - coordinates.bottom) > 400) {
		obj.top = coordinates.top; // if element has space on bottom
	} else if (coordinates.top > 400) {
		// obj.top = 300 + coordinates.height; //  if element has space on top
		// obj.top = -300 + coordinates.height; //  if element has space on top
		obj.top = (coordinates.top + coordinates.height) - 400;
	} else {
		obj.top = 0;
	}

	if ((window.innerWidth - coordinates.right) > 360) {
		obj.left = coordinates.right + 10; // if element is on right
	} else if (coordinates.left > 360) {
		obj.left = coordinates.left - 360; // if element has space on left
	} else {
		obj.left = 0;
	}
	return ` ${ obj.top || 0 }px 0 0 ${ obj.left || 0 }px`;
}

function changelog() {

	document.addEventListener('click', e => {
		const iframeEle = document.getElementById('antrika-changelog-iframe');
		const buttonEle = document.querySelector('[data-antrika-changelog]');
		if (e?.target === buttonEle) {
			if (iframeEle) {
				// console.log('2')
				iframeEle.remove();
			} else {
				var rect = buttonEle.getBoundingClientRect();
				const coordinates = getCoordinates(buttonEle, rect);
				// console.log('called 1')
				const iframe = document.createElement('iframe');
				iframe.setAttribute('src', 'https://local.dev.antrika.com/changelog?widget=true');
				iframe.setAttribute('width', '350px');
				iframe.setAttribute('height', '400px');
				iframe.setAttribute('title', 'Feedback Form');
				iframe.setAttribute('id', 'antrika-changelog-iframe');
				iframe.setAttribute(
					'allow',
					'accelerometer; autoplay; encrypted-media; fullscreen; gyroscope; picture-in-picture'
				);
				iframe.setAttribute('background', '#fff');
				iframe.setAttribute('display', 'block');
				iframe.setAttribute('overflow', 'hidden');
				iframe.setAttribute('position', 'absolute');
				iframe.style.animation = 'antrika-widget-slide-up 0.2s ease';
				iframe.style.border = '0';
				iframe.style.borderRadius = '8px';
				iframe.style.boxShadow = '0px 2px 10px rgba(0, 0, 0, 0.15)';
				iframe.style.position = 'absolute';
				iframe.style.zIndex = 2147483647;
				iframe.style.inset = coordinates;
				// console.log({ iframe });
				// iframe.contentWindow.document.cookie = 'SameSite=None; Secure';

				// Enhance security by using sandbox attribute
				iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
				if (buttonEle) {
					document.body.appendChild(iframe);
				}
				var u = document.createElement('style');
				u.id = 'canny-changeloge-style';
				  u.setAttribute('type', 'text/css');
				  u.innerHTML =
					'.Antrika_BadgeContainer { position: absolute; top: 0; bottom: 0; left: 0; right: 0; visibility: hidden } .Antrika_Badge { position: absolute; top: -1px; right: -1px; border-radius: 10px; background-color: red; padding: 5px; border: 1px solid white; visibility: visible } @keyframes antrika-widget-slide-up { from { opacity:0.6; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }';
				  (
					document.head ||
					document.getElementsByTagName('head')[0]
				  ).appendChild(u);
				e.stopPropagation();
			}
		} else {
			// console.log('3')
			if (iframeEle) {
				iframeEle.remove();
			}
		}
	});
	// const element = document.getElementById('antrika-changelog-iframe');
}

function render() {
	const element = document.getElementById('antrika-feedback-iframe');
	if (!element) {
		const iframe = document.createElement('iframe');
		iframe.setAttribute('src', 'https://local.dev.antrika.com/feedback?widget=true&sort=latest');
		iframe.setAttribute('width', '100%');
		iframe.setAttribute('frameborder', '0'); // Remove border if needed
		iframe.setAttribute('title', 'Feedback Form');
		iframe.setAttribute('id', 'antrika-feedback-iframe');
		iframe.style.height = '500px';
		iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-forms allow-popups');
		const ele = document.querySelector('[data-antrika]');
		if (ele) {
			  ele.appendChild(iframe);
		}
		iframe.addEventListener('load', () => {
			// console.log('called')
			const iframeDocument = iframe.contentDocument || iframe?.contentWindow?.document;
			// console.log({ iframe, iframeDocument });
			// Check if iframeDocument is defined before setting the cookie
			if (iframeDocument) {
			  iframeDocument.cookie = 'cookieName=cookieValue; SameSite=None; Secure';
			} else {
			//   console.error('Cannot access iframe document.');
			}
		  });
	}
}
