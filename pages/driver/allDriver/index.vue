<template>
	<view class="content">
		<view class="card-wrap">
			<uni-card v-for="(item, index) in driverList" :title="item.name+(item.sex==0?'(先生)':'(女士)')" thumbnail="http://img.redocn.com/sheji/20150421/jianjiediannaoxianshiqimingpiansheji_4207570_small.jpg" :extra="item.userDesc" :note="'所在社区：'+item.communityName">
				<text>入驻时间：{{item.createTime}}</text><br>
				<text>车牌号：{{item.licensePlate}}</text>
				
			</uni-card>
		</view>
	</view>
</template>

<script>
	import service from '../../../service.js';
	import { uniCard } from '@dcloudio/uni-ui';
	export default {
		data() {
			return {
				driverList: []
			}
		},
		components: { uniCard },
		onLoad() {
			this.loadDate();
		},
		methods: {
			async loadDate() {
				const result = await service.queryAllDriver();
				this.driverList = result.data;
				console.log('加在出来的数据是：', result);
			},			
		},
	}
</script>

<style>
	.card-wrap>.uni-card{
		margin-left: 0;
		margin-right: 0;
		margin-top: 20upx;
	}
	.card-wrap>>>.uni-card__header-extra-img {
		border-radius: 50% !important;
		background-color: white;
		width: 60upx;
		height: 60upx;
	}
</style>
