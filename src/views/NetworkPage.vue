<template>
	<div class="network-page-container">
		<Network :uuid-center="uuidCenter" />
	</div>
</template>

<script>
import Network from '../components/Network/Network'

export default {
	name:'NetworkPage',
	data() {
		return {
			uuidCenter: this.$route.params.uuidNeuron
		}
	},
	components: {
		Network
	},
	beforeRouteUpdate(to, from, next) {
		this.uuidCenter = to.params.uuidNeuron
		console.log('route change');
		next();
	}
}
</script>
