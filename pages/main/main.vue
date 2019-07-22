<template>
	<view class="content">
		<view class="header">
			<uni-grid :options="[
				{image:'https://img-cdn-qiniu.dcloud.net.cn/img/shu.png',text:'所有司机'},
				{image:'https://img-cdn-qiniu.dcloud.net.cn/img/lindang.png',text:'铃铛'},
				{image:'https://img-cdn-qiniu.dcloud.net.cn/img/laoren.png',text:'圣诞老人'},
				{image:'https://img-cdn-qiniu.dcloud.net.cn/img/liwu.png',text:'礼物'},
				{image:'https://img-cdn-qiniu.dcloud.net.cn/img/maozi.png',text:'帽子'},
				{image:'https://img-cdn-qiniu.dcloud.net.cn/img/shoutao.png',text:'手套'}]" 
				@click="goto"
				:show-border="false"
				:column-num="4">
			</uni-grid>
			
		</view>
		<uni-notice-bar v-if="broadCastMsg"
			:single="true" 
			:text="`[通知]`+broadCastMsg ">
		</uni-notice-bar>
		<view class="broad-wrap">
			<input class="input-wrap" type="text" v-model="inputValue" />
			<button @click="sendBroadCast" type="primary" size="mini">我要广播</button>
			<button @click="sendBroadCastNetty" type="primary" size="mini">发送netty消息</button>
		</view>
		<button @click="sendDing" type="primary" size="mini">叮一下，证明我的存在</button>
		<view class="card-wrap">
			<uni-card v-for="(item, index) in carpoolingList" :title="item.carPoolingName" thumbnail="http://img.redocn.com/sheji/20150421/jianjiediannaoxianshiqimingpiansheji_4207570_small.jpg" extra="正在拼车..." :note="'拼车时间：'+item.createTime">
				<view class="content-wrap">
					<view class="progress-list">
						
					</view>
					<view class="detail">
						<text>{{item.startSitInfo.siteName}}</text><br>
						<text>{{item.endSitInfo.siteName}}</text><br>
					</view>
				</view>
				<text>车牌号</text>
				
			</uni-card>
		</view>
		
	</view>
</template>

<script>
import service from '../../service.js';
import { mapState } from 'vuex';
import { uniCard,uniGrid,uniNoticeBar  } from '@dcloudio/uni-ui';
var socket;
var netty;
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
	components: { uniCard,uniGrid,uniNoticeBar },
	data() {
		return {
			inputValue:'',
			broadCastMsg: '',
			carpoolingList: []
		}
	},
	onLoad() {
		let that = this;
		if (!this.hasLogin) {
			uni.showModal({
				title: '未登录',
				content: '您未登录，需要登录后才能继续',
				showCancel: !this.forcedLogin,
				success: res => {
					if (res.confirm) {
						if (this.forcedLogin) {
							uni.reLaunch({
								url: '../login/login'
							});
						} else {
							uni.navigateTo({
								url: '../login/login'
							});
						}
					}
				}
			});
		}
		  
		if(typeof(WebSocket) == "undefined") {  
			console.log("您的浏览器不支持WebSocket");  
		}else{  
			console.log("您的浏览器支持WebSocket");  
			//实现化WebSocket对象，指定要连接的服务器地址与端口  建立连接  
			//等同于socket = new WebSocket("ws://localhost:8083/checkcentersys/websocket/20");  
			var basePath = "ws://localhost:8935/socket/"
			var cid = 12;
			socket = new WebSocket(`${basePath}websocket/${cid}`.replace("http","ws"));  
			//打开事件  
			socket.onopen = function() {  
				console.log("Socket 已打开");  
				//socket.send("这是来自客户端的消息" + location.href + new Date());  
			};  
			//获得消息事件  
			socket.onmessage = function(msg) {  
				console.log('service-msg'+msg.data);  
				that.broadCastMsg = msg.data;
				//发现消息进入    开始处理前端触发逻辑
			};  
			//关闭事件  
			socket.onclose = function() {  
				console.log("Socket已关闭");  
			};  
			//发生了错误事件  
			socket.onerror = function() {  
				alert("Socket发生了错误");  
				//此时可以尝试刷新页面
			}  
			//离开页面时，关闭socket
			//jquery1.8中已经被废弃，3.0中已经移除
			// $(window).unload(function(){  
			//     socket.close();  
			//}); 
			 
			 var basePath2 = "ws://localhost:9090"
			 var cid = 12;
			 netty = new WebSocket(`${basePath2}`.replace("http","ws"));  
			 //打开事件  
			 netty.onopen = function() {  
			 	console.log("netty 已打开");  
				// netty.send("发送第一个netty内容")
				let param = {
					 t:2, // 消息类型
					 n:2, // 用户名称
					// TODO: 预留房间ID
					 room_id:2, // 房间 ID
					 body: 2, // 消息主体
					 err:2 //错误码
				}
				netty.send(JSON.stringify(param))
			 	//socket.send("这是来自客户端的消息" + location.href + new Date());  
			 };  
			 //获得消息事件  
			 netty.onmessage = function(msg) {  
			 	console.log('netty-msg'+msg.data);  
			 	that.broadCastMsg = msg.data;
			 	//发现消息进入    开始处理前端触发逻辑
			 };  
			 //关闭事件  
			 netty.onclose = function() {  
			 	console.log("netty已关闭");  
			 };  
			 //发生了错误事件  
			 netty.onerror = function() {  
			 	alert("netty发生了错误");  
			 	//此时可以尝试刷新页面
			 }  
				
		}
	},
	onReady() {
		
	},
	onShow() {
		this.loadDate();
	},
	methods: {
		sendBroadCast(){
			socket.send(this.inputValue)
		},
		sendBroadCastNetty(){
			let param = {
				 t:2, // 消息类型
				 n:'张三', // 用户名称
				// TODO: 预留房间ID
				 room_id:2, // 房间 ID
				 body: this.inputValue, // 消息主体
				 err:2 //错误码
			}
			netty.send(JSON.stringify(param))
		},
		async sendDing(){
			const result = await service.sendDing({message:'叮！'});
		},
		async loadDate() {
			const result = await service.queryAllCarpooling();
			this.carpoolingList = result.data;
		},
		goto(options){
			console.log(options)
			switch (options.index){
				case 0:
					uni.navigateTo({
						url:'/pages/driver/allDriver/index'
					})
					break;
				default:
					break;
			}
		}
	}
};
</script>

<style lang="less">
	.header{
		background-color: white;
		}
.title {
	color: #8f8f94;
	margin-top: 50upx;
}
.card-wrap>.uni-card{
	margin-left: 0;
	margin-right: 0;
	margin-top: 20upx;
}

.ul {
	font-size: 30upx;
	color: #8f8f94;
	margin-top: 50upx;
}
.content-wrap{
	.detail{
		font-size: 23upx;
	}
}
.ul > view {
	line-height: 50upx;
}
.input-wrap{
	background-color: white;
	border: 1px solid #8f8f94;
	flex: 1;
	margin-left: 20upx;
	margin-right: 20upx;
	}
.broad-wrap{
	display: flex;
	flex-direction: row;
}
</style>
<style>
	.card-wrap>>>.uni-card__header-extra-img {
		border-radius: 50% !important;
		background-color: white;
		width: 60upx;
		height: 60upx;
	}
</style>