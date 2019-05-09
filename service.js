// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
// const baseUrl = 'http://localhost:8986'

function request(url, method, param){
	return new Promise((resolve,reject)=>{
		console.log("账号密码是：",param)
		console.log("链接是：",url)
		uni.request({
			url: url,
			data:param,
			header:{token: uni.getStorageSync('token')},
			method:method,
			success: res=>{
				if(res.statusCode == 200) {
					resolve(res.data);
				} else {
					reject("接口调用失败");
				}
			},
			fail: err=>{
				reject(err);
			}
		})
	})
}

const getUsers = function () {
    let ret = '';
    ret = uni.getStorageSync(USERS_KEY);
    if (!ret) {
        ret = '[]';
    }
    return JSON.parse(ret);
}

const addUser = function (userInfo) {
    let users = getUsers();
    users.push({
        account: userInfo.account,
        password: userInfo.password
    });
    uni.setStorageSync(USERS_KEY, JSON.stringify(users));
}
/**
 * 通过账号登陆
 */
const loginByAccount = (param)=>{
	return request('/fruits/user/login','post', param);
}
/**
 * 查询所有司机
 */
const queryAllDriver = ()=>{
	return request('/fruits/user/queryAllDriver','get');
}
/**
 * 查询所有拼车
 */
const queryAllCarpooling = ()=>{
	return request('/fruits/carpooling/queryAllCarpooling','get');
}

export default {
    getUsers,
    addUser,
	loginByAccount,
	queryAllDriver,
	queryAllCarpooling
}
