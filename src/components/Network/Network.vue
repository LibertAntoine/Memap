<template>
		<div class="network-container" @click="fetchNetworkData">
			<Parents :neurons="parents"/>
			<Friends :neurons="friends"/>
			<Children :neurons="children"/>
			<Center :uuidNeuron="uuidCenter"/>
		</div>
</template>

<script>
import Parents from './Parents'
import Children from './Children'
import Friends from './Friends'
import Center from './Center'

import NetworkAPI from '../../services/network'

export default {
	name:'Network',
	components: {
		Parents,
		Friends,
		Center,
		Children
	},
	data() {
		return {
			polling: null,
			friends:null,
			children:null,
			center:null,
			parents:null
		}
	},
	props: ['uuidCenter'],
	methods: {
		fetchNetworkData() {
			if (this.uuidCenter) {
				console.log('fetch', this.uuidCenter)
				NetworkAPI.getNeuronNetwork(this.uuidCenter).then( data => {
					this.friends = data.friends;
					this.parents = data.parents;
					this.children = data.children;
				}).catch(err => console.log(err));
			}
		},
		initFetchService() { // TODO clarify the role
			this.fetchNetworkData();
			this.polling = setInterval(() => {
				this.fetchNetworkData();
			}, 5000)
		}
	},
	/* TODO: looks to be outdated as it's no longer called on rout change */
	// TODO: Understand why I have to rely on parent componenent in this case
	beforeRouteUpdate(to, from, next) {
		//this.uuidCenter = to.params.uuidNeuron
		console.log('route change');
		this.fetchNetworkData();
		next()
	},

	created() {
		this.initFetchService();
	},
	mounted() {
		this.initFetchService();
	},
	beforeDestroy() {
		clearInterval(this.polling);
	}
}
</script>

<style lang="less">
.network-container {
	height: 100vh;
	display: grid;
	grid-template-columns: 70% 30%;
	grid-template-rows: 33% 1fr 33%;
	grid-template-areas: 
	"parents friends"
	"center friends"
	"children friends";
	> div {
		border: 1px dashed grey;
		place-self: center;
	}
	 .parents-container {
		grid-area: parents;
		align-self: end;
	}
	 .children-container {
		grid-area: children;
		align-self: start;
	}
	 .friends-container {
		grid-area: friends;
		align-self: center;
		justify-self: start;
	}
	.center-container {
		align-self: center;
	}
}
</style>

