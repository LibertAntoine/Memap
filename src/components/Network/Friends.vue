<template>
	<div class="friends-container">
		<div v-for="(neuron, id) in neurons" :key="id">
			<Neuron :neuron="neuron"></Neuron>
		</div>
	</div>
</template>

<script>
import Neuron from '../Neuron/Neuron';

export default {
 	name: 'Friends',
	components: {
		Neuron
	},
	props: ['neurons']
}
</script>

<style lang="less">
.neuron-container {
	margin: 10px 0;
}
</style>
