<template>
	<div class="center-container">
		<Neuron :uuid-neuron="uuidNeuron"></Neuron>
	</div>
</template>

<script>
import Neuron from '../Neuron/Neuron';

export default {
 	name: 'Center',
	components: {
		Neuron
	},
	props: ['uuidNeuron']
}
</script>

<style>
.center-container .handle-friend {
 		right: -8px !important;
 		left: unset !important;
}
</style>
