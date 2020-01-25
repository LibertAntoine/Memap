<template>
	<div class="box-selection-container">
		<vue-draggable-resizable :resizable="false" :x="50" :y="30">
			<Box :open="open" :title="neuronName" :icon="icon" :color="neuronColor">
			<div class="rename-container" v-if="inputName"><input @keypress.esc="toggleInput" @focusout="rename" @keypress.enter="rename" type="text" v-model="neuron.neuron.name"></div>
			<div class="neuron-button-container">
				<div class="align-left">
					<NeuronPin v-on:click.native="toggleSelection" :toggled="selected" class="align-left"/>
					<NeuronFavorite v-on:click.native="toggleFavorite" :toggled="favorite" class="align-left"/>
				</div>
				<div class="align-right">
					<NeuronRename v-on:click.native="toggleInput" class="align-right"/>
					<NeuronDelete class="align-right"/>
				</div>
			</div>
			<BoxSectionHeader :title="'Tags'">
			<RoundButton>🍎</RoundButton>
			</BoxSectionHeader>
			<div class="neuron-tags-container">
				<Tag v-for="(tagname, id) in tags" :name="tagname.name" :key="id" @remove-tag="removeTag(tagname.name)"/>
			</div>
			<button @click="logNeuron" >Yo</button>
			</Box>
		</vue-draggable-resizable>
	</div>
</template>

<script>
/* Components */
import Box from './Box'
import Tag from './Tag'
import BoxSectionHeader from './BoxSectionHeader'
import RoundButton from './RoundButton'
import NeuronPin from './NeuronPin'
import NeuronFavorite from './NeuronFavorite'
import NeuronDelete from './NeuronDelete'
import NeuronRename from './NeuronRename'

import VueDraggableResizable from 'vue-draggable-resizable'

/* Other */
import NeuronAPI from '../services/neuron'

export default {
	name: 'BoxNeuron',
	data() {
		return {
			polling: null,
			neuron: null,
			inputName: false,
			open: true,
			title: "MyNeuron",
			icon: "👽"
		}
	},
	props: [ 'uuidNeuron' ],
	components: {
		Box, BoxSectionHeader, RoundButton,
		NeuronDelete, NeuronPin,
		NeuronRename, NeuronFavorite, Tag,
		VueDraggableResizable
	},
	computed: {
		tags() {
			return this.neuron ? this.neuron.tags : []
		},
		favorite() {
			return this.neuron ? this.neuron.favorite : false
		},
		selected() {
			return this.neuron ? this.neuron.selected : false
		},
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
		removeTag(tagName){
			NeuronAPI.removeTag(this.uuidNeuron, tagName).then( data => {
				console.log(data);
				this.fetchNeuronData();
			}).catch(err => console.log(err));
		},
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
		toggleFavorite() {
			NeuronAPI.toggleFavorite(this.uuidNeuron).then( data => {
				console.log(data)
				this.fetchNeuronData();
			}).catch(err => console.log(err));
		},
		toggleSelection() {
			NeuronAPI.toggleSelection(this.uuidNeuron).then( data => {
				console.log(data)
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
.box-container {
	margin: 20px;

	.neuron-button-container {
		display: grid;
		grid-template-columns: 1fr 1fr;
		padding: 12px 10px;

		.align-right {
			justify-self: right;
		}
		.align-left {
			justify-self: left;
		}

		> div > div {
			display: inline-block;
			margin: 0 5px;
		}

		/* Overriding Semantic UI */
		.ui.button {
			font-size: 12px;

			.trash {
				color: red;
			}
		}
	}

	.neuron-tags-container {
		text-align: left;
		padding-left: 5px;
	}
}
</style>
