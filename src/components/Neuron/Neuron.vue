/* OPTIMIZE this updates all the time for unknown reasons */
<template>
	<div @click.ctrl.exact.prevent="toggleSelection" @click.alt.exact="logNeuron" class="neuron-container">
		<router-link :to="{ name: 'NetworkPage', params: {uuidNeuron} }" tag="a">
			<div class="neuron-content-container" :style="{ borderColor: (this.neuron && this.neuron.selected) ? 'red' : neuronColor }" >
				<div class="neuron-icon-container" :style="{ backgroundColor: neuronColor }">
					<div class="icon">👍</div>
				</div>
				<input v-if="inputName" class="neuron-name-con" @focusout="rename" type="text" v-model="neuron.neuron.name">
				<div v-else class="neuron-name-container" @dblclick="toggleInput">{{ neuronName }}</div>
			</div>
		</router-link>
		<div class="handle handle-parent"></div>
		<div class="handle handle-children"></div>
		<div class="handle handle-friend"></div>
	</div>
</template>

<script>
import NeuronAPI from '../../services/neuron'

export default {
	name: 'Neuron',
	props: ['uuidNeuron'],
	data() {
		return {
			polling: null,
			neuron: null,
			inputName: false
		}
	},
	computed: {
		neuronName() {
			/* May not be fetched at this point */
			//if(this.neuron) { return this.neuron.neuron.properties.name; }
			//console.log(this.neuron.neuron)
			return this.neuron ? this.neuron.neuron.name : ""
		},
		neuronColor() {
			return (this.neuron && this.neuron.neuron.color) ? "#"+this.neuron.neuron.color : "blue";
		}
	},
	methods: {
		rename(){
			NeuronAPI.renameNeuron(this.uuidNeuron, this.neuron.neuron.name).then( data => {
				console.log(data);
				this.fetchNeuronData();
			}).catch(err => console.log(err));
			this.toggleInput();
		},
		toggleInput() {
			this.inputName = !this.inputName;
		},
		logNeuron() {
			console.log('Neuron: ', this.neuron);
		},
		toggleSelection() {
			NeuronAPI.toggleSelection(this.uuidNeuron).then( data => {
				console.log(data);
				this.fetchNeuronData();
			}).catch(err => console.log(err));
		},
		fetchNeuronData() {
			NeuronAPI.getNeuron(this.uuidNeuron).then( data => {
				this.neuron = data;
			}).catch(err => console.log(err));
		},
		initFetchService() { 
			this.fetchNeuronData();
			this.polling = setInterval(() => {
				if (!this.inputName) this.fetchNeuronData();
			}, 500) // OPTIMIZE: Should run much less often BUT straight after a route change
		}
	},
	/*
	beforeUpdate() {
		console.log('update')
		this.fetchNeuronData();
	},
	*/
	created() {
		this.initFetchService();
	},
	beforeDestroy() {
		clearInterval(this.polling);
	}
}
</script>

<style lang="less">
.neuron-container {
	position: relative;

	.neuron-content-container {
		display: grid;
		grid-template-columns: auto auto;
		border: 2px solid blue;
		border-radius: 10px;
		height: 40px;
		overflow: hidden;

		.neuron-icon-container {
			overflow: hidden;
			background: blue;
			padding: 5px;
			width: 40px;
		}

		.neuron-name-container {
			place-self: center;
			padding: 0 10px;
			background: white;
		}
	}

	> a {
		text-decoration: none;
		color: unset;
		display: contents;
		z-index: 1;
	}


	.handle {
		position: absolute;
		width: 10px;
		height: 10px;
		border-radius: 50%;

		&.handle-friend {
			background: green;
			right: -8px;;
			top: 50%;
		}
		&.handle-children {
			background: red;
			right: 50%;
			bottom: -8px;
		}
		&.handle-parent {
			background: purple;
			right: 50%;
			top: -8px
		}
	}
}
</style>
