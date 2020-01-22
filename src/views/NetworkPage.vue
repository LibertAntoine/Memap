<template>
	<div>
		<div class="network-container">
			<Parents class="parent-container" :neurons="parentNeurons"/>
			<Friends class="friends-container" :neurons="friendNeurons"/>
			<Children class="children-container" :neurons="childrenNeurons"/>

			<Neuron class="center-container" :neuron="centerNeuron"/>
		</div>
	</div>
</template>

<script>
import Neuron from '../components/Neuron/Neuron.vue'

import Parents from '../components/Network/Parents'
import Children from '../components/Network/Children'
import Friends from '../components/Network/Friends'

export default {
	name:'Network',
	data() {
		return {
			polling: null
		}
	},
	methods: {
		pollData() {
			this.polling = setInterval(() => {
				this.$store.dispatch('network/getNeuronNetwork')
			}, 5000)
		}
	},
	components: {
		Parents,
		Friends,
		Neuron,
		Children
	},
	computed: {
		friendNeurons() {
			return this.$store.getters['network/friends'];
		},
		childrenNeurons() {
			return this.$store.getters['network/children'];
		},
		parentNeurons() {
				return this.$store.getters['network/parents'];
		},
		centerNeuron() {
				console.log(this.$store.getters['network/center']);
				return this.$store.getters['network/center'].neuron;
		}
	},
	created() {
		this.pollData();
	},
	mounted() {
		console.log('MOUNTED: Center neuron', this.centerNeuron.neuron);
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
	 .parent-container {
		grid-area: parents;
	}
	 .children-container {
		grid-area: children;
	}
	 .friends-container {
		grid-area: friends;
	}
}
</style>
