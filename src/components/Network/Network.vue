<template>
		<div class="network-container">
			<Parents :uuid-center="uuidCenter" @contextmenu="parentsContext" :neurons="parents" :center-ref="$refs.center"/>
			<Friends :uuid-center="uuidCenter" @contextmenu="friendsContext" :neurons="friends" :center-ref="$refs.center"/>
			<Children :uuid-center="uuidCenter" @contextmenu="parentsContext" :neurons="children" :center-ref="$refs.center"/>
			<Center ref="center" :uuid-neuron="uuidCenter"/>
			<History />
			<vue-context ref="menu">
				<template slot-scope="child" v-if="child.data">
					<li><a @click="deleteRelationship(child.data)">Delete this relationship</a></li>
				</template>
			</vue-context>
		</div>
</template>

<script>
import Parents from './Parents'
import Children from './Children'
import Friends from './Friends'
import Center from './Center'
import History from './History'

import VueContext from 'vue-context'

import NetworkAPI from '../../services/network'

export default {
	name:'Network',
	components: {
		Parents, Friends, Center, Children, History,
		VueContext
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
		deleteRelationship(data) {
			NetworkAPI.deleteRelationship(data.type, data.uuid, this.uuidCenter).then(res => { console.log(res) }).catch(err => { console.log(err) });
		},
		friendsContext(event, uuid) {
			this.$refs.menu.open(event, { type: 'friend', uuid })
		},
		parentsContext(event, uuid) {
			this.$refs.menu.open(event, { type: 'parent', uuid })
		},
		async fetchNetworkData() {
			if (this.uuidCenter) {
				//console.log('fetch', this.uuidCenter)
				const network = await NetworkAPI.getNeuronNetwork(this.uuidCenter);
				this.parents = network.parents;
				this.children = network.children;
				this.friends = network.friends;
			}
		},
		initFetchService() { // TODO clarify the role
			this.fetchNetworkData();
			const network = this;
			this.polling = setInterval(() => {
				network.fetchNetworkData();
			}, 100)
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
		this.fetchNetworkData();
	},
	beforeDestroy() {
		clearInterval(this.polling);
	}
}
</script>

<style lang="less">
@import '~vue-context/dist/css/vue-context.css';

.network-container {
	/*
  position: absolute;
  width: 100%;
  height: 100%;
	*/
	display: grid;
	grid-template-columns: 70% 30%;
	grid-template-rows: 30% 1fr 30% 10%;
	grid-template-areas: 
	"parents friends"
	"center friends"
	"children friends"
	"history empty";
	position: absolute;
	width: 75%;
	height: 100%;
	right: 0;

	> div {
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
		grid-area: center;
		align-self: center;
	}
	.history-container {
		grid-area: history;
	}
}
</style>

