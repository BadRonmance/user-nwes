const util = require("../utils/index").default
class roleCheck {
      constructor(form, role) {
            for (let i in form) {
                  form[i] = form[i] || ''
            }
            this.form = form ? JSON.parse(JSON.stringify(form)) : {}
            this.role = role ? JSON.parse(JSON.stringify(role)) : {}
      }
      checkValue() {
            let form = this.form
            let role = this.role
            if (JSON.stringify(form) === '{}') {
                  this.toast('请填写相关信息')
                  return false
            }
            if (JSON.stringify(role) === '{}') {
                  console.error("验证规则为空")
                  return true
            }
            for (let i in form) {
                  form[i] = form[i].value === undefined ? {
                        value: form[i],
                        status: false
                  } : form[i]
                  form[i].value = form[i].value === undefined ? '' : form[i].value
                  if (role[i] !== undefined) {
                        let dataType = util.dataType(role[i])
                        if (dataType === 'Array' && !this.composeDataArray(form[i].value, role[i], i)) {
                              return false
                        }
                        if (dataType === 'Object' && !this.checkObject(form[i].value, role[i], i)) {
                              return false
                        }
                  }
            }
            return true
      }
      composeDataArray(val, role, key) {
            for (let i in role) {
                  if (role[i].roleType) {
                        role[i].status = this.checkObject(val, role[i])
                        if (!role[i].status) {
                              return false
                        }
                  }
            }
            return role.findIndex(val => val.status === false) !== -1 ? false : true
      }
      //表单校验
      checkObject(val, role) {
            if (role.roleType === 'rgep' && this.roleRgep(val, role) === false) {
                  return false
            }
            if (role.roleType === 'isNumber' && this.isNumber(val, role) === false) {
                  return false
            }
            if (role.roleType === 'checkCard' && this.checkCard(val, role) === false) {
                  return false
            }
            if (role.roleType === 'emptyChildString' && this.emptyChildString(val, role) === false) {
                  return false
            }
            if (role.roleType === 'checkEmail' && this.checkEmail(val, role) === false) {
                  return false
            }
            if (role.roleType === 'checkPhone' && this.checkPhone(val, role) === false) {
                  return false
            }
            if (role.roleType === 'emptyString' && this.emptyString(val, role) === false) {
                  return false
            }
            if (role.roleType === 'emptyArray' && this.emptyArray(val, role) === false) {
                  return false
            }
            if (role.roleType === 'stringLength' && this.stringLength(val, role) === false) {
                  return false
            }
            return true
      }
      // ! 数组子元素非空字符串校验
      emptyChildString(val, role) {
            const messageType = util.dataType(role.message) !== 'Array'
            if (util.dataType(val) !== 'Array') {
                  this.toast("非法字符")
                  return false
            }
            for (let i in val) {
                  if (val[i] === '') {
                        this.toast(messageType ? role.message : role.message[i])
                        return false
                  }
            }
            return true
      }
      // ! 正则校验
      roleRgep(val, role) {
            role.reg = new RegExp(role.reg, "")
            if (role.reg.test(val)) {
                  return true
            } else {
                  this.toast(role.message)
                  return false
            }
      }
      // ! 是否是纯数字
      isNumber(val, role) {
            var reg = /^[0-9]+.?[0-9]*$/
            if (reg.test(val)) {
                  return true
            } else {
                  this.toast(role.message)
                  return false
            }
      }
      // ! 是否是空字符串
      emptyString(val, role) {
            if (!!val) {
                  return true
            } else {
                  this.toast(role.message)
                  return false
            }
      }
      // ! 是否是空字数组
      emptyArray(val, role) {
            if (util.dataType(val) !== 'Array') {
                  this.toast("非法字符")
                  return false
            } else if (val.length === 0) {
                  this.toast(role.message)
                  return false
            } else {
                  return true
            }
      }
      // ! 邮箱校验
      checkEmail(val, role) {
            let message = util.dataType(role) === 'Object' ? role.message : role ? role : '邮箱验证失败'
            var reg = /^\w+@[a-zA-Z0-9]{2,10}(?:\.[a-z]{2,4}){1,3}$/
            if (reg.test(val)) {
                  return true
            } else {
                  this.toast(message)
                  return false
            }
      }
      // ! 身份证号校验
      checkCard(val, role) {
            var format = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/;
            if (!format.test(val)) {
                  this.toast(role.message)
                  return false;
            }
            var year = val.substr(6, 4),
                  month = val.substr(10, 2),
                  date = val.substr(12, 2),
                  time = Date.parse(month + '-' + date + '-' + year),
                  now_time = Date.parse(new Date()),
                  dates = (new Date(year, month, 0)).getDate();
            if (time > now_time || date > dates) {
                  this.toast("出生日期不合规")
            }
            //校验码判断
            var c = new Array(7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2);
            var b = new Array('1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2');
            var id_array = val.split("");
            var sum = 0;
            for (var k = 0; k < 17; k++) {
                  sum += parseInt(id_array[k]) * parseInt(c[k]);
            }
            if (id_array[17].toUpperCase() != b[sum % 11].toUpperCase()) {
                  this.toast(role.message)
                  return false
            }
            return true
      }
      // ! 手机号校验
      checkPhone(val, role) {
            let message = util.dataType(role) === 'Object' ? role.message : role ? role : '手机号验证失败'
            var reg = /^[1][0-9][0-9]{9}$/
            if (reg.test(val)) {
                  return true
            } else {
                  this.toast(message)
                  return false
            }
      }
      // ! 字符串长度校验
      stringLength(val, role) {
            let min = role.min ? role.min : 0
            let max = role.max ? role.max : 10000
            let length = val.length
            if (min >= max) {
                  let isLength = length === max ? true : false
                  isLength ? '' : this.toast(role.message)
                  return isLength
            } else if (length >= min && length <= max) {
                  return true
            } else {
                  this.toast(role.message)
                  return false
            }
      }
      toast(msg) {
            uni.showToast({
                  icon: "none",
                  title: msg,
            })
      }
}
export default {
      roleCheck
}