<template>
	<div class="test-container">
		<BoxNeuronProperties :uuid-neuron="'8f712c97-87de-466d-922e-d6da230f54e2'"/>
		<!-- <BoxSelection /> -->
		<!-- <BoxSelection /> -->
	</div>
</template>

<script>
import BoxNeuronProperties from '../components/Box/BoxNeuronProperties'
export default {
	name: 'TestPage',
	components: {
		BoxNeuronProperties
	}
}
</script>

<style lang="less">
.test-container {
	display: grid;
	grid-template-columns: 1fr;
	margin-left: 70px;
	width: 70vw;
}
</style>
