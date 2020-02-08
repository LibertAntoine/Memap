<template>
	<div class="box-neuron-properties-container">
		<vue-draggable-resizable :resizable="false" :x="50" :y="200">
			<Box :title="neuronName" :icon-link="iconLink" :font-awesome-icon="fontAwesomeIcon" :color="neuronColor">
				<div class="rename-container" v-if="inputName"><input @keypress.esc="toggleInput" @focusout="rename" @keypress.enter="rename" type="text" v-model="neuron.neuron.name"></div>
				<div class="neuron-button-container">
					<div class="align-left">
						<NeuronPin v-on:click.native="toggleSelection" :toggled="selected" class="align-left"/>
						<NeuronFavorite v-on:click.native="toggleFavorite" :toggled="favorite" class="align-left"/>
					</div>
					<div class="align-right">
						<NeuronRename v-on:click.native="toggleInput" class="align-right"/>
						<NeuronDelete v-on:click.native="deleteNeuron" class="align-right"/>
					</div>
				</div>
				<BoxSectionHeader :title="'Tags'">
				<RoundButton :icon="'plus'" :color="neuronColor" />
				</BoxSectionHeader>
				<div class="neuron-tags-container">
					<Tag v-for="(tagname, id) in tags" :name="tagname.name" :key="id" @remove-tag="removeTag(tagname.name)"/>
				</div>
				<BoxSectionHeader :title="'Documents'">
				<RoundButton :icon="'plus'" :color="neuronColor"/>
				</BoxSectionHeader>
				<div class="neuron-documents-container">
					<InlineDocument v-for="(document, id) in documents" :key="id" :document="document" />
				</div>
				<BoxSectionHeader :title="'Files'">
				<RoundButton :icon="'plus'" :color="neuronColor"/>
				</BoxSectionHeader>
				<div class="neuron-files-container">
					<InlineFile v-for="(file, id) in files" :key="id" :file="file" />
				</div>
			</Box>
		</vue-draggable-resizable>
	</div>
</template>

<script>
/* Components */
import Box from './Box'
import Tag from '../Tag'
import InlineFile from '../InlineFile'
import InlineDocument from '../Document/InlineDocument'
import BoxSectionHeader from './BoxSectionHeader'
import RoundButton from '../RoundButton'
import NeuronPin from '../NeuronProperties/NeuronPin'
import NeuronFavorite from '../NeuronProperties/NeuronFavorite'
import NeuronDelete from '../NeuronProperties/NeuronDelete'
import NeuronRename from '../NeuronProperties/NeuronRename'

import VueDraggableResizable from 'vue-draggable-resizable'

/* Other */
import NeuronAPI from '@/services/neuron'

export default {
	name: 'BoxNeuronProperties',
	data() {
		return {
			polling: null,
			neuron: null,
			inputName: false,
			open: true
		}
	},
	props: [ 'uuidNeuron' ],
	components: {
		Box, BoxSectionHeader, RoundButton,
		NeuronDelete, NeuronPin,
		NeuronRename, NeuronFavorite, Tag,
		VueDraggableResizable, InlineFile, InlineDocument
	},
	computed: {
		iconLink() {
			return (this.neuron && this.neuron.icon) ? `http://localhost:3000/static/icons/${this.neuron.icon.uuid}.${this.neuron.icon.extension}` : null;
		},
		fontAwesomeIcon() {
			return ( this.neuron && this.neuron.neuron.iconFontAwesome ) ? this.neuron.neuron.iconFontAwesome : "sliders horizontal"
		},
		documents() {
			return this.neuron ? this.neuron.documents : []
		},
		files() {
			return this.neuron ? this.neuron.files : []
		},
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
			return (this.neuron && this.neuron.neuron.color) ? "#"+this.neuron.neuron.color : "#7fa3ff";
		}
	},
	methods: {
		removeTag(tagName){
			NeuronAPI.removeTag(this.uuidNeuron, tagName);
		},
		rename(){
			NeuronAPI.renameNeuron(this.uuidNeuron, this.neuron.neuron.name);
			this.toggleInput();
		},
		toggleInput() {
			this.inputName = !this.inputName;
		},
		logNeuron() {
			console.log('Neuron: ', this.neuron);
		},
		toggleFavorite() {
			NeuronAPI.toggleFavorite(this.uuidNeuron);
		},
		toggleSelection() {
			NeuronAPI.toggleSelection(this.uuidNeuron);
			this.fetchNeuronData();
		},
		deleteNeuron() {
			debugger
			NeuronAPI.deleteNeuron(this.uuidNeuron);
			//this.fetchNeuronData();
		},
		async fetchNeuronData() {
			this.neuron = await NeuronAPI.getNeuron(this.uuidNeuron);
		},
		initFetchService() { 
			this.fetchNeuronData();
			const neuron = this;
			this.polling = setInterval(() => {
				if (!neuron.inputName) neuron.fetchNeuronData();
			}, 100) // OPTIMIZE: Should run much less often BUT straight after a route change
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
		.ui.button, .ui.button:focus {
			font-size: 12px;
			background-color: white;
			color: #8b919a;
			box-shadow: 0px 1px 5px rgba(0, 0, 0, 0.22);

			&.selected {
				background-color: #6256f3;
				color: white;
			}
			
		}

			.trash {
				color: red;
			}
	}

	.neuron-tags-container {
		text-align: left;
		padding-left: 5px;
	}

	.neuron-files-container, .neuron-documents-container {
		padding: 0 20px;
	}
}
</style>
