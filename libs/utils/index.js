import validateDate from "./validate/date.js"
import validateEmail from "./validate/email.js"
import validateMobile from "./validate/mobile.js"
import validateNumber from "./validate/number.js"
import validateSystem from "./validate/system.js"
import deepAssign from "./deep-assign.js"
import deepClone from "./deep-clone.js"
import functional from "./functional.js"
import focusClass from "./class.js"
import base64 from "./validate/base64"

export default {
	...base64,
	...validateDate,
	...validateEmail,
	...validateMobile,
	...validateNumber,
	...validateSystem,
	...deepAssign,
	...deepClone,
	...functional,
	...focusClass
}
