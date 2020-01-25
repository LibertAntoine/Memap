<template>
	<div class="test-container">
		<BoxSelection :uuid-neuron="'8f712c97-87de-466d-922e-d6da230f54e2'"/>
		<!-- <BoxSelection /> -->
		<!-- <BoxSelection /> -->
	</div>
</template>

<script>
import BoxSelection from '../components/BoxSelection'
export default {
	name: 'TestPage',
	components: {
		BoxSelection
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
