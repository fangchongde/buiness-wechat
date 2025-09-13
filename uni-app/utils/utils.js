/**
 *  防抖
 */
export const Debounce = (fn, interval) => {
	var timer;
	var gapTime = interval || 1000; //间隔时间，如果interval不传，则默认1000ms
	return function() {
		clearTimeout(timer);
		var context = this;
		var args = arguments; //保存此处的arguments，因为setTimeout是全局的，arguments不是防抖函数需要的。
		timer = setTimeout(function() {
			fn.call(context, args);
		}, gapTime);
	};
}
/**
 *  节流
 */
export const Throttle = (fn, interval) => {
	var enterTime = 0; //触发的时间
	var gapTime = interval || 300; //间隔时间，如果interval不传，则默认300ms
	return function() {
		var context = this;
		var backTime = new Date(); //第一次函数return即触发的时间
		if (backTime - enterTime > gapTime) {
			fn.call(context, arguments);
			enterTime = backTime; //赋值给第一次触发的时间，这样就保存了第二次触发的时间
		}
	}
}


/**
 * 可获取到对象属性（若属性为空，也不会报错）
 * @param obj
 * @param args
 */
export const getVal = (obj, ...args) => {
	let out = null;
	if (obj || obj === 0) {
		out = obj;
		if (args && args.length > 0) {
			for (let index = 0; index < args.length; index++) {
				const key = args[index];
				out = out[key];
				if (out === undefined || out === null || out === "") {
					return null;
				}
			}
		} else {
			if (out === undefined || out === null || out === "") {
				return null;
			}
		}
	}
	return out;
};

/**
 * 跳转到具体的工序页面
 */
export function toPage(processType) {
	switch (processType) {
		case 'SK':
			return '/pageB/pages/parameter/kama-tangjin'
			break;
		case 'EK':
			return '/pageB/pages/parameter/kama-aotu'
			break;
		case 'CK':
			return '/pageB/pages/parameter/kama-moqie'
			break;
		case 'SP':
			return '/pageB/pages/parameter/siwang'
			break;
		case 'SH':
			return '/pageB/pages/parameter/shoubai-tangjin'
			break;
		case 'EH':
			return '/pageB/pages/parameter/shoubai-aotu'
			break;
		case 'CH':
			return '/pageB/pages/parameter/shoubai-moqie'
			break;
		case 'UV':
			return '/pageB/pages/parameter/uv-yinshua'
			break;
		case 'SH':
			return '/pageB/pages/parameter/shoubai-tangjin'
			break;
		case 'SK':
			return '/pageB/pages/parameter/kama-tangjin'
			break;
		case 'DP':
			return '/pageB/pages/parameter/shumayinshua'
			break;

		default:
			return ''
	}
}
