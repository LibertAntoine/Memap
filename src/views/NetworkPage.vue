<template>
	<div class="network-page-container">
		<BoxNeuronProperties :uuid-neuron="uuidCenter"/>
		<BoxNeuronSelection />
		<BoxNeuronFavorite />
		<Network :uuid-center="uuidCenter" />
	</div>
</template>

<script>
import Network from '../components/Network/Network'
import BoxNeuronProperties from '../components/Box/BoxNeuronProperties'
import BoxNeuronSelection from '../components/Box/BoxNeuronSelection'
import BoxNeuronFavorite from '../components/Box/BoxNeuronFavorite'

export default {
	name:'NetworkPage',
	data() {
		return {
			uuidCenter: this.$route.params.uuidNeuron
		}
	},
	components: {
		Network, BoxNeuronProperties, BoxNeuronSelection, BoxNeuronFavorite
	},
	beforeRouteUpdate(to, from, next) {
		this.uuidCenter = to.params.uuidNeuron
		console.log('route change');
		next();
	}
}
</script>

<style lang="less">
.network-page-container {
	display: grid;
	grid-template-columns: 1fr 2fr;

	.network-container {
		grid-column-start: 2;
		height: 95%;
	}
}
</style>
