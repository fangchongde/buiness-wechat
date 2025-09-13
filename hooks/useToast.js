// composables/useAppRef.js
import { ref } from 'vue'

let toastRef = ref(null)

export function useToast() {
  const registerHandler = (_ref) => {
	toastRef = _ref
  }

  const showToast = (opt = {}) => {
		opt = typeof opt === "string"?{message:opt}:opt
		const defaultToast = {
			type: opt.type || 'default',
			title: opt.title || '',
			message: opt.message || "",
			complete() {
				opt.complete && opt.complete()
			}
	  }
	  toastRef.show(defaultToast)
  }

  return {
    toastRef,
    registerHandler,
    showToast
  }
}