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
		<view class="card-wrap">
			<uni-card v-for="(item, index) in carpoolingList" :title="item.carPoolingName" thumbnail="http://img.redocn.com/sheji/20150421/jianjiediannaoxianshiqimingpiansheji_4207570_small.jpg" extra="正在拼车..." :note="'拼车时间：'+item.createTime">
				<view class="content-wrap">
					<view class="progress-list">
						
					</view>
					<view class="detail">
						<text>武汉工程学院</text><br>
						<text>万科花山紫悦湾</text><br>
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
import { uniCard,uniGrid } from '@dcloudio/uni-ui';
export default {
	computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
	components: { uniCard,uniGrid },
	data() {
		return {
			carpoolingList: []
		}
	},
	onLoad() {
		if (!this.hasLogin) {
			uni.showModal({
				title: '未登录',
				content: '您未登录，需要登录后才能继续',
				/**
				 * 如果需要强制登录，不显示取消按钮
				 */
				showCancel: !this.forcedLogin,
				success: res => {
					if (res.confirm) {
						/**
						 * 如果需要强制登录，使用reLaunch方式
						 */
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
	},
	onReady() {
		
	},
	onShow() {
		this.loadDate();
	},
	methods: {
		async loadDate() {
			const result = await service.queryAllCarpooling();
			this.carpoolingList = result;
			console.log('加在出来的数据是：', result);
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
</style>
<style>
	.card-wrap>>>.uni-card__header-extra-img {
		border-radius: 50% !important;
		background-color: white;
		width: 60upx;
		height: 60upx;
	}
</style>