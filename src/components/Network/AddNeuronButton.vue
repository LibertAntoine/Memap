<template>
	<div @click="addNeuron" class="add-neuron-button-container">
		<div>Add a {{ name }}</div>
		<div class="icon-container">
			<i class="icon plus"></i>
		</div>
	</div>
</template>

<script>
import NetworkAPI from '../../services/network.js'
import NeuronAPI from '../../services/neuron.js'

export default {
	name: 'AddNeuronButton',
	computed: {
		name() {
			return ( this.type ) ? this.type : "neuron";
		}
	},
	props: ['type', 'uuidCenterNeuron'],
	methods: {
		async addNeuron() {
			const newUUID = await NeuronAPI.createNeuron('untitled neuron');
			if (this.uuidCenterNeuron) {
				// TODO: link to the neuron
				if (this.type === 'children')
					NetworkAPI.createRelationship('parent', this.uuidCenterNeuron, newUUID)
				else if (this.type === 'parent')
					NetworkAPI.createRelationship('parent', newUUID, this.uuidCenterNeuron)
				else if (this.type === 'friend')
					NetworkAPI.createRelationship('friend', newUUID, this.uuidCenterNeuron)
			}
		}
	}
}
</script>

<style lang="less">
.add-neuron-button-container {
	display: grid;
	grid-template-columns: 1fr auto;
  cursor: pointer;
  border: 2px solid blue;
  padding: 5px 8px;
  font-size: 1em;
  border-radius: 50px;
  background: blue;
  color: white;

	.icon-container {
		font-size: 14px;
		padding: 0 5px;
		place-self: center;
		margin: 0;
	}

}
</style>
