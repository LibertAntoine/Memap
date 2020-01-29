<template>
	<div :class="{ hover: isHover }" @mouseleave="isHover = false" @mouseover="isHover = true" class="inline-file-container" >
		<div class="file-icon">
			<i class="icon" :class="fileIcon(file.extension)"></i>
		</div>
		<div class="file-name">
			<span>{{ fileName(file) }}</span>
		</div>
		<div @click.prevent.stop="menu($event)" class="file-menu" v-show="isHover">
			<i class="icon ellipsis vertical" @click="toggleFileMenu(file)"></i>
		</div>
		<vue-context ref="menu">
			<template slot-scope="child" v-if="child.data">
				<li>
					<a class="menu-item" @click="downloadFile()">
						<i class="icon download"></i>
						<span>Download</span>
					</a>
				</li>
			</template>
		</vue-context>
	</div>
</template>

<script>
import VueContext from 'vue-context'

//import NeuronAPI from '../../services/neuron'

export default {
	name: 'InlineFile',
	props: ['file'],
	components: {
		VueContext
	},
	data() {
		return {
			isHover: false
		}
	},
	methods: {
		menu(event) {
			this.$refs.menu.open(event, { type: 'friend', uuid: "damn" })
		},
		downloadFile() {
			window.open(`http://localhost:3000/static/files/${this.file.uuid}.${this.file.extension}`, '_blank')
		},
		toggleFileMenu() {
			console.log('File Menu', this.file)
		},
		fileIcon(extension) {
			if (extension.match(/(xls)/g)) return 'file excel outline';
 			else if (extension.match(/(png)|(jpg)|(gif)/g)) return 'image outline'
			else return 'file'
		},
		fileName(file) {
			return file.name + '.' + file.extension;
		},
	}
}
</script>

<style lang="less">
.inline-file-container	{
	display: grid;
	grid-template-columns: 40px 1fr 30px;
	height: 30px;
	align-items: center;

	.file-icon {
		font-size: 20px;
	}
	.file-name {
		justify-self: left;
		font-size: 13px;
	}
	.file-menu {
		font-size: 10px;
		cursor: pointer;
	}
	&.hover {
		background: lightgrey;
	}

	.menu-item {
		cursor: pointer;

		i {
			float: left;
		}

		&:hover {
			background: lightgrey;
		}
	}
}
</style>
