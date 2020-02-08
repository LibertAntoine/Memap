<template>
	<div :class="{ hover: isHover }" @mouseleave="isHover = false" @mouseover="isHover = true" class="inline-document-container" >
		<router-link :to="{ name: 'Document', params: { id: document.uuid } }" tag="a">
			<div class="document-icon">
				<i class="icon file alternate"></i>
			</div>
			<div class="document-name">
				<span>{{ documentName() }}</span>
			</div>
			<div class="document-menu" v-show="isHover">
				<i class="icon ellipsis vertical"></i>
			</div>
		</router-link>
	</div>
</template>

<script>
//import NeuronAPI from '../../services/neuron'

export default {
	name: 'InlineDocument',
	props: ['document'],
	data() {
		return {
			isHover: false
		}
	},
	methods: {
		documentName() {
			return this.document.title;
		},
	}
}
</script>

<style lang="less">
.inline-document-container	{

	> a {
		display: grid;
		grid-template-columns: 40px 1fr 30px;
		height: 30px;
		align-items: center;
		color: inherit;

		.document-icon {
			font-size: 20px;
		}
		.document-name {
			justify-self: left;
			font-size: 13px;
		}
		.document-menu {
			font-size: 10px;
			cursor: pointer;
		}
		&.hover {
			background: lightgrey;
		}

	}
}
</style>
