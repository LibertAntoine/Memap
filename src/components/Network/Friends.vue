<template>
	<div class="friends-container">
		<div class="neurons">
			<Neuron v-for="(neuron, id) in neurons" :key="id" ref="neuron" :uuid-neuron="neuron.neuronUUID" />
		</div>
		<AddNeuronButton :type="'friend'" :uuid-center-neuron="uuidCenter"/>
		<SVGPathFriends @contextmenu="contextClick" :friends-ref="$refs.neuron" :center-ref="centerRef"/>
	</div>
</template>

<script>
import Neuron from '../Neuron/Neuron';
import AddNeuronButton from '../Network/AddNeuronButton';
import SVGPathFriends from './Links/SVGPathFriends'

export default {
 	name: 'Friends',
	components: {
		Neuron, SVGPathFriends, AddNeuronButton
	},
	methods: {
		logClick(uuid, event) {
			console.log('click', uuid, event)
		},
		contextClick(uuid, ev) {
			console.log(uuid, ev)
			this.$emit('contextmenu', ev, uuid)
		}
	},
	props: ['uuidCenter', 'neurons', 'centerRef']
}
</script>

<style lang="less">
.friends-container {
	display: grid;
	grid-template-rows: 1fr 40px;
	grid-template-areas: "neurons" "addbutton";

	.neurons {
		text-align: left;

		.neuron-container {
			display: block;
			margin: 10px;
		}
	}
	.add-neuron-button-container {
		align-self: center;
		grid-area: addbutton;
		justify-self: center;
	}
}
</style>
